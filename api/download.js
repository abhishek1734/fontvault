// api/download.js — Vercel Serverless Function
// Proxies font file downloads so users never leave FontVault.
// Usage:
//   /api/download?family=Inter                       ? downloads Inter.woff2 from Google Fonts
//   /api/download?url=https://...&filename=Foo.woff2 ? proxies any direct font URL

module.exports = async (req, res) => {
  const { family, url, filename } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let fontUrl = null;
    let outputFilename = filename || 'font.woff2';

    // -- Path A: Google Fonts family name ------------------------
    if (family) {
      const cleanFamily = family.trim();
      outputFilename = filename || `${cleanFamily.replace(/\s+/g, '_')}.woff2`;

      const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFamily)}&display=swap`;
      const cssResp = await fetch(cssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
      });

      if (!cssResp.ok) {
        return res.status(502).json({ error: `Google Fonts CSS API returned ${cssResp.status}` });
      }

      const css = await cssResp.text();
      const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
      if (!match) {
        return res.status(404).json({ error: 'Could not find WOFF2 URL in Google Fonts CSS response' });
      }
      fontUrl = match[1];
    }

    // -- Path B: Direct font URL ----------------------------------
    else if (url) {
      const allowed = /\.(woff2?|ttf|otf|eot)(\?.*)?$/i;
      if (!allowed.test(url) && !url.includes('fonts.gstatic.com') && !url.includes('supabase')) {
        return res.status(400).json({ error: 'URL does not appear to be a font file' });
      }
      fontUrl = url;
      if (!filename) {
        outputFilename = url.split('/').pop().split('?')[0] || 'font.woff2';
      }
    }

    else {
      return res.status(400).json({ error: 'Provide ?family=FontName or ?url=https://...' });
    }

    // -- Fetch the actual font binary -----------------------------
    const fontResp = await fetch(fontUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://fontvault.vercel.app/',
      },
    });

    if (!fontResp.ok) {
      return res.status(502).json({ error: `Failed to fetch font binary: ${fontResp.status}` });
    }

    const buffer = Buffer.from(await fontResp.arrayBuffer());
    const contentType = fontResp.headers.get('content-type') || 'font/woff2';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(buffer);

  } catch (err) {
    console.error('[/api/download] error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
