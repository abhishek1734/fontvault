// api/download.js — Vercel Serverless Function
// Generates a ZIP file matching Google Fonts official download format:
//   - Root of ZIP: Variable TTF files (from google/fonts GitHub repo) + OFL.txt license file
//   - static/ folder inside ZIP: Individual static TTF files for all weights (scraped from Google Fonts CSS API)
//   - Falls back to CSS parse only (putting TTFs in root) if not found in GitHub.

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

function familyToSlug(family) {
  return family.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ── Fetch variable fonts & OFL license from GitHub ──────────────
async function fetchMetadataFromGitHub(family) {
  const slug    = familyToSlug(family);
  const folders = ['ofl', 'apache', 'ufl'];
  const GH_API  = 'https://api.github.com/repos/google/fonts/contents';
  const headers = {
    'User-Agent': 'FontVault/1.0',
    'Accept': 'application/vnd.github.v3+json',
  };

  for (const folder of folders) {
    const apiUrl = `${GH_API}/${folder}/${slug}`;
    const resp   = await fetch(apiUrl, { headers });
    if (!resp.ok) continue;

    const files = await resp.json();
    if (!Array.isArray(files)) continue;

    // We want variable TTF files (they have bracket axes in filename, e.g. Montserrat[wght].ttf)
    // and LICENSE or OFL text files
    const targets = files.filter(f =>
      f.type === 'file' && (
        (/\.(ttf|otf)$/i.test(f.name) && f.name.includes('[') && f.name.includes(']')) ||
        /^(ofl|license|readme)\.txt$/i.test(f.name)
      )
    );

    if (targets.length === 0) continue;

    const entries = (await Promise.all(
      targets.map(async file => {
        try {
          const r = await fetch(file.download_url, { headers: { 'User-Agent': 'FontVault/1.0' } });
          if (!r.ok) return null;
          const data = Buffer.from(await r.arrayBuffer());
          return { name: file.name, data };
        } catch { return null; }
      })
    )).filter(Boolean);

    if (entries.length > 0) return entries;
  }

  return [];
}

// ── Fetch individual static TTF files from Google Fonts CSS API ──
async function fetchStaticFontsFromCSS(family) {
  const cleanFamily = family.trim();
  const weightsParam = 'ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900';
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFamily)}:${weightsParam}`;
  
  try {
    const cssResp = await fetch(cssUrl, {
      headers: { 'User-Agent': '' } // Empty User-Agent forces TTF format instead of WOFF2
    });

    if (!cssResp.ok) return [];

    const css = await cssResp.text();
    const blocks = css.split('@font-face');
    const filesToDownload = [];
    
    const weightNames = {
      '100': 'Thin', '200': 'ExtraLight', '300': 'Light', '400': 'Regular',
      '500': 'Medium', '600': 'SemiBold', '700': 'Bold', '800': 'ExtraBold', '900': 'Black'
    };

    for (const block of blocks) {
      if (!block.includes('src:')) continue;
      const styleMatch = block.match(/font-style:\s*(\w+)/);
      const weightMatch = block.match(/font-weight:\s*(\d+)/);
      const urlMatch = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
      
      if (styleMatch && weightMatch && urlMatch) {
        const style = styleMatch[1];
        const weight = weightMatch[1];
        const fontFileUrl = urlMatch[1];
        
        const weightName = weightNames[weight] || weight;
        let fontFileName = '';
        if (style === 'italic') {
          fontFileName = weightName === 'Regular' ? 'Italic' : `${weightName}Italic`;
        } else {
          fontFileName = weightName;
        }
        
        const name = `${cleanFamily.replace(/\s+/g, '')}-${fontFileName}.ttf`;
        
        if (!filesToDownload.find(f => f.name === name)) {
          filesToDownload.push({ name, url: fontFileUrl });
        }
      }
    }

    if (filesToDownload.length === 0) return [];

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

module.exports = async (req, res) => {
  const { family, url, filename } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ── Path A: Google Fonts family → TTF ZIP ────────────────────
    if (family) {
      const cleanFamily = family.trim();
      const zipName     = filename || `${cleanFamily.replace(/\s+/g, '_')}_fonts.zip`;

      console.log(`[download] Generating ZIP bundle for Google Font: "${cleanFamily}"`);

      // 1. Fetch Variable TTFs & OFL license from GitHub
      const githubEntries = await fetchMetadataFromGitHub(cleanFamily);

      // 2. Fetch Static TTFs from CSS API
      const staticEntries = await fetchStaticFontsFromCSS(cleanFamily);

      // 3. Assemble entries following Google Fonts official structure:
      //   - Variable fonts & OFL.txt go to the root folder
      //   - Static fonts go to the "static/" subfolder (if variable fonts exist)
      //   - If NO variable fonts found (e.g. Google Sans), put all static fonts in the root.
      const hasVariableFonts = githubEntries.some(e => e.name.includes('[') && e.name.includes(']'));
      const finalEntries = [];

      // Add license / readme files to root
      githubEntries.forEach(entry => {
        finalEntries.push(entry);
      });

      // Add static files
      staticEntries.forEach(entry => {
        const entryName = hasVariableFonts ? `static/${entry.name}` : entry.name;
        // Avoid duplicate files
        if (!finalEntries.some(e => e.name === entryName)) {
          finalEntries.push({ name: entryName, data: entry.data });
        }
      });

      if (finalEntries.length === 0) {
        return res.status(404).json({
          error: `Font "${cleanFamily}" not found. Check the family name spelling.`,
        });
      }

      console.log(`[download] ZIP generated with ${finalEntries.length} items (hasVariable: ${hasVariableFonts})`);
      const zip = buildZip(finalEntries);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
      res.setHeader('Content-Length', zip.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.status(200).send(zip);
    }

    // ── Path B: Direct font file URL ─────────────────────────────
    else if (url) {
      const allowed = /\.(woff2?|ttf|otf|eot|zip)(\?.*)?$/i;
      if (!allowed.test(url) && !url.includes('fonts.gstatic.com') && !url.includes('supabase')) {
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
