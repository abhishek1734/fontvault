// generate_sitemap.js
// Node.js script to dynamically compile the sitemap.xml for FontVault

const fs = require('fs');
const path = require('path');

const domain = "https://fontvault.vercel.app"; // Using the Vercel domain as standard canonical for indexability

// Load blog posts
let blogPosts = [];
try {
  const blogDataFile = fs.readFileSync(path.join(__dirname, 'blog-data.js'), 'utf8');
  // Evaluate the file contextually
  const sandbox = {};
  const fn = new Function('sandbox', blogDataFile + '\nreturn blogPosts;');
  blogPosts = fn(sandbox) || [];
} catch (e) {
  console.error("Failed to load blog-data.js:", e.message);
}

// Load fonts
let fontsData = [];
try {
  const fontsFile = fs.readFileSync(path.join(__dirname, 'fonts.js'), 'utf8');
  // Evaluate the fontsData array by replacing let declaration with a global variable
  const code = fontsFile.replace(/^let\s+fontsData\s*=/, 'global.fontsData =') + ';\nreturn global.fontsData;';
  const fn = new Function('global', code);
  fontsData = fn(global) || [];
} catch (e) {
  console.error("Failed to load fonts.js:", e.message);
}

// Collections defined for SEO
const collections = [
  "minimal-fonts",
  "luxury-fonts",
  "modern-fonts",
  "bold-fonts",
  "vintage-fonts",
  "elegant-fonts",
  "clean-fonts",
  "serif-fonts",
  "sans-serif-fonts",
  "display-fonts",
  "script-fonts"
];

// Categories defined
const categories = [
  "Serif",
  "Sans-Serif",
  "Display",
  "Script",
  "Monospace"
];

// Static pages
const staticPages = [
  { path: "", changefreq: "daily", priority: "1.0" },
  { path: "/ai/font-pair-generator", changefreq: "weekly", priority: "0.9" },
  { path: "/ai/font-finder", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" }
];

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add static pages
staticPages.forEach(p => {
  xml += `  <url>
    <loc>${domain}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>\n`;
});

// Add Categories
categories.forEach(c => {
  xml += `  <url>
    <loc>${domain}/category/${c.toLowerCase()}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
});

// Add Collections
collections.forEach(c => {
  xml += `  <url>
    <loc>${domain}/collections/${c}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
});

// Add Blog Posts
blogPosts.forEach(post => {
  xml += `  <url>
    <loc>${domain}/blog/${post.slug}</loc>
    <lastmod>${post.dateModified || post.datePublished}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
});

// Add Font Specimen Pages
fontsData.forEach(font => {
  const fontId = font.id || font.slug || font.name.toLowerCase().replace(/\s+/g, '-');
  xml += `  <url>
    <loc>${domain}/fonts/${fontId}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml);
console.log("Successfully compiled sitemap.xml with " + (staticPages.length + categories.length + collections.length + blogPosts.length + fontsData.length) + " urls!");
