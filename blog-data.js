// blog-data.js
// Static blog posts database for dynamic routing and sitemap generation
const blogPosts = [
  {
    slug: "best-fonts-for-ui-design",
    title: "Best Fonts for Modern UI Design in 2026",
    description: "Explore the most readable, accessible, and high-performance typefaces for web and mobile user interfaces, with pairing suggestions.",
    author: "Elena Rostova",
    datePublished: "2026-03-10",
    dateModified: "2026-07-06",
    category: "Design",
    tags: ["UI/UX", "Sans-Serif", "Accessibility"],
    content: "Good typography is the foundation of user interface design. In this guide, we review the top fonts like Inter, Satoshi, and SF Pro that offer excellent legibility at micro sizes and render crisp on high-density screens.",
    readTime: "5 min"
  },
  {
    slug: "guide-to-font-pairing",
    title: "The Ultimate Guide to AI-Powered Font Pairing",
    description: "Learn how to use AI to find the perfect typeface combinations for your website, brand identity, or presentation projects.",
    author: "Marcus Aurel",
    datePublished: "2026-04-15",
    dateModified: "2026-07-06",
    category: "AI Tools",
    tags: ["AI", "Font Pairing", "Web Design"],
    content: "Font pairing is both an art and a science. With modern AI models, we can analyze the structural and visual characteristics of fonts to recommend matches with perfect visual hierarchy. Here is how to construct great pairings.",
    readTime: "7 min"
  },
  {
    slug: "minimalist-typography-trends",
    title: "Minimalist Typography Trends: Less is More",
    description: "Discover how top luxury and lifestyle brands use clean, minimal typography to create high-end brand appeal.",
    author: "Sophia Chen",
    datePublished: "2026-05-20",
    dateModified: "2026-07-06",
    category: "Trends",
    tags: ["Minimalist", "Luxury", "Design Principles"],
    content: "Minimalist design relies heavily on typography to carry the message. By using ultra-light weights, generous letter-spacing, and extreme contrast, modern brands achieve a sleek, premium, and sophisticated visual tone.",
    readTime: "4 min"
  },
  {
    slug: "choosing-brand-typeface",
    title: "How to Choose the Right Brand Typeface",
    description: "A step-by-step framework for selecting a typeface that aligns with your brand personality, target audience, and product goals.",
    author: "Elena Rostova",
    datePublished: "2026-06-01",
    dateModified: "2026-07-06",
    category: "Branding",
    tags: ["Identity", "Foundry", "Marketing"],
    content: "Your typeface choice communicates brand value before the user reads a single word. Serif fonts express heritage and reliability, while sans-serif fonts suggest modernity and friendliness. We break down the checklist.",
    readTime: "6 min"
  },
  {
    slug: "serif-vs-sans-serif-in-web-design",
    title: "Serif vs. Sans-Serif: Readability on the Web",
    description: "A comprehensive look at readability studies comparing Serif and Sans-Serif typefaces on digital displays.",
    author: "Dr. Alistair Vance",
    datePublished: "2026-06-25",
    dateModified: "2026-07-06",
    category: "Research",
    tags: ["Legibility", "Web Standards", "Typography History"],
    content: "For decades, it was assumed that sans-serif was superior for screen reading. However, with modern high-DPI displays, high-quality serif fonts have closed the legibility gap. Let's look at what eye-tracking studies tell us.",
    readTime: "8 min"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { blogPosts };
}
