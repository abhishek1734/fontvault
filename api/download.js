// api/download.js — Vercel Serverless Function
// Downloads fonts as installable files:
//   - Strategy 1: Google JSON manifest API (contains exact filenames, static/ folders, and gstatic URLs)
//   - Strategy 2: Google CSS parsing fallback (for Google Sans / unlisted fonts, maps and downloads all TTFs)
//   - Strategy 3: Fontshare CDN parsing (downloads Fontshare font files directly)
//   - Strategy 4: Direct URL file proxy (Supabase, TTF, OTF, WOFF2)

// ── Minimal pure-Node ZIP builder (no npm needed) ────────────────
function buildZip(entries) {
  function crc32(buf) {
    if (!crc32._t) {
      crc32._t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        crc32._t[i] = c;
      }
    }
    let crc = 0xffffffff;
    for (const b of buf) crc = crc32._t[(crc ^ b) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  const u16 = n => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; };
  const u32 = n => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };

  const locals = [], central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nb  = Buffer.from(name, 'utf8');
    const crc = crc32(data);
    const local = Buffer.concat([
      Buffer.from([0x50,0x4b,0x03,0x04]), u16(20), u16(0), u16(0),
      u16(0), u16(0), u32(crc), u32(data.length), u32(data.length),
      u16(nb.length), u16(0), nb, data,
    ]);
    locals.push(local);
    central.push(Buffer.concat([
      Buffer.from([0x50,0x4b,0x01,0x02]), u16(20), u16(20),
      u16(0), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(data.length), u32(data.length),
      u16(nb.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nb,
    ]));
    offset += local.length;
  }
  const cd = Buffer.concat(central);
  const eocd = Buffer.concat([
    Buffer.from([0x50,0x4b,0x05,0x06]), u16(0), u16(0),
    u16(entries.length), u16(entries.length),
    u32(cd.length), u32(offset), u16(0),
  ]);
  return Buffer.concat([...locals, cd, eocd]);
}

// ── Strategy 1: Download using Google's official JSON manifest ──
async function fetchFromManifest(family) {
  const url = `https://fonts.google.com/download/list?family=${encodeURIComponent(family)}`;
  
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
      }
    });
    
    if (!resp.ok) return null;
    
    const text = await resp.text();
    let clean = text;
    // Google prepends a XSSI protection prefix
    if (text.startsWith(")]}'")) {
      clean = text.substring(4);
    }
    
    let data;
    try {
      data = JSON.parse(clean);
    } catch (parseErr) {
      console.warn(`[download] JSON parse failed for manifest:`, parseErr.message);
      return null;
    }

    // The manifest JSON has multiple possible shapes depending on API version
    let fileRefs = null;
    if (data && data.manifest && Array.isArray(data.manifest.fileRefs)) {
      fileRefs = data.manifest.fileRefs;
    } else if (data && Array.isArray(data.fileRefs)) {
      fileRefs = data.fileRefs;
    } else {
      // Deep search for fileRefs key
      const str = JSON.stringify(data);
      const match = str.match(/"fileRefs":\s*(\[[^\]]*\])/s);
      if (match) {
        try { fileRefs = JSON.parse(match[1]); } catch {}
      }
    }
    
    if (!fileRefs || fileRefs.length === 0) return null;

    // Download files in parallel
    const entries = (await Promise.all(
      fileRefs.map(async (ref) => {
        try {
          const fileUrl = ref.url;
          if (!fileUrl) return null;

          const r = await fetch(fileUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          if (!r.ok) return null;

          const data = Buffer.from(await r.arrayBuffer());
          const cleanName = (ref.filename || fileUrl.split('/').pop().split('?')[0] || 'font.ttf')
            .replace(/^[\/\\]+/, '');

          return { name: cleanName, data };
        } catch {
          return null;
        }
      })
    )).filter(Boolean);

    return entries.length > 0 ? entries : null;

  } catch (err) {
    console.warn(`[download] fetchFromManifest error for "${family}":`, err.message);
    return null;
  }
}

// ── Strategy 2: Fallback for unlisted/Google Sans fonts via CSS v2 API ──
async function fetchStaticFontsFromCSS(family) {
  const n = family.replace(/\s+/g, '+');
  const cssUrl = `https://fonts.googleapis.com/css2?family=${n}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`;

  try {
    const cssResp = await fetch(cssUrl, {
      headers: {
        'User-Agent': 'Mozilla/4.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
      },
    });

    if (!cssResp.ok) return [];
    const cssText = await cssResp.text();

    const blocks = cssText.split('@font-face').slice(1);
    const filesToDownload = [];

    const weightMap = {
      100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular',
      500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black',
    };

    for (const block of blocks) {
      const isLatin = /latin|subset/i.test(block) || !/subset/i.test(block);
      if (!isLatin) continue;

      const urlMatch = block.match(/src:\s*url\((https:\/\/[^)]+)\)/);
      if (!urlMatch) continue;

      const wMatch = block.match(/font-weight:\s*(\d+)/);
      const sMatch = block.match(/font-style:\s*(italic|normal)/);

      const weight = wMatch ? parseInt(wMatch[1], 10) : 400;
      const isItalic = sMatch && sMatch[1] === 'italic';

      const weightName = weightMap[weight] || `${weight}`;
      const styleSuffix = isItalic ? (weightName === 'Regular' ? 'Italic' : `${weightName}Italic`) : weightName;
      const fileName = `${family.replace(/\s+/g, '_')}-${styleSuffix}.ttf`;

      if (!filesToDownload.some(f => f.name === fileName)) {
        filesToDownload.push({ name: fileName, url: urlMatch[1] });
      }
    }

    const entries = (await Promise.all(
      filesToDownload.map(async f => {
        try {
          const r = await fetch(f.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (!r.ok) return null;
          const data = Buffer.from(await r.arrayBuffer());
          return { name: f.name, data };
        } catch { return null; }
      })
    )).filter(Boolean);

    return entries;

  } catch (err) {
    console.warn('[download] fetchStaticFontsFromCSS failed:', err.message);
    return [];
  }
}

