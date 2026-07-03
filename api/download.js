// api/download.js — Vercel Serverless Function
// Downloads fonts as installable files:
//   Google Fonts  → ZIP of TTF files (all weights/styles)
//   Direct URL    → proxied as-is (TTF/OTF/WOFF2)

const { createGzip } = require('zlib');

// Minimal ZIP builder (no npm needed — pure Node.js Buffer magic)
function buildZip(entries) {
  // entries = [{ name: string, data: Buffer }]
  const localHeaders = [];
  const centralDir   = [];
  let offset = 0;

  function crc32(buf) {
    const table = crc32.table || (crc32.table = (() => {
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        t[i] = c;
      }
      return t;
    })());
    let crc = 0xffffffff;
    for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function u16(n) { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; }
  function u32(n) { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; }

  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name, 'utf8');
    const crc       = crc32(data);
    const local = Buffer.concat([
      Buffer.from([0x50,0x4b,0x03,0x04]),  // signature
      u16(20),         // version needed
      u16(0),          // flags
      u16(0),          // compression (stored)
      u16(0), u16(0),  // mod time/date
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0),          // extra field length
      nameBytes,
      data,
    ]);
    localHeaders.push(local);

    centralDir.push(Buffer.concat([
      Buffer.from([0x50,0x4b,0x01,0x02]),  // central dir signature
      u16(20), u16(20),
      u16(0), u16(0), u16(0),
      u16(0), u16(0),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0), u16(0), u16(0), u16(0),
      u32(0),
      u32(offset),
      nameBytes,
    ]));

    offset += local.length;
  }

  const cdOffset = offset;
  const cdBuffer  = Buffer.concat(centralDir);
  const eocd = Buffer.concat([
    Buffer.from([0x50,0x4b,0x05,0x06]),
    u16(0), u16(0),
    u16(entries.length),
    u16(entries.length),
    u32(cdBuffer.length),
    u32(cdOffset),
    u16(0),
  ]);

  return Buffer.concat([...localHeaders, cdBuffer, eocd]);
}

// ── Main handler ──────────────────────────────────────────────────
module.exports = async (req, res) => {
  const { family, url, filename } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ── Path A: Google Fonts — download TTF ZIP ─────────────────
    if (family) {
      const cleanFamily = family.trim();
      const zipName = filename || `${cleanFamily.replace(/\s+/g, '_')}_fonts.zip`;

      // Use an old UA so Google returns TTF (truetype) instead of WOFF2
      const OLD_UA = 'Mozilla/5.0 (Windows NT 5.1; rv:13.0) Gecko/20100101 Firefox/13.0.1';

      // Fetch CSS for all common weights
      const cssUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(cleanFamily)}:100,200,300,400,500,600,700,800,900,100italic,200italic,300italic,400italic,500italic,600italic,700italic,800italic,900italic`;
      const cssResp = await fetch(cssUrl, { headers: { 'User-Agent': OLD_UA } });

      if (!cssResp.ok) {
        return res.status(502).json({ error: `Google Fonts CSS API: ${cssResp.status}` });
      }

      const css = await cssResp.text();

      // Parse all TTF URLs  (format: url(https://fonts.gstatic.com/...))
      const urlRegex = /font-style:\s*(\w+)[\s\S]*?font-weight:\s*(\d+)[\s\S]*?url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
      const found = [];
      let m;
      while ((m = urlRegex.exec(css)) !== null) {
        const [, style, weight, fontUrl] = m;
        const ext = fontUrl.split('.').pop().split('?')[0] || 'ttf';
        found.push({ style, weight, fontUrl, ext });
      }

      // Fallback: just match all gstatic URLs
      if (found.length === 0) {
        const simple = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)];
        simple.forEach((sm, i) => {
          const ext = sm[1].split('.').pop().split('?')[0] || 'ttf';
          found.push({ style: 'normal', weight: '400', fontUrl: sm[1], ext });
        });
      }

      if (found.length === 0) {
        return res.status(404).json({ error: 'No font files found in Google Fonts CSS response' });
      }

      // Download each font file and build ZIP entries
      const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36';
      const entries = await Promise.all(
        found.map(async ({ style, weight, fontUrl, ext }) => {
          const r = await fetch(fontUrl, { headers: { 'User-Agent': CHROME_UA } });
          if (!r.ok) return null;
          const data = Buffer.from(await r.arrayBuffer());
          const styleSuffix = style === 'italic' ? '_Italic' : '';
          const name = `${cleanFamily.replace(/\s+/g, '_')}-${weight}${styleSuffix}.${ext}`;
          return { name, data };
        })
      );

      const validEntries = entries.filter(Boolean);
      if (validEntries.length === 0) {
        return res.status(502).json({ error: 'Failed to download any font files' });
      }

      const zip = buildZip(validEntries);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
      res.setHeader('Content-Length', zip.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.status(200).send(zip);
    }

    // ── Path B: Direct font URL ──────────────────────────────────
    else if (url) {
      const allowed = /\.(woff2?|ttf|otf|eot|zip)(\?.*)?$/i;
      if (!allowed.test(url) && !url.includes('fonts.gstatic.com') && !url.includes('supabase')) {
        return res.status(400).json({ error: 'URL does not appear to be a font file' });
      }

      const outputFilename = filename || url.split('/').pop().split('?')[0] || 'font';

      const fontResp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
        },
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
