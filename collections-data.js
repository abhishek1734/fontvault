// collections-data.js
// Pre-crafted SEO-rich metadata for typography collections

const collectionsData = {
  "minimal-fonts": {
    title: "Best Minimalist Fonts for Clean Visual Designs",
    desc: "Discover our curated collection of clean, minimalist typefaces. Perfect for modern branding, user interfaces, and editorial design.",
    introduction: "Minimalist typography prioritizes clarity, simplicity, and function. By stripping away decorative elements, these fonts convey a quiet sophistication and high legibility.",
    benefits: [
      "High readability across all screen resolutions and sizes.",
      "Creates a modern, premium, and sophisticated brand personality.",
      "Reduces visual clutter, letting content stand out."
    ],
    faqs: [
      {
        q: "What defines a minimalist font?",
        a: "Minimalist fonts feature geometric structures, consistent stroke weights, clean terminals, and lack ornate decorations or flourishes."
      },
      {
        q: "Which minimalist font is best for website copy?",
        a: "Inter and Satoshi are excellent modern choices that render crisply at smaller body text sizes."
      }
    ],
    tagFilter: "Minimal"
  },
  "luxury-fonts": {
    title: "Best Luxury Fonts for High-End & Premium Brands",
    desc: "Browse premium, high-contrast typefaces designed for fashion branding, premium packaging, and editorial headers.",
    introduction: "Luxury typography is all about elegance, heritage, and dramatic contrast. Featuring hairline serifs, tall x-heights, and vertical axes, these fonts evoke timeless prestige.",
    benefits: [
      "Elevates brand value and commands premium positioning.",
      "Delivers high visual impact in titles and billboards.",
      "Establishes a classic, sophisticated aesthetic instantly."
    ],
    faqs: [
      {
        q: "When should I use a luxury font?",
        a: "Luxury fonts are best reserved for display headers, logos, invitations, and premium branding applications rather than body copy."
      },
      {
        q: "Do luxury fonts have to be Serif?",
        a: "While traditional luxury uses high-contrast serifs, modern luxury brands often pair clean sans-serifs with geometric letter-spacing."
      }
    ],
    tagFilter: "Luxury"
  },
  "modern-fonts": {
    title: "Best Modern Fonts for Startups and Digital Apps",
    desc: "Explore sleek, futuristic, and contemporary typefaces built for screen legibility and digital interfaces.",
    introduction: "Modern typography reflects our digital-first world. Combining humanist curves with geometric foundations, these fonts are engineered for performance and versatility.",
    benefits: [
      "Optimized for legibility on mobile, desktop, and smart display devices.",
      "Conveys innovation, technology, and approachable authority.",
      "Supports extensive weight variants for flexible layout design."
    ],
    faqs: [
      {
        q: "What makes a font feel modern?",
        a: "Slightly wider proportions, open counters, and high performance hinting for screen rendering define a modern font."
      }
    ],
    tagFilter: "Modern"
  },
  "bold-fonts": {
    title: "Best Bold & Loud Fonts for Impactful Display Headers",
    desc: "Discover high-impact, heavy-weight fonts built to command attention in posters, headlines, and logos.",
    introduction: "Bold typography is loud, confident, and direct. Featuring thick strokes and tight counters, these heavy-duty fonts are designed to grab attention instantly.",
    benefits: [
      "Creates immediate visual hierarchy and locks in focus.",
      "Perfect for short display headlines, posters, and logotypes.",
      "Works exceptionally well in brutalist and poster design layouts."
    ],
    faqs: [
      {
        q: "Can I use bold display fonts for body copy?",
        a: "No. Heavy display fonts suffer from legibility loss at small sizes due to tight counters. Use them strictly for headlines."
      }
    ],
    tagFilter: "Bold"
  },
  "vintage-fonts": {
    title: "Best Vintage & Retro Fonts for Nostalgic Appeal",
    desc: "Explore typefaces with classic warmth, organic textures, and historic character inspired by print heritage.",
    introduction: "Vintage typography brings retro charm, craftsmanship, and human warmth. Ideal for packaging, editorial, and nostalgic branding projects.",
    benefits: [
      "Creates an authentic, heritage, and hand-crafted feel.",
      "Injects personality and distinct narrative into a brand.",
      "Stands out from clean, sterile modern digital designs."
    ],
    faqs: [
      {
        q: "How do I pair vintage fonts?",
        a: "Pair ornamental vintage headers with simple, neutral geometric sans-serifs for body text to balance the layout."
      }
    ],
    tagFilter: "Vintage"
  },
  "elegant-fonts": {
    title: "Best Elegant & Sophisticated Fonts for Editorial Design",
    desc: "Discover graceful, high-contrast serif and script fonts for elegant branding, invitation cards, and magazines.",
    introduction: "Elegant typography uses graceful curves, delicate details, and rhythmic calligraphic lines to convey sophistication and charm.",
    benefits: [
      "Establishes a high-end, premium style immediately.",
      "Perfect for fashion, lifestyle, and magazine layouts.",
      "Adds a personal, organic touch to luxury identities."
    ],
    faqs: [
      {
        q: "What category do elegant fonts typically fall under?",
        a: "They are primarily high-contrast Serifs or flowing script/handwritten fonts."
      }
    ],
    tagFilter: "Elegant"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { collectionsData };
}