// ── Strategy 3: Fontshare CDN Downloader ──
async function fetchFromFontshare(family) {
  const slug = family.toLowerCase().replace(/\s+/g, '-');
  const cssUrl = `https://api.fontshare.com/v2/css?f=${slug}@100,200,300,400,500,600,700,800,900&display=swap`;
  try {
    const resp = await fetch(cssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!resp.ok) return null;
    const cssText = await resp.text();
    const regex = /url\(['"]?([^'")]+)['"]?\)/g;
    const urls = new Set();
    let m;
    while ((m = regex.exec(cssText)) !== null) {
      let u = m[1];
      if (u.startsWith('//')) u = 'https:' + u;
      urls.add(u);
    }
    if (urls.size === 0) return null;

    const entries = (await Promise.all(
      Array.from(urls).map(async (u, idx) => {
        try {
          const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (!r.ok) return null;
          const ext = u.endsWith('.ttf') ? 'ttf' : (u.endsWith('.otf') ? 'otf' : (u.endsWith('.woff2') ? 'woff2' : 'woff'));
          const fileName = `${family.replace(/\s+/g, '_')}_style_${idx + 1}.${ext}`;
          const data = Buffer.from(await r.arrayBuffer());
          return { name: fileName, data };
        } catch { return null; }
      })
    )).filter(Boolean);

    return entries.length > 0 ? entries : null;
  } catch (err) {
    console.warn('[download] fetchFromFontshare failed:', err.message);
    return null;
  }
}

module.exports = async (req, res) => {
  const { family, url, filename } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ── Path A: Font family name → ZIP bundle ────────────────────
    if (family) {
      const cleanFamily = family.trim();
      const zipName     = filename || `${cleanFamily.replace(/\s+/g, '_')}_fonts.zip`;

      console.log(`[download] Generating ZIP bundle for font family: "${cleanFamily}"`);

      // 1. Try Google's official JSON manifest endpoint (works for Google Fonts + open-source Adobe Fonts)
      const manifestEntries = await fetchFromManifest(cleanFamily);
      if (manifestEntries && manifestEntries.length > 0) {
        console.log(`[download] Manifest success: found ${manifestEntries.length} files`);
        const zip = buildZip(manifestEntries);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
        res.setHeader('Content-Length', zip.length);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.status(200).send(zip);
      }

      // 2. Google CSS v2 API parsing fallback
      console.log(`[download] Manifest miss, checking CSS parse for "${cleanFamily}"`);
      const staticEntries = await fetchStaticFontsFromCSS(cleanFamily);
      if (staticEntries && staticEntries.length > 0) {
        const zip = buildZip(staticEntries);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
        res.setHeader('Content-Length', zip.length);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.status(200).send(zip);
      }

      // 3. Try Fontshare CDN bundle
      console.log(`[download] Checking Fontshare CDN for "${cleanFamily}"`);
      const fontshareEntries = await fetchFromFontshare(cleanFamily);
      if (fontshareEntries && fontshareEntries.length > 0) {
        console.log(`[download] Fontshare success: found ${fontshareEntries.length} files`);
        const zip = buildZip(fontshareEntries);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
        res.setHeader('Content-Length', zip.length);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.status(200).send(zip);
      }

      return res.status(404).json({
        error: `Font "${cleanFamily}" not found. Check the family name spelling.`,
      });
    }

    // ── Path B: Direct font file URL ─────────────────────────────
    else if (url) {
      const allowed = /\.(woff2?|ttf|otf|eot|zip)(\?.*)?$/i;
      if (!allowed.test(url) && !url.includes('fonts.gstatic.com') && !url.includes('supabase') && !url.includes('cdn.fontshare.com')) {
        return res.status(400).json({ error: 'URL does not appear to be a font file' });
      }

      const outputFilename = filename || url.split('/').pop().split('?')[0] || 'font';
      const fontResp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124' },
      });
      if (!fontResp.ok) {
        return res.status(502).json({ error: `Failed to fetch font: ${fontResp.status}` });
      }

      const buffer      = Buffer.from(await fontResp.arrayBuffer());
      const contentType = fontResp.headers.get('content-type') || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.status(200).send(buffer);
    }

    else {
      return res.status(400).json({ error: 'Provide ?family=FontName or ?url=https://...' });
    }

  } catch (err) {
    console.error('[/api/download] error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
