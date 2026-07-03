// api/download.js — Vercel Serverless Function
// Downloads fonts as installable files:
//   Google Fonts:
//     - Strategy 1: Official Google Fonts ZIP endpoint (contains variable + static TTFs)
//     - Strategy 2: CSS parsing fallback (for Google Sans/unlisted fonts, maps and downloads all TTFs)
//   Direct URL:
//     - Proxies the file as-is (TTF/OTF/WOFF2)

// ── Minimal pure-Node ZIP builder (no npm needed) — used for CSS parsing fallback ──
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

      // Strategy 1: Official Google Fonts download endpoint (direct zip with static + variable TTFs)
      console.log(`[download] Trying official endpoint for "${cleanFamily}"`);
      const googleZipUrl = `https://fonts.google.com/download?family=${encodeURIComponent(cleanFamily)}`;
      
      try {
        const zipResp = await fetch(googleZipUrl, {
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/zip,*/*;q=0.8',
          },
        });

        const ct = zipResp.headers.get('content-type') || '';
        if (zipResp.ok && (ct.includes('zip') || ct.includes('octet-stream'))) {
          const buffer = Buffer.from(await zipResp.arrayBuffer());
          console.log(`[download] Official endpoint success for "${cleanFamily}"`);
          res.setHeader('Content-Type', 'application/zip');
          res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
          res.setHeader('Content-Length', buffer.length);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.status(200).send(buffer);
        }
      } catch (e) {
        console.warn(`[download] Official endpoint request failed for "${cleanFamily}":`, e.message);
      }

      // Strategy 2: CSS v2 API parsing fallback (for Google Sans / unlisted fonts)
      console.log(`[download] Official endpoint miss, falling back to CSS parse for "${cleanFamily}"`);
      
      const weightsParam = 'ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900';
      const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFamily)}:${weightsParam}`;
      const cssResp = await fetch(cssUrl, {
        headers: { 'User-Agent': '' } // Empty User-Agent forces TTF format instead of WOFF2
      });

      if (cssResp.ok) {
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

        if (filesToDownload.length > 0) {
          console.log(`[download] CSS Parse found ${filesToDownload.length} files`);
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

          if (entries.length > 0) {
            const zip = buildZip(entries);
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
            res.setHeader('Content-Length', zip.length);
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.status(200).send(zip);
          }
        }
      }

      return res.status(404).json({
        error: `Font "${cleanFamily}" not found. Check the family name spelling.`,
      });
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
