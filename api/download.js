// api/download.js — Vercel Serverless Function
// Downloads fonts as installable files:
//   Google Fonts → uses official ZIP download endpoint (contains TTF files)
//   Direct URL   → proxies file as-is (TTF/OTF/WOFF2)

// Minimal pure-Node ZIP builder (no npm needed) — used only for fallback
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
    const nb = Buffer.from(name, 'utf8');
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

module.exports = async (req, res) => {
  const { family, url, filename } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {

    // ── Path A: Google Fonts family → TTF ZIP ────────────────────
    if (family) {
      const cleanFamily = family.trim();
      const zipName = filename || `${cleanFamily.replace(/\s+/g, '_')}_fonts.zip`;

      // Strategy 1: official Google Fonts ZIP download (contains TTF files)
      const googleZipUrl = `https://fonts.google.com/download?family=${encodeURIComponent(cleanFamily)}`;

      const zipResp = await fetch(googleZipUrl, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      // Check we got a valid ZIP back (not an HTML error page)
      const ct = zipResp.headers.get('content-type') || '';
      if (zipResp.ok && (ct.includes('zip') || ct.includes('octet-stream'))) {
        const buffer = Buffer.from(await zipResp.arrayBuffer());
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.status(200).send(buffer);
      }

      // Strategy 2 fallback: parse CSS API with no UA to get TTF URLs
      console.log('[download] Google ZIP endpoint failed (ct:', ct, '), falling back to CSS parse');

      // Empty / minimal UA forces Google Fonts to return TTF format
      const cssUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(cleanFamily)}:100,300,400,500,700,900`;
      const cssResp = await fetch(cssUrl, {
        headers: { 'User-Agent': '' },   // no UA → TTF
      });

      if (!cssResp.ok) {
        return res.status(502).json({ error: `Google Fonts CSS API: ${cssResp.status}` });
      }

      const css = await cssResp.text();
      console.log('[download] CSS sample:', css.substring(0, 400));

      // Match all font file URLs (any format)
      const allUrls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)];
      if (allUrls.length === 0) {
        return res.status(404).json({ error: 'No font URLs found in Google Fonts CSS' });
      }

      // Fetch all font files
      const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124';
      const entries = (await Promise.all(
        allUrls.map(async ([, fontUrl], i) => {
          try {
            const r = await fetch(fontUrl, { headers: { 'User-Agent': CHROME_UA } });
            if (!r.ok) return null;
            const data = Buffer.from(await r.arrayBuffer());
            const ext = fontUrl.split('.').pop().split('?')[0].toLowerCase() || 'ttf';
            const name = `${cleanFamily.replace(/\s+/g, '_')}_${i + 1}.${ext}`;
            return { name, data };
          } catch { return null; }
        })
      )).filter(Boolean);

      if (entries.length === 0) {
        return res.status(502).json({ error: 'Failed to download any font files' });
      }

      const zip = buildZip(entries);
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

      const buffer = Buffer.from(await fontResp.arrayBuffer());
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
