// =============================================================
//  FONTVAULT — curated-pairings.js
//  Seed dataset of 30 classic, typography-proven font pairings.
//  Structured for dual use: in-browser window global & Node.js module.
// =============================================================

const curatedFontPairings = [
  {
    heading: "Playfair Display",
    body: "Inter",
    tags: ["editorial", "luxury", "classic", "modern"],
    reason: "High-contrast transitional serif header paired with ultra-neutral, screen-optimized sans body.",
    curatedScore: 98
  },
  {
    heading: "Playfair Display",
    body: "Lato",
    tags: ["editorial", "fashion", "magazine", "elegant"],
    reason: "Playfair's sharp, high-contrast serifs are softened by Lato's warm, humanist sans-serif terminals.",
    curatedScore: 95
  },
  {
    heading: "Poppins",
    body: "Merriweather",
    tags: ["modern", "corporate", "clean", "reading"],
    reason: "Geometric sans headlines bring modern energy, balanced by Merriweather's sturdy, high-legibility book serifs.",
    curatedScore: 96
  },
  {
    heading: "Space Grotesk",
    body: "Lora",
    tags: ["tech", "editorial", "modern", "artistic"],
    reason: "Space Grotesk provides brutalist, geometric edge while Lora grounds long-form reading with literary warmth.",
    curatedScore: 94
  },
  {
    heading: "DM Serif Display",
    body: "Inter",
    tags: ["poster", "minimal", "contemporary", "bold"],
    reason: "Dramatic high-contrast transitional curves command attention against Inter's crisp, functional text rendering.",
    curatedScore: 97
  },
  {
    heading: "DM Serif Display",
    body: "Satoshi",
    tags: ["editorial", "brand", "clean", "minimal"],
    reason: "Editorial display serifs meet Satoshi's modernist proportions for premium branding and portfolio headers.",
    curatedScore: 96
  },
  {
    heading: "Instrument Serif",
    body: "Inter",
    tags: ["editorial", "minimal", "luxury", "elegant"],
    reason: "Delicate, high-contrast early 20th-century metal type elegance offset by modern digital screen geometry.",
    curatedScore: 95
  },
  {
    heading: "Clash Display",
    body: "Satoshi",
    tags: ["bold", "modern", "agency", "tech"],
    reason: "Clash Display's aggressive, unexpected terminals pair naturally with Satoshi's balanced, neo-grotesque body.",
    curatedScore: 97
  },
  {
    heading: "Cabinet Grotesk",
    body: "Switzer",
    tags: ["minimal", "architecture", "portfolio", "clean"],
    reason: "Tight display tracking and high structural character balanced by Switzer's neutral, Swiss-inspired text.",
    curatedScore: 95
  },
  {
    heading: "Syne",
    body: "Inter",
    tags: ["artistic", "creative", "web3", "playful"],
    reason: "Expressive, wide avant-garde display forms paired with Inter's reliable interface legibility.",
    curatedScore: 93
  },
  {
    heading: "Cinzel",
    body: "Lato",
    tags: ["formal", "luxury", "heritage", "classic"],
    reason: "Classical Roman inscriptional proportions balanced by Lato's approachable, transparent humanist structure.",
    curatedScore: 94
  },
  {
    heading: "Cormorant Garamond",
    body: "Plus Jakarta Sans",
    tags: ["elegant", "lifestyle", "boutique", "clean"],
    reason: "Traditional, graceful French Garamond curves grounded by clean, open geometric sans-serif body copy.",
    curatedScore: 95
  },
  {
    heading: "Bespoke Serif",
    body: "General Sans",
    tags: ["editorial", "corporate", "advisory", "formal"],
    reason: "A sophisticated, high-contrast serif head paired with the neutral, workhorse clarity of General Sans.",
    curatedScore: 96
  },
  {
    heading: "Zodiak",
    body: "Switzer",
    tags: ["retro", "vintage", "craft", "bold"],
    reason: "Flamboyant, heavy display serifs with vintage charm, stabilized by clean grotesque body typography.",
    curatedScore: 94
  },
  {
    heading: "Sentient",
    body: "Satoshi",
    tags: ["luxury", "cosmetics", "skincare", "elegant"],
    reason: "Sentient's delicate contemporary serif construction harmonizes seamlessly with Satoshi's clean lines.",
    curatedScore: 95
  },
  {
    heading: "Plus Jakarta Sans",
    body: "Lora",
    tags: ["saas", "clean", "reading", "modern"],
    reason: "Clean, tech-forward geometric headings paired with Lora's calligraphic, comfortable literary reading flow.",
    curatedScore: 94
  },
  {
    heading: "Bebas Neue",
    body: "Montserrat",
    tags: ["bold", "poster", "athletics", "modern"],
    reason: "Condensed, high-impact all-caps display headings backed by wide, open geometric lowercase body copy.",
    curatedScore: 92
  },
  {
    heading: "Oswald",
    body: "Merriweather",
    tags: ["news", "journalism", "editorial", "bold"],
    reason: "Alternate Gothic condensed urgency balanced by Merriweather's sturdy, wide-reading x-height.",
    curatedScore: 93
  },
  {
    heading: "Epilogue",
    body: "Alegreya",
    tags: ["artisan", "literary", "creative", "vintage"],
    reason: "Modern sans-serif heading with strong geometric personality paired with Alegreya's lyrical serif warmth.",
    curatedScore: 93
  },
  {
    heading: "Archivo",
    body: "Adobe Caslon Pro",
    tags: ["publishing", "classic", "modern", "formal"],
    reason: "Industrial grotesque boldness contrasted with the timeless, dignified heritage of Adobe Caslon.",
    curatedScore: 95
  },
  {
    heading: "Adobe Garamond Pro",
    body: "Inter",
    tags: ["academic", "editorial", "formal", "classic"],
    reason: "Centuries of book design prestige balanced against modern, pixel-perfect interface typography.",
    curatedScore: 96
  },
  {
    heading: "Outfit",
    body: "Lora",
    tags: ["friendly", "modern", "lifestyle", "clean"],
    reason: "Approachable, rounded geometric headlines paired with sophisticated literary body serifs.",
    curatedScore: 94
  },
  {
    heading: "Raleway",
    body: "Merriweather",
    tags: ["fashion", "editorial", "clean", "elegant"],
    reason: "Thin, stylish geometric display proportions anchored by robust, readable serif text copy.",
    curatedScore: 93
  },
  {
    heading: "Work Sans",
    body: "Libre Baskerville",
    tags: ["editorial", "magazine", "culture", "classic"],
    reason: "A friendly, early-grotesque heading paired with high-legibility web-optimized Baskerville body text.",
    curatedScore: 95
  },
  {
    heading: "JetBrains Mono",
    body: "Inter",
    tags: ["developer", "tech", "documentation", "clean"],
    reason: "Technical monospace structure in headers balanced by Inter's clean, fatigue-free reading layout.",
    curatedScore: 94
  },
  {
    heading: "Gambetta",
    body: "Satoshi",
    tags: ["literary", "minimal", "modern", "editorial"],
    reason: "Gambetta's sharp, elegant editorial serif terminals offset by Satoshi's contemporary neutral precision.",
    curatedScore: 96
  },
  {
    heading: "Melodrama",
    body: "Switzer",
    tags: ["playful", "bold", "vintage", "artistic"],
    reason: "Curvaceous, theatrical retro display serifs balanced by Switzer's dependable neo-grotesque discipline.",
    curatedScore: 93
  },
  {
    heading: "Boska",
    body: "General Sans",
    tags: ["lifestyle", "magazine", "luxury", "elegant"],
    reason: "High-contrast serif drama creates strong visual hierarchy alongside General Sans' clean functionality.",
    curatedScore: 95
  },
  {
    heading: "Space Grotesk",
    body: "Switzer",
    tags: ["agency", "tech", "portfolio", "modern"],
    reason: "Quirky, tech-infused display letterforms complemented by the neutral, modern rhythm of Switzer.",
    curatedScore: 94
  },
  {
    heading: "Playfair Display",
    body: "Plus Jakarta Sans",
    tags: ["fashion", "luxury", "modern", "elegant"],
    reason: "Classic high-contrast luxury serifs paired with a fresh, airy geometric sans-serif.",
    curatedScore: 96
  }
];

if (typeof window !== "undefined") {
  window.curatedFontPairings = curatedFontPairings;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { curatedFontPairings };
}
