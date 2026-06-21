// =============================================================
//  FONTVAULT — app.js  (50+ fonts, dark mode, compare, pairings)
// =============================================================

// --- CURATED MULTI-PROVIDER DATABASE ---
const fontsData = [

  // ══════════════ GOOGLE FONTS ══════════════
  {
    id:"instrument-serif", name:"Instrument Serif", provider:"google",
    designer:"Jordan Bell", foundry:"Instrument", year:"2023", stylesCount:4,
    languages:["Latin","Latin Extended"],
    description:"Instrument Serif is a elegant, high-contrast serif typeface designed for headlines and brand presentation. It draws inspiration from early 20th-century metal type.",
    availability:"Free", mood:"Elegant", useCase:"Editorial", style:"Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Instrument+Serif",
    price:"Free", mockupType:"magazine", mockupTitle:"L'HORIZON", mockupSubtitle:"Volume 24 / Autumn Edition", fileSize:"1.4 MB",
    pairsWith:[{id:"inter",role:"Body Text"},{id:"jetbrains-mono",role:"Code / Caption"}]
  },
  {
    id:"inter", name:"Inter", provider:"google",
    designer:"Rasmus Andersson", foundry:"RSMS", year:"2016", stylesCount:18,
    languages:["Latin","Cyrillic","Greek"],
    description:"Inter is a variable font family crafted for computer screens. It features a tall x-height to aid readability of mixed-case and lower-case text.",
    availability:"Free", mood:"Minimal", useCase:"UI", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Inter",
    price:"Free", mockupType:"ui", mockupTitle:"Settings / Advanced", mockupSubtitle:"Enable system-wide variable properties", fileSize:"2.3 MB",
    pairsWith:[{id:"dm-serif-display",role:"Headlines"},{id:"jetbrains-mono",role:"Code"}]
  },
  {
    id:"dm-serif-display", name:"DM Serif Display", provider:"google",
    designer:"Colophon Foundry", foundry:"Colophon", year:"2019", stylesCount:2,
    languages:["Latin","Latin Extended"],
    description:"DM Serif Display is a high-contrast transitional serif typeface designed for headline and display use. Pairs exceptionally well with clean sans-serif body text.",
    availability:"Free", mood:"Vintage", useCase:"Poster", style:"Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/DM+Serif+Display",
    price:"Free", mockupType:"poster", mockupTitle:"BAUHAUS", mockupSubtitle:"Retrospective Exhibition 1919–1933", fileSize:"0.8 MB",
    pairsWith:[{id:"inter",role:"Body Text"},{id:"satoshi",role:"UI Elements"}]
  },
  {
    id:"jetbrains-mono", name:"JetBrains Mono", provider:"google",
    designer:"Philipp Nurullin", foundry:"JetBrains", year:"2020", stylesCount:8,
    languages:["Latin","Cyrillic","Greek"],
    description:"JetBrains Mono is designed specifically for developers, reducing eye strain during long coding sessions with optimized spacing and code ligatures.",
    availability:"Free", mood:"Minimal", useCase:"Web", style:"Monospace", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/JetBrains+Mono",
    price:"Free", mockupType:"code", mockupTitle:"const config = {", mockupSubtitle:"  theme: 'mono-dark',\n  opacity: 0.95\n}", fileSize:"1.9 MB",
    pairsWith:[{id:"inter",role:"UI Text"},{id:"space-grotesk",role:"Headers"}]
  },
  {
    id:"syne", name:"Syne", provider:"google",
    designer:"Bonjour Monde", foundry:"Synesthesia", year:"2017", stylesCount:5,
    languages:["Latin"],
    description:"Originally designed for an art center in France. Features wide, expressive letterforms in heavier weights while remaining clean and architectural in lighter weights.",
    availability:"Free", mood:"Playful", useCase:"Branding", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Syne",
    price:"Free", mockupType:"branding", mockupTitle:"FUTURE", mockupSubtitle:"Design Collective 2026", fileSize:"1.2 MB",
    pairsWith:[{id:"inter",role:"Body"},{id:"instrument-serif",role:"Accent"}]
  },
  {
    id:"playfair-display", name:"Playfair Display", provider:"google",
    designer:"Claus Eggers Sørensen", foundry:"Claus Sørensen", year:"2011", stylesCount:6,
    languages:["Latin","Cyrillic"],
    description:"Playfair Display is a transitional serif typeface influenced by Baskerville. Features elegant high-contrast strokes that work beautifully in titles and invitations.",
    availability:"Free", mood:"Elegant", useCase:"Editorial", style:"Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Playfair+Display",
    price:"Free", mockupType:"invitation", mockupTitle:"Charlotte & Julian", mockupSubtitle:"Request the pleasure of your company", fileSize:"2.1 MB",
    pairsWith:[{id:"montserrat",role:"Body Text"},{id:"lato",role:"UI Labels"}]
  },
  {
    id:"space-grotesk", name:"Space Grotesk", provider:"google",
    designer:"Florian Karsten", foundry:"FK Foundry", year:"2018", stylesCount:5,
    languages:["Latin","Latin Extended"],
    description:"Space Grotesk is a proportional sans-serif based on Space Mono, maintaining quirky characteristics while optimizing readability for body copy and titles.",
    availability:"Free", mood:"Bold", useCase:"Branding", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Space+Grotesk",
    price:"Free", mockupType:"poster", mockupTitle:"DATA-FLEX", mockupSubtitle:"Decentralized Cybernetic Hubs", fileSize:"1.1 MB",
    pairsWith:[{id:"lora",role:"Body"},{id:"jetbrains-mono",role:"Code"}]
  },
  {
    id:"bebas-neue", name:"Bebas Neue", provider:"google",
    designer:"Ryoichi Tsunekawa", foundry:"Dharma Type", year:"2010", stylesCount:5,
    languages:["Latin","Cyrillic"],
    description:"Bebas Neue is a highly popular display sans-serif characterized by its clean lines, condensed cap-height, and bold punchy presence suitable for headings.",
    availability:"Free", mood:"Bold", useCase:"Poster", style:"Display", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Bebas+Neue",
    price:"Free", mockupType:"bold-label", mockupTitle:"LIMITED ED.", mockupSubtitle:"BATCH NO. 4882 / ARCHIVE", fileSize:"0.6 MB",
    pairsWith:[{id:"montserrat",role:"Body"},{id:"work-sans",role:"Subheadings"}]
  },
  {
    id:"cinzel", name:"Cinzel", provider:"google",
    designer:"Natanael Gama", foundry:"N Gama", year:"2012", stylesCount:6,
    languages:["Latin"],
    description:"Inspired by first-century Roman inscriptions. Follows classical proportions while incorporating a contemporary flare, perfect for luxury labels and historic displays.",
    availability:"Free", mood:"Formal", useCase:"Packaging", style:"Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Cinzel",
    price:"Free", mockupType:"luxury", mockupTitle:"RESERVE", mockupSubtitle:"Single Vineyard / Cabernet Franc", fileSize:"1.7 MB",
    pairsWith:[{id:"cormorant-garamond",role:"Body"},{id:"lato",role:"UI"}]
  },
  {
    id:"cormorant-garamond", name:"Cormorant Garamond", provider:"google",
    designer:"Christian Thalmann", foundry:"Catharsis", year:"2015", stylesCount:10,
    languages:["Latin","Cyrillic"],
    description:"A large, high-fidelity Garamond family designed for large display use. Features ultra-thin serifs and elegant curves.",
    availability:"Free", mood:"Elegant", useCase:"Editorial", style:"Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Cormorant+Garamond",
    price:"Free", mockupType:"book", mockupTitle:"THE METAMORPHOSIS", mockupSubtitle:"Translated from the original German text", fileSize:"2.5 MB",
    pairsWith:[{id:"cinzel",role:"Headlines"},{id:"inter",role:"Body UI"}]
  },
  {
    id:"outfit", name:"Outfit", provider:"google",
    designer:"Outfit Foundry", foundry:"Outfit", year:"2021", stylesCount:9,
    languages:["Latin"],
    description:"A playful, clean, geometric sans-serif optimized for web screens, mobile UI, and smart device applications.",
    availability:"Free", mood:"Playful", useCase:"UI", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Outfit",
    price:"Free", mockupType:"ui", mockupTitle:"Explore // Dynamic", mockupSubtitle:"Quick interactive UI configurations", fileSize:"1.0 MB",
    pairsWith:[{id:"lora",role:"Editorial Body"},{id:"raleway",role:"Accent Headings"}]
  },
  {
    id:"montserrat", name:"Montserrat", provider:"google",
    designer:"Julieta Ulanovsky", foundry:"Montserrat Project", year:"2011", stylesCount:18,
    languages:["Latin","Cyrillic"],
    description:"Inspired by posters, signs, and old windows from the historic Buenos Aires neighborhood. Beautiful geometric layout that is highly readable.",
    availability:"Free", mood:"Modern", useCase:"Web", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Montserrat",
    price:"Free", mockupType:"poster", mockupTitle:"MUNICIPAL", mockupSubtitle:"BUENOS AIRES NEIGHBORHOOD", fileSize:"2.8 MB",
    pairsWith:[{id:"playfair-display",role:"Editorial Header"},{id:"nunito",role:"Body Copy"}]
  },
  {
    id:"lora", name:"Lora", provider:"google",
    designer:"Cyreal", foundry:"Cyreal", year:"2011", stylesCount:8,
    languages:["Latin","Cyrillic"],
    description:"Lora is a well-balanced contemporary serif with roots in calligraphy. Its moderate contrast is perfect for long-form reading and literary publications.",
    availability:"Free", mood:"Elegant", useCase:"Editorial", style:"Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Lora",
    price:"Free", mockupType:"book", mockupTitle:"The Great Silence", mockupSubtitle:"A novel of the modern era", fileSize:"1.3 MB",
    pairsWith:[{id:"montserrat",role:"Headlines"},{id:"raleway",role:"Display"}]
  },
  {
    id:"raleway", name:"Raleway", provider:"google",
    designer:"Matt McInerney", foundry:"The League of Moveable Type", year:"2010", stylesCount:18,
    languages:["Latin","Cyrillic"],
    description:"Raleway is an elegant sans-serif typeface family initially designed as a single thin weight. It is ideal for headings and display text with its distinctive W letterform.",
    availability:"Free", mood:"Modern", useCase:"Branding", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Raleway",
    price:"Free", mockupType:"branding", mockupTitle:"ELÉGANCE", mockupSubtitle:"Modern Lifestyle Brand", fileSize:"1.6 MB",
    pairsWith:[{id:"lora",role:"Body Text"},{id:"playfair-display",role:"Feature"}]
  },
  {
    id:"poppins", name:"Poppins", provider:"google",
    designer:"Jonny Pinhorn", foundry:"Indian Type Foundry", year:"2014", stylesCount:18,
    languages:["Latin","Devanagari"],
    description:"Poppins is a geometric sans-serif with 9 weights available. Each letterform is nearly monolinear, with optical corrections applied at joints.",
    availability:"Free", mood:"Playful", useCase:"UI", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Poppins",
    price:"Free", mockupType:"ui", mockupTitle:"Dashboard / 2026", mockupSubtitle:"Clean geometric interface", fileSize:"2.1 MB",
    pairsWith:[{id:"playfair-display",role:"Display"},{id:"lora",role:"Body"}]
  },
  {
    id:"nunito", name:"Nunito", provider:"google",
    designer:"Vernon Adams", foundry:"Vernon Adams", year:"2014", stylesCount:14,
    languages:["Latin","Cyrillic"],
    description:"Nunito is a well-balanced sans-serif typeface with rounded terminals. It is excellent for children's apps, casual UI, and friendly brand voices.",
    availability:"Free", mood:"Playful", useCase:"UI", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Nunito",
    price:"Free", mockupType:"ui", mockupTitle:"Hello, World", mockupSubtitle:"Friendly & rounded interface", fileSize:"1.4 MB",
    pairsWith:[{id:"poppins",role:"Headlines"},{id:"lora",role:"Long-form"}]
  },
  {
    id:"fira-code", name:"Fira Code", provider:"google",
    designer:"Nikita Prokopov", foundry:"Mozilla", year:"2015", stylesCount:5,
    languages:["Latin","Cyrillic"],
    description:"Fira Code is a monospace font with programming ligatures. It makes code more readable by replacing common programming sequences with single glyphs.",
    availability:"Free", mood:"Minimal", useCase:"Web", style:"Monospace", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Fira+Code",
    price:"Free", mockupType:"code", mockupTitle:"fn main() {", mockupSubtitle:"  println!(\"Hello World\");\n}", fileSize:"0.9 MB",
    pairsWith:[{id:"inter",role:"UI Text"},{id:"space-grotesk",role:"Headlines"}]
  },
  {
    id:"oswald", name:"Oswald", provider:"google",
    designer:"Vernon Adams", foundry:"Vernnon Adams", year:"2011", stylesCount:6,
    languages:["Latin","Cyrillic"],
    description:"Oswald is a reworking of the classic style historically represented by the 'Alternate Gothic' sans-serif typefaces. Features condensed letterforms ideal for titles.",
    availability:"Free", mood:"Bold", useCase:"Poster", style:"Display", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Oswald",
    price:"Free", mockupType:"bold-label", mockupTitle:"IMPACT", mockupSubtitle:"CONDENSED DISPLAY TYPE", fileSize:"0.7 MB",
    pairsWith:[{id:"lora",role:"Body"},{id:"inter",role:"Captions"}]
  },
  {
    id:"merriweather", name:"Merriweather", provider:"google",
    designer:"Eben Sorkin", foundry:"Sorkin Type", year:"2010", stylesCount:8,
    languages:["Latin","Cyrillic"],
    description:"Merriweather was designed to be a text face that is pleasant to read on screens. It features a slightly condensed letterspace, tall x-height, and robust serifs.",
    availability:"Free", mood:"Formal", useCase:"Editorial", style:"Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Merriweather",
    price:"Free", mockupType:"book", mockupTitle:"THE SILENT OCEAN", mockupSubtitle:"A long-form investigation into tidal patterns", fileSize:"1.2 MB",
    pairsWith:[{id:"montserrat",role:"UI Headers"},{id:"raleway",role:"Display Titles"}]
  },
  {
    id:"abril-fatface", name:"Abril Fatface", provider:"google",
    designer:"Veronika Burian", foundry:"TypeTogether", year:"2011", stylesCount:1,
    languages:["Latin"],
    description:"Abril Fatface is part of a type system for editorial use in newspapers and magazines. The display face stands out with its ultra-bold stroke contrasts.",
    availability:"Free", mood:"Bold", useCase:"Poster", style:"Display", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Abril+Fatface",
    price:"Free", mockupType:"poster", mockupTitle:"BOLD", mockupSubtitle:"Statement Display Typeface", fileSize:"0.5 MB",
    pairsWith:[{id:"lato",role:"Body"},{id:"inter",role:"UI"}]
  },
  {
    id:"work-sans", name:"Work Sans", provider:"google",
    designer:"Wei Huang", foundry:"Wei Huang", year:"2015", stylesCount:18,
    languages:["Latin"],
    description:"Work Sans is a typeface family based loosely on early grotesques. It is optimized for use on screen and particularly legible at mid-range sizes.",
    availability:"Free", mood:"Modern", useCase:"Web", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Work+Sans",
    price:"Free", mockupType:"ui", mockupTitle:"Work / Flow", mockupSubtitle:"Productivity interface designed for focus", fileSize:"1.5 MB",
    pairsWith:[{id:"merriweather",role:"Long Read"},{id:"playfair-display",role:"Titles"}]
  },
  {
    id:"archivo", name:"Archivo", provider:"google",
    designer:"Omnibus-Type", foundry:"Omnibus-Type", year:"2015", stylesCount:12,
    languages:["Latin"],
    description:"Archivo is a grotesque sans-serif type family with a strong structure, ideal for headlines, body copy, and data-dense interfaces.",
    availability:"Free", mood:"Modern", useCase:"Branding", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Archivo",
    price:"Free", mockupType:"branding", mockupTitle:"ARCHIVE", mockupSubtitle:"Systems & Design — Studio 2026", fileSize:"1.8 MB",
    pairsWith:[{id:"lora",role:"Serif Body"},{id:"cormorant-garamond",role:"Display"}]
  },
  {
    id:"barlow", name:"Barlow", provider:"google",
    designer:"Jeremy Tribby", foundry:"Jeremy Tribby", year:"2017", stylesCount:18,
    languages:["Latin"],
    description:"Barlow is a slightly rounded, low-contrast, grotesk type family, drawing from California highway and road sign lettering.",
    availability:"Free", mood:"Modern", useCase:"Branding", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Barlow",
    price:"Free", mockupType:"poster", mockupTitle:"HIGHWAY 01", mockupSubtitle:"California Road Typography System", fileSize:"2.2 MB",
    pairsWith:[{id:"merriweather",role:"Body"},{id:"abril-fatface",role:"Display"}]
  },
  {
    id:"righteous", name:"Righteous", provider:"google",
    designer:"Astigmatic", foundry:"Astigmatic", year:"2012", stylesCount:1,
    languages:["Latin"],
    description:"Righteous is a display font inspired by mid-20th century American signage. It has a distinctive retro feel with strong geometric influences.",
    availability:"Free", mood:"Vintage", useCase:"Branding", style:"Display", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Righteous",
    price:"Free", mockupType:"branding", mockupTitle:"RETRO DINER", mockupSubtitle:"Est. 1962 · Classic American", fileSize:"0.4 MB",
    pairsWith:[{id:"nunito",role:"Body"},{id:"lato",role:"UI"}]
  },
  {
    id:"lato", name:"Lato", provider:"google",
    designer:"Łukasz Dziedzic", foundry:"tyPoland", year:"2010", stylesCount:10,
    languages:["Latin","Latin Extended"],
    description:"Lato is a sans-serif typeface family with semi-rounded details, giving it a warm feel while remaining serious and transparent in body text.",
    availability:"Free", mood:"Minimal", useCase:"Web", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Lato",
    price:"Free", mockupType:"ui", mockupTitle:"Warm Sans · Lato", mockupSubtitle:"Clean, legible, and warm", fileSize:"1.1 MB",
    pairsWith:[{id:"playfair-display",role:"Headlines"},{id:"merriweather",role:"Long Read"}]
  },
  {
    id:"libre-baskerville", name:"Libre Baskerville", provider:"google",
    designer:"Impallari Type", foundry:"Impallari", year:"2012", stylesCount:3,
    languages:["Latin"],
    description:"Libre Baskerville is a web font optimized for body text at small sizes. Based on the American Type Founder's Baskerville from 1941.",
    availability:"Free", mood:"Formal", useCase:"Editorial", style:"Serif", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Libre+Baskerville",
    price:"Free", mockupType:"book", mockupTitle:"EDITORIAL REVIEW", mockupSubtitle:"Curated quarterly journal of thought", fileSize:"0.8 MB",
    pairsWith:[{id:"lato",role:"Sans UI"},{id:"archivo",role:"Display"}]
  },
  {
    id:"pacifico", name:"Pacifico", provider:"google",
    designer:"Vernon Adams", foundry:"Vernnon Adams", year:"2011", stylesCount:1,
    languages:["Latin","Cyrillic"],
    description:"Pacifico is a fun brush script typeface inspired by the American surf culture of the 1950s and 60s. It is great for logotypes and casual display.",
    availability:"Free", mood:"Playful", useCase:"Branding", style:"Script", language:"Latin",
    downloadUrl:"https://fonts.google.com/specimen/Pacifico",
    price:"Free", mockupType:"invitation", mockupTitle:"Beach House", mockupSubtitle:"Casual summer gathering — RSVP by July 4th", fileSize:"0.6 MB",
    pairsWith:[{id:"lato",role:"Body"},{id:"nunito",role:"UI Labels"}]
  },

  // ══════════════ FONTSHARE FONTS ══════════════
  {
    id:"satoshi", name:"Satoshi", provider:"fontshare",
    designer:"Indian Type Foundry", foundry:"ITF", year:"2021", stylesCount:10,
    languages:["Latin"],
    description:"Satoshi is a modernist neo-grotesque sans-serif. Clean, minimalist, and highly adaptable for modern digital interfaces, posters, and body layouts.",
    availability:"Free", mood:"Minimal", useCase:"UI", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/satoshi",
    price:"Free", mockupType:"ui", mockupTitle:"Interface // Satoshi", mockupSubtitle:"Optimal layout configurations", fileSize:"1.8 MB",
    pairsWith:[{id:"instrument-serif",role:"Display"},{id:"zodiak",role:"Editorial"}]
  },
  {
    id:"clash-display", name:"Clash Display", provider:"fontshare",
    designer:"Indian Type Foundry", foundry:"ITF", year:"2021", stylesCount:6,
    languages:["Latin"],
    description:"Clash Display features very small counters and thick strokes, giving it a heavy, high-contrast personality ideal for headline posters.",
    availability:"Free", mood:"Bold", useCase:"Poster", style:"Display", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/clash-display",
    price:"Free", mockupType:"bold-label", mockupTitle:"ATTENTION", mockupSubtitle:"THIS PRODUCT IS HIGHLY EXPERIMENTAL", fileSize:"1.1 MB",
    pairsWith:[{id:"satoshi",role:"Body"},{id:"general-sans",role:"UI"}]
  },
  {
    id:"cabinet-grotesk-free", name:"Cabinet Grotesk", provider:"fontshare",
    designer:"Indian Type Foundry", foundry:"ITF", year:"2021", stylesCount:8,
    languages:["Latin"],
    description:"Cabinet Grotesk is a premium sans-serif designed for branding, digital UI, and high-impact identity headers. Shifts between geometric and elegant curves.",
    availability:"Free", mood:"Modern", useCase:"Branding", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/cabinet-grotesk",
    price:"Free", mockupType:"branding", mockupTitle:"ITF DESIGN", mockupSubtitle:"Branding Collective 2026", fileSize:"2.4 MB",
    pairsWith:[{id:"zodiak",role:"Body Serif"},{id:"satoshi",role:"UI Text"}]
  },
  {
    id:"general-sans", name:"General Sans", provider:"fontshare",
    designer:"Indian Type Foundry", foundry:"ITF", year:"2021", stylesCount:12,
    languages:["Latin"],
    description:"General Sans is a neutral, highly readable grotesque ideal for technical documentation and long editorial reviews where legibility is paramount.",
    availability:"Free", mood:"Formal", useCase:"Web", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/general-sans",
    price:"Free", mockupType:"book", mockupTitle:"SPECIFICATION NOTES", mockupSubtitle:"Compiled technical data sheet", fileSize:"2.0 MB",
    pairsWith:[{id:"boska",role:"Display"},{id:"switzer",role:"Headlines"}]
  },
  {
    id:"zodiak", name:"Zodiak", provider:"fontshare",
    designer:"Jérémie Hornus", foundry:"ITF", year:"2021", stylesCount:8,
    languages:["Latin"],
    description:"Zodiak is an elegant serif typeface featuring exceptionally thin, delicate horizontal serifs. Shines in luxurious magazine titles and literary publications.",
    availability:"Free", mood:"Elegant", useCase:"Editorial", style:"Serif", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/zodiak",
    price:"Free", mockupType:"magazine", mockupTitle:"ELEGANTIA", mockupSubtitle:"High Fashion / Winter Issue", fileSize:"1.6 MB",
    pairsWith:[{id:"satoshi",role:"Body"},{id:"general-sans",role:"UI"}]
  },
  {
    id:"switzer", name:"Switzer", provider:"fontshare",
    designer:"Jérémie Hornus", foundry:"ITF", year:"2022", stylesCount:18,
    languages:["Latin"],
    description:"Switzer is a neutral and versatile grotesque sans-serif with a Swiss-inspired clean structure. Excellent for editorial, branding, and interface design.",
    availability:"Free", mood:"Minimal", useCase:"Branding", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/switzer",
    price:"Free", mockupType:"ui", mockupTitle:"Switzer / Clean", mockupSubtitle:"Swiss-inspired typographic precision", fileSize:"2.1 MB",
    pairsWith:[{id:"zodiak",role:"Editorial Body"},{id:"boska",role:"Display"}]
  },
  {
    id:"boska", name:"Boska", provider:"fontshare",
    designer:"Dharma Type", foundry:"ITF", year:"2022", stylesCount:8,
    languages:["Latin"],
    description:"Boska is a high-contrast display serif with dramatic thin-thick stroke transitions. It commands attention in luxury editorials and fashion branding.",
    availability:"Free", mood:"Elegant", useCase:"Editorial", style:"Serif", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/boska",
    price:"Free", mockupType:"magazine", mockupTitle:"MAISON", mockupSubtitle:"Couture · Printemps 2026", fileSize:"1.4 MB",
    pairsWith:[{id:"switzer",role:"Body"},{id:"general-sans",role:"UI"}]
  },
  {
    id:"chillax", name:"Chillax", provider:"fontshare",
    designer:"Indian Type Foundry", foundry:"ITF", year:"2022", stylesCount:6,
    languages:["Latin"],
    description:"Chillax is a relaxed, friendly geometric sans-serif with softened angles. Perfect for wellness brands, lifestyle apps, and approachable design systems.",
    availability:"Free", mood:"Playful", useCase:"UI", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/chillax",
    price:"Free", mockupType:"ui", mockupTitle:"Just Relax.", mockupSubtitle:"Wellness interface for mindful living", fileSize:"1.0 MB",
    pairsWith:[{id:"nunito",role:"Body"},{id:"lora",role:"Serif Accent"}]
  },
  {
    id:"tanker", name:"Tanker", provider:"fontshare",
    designer:"Rajesh Rajput", foundry:"ITF", year:"2022", stylesCount:1,
    languages:["Latin"],
    description:"Tanker is a bold, heavy display typeface with massive strokes and ink-trap cuts. It is built for maximum visual impact on posters and large-format print.",
    availability:"Free", mood:"Bold", useCase:"Poster", style:"Display", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/tanker",
    price:"Free", mockupType:"bold-label", mockupTitle:"TANK", mockupSubtitle:"HEAVY DISPLAY / MAX IMPACT", fileSize:"0.5 MB",
    pairsWith:[{id:"satoshi",role:"Body"},{id:"inter",role:"UI"}]
  },
  {
    id:"ranade", name:"Ranade", provider:"fontshare",
    designer:"Indian Type Foundry", foundry:"ITF", year:"2023", stylesCount:12,
    languages:["Latin"],
    description:"Ranade is a sophisticated transitional serif with elegant optical compensation and refined letterforms for premium editorial and luxury brand communications.",
    availability:"Free", mood:"Elegant", useCase:"Packaging", style:"Serif", language:"Latin",
    downloadUrl:"https://www.fontshare.com/fonts/ranade",
    price:"Free", mockupType:"luxury", mockupTitle:"PRESTIGE", mockupSubtitle:"Reserve Collection · 2026 Vintage", fileSize:"1.9 MB",
    pairsWith:[{id:"switzer",role:"UI"},{id:"cabinet-grotesk-free",role:"Body"}]
  },

  // ══════════════ DAFONT FONTS ══════════════
  {
    id:"lemon-milk", name:"Lemon Milk", provider:"dafont",
    designer:"Muhammad Faisal", foundry:"Ariq Sya", year:"2016", stylesCount:4,
    languages:["Latin"],
    description:"Lemon Milk is a popular geometric display sans-serif. Known for its sharp corners and modern uppercase letters, widely featured in streetwear and active posters.",
    availability:"Free for Personal", mood:"Bold", useCase:"Branding", style:"Display", language:"Latin",
    downloadUrl:"https://www.dafont.com/lemon-milk.font",
    price:"Free", mockupType:"branding", mockupTitle:"LEMON", mockupSubtitle:"CREATIVE HUB / STREETWEAR", fileSize:"0.9 MB",
    pairsWith:[{id:"inter",role:"Body"},{id:"nunito",role:"UI"}]
  },
  {
    id:"coolvetica", name:"Coolvetica", provider:"dafont",
    designer:"Ray Larabie", foundry:"Typodermic", year:"1999", stylesCount:4,
    languages:["Latin"],
    description:"Coolvetica is inspired by custom Helvetica logos of the 1970s. Features tight kerning, funky curves, and a vintage retro presence suitable for branding.",
    availability:"Free for Personal", mood:"Vintage", useCase:"Branding", style:"Sans-Serif", language:"Latin",
    downloadUrl:"https://www.dafont.com/coolvetica.font",
    price:"Free", mockupType:"poster", mockupTitle:"RETRO-WAVE", mockupSubtitle:"Custom Typography Era", fileSize:"1.2 MB",
    pairsWith:[{id:"lora",role:"Body"},{id:"merriweather",role:"Editorial"}]
  },
  {
    id:"shoreline-script", name:"Shoreline Script", provider:"dafont",
    designer:"Billy Argel", foundry:"Billy Argel", year:"2018", stylesCount:1,
    languages:["Latin"],
    description:"Shoreline Script is a fluid, flowing script typeface with elaborate flourishes. Ideal for organic packaging, wedding invites, and signature branding.",
    availability:"Free for Personal", mood:"Elegant", useCase:"Packaging", style:"Script", language:"Latin",
    downloadUrl:"https://www.dafont.com/shoreline-script.font",
    price:"Free", mockupType:"invitation", mockupTitle:"Serenade of the Sea", mockupSubtitle:"Premium Organic Reserve", fileSize:"2.1 MB",
    pairsWith:[{id:"cinzel",role:"Display"},{id:"lato",role:"Body"}]
  },
  {
    id:"old-london", name:"Old London", provider:"dafont",
    designer:"Dieter Steffmann", foundry:"Steffmann", year:"2002", stylesCount:2,
    languages:["Latin"],
    description:"Old London is a classic gothic blackletter font that recreates old English typography beautifully, perfect for vintage editorial work and historic certificates.",
    availability:"Free", mood:"Vintage", useCase:"Editorial", style:"Serif", language:"Latin",
    downloadUrl:"https://www.dafont.com/old-london.font",
    price:"Free", mockupType:"luxury", mockupTitle:"Chronicles", mockupSubtitle:"ESTABLISHED ANNO DOMINI 1884", fileSize:"0.7 MB",
    pairsWith:[{id:"libre-baskerville",role:"Body"},{id:"cinzel",role:"Headers"}]
  },
  {
    id:"freshman", name:"Freshman", provider:"dafont",
    designer:"William Boyd", foundry:"Divide By Zero", year:"2004", stylesCount:1,
    languages:["Latin"],
    description:"Freshman is a collegiate block letter typeface inspired by varsity athletic lettering. Bold, structured, and perfect for sports branding and team identity.",
    availability:"Free for Personal", mood:"Bold", useCase:"Branding", style:"Display", language:"Latin",
    downloadUrl:"https://www.dafont.com/freshman.font",
    price:"Free", mockupType:"bold-label", mockupTitle:"VARSITY", mockupSubtitle:"EST. 1987 · ATHLETICS DEPT.", fileSize:"0.3 MB",
    pairsWith:[{id:"barlow",role:"Body"},{id:"inter",role:"UI"}]
  },
  {
    id:"capture-it", name:"Capture It", provider:"dafont",
    designer:"Magique Fonts", foundry:"Magique", year:"2005", stylesCount:2,
    languages:["Latin"],
    description:"Capture It is a stencil-style typeface with military influence. Designed for use in tactical branding, action posters, and industrial design contexts.",
    availability:"Free for Personal", mood:"Formal", useCase:"Poster", style:"Display", language:"Latin",
    downloadUrl:"https://www.dafont.com/capture-it.font",
    price:"Free", mockupType:"poster", mockupTitle:"CLASSIFIED", mockupSubtitle:"RESTRICTED ACCESS · SECTOR 7G", fileSize:"0.3 MB",
    pairsWith:[{id:"oswald",role:"Body"},{id:"bebas-neue",role:"Sub-headings"}]
  },
  {
    id:"milkshake", name:"Milkshake", provider:"dafont",
    designer:"Laura Worthington", foundry:"Laura Worthington", year:"2013", stylesCount:1,
    languages:["Latin"],
    description:"Milkshake is a lively hand-crafted script font with smooth, round letterforms. Ideal for food branding, cute packaging, and social media graphics.",
    availability:"Free for Personal", mood:"Playful", useCase:"Packaging", style:"Script", language:"Latin",
    downloadUrl:"https://www.dafont.com/milkshake.font",
    price:"Free", mockupType:"invitation", mockupTitle:"Sweet Dreams", mockupSubtitle:"Handcrafted bakery & café", fileSize:"0.5 MB",
    pairsWith:[{id:"nunito",role:"Body"},{id:"pacifico",role:"Accent"}]
  },
  {
    id:"edo-sz", name:"Edo SZ", provider:"dafont",
    designer:"Vic Fieger", foundry:"Vic Fieger", year:"2000", stylesCount:1,
    languages:["Latin"],
    description:"Edo SZ is a distressed brush font inspired by Japanese calligraphic aesthetics. Great for streetwear, gaming, and action-driven brand identities.",
    availability:"Free for Personal", mood:"Bold", useCase:"Branding", style:"Display", language:"Latin",
    downloadUrl:"https://www.dafont.com/edo.font",
    price:"Free", mockupType:"branding", mockupTitle:"SHOGUN", mockupSubtitle:"Urban Street Edition 2026", fileSize:"0.4 MB",
    pairsWith:[{id:"barlow",role:"Body"},{id:"oswald",role:"Sub-headings"}]
  },
  {
    id:"badaboom-pro", name:"Boogaloo", provider:"dafont",
    designer:"Atipo Foundry", foundry:"Atipo", year:"2012", stylesCount:1,
    languages:["Latin"],
    description:"Boogaloo is an informal single-weight, Latin and Devanagari font inspired by 1960s era psychedelic poster and hand lettering styles.",
    availability:"Free for Personal", mood:"Playful", useCase:"Poster", style:"Display", language:"Latin",
    downloadUrl:"https://www.dafont.com/boogaloo.font",
    price:"Free", mockupType:"bold-label", mockupTitle:"BOOGIE", mockupSubtitle:"NIGHT FEVER / 70s EDITION", fileSize:"0.3 MB",
    pairsWith:[{id:"lato",role:"Body"},{id:"nunito",role:"UI"}]
  }
,
  {"id":"roboto","name":"Roboto","provider":"google","designer":"Designer 1","foundry":"Foundry 1","year":"2000","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Roboto is a versatile sans-serif font that perfectly captures a modern aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Modern","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Roboto","price":"Free","mockupType":"ui","mockupTitle":"Roboto Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"open-sans","name":"Open Sans","provider":"fontshare","designer":"Designer 2","foundry":"Foundry 2","year":"2001","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Open Sans is a versatile serif font that perfectly captures a classic aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Classic","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Open+Sans","price":"Free","mockupType":"ui","mockupTitle":"Open Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"lato","name":"Lato","provider":"dafont","designer":"Designer 3","foundry":"Foundry 3","year":"2002","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Lato is a versatile monospace font that perfectly captures a playful aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Playful","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Lato","price":"Free","mockupType":"ui","mockupTitle":"Lato Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"montserrat","name":"Montserrat","provider":"google","designer":"Designer 4","foundry":"Foundry 4","year":"2003","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Montserrat is a versatile display font that perfectly captures a elegant aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Elegant","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Montserrat","price":"Free","mockupType":"ui","mockupTitle":"Montserrat Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"oswald","name":"Oswald","provider":"fontshare","designer":"Designer 5","foundry":"Foundry 5","year":"2004","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Oswald is a versatile handwriting font that perfectly captures a minimal aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Minimal","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Oswald","price":"Free","mockupType":"ui","mockupTitle":"Oswald Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"source-sans-pro","name":"Source Sans Pro","provider":"dafont","designer":"Designer 6","foundry":"Foundry 6","year":"2005","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Source Sans Pro is a versatile script font that perfectly captures a bold aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Bold","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Source+Sans+Pro","price":"Free","mockupType":"ui","mockupTitle":"Source Sans Pro Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"slabo-27px","name":"Slabo 27px","provider":"google","designer":"Designer 7","foundry":"Foundry 7","year":"2006","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Slabo 27px is a versatile sans-serif font that perfectly captures a vintage aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Vintage","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Slabo+27px","price":"Free","mockupType":"ui","mockupTitle":"Slabo 27px Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"raleway","name":"Raleway","provider":"fontshare","designer":"Designer 8","foundry":"Foundry 8","year":"2007","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Raleway is a versatile serif font that perfectly captures a modern aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Modern","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Raleway","price":"Free","mockupType":"ui","mockupTitle":"Raleway Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"pt-sans","name":"PT Sans","provider":"dafont","designer":"Designer 9","foundry":"Foundry 9","year":"2008","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"PT Sans is a versatile monospace font that perfectly captures a classic aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Classic","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=PT+Sans","price":"Free","mockupType":"ui","mockupTitle":"PT Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"merriweather","name":"Merriweather","provider":"google","designer":"Designer 10","foundry":"Foundry 10","year":"2009","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Merriweather is a versatile display font that perfectly captures a playful aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Playful","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Merriweather","price":"Free","mockupType":"ui","mockupTitle":"Merriweather Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"noto-sans","name":"Noto Sans","provider":"fontshare","designer":"Designer 11","foundry":"Foundry 11","year":"2010","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Noto Sans is a versatile handwriting font that perfectly captures a elegant aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Elegant","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Noto+Sans","price":"Free","mockupType":"ui","mockupTitle":"Noto Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"nunito","name":"Nunito","provider":"dafont","designer":"Designer 12","foundry":"Foundry 12","year":"2011","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Nunito is a versatile script font that perfectly captures a minimal aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Minimal","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Nunito","price":"Free","mockupType":"ui","mockupTitle":"Nunito Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"concert-one","name":"Concert One","provider":"google","designer":"Designer 13","foundry":"Foundry 13","year":"2012","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Concert One is a versatile sans-serif font that perfectly captures a bold aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Bold","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Concert+One","price":"Free","mockupType":"ui","mockupTitle":"Concert One Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"promesh","name":"Promesh","provider":"fontshare","designer":"Designer 14","foundry":"Foundry 14","year":"2013","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Promesh is a versatile serif font that perfectly captures a vintage aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Vintage","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Promesh","price":"Free","mockupType":"ui","mockupTitle":"Promesh Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"bebas-neue","name":"Bebas Neue","provider":"dafont","designer":"Designer 15","foundry":"Foundry 15","year":"2014","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Bebas Neue is a versatile monospace font that perfectly captures a modern aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Modern","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Bebas+Neue","price":"Free","mockupType":"ui","mockupTitle":"Bebas Neue Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"ubuntu","name":"Ubuntu","provider":"google","designer":"Designer 16","foundry":"Foundry 16","year":"2015","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Ubuntu is a versatile display font that perfectly captures a classic aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Classic","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Ubuntu","price":"Free","mockupType":"ui","mockupTitle":"Ubuntu Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"playfair-display","name":"Playfair Display","provider":"fontshare","designer":"Designer 17","foundry":"Foundry 17","year":"2016","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Playfair Display is a versatile handwriting font that perfectly captures a playful aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Playful","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Playfair+Display","price":"Free","mockupType":"ui","mockupTitle":"Playfair Display Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"rubik","name":"Rubik","provider":"dafont","designer":"Designer 18","foundry":"Foundry 18","year":"2017","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Rubik is a versatile script font that perfectly captures a elegant aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Elegant","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Rubik","price":"Free","mockupType":"ui","mockupTitle":"Rubik Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"lora","name":"Lora","provider":"google","designer":"Designer 19","foundry":"Foundry 19","year":"2018","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Lora is a versatile sans-serif font that perfectly captures a minimal aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Minimal","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Lora","price":"Free","mockupType":"ui","mockupTitle":"Lora Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"work-sans","name":"Work Sans","provider":"fontshare","designer":"Designer 20","foundry":"Foundry 20","year":"2019","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Work Sans is a versatile serif font that perfectly captures a bold aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Bold","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Work+Sans","price":"Free","mockupType":"ui","mockupTitle":"Work Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"fira-sans","name":"Fira Sans","provider":"dafont","designer":"Designer 21","foundry":"Foundry 21","year":"2020","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Fira Sans is a versatile monospace font that perfectly captures a vintage aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Vintage","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Fira+Sans","price":"Free","mockupType":"ui","mockupTitle":"Fira Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"quicksand","name":"Quicksand","provider":"google","designer":"Designer 22","foundry":"Foundry 22","year":"2021","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Quicksand is a versatile display font that perfectly captures a modern aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Modern","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Quicksand","price":"Free","mockupType":"ui","mockupTitle":"Quicksand Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"barlow","name":"Barlow","provider":"fontshare","designer":"Designer 23","foundry":"Foundry 23","year":"2022","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Barlow is a versatile handwriting font that perfectly captures a classic aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Classic","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Barlow","price":"Free","mockupType":"ui","mockupTitle":"Barlow Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"inconsolata","name":"Inconsolata","provider":"dafont","designer":"Designer 24","foundry":"Foundry 24","year":"2023","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Inconsolata is a versatile script font that perfectly captures a playful aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Playful","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Inconsolata","price":"Free","mockupType":"ui","mockupTitle":"Inconsolata Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"mukta","name":"Mukta","provider":"google","designer":"Designer 25","foundry":"Foundry 25","year":"2000","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Mukta is a versatile sans-serif font that perfectly captures a elegant aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Elegant","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Mukta","price":"Free","mockupType":"ui","mockupTitle":"Mukta Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"josefin-sans","name":"Josefin Sans","provider":"fontshare","designer":"Designer 26","foundry":"Foundry 26","year":"2001","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Josefin Sans is a versatile serif font that perfectly captures a minimal aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Minimal","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Josefin+Sans","price":"Free","mockupType":"ui","mockupTitle":"Josefin Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"karla","name":"Karla","provider":"dafont","designer":"Designer 27","foundry":"Foundry 27","year":"2002","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Karla is a versatile monospace font that perfectly captures a bold aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Bold","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Karla","price":"Free","mockupType":"ui","mockupTitle":"Karla Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"anton","name":"Anton","provider":"google","designer":"Designer 28","foundry":"Foundry 28","year":"2003","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Anton is a versatile display font that perfectly captures a vintage aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Vintage","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Anton","price":"Free","mockupType":"ui","mockupTitle":"Anton Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"cabin","name":"Cabin","provider":"fontshare","designer":"Designer 29","foundry":"Foundry 29","year":"2004","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Cabin is a versatile handwriting font that perfectly captures a modern aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Modern","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Cabin","price":"Free","mockupType":"ui","mockupTitle":"Cabin Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"hind","name":"Hind","provider":"dafont","designer":"Designer 30","foundry":"Foundry 30","year":"2005","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Hind is a versatile script font that perfectly captures a classic aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Classic","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Hind","price":"Free","mockupType":"ui","mockupTitle":"Hind Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"fjalla-one","name":"Fjalla One","provider":"google","designer":"Designer 31","foundry":"Foundry 31","year":"2006","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Fjalla One is a versatile sans-serif font that perfectly captures a playful aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Playful","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Fjalla+One","price":"Free","mockupType":"ui","mockupTitle":"Fjalla One Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"oxygen","name":"Oxygen","provider":"fontshare","designer":"Designer 32","foundry":"Foundry 32","year":"2007","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Oxygen is a versatile serif font that perfectly captures a elegant aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Elegant","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Oxygen","price":"Free","mockupType":"ui","mockupTitle":"Oxygen Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"arimo","name":"Arimo","provider":"dafont","designer":"Designer 33","foundry":"Foundry 33","year":"2008","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Arimo is a versatile monospace font that perfectly captures a minimal aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Minimal","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Arimo","price":"Free","mockupType":"ui","mockupTitle":"Arimo Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"dosis","name":"Dosis","provider":"google","designer":"Designer 34","foundry":"Foundry 34","year":"2009","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Dosis is a versatile display font that perfectly captures a bold aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Bold","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Dosis","price":"Free","mockupType":"ui","mockupTitle":"Dosis Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"bitter","name":"Bitter","provider":"fontshare","designer":"Designer 35","foundry":"Foundry 35","year":"2010","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Bitter is a versatile handwriting font that perfectly captures a vintage aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Vintage","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Bitter","price":"Free","mockupType":"ui","mockupTitle":"Bitter Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"abel","name":"Abel","provider":"dafont","designer":"Designer 36","foundry":"Foundry 36","year":"2011","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Abel is a versatile script font that perfectly captures a modern aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Modern","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Abel","price":"Free","mockupType":"ui","mockupTitle":"Abel Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"varela-round","name":"Varela Round","provider":"google","designer":"Designer 37","foundry":"Foundry 37","year":"2012","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Varela Round is a versatile sans-serif font that perfectly captures a classic aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Classic","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Varela+Round","price":"Free","mockupType":"ui","mockupTitle":"Varela Round Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"signika","name":"Signika","provider":"fontshare","designer":"Designer 38","foundry":"Foundry 38","year":"2013","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Signika is a versatile serif font that perfectly captures a playful aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Playful","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Signika","price":"Free","mockupType":"ui","mockupTitle":"Signika Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"libre-baskerville","name":"Libre Baskerville","provider":"dafont","designer":"Designer 39","foundry":"Foundry 39","year":"2014","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Libre Baskerville is a versatile monospace font that perfectly captures a elegant aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Elegant","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Libre+Baskerville","price":"Free","mockupType":"ui","mockupTitle":"Libre Baskerville Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"pt-serif","name":"PT Serif","provider":"google","designer":"Designer 40","foundry":"Foundry 40","year":"2015","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"PT Serif is a versatile display font that perfectly captures a minimal aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Minimal","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/PT+Serif","price":"Free","mockupType":"ui","mockupTitle":"PT Serif Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"zilla-slab","name":"Zilla Slab","provider":"fontshare","designer":"Designer 41","foundry":"Foundry 41","year":"2016","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Zilla Slab is a versatile handwriting font that perfectly captures a bold aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Bold","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Zilla+Slab","price":"Free","mockupType":"ui","mockupTitle":"Zilla Slab Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"teko","name":"Teko","provider":"dafont","designer":"Designer 42","foundry":"Foundry 42","year":"2017","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Teko is a versatile script font that perfectly captures a vintage aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Vintage","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Teko","price":"Free","mockupType":"ui","mockupTitle":"Teko Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"exo-2","name":"Exo 2","provider":"google","designer":"Designer 43","foundry":"Foundry 43","year":"2018","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Exo 2 is a versatile sans-serif font that perfectly captures a modern aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Modern","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Exo+2","price":"Free","mockupType":"ui","mockupTitle":"Exo 2 Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"pacifico","name":"Pacifico","provider":"fontshare","designer":"Designer 44","foundry":"Foundry 44","year":"2019","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Pacifico is a versatile serif font that perfectly captures a classic aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Classic","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Pacifico","price":"Free","mockupType":"ui","mockupTitle":"Pacifico Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"dancing-script","name":"Dancing Script","provider":"dafont","designer":"Designer 45","foundry":"Foundry 45","year":"2020","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Dancing Script is a versatile monospace font that perfectly captures a playful aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Playful","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Dancing+Script","price":"Free","mockupType":"ui","mockupTitle":"Dancing Script Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"shadows-into-light","name":"Shadows Into Light","provider":"google","designer":"Designer 46","foundry":"Foundry 46","year":"2021","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Shadows Into Light is a versatile display font that perfectly captures a elegant aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Elegant","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Shadows+Into+Light","price":"Free","mockupType":"ui","mockupTitle":"Shadows Into Light Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"acme","name":"Acme","provider":"fontshare","designer":"Designer 47","foundry":"Foundry 47","year":"2022","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Acme is a versatile handwriting font that perfectly captures a minimal aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Minimal","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Acme","price":"Free","mockupType":"ui","mockupTitle":"Acme Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"bree-serif","name":"Bree Serif","provider":"dafont","designer":"Designer 48","foundry":"Foundry 48","year":"2023","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Bree Serif is a versatile script font that perfectly captures a bold aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Bold","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Bree+Serif","price":"Free","mockupType":"ui","mockupTitle":"Bree Serif Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"asap","name":"Asap","provider":"google","designer":"Designer 49","foundry":"Foundry 49","year":"2000","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Asap is a versatile sans-serif font that perfectly captures a vintage aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Vintage","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Asap","price":"Free","mockupType":"ui","mockupTitle":"Asap Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"crete-round","name":"Crete Round","provider":"fontshare","designer":"Designer 50","foundry":"Foundry 50","year":"2001","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Crete Round is a versatile serif font that perfectly captures a modern aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Modern","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Crete+Round","price":"Free","mockupType":"ui","mockupTitle":"Crete Round Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"questrial","name":"Questrial","provider":"dafont","designer":"Designer 51","foundry":"Foundry 51","year":"2002","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Questrial is a versatile monospace font that perfectly captures a classic aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Classic","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Questrial","price":"Free","mockupType":"ui","mockupTitle":"Questrial Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"righteous","name":"Righteous","provider":"google","designer":"Designer 52","foundry":"Foundry 52","year":"2003","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Righteous is a versatile display font that perfectly captures a playful aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Playful","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Righteous","price":"Free","mockupType":"ui","mockupTitle":"Righteous Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"alfa-slab-one","name":"Alfa Slab One","provider":"fontshare","designer":"Designer 53","foundry":"Foundry 53","year":"2004","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Alfa Slab One is a versatile handwriting font that perfectly captures a elegant aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Elegant","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Alfa+Slab+One","price":"Free","mockupType":"ui","mockupTitle":"Alfa Slab One Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"patua-one","name":"Patua One","provider":"dafont","designer":"Designer 54","foundry":"Foundry 54","year":"2005","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Patua One is a versatile script font that perfectly captures a minimal aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Minimal","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Patua+One","price":"Free","mockupType":"ui","mockupTitle":"Patua One Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"rokkitt","name":"Rokkitt","provider":"google","designer":"Designer 55","foundry":"Foundry 55","year":"2006","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Rokkitt is a versatile sans-serif font that perfectly captures a bold aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Bold","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Rokkitt","price":"Free","mockupType":"ui","mockupTitle":"Rokkitt Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"monda","name":"Monda","provider":"fontshare","designer":"Designer 56","foundry":"Foundry 56","year":"2007","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Monda is a versatile serif font that perfectly captures a vintage aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Vintage","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Monda","price":"Free","mockupType":"ui","mockupTitle":"Monda Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"francois-one","name":"Francois One","provider":"dafont","designer":"Designer 57","foundry":"Foundry 57","year":"2008","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Francois One is a versatile monospace font that perfectly captures a modern aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Modern","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Francois+One","price":"Free","mockupType":"ui","mockupTitle":"Francois One Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"archivo-black","name":"Archivo Black","provider":"google","designer":"Designer 58","foundry":"Foundry 58","year":"2009","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Archivo Black is a versatile display font that perfectly captures a classic aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Classic","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Archivo+Black","price":"Free","mockupType":"ui","mockupTitle":"Archivo Black Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"abril-fatface","name":"Abril Fatface","provider":"fontshare","designer":"Designer 59","foundry":"Foundry 59","year":"2010","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Abril Fatface is a versatile handwriting font that perfectly captures a playful aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Playful","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Abril+Fatface","price":"Free","mockupType":"ui","mockupTitle":"Abril Fatface Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"vollkorn","name":"Vollkorn","provider":"dafont","designer":"Designer 60","foundry":"Foundry 60","year":"2011","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Vollkorn is a versatile script font that perfectly captures a elegant aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Elegant","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Vollkorn","price":"Free","mockupType":"ui","mockupTitle":"Vollkorn Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"alegreya","name":"Alegreya","provider":"google","designer":"Designer 61","foundry":"Foundry 61","year":"2012","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Alegreya is a versatile sans-serif font that perfectly captures a minimal aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Minimal","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Alegreya","price":"Free","mockupType":"ui","mockupTitle":"Alegreya Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"eb-garamond","name":"EB Garamond","provider":"fontshare","designer":"Designer 62","foundry":"Foundry 62","year":"2013","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"EB Garamond is a versatile serif font that perfectly captures a bold aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Bold","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=EB+Garamond","price":"Free","mockupType":"ui","mockupTitle":"EB Garamond Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"cinzel","name":"Cinzel","provider":"dafont","designer":"Designer 63","foundry":"Foundry 63","year":"2014","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Cinzel is a versatile monospace font that perfectly captures a vintage aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Vintage","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Cinzel","price":"Free","mockupType":"ui","mockupTitle":"Cinzel Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"cardo","name":"Cardo","provider":"google","designer":"Designer 64","foundry":"Foundry 64","year":"2015","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Cardo is a versatile display font that perfectly captures a modern aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Modern","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Cardo","price":"Free","mockupType":"ui","mockupTitle":"Cardo Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"crimson-text","name":"Crimson Text","provider":"fontshare","designer":"Designer 65","foundry":"Foundry 65","year":"2016","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Crimson Text is a versatile handwriting font that perfectly captures a classic aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Classic","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Crimson+Text","price":"Free","mockupType":"ui","mockupTitle":"Crimson Text Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"domine","name":"Domine","provider":"dafont","designer":"Designer 66","foundry":"Foundry 66","year":"2017","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Domine is a versatile script font that perfectly captures a playful aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Playful","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Domine","price":"Free","mockupType":"ui","mockupTitle":"Domine Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"cormorant-garamond","name":"Cormorant Garamond","provider":"google","designer":"Designer 67","foundry":"Foundry 67","year":"2018","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Cormorant Garamond is a versatile sans-serif font that perfectly captures a elegant aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Elegant","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Cormorant+Garamond","price":"Free","mockupType":"ui","mockupTitle":"Cormorant Garamond Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"amatic-sc","name":"Amatic SC","provider":"fontshare","designer":"Designer 68","foundry":"Foundry 68","year":"2019","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Amatic SC is a versatile serif font that perfectly captures a minimal aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Minimal","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Amatic+SC","price":"Free","mockupType":"ui","mockupTitle":"Amatic SC Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"caveat","name":"Caveat","provider":"dafont","designer":"Designer 69","foundry":"Foundry 69","year":"2020","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Caveat is a versatile monospace font that perfectly captures a bold aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Bold","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Caveat","price":"Free","mockupType":"ui","mockupTitle":"Caveat Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"indie-flower","name":"Indie Flower","provider":"google","designer":"Designer 70","foundry":"Foundry 70","year":"2021","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Indie Flower is a versatile display font that perfectly captures a vintage aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Vintage","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Indie+Flower","price":"Free","mockupType":"ui","mockupTitle":"Indie Flower Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"permanent-marker","name":"Permanent Marker","provider":"fontshare","designer":"Designer 71","foundry":"Foundry 71","year":"2022","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Permanent Marker is a versatile handwriting font that perfectly captures a modern aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Modern","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Permanent+Marker","price":"Free","mockupType":"ui","mockupTitle":"Permanent Marker Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"satisfy","name":"Satisfy","provider":"dafont","designer":"Designer 72","foundry":"Foundry 72","year":"2023","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Satisfy is a versatile script font that perfectly captures a classic aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Classic","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Satisfy","price":"Free","mockupType":"ui","mockupTitle":"Satisfy Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"courgette","name":"Courgette","provider":"google","designer":"Designer 73","foundry":"Foundry 73","year":"2000","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Courgette is a versatile sans-serif font that perfectly captures a playful aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Playful","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Courgette","price":"Free","mockupType":"ui","mockupTitle":"Courgette Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"great-vibes","name":"Great Vibes","provider":"fontshare","designer":"Designer 74","foundry":"Foundry 74","year":"2001","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Great Vibes is a versatile serif font that perfectly captures a elegant aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Elegant","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Great+Vibes","price":"Free","mockupType":"ui","mockupTitle":"Great Vibes Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"sacramento","name":"Sacramento","provider":"dafont","designer":"Designer 75","foundry":"Foundry 75","year":"2002","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Sacramento is a versatile monospace font that perfectly captures a minimal aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Minimal","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Sacramento","price":"Free","mockupType":"ui","mockupTitle":"Sacramento Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"cookie","name":"Cookie","provider":"google","designer":"Designer 76","foundry":"Foundry 76","year":"2003","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Cookie is a versatile display font that perfectly captures a bold aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Bold","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Cookie","price":"Free","mockupType":"ui","mockupTitle":"Cookie Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"handlee","name":"Handlee","provider":"fontshare","designer":"Designer 77","foundry":"Foundry 77","year":"2004","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Handlee is a versatile handwriting font that perfectly captures a vintage aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Vintage","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Handlee","price":"Free","mockupType":"ui","mockupTitle":"Handlee Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"kalam","name":"Kalam","provider":"dafont","designer":"Designer 78","foundry":"Foundry 78","year":"2005","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Kalam is a versatile script font that perfectly captures a modern aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Modern","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Kalam","price":"Free","mockupType":"ui","mockupTitle":"Kalam Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"gloria-hallelujah","name":"Gloria Hallelujah","provider":"google","designer":"Designer 79","foundry":"Foundry 79","year":"2006","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Gloria Hallelujah is a versatile sans-serif font that perfectly captures a classic aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Classic","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Gloria+Hallelujah","price":"Free","mockupType":"ui","mockupTitle":"Gloria Hallelujah Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"architects-daughter","name":"Architects Daughter","provider":"fontshare","designer":"Designer 80","foundry":"Foundry 80","year":"2007","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Architects Daughter is a versatile serif font that perfectly captures a playful aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Playful","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Architects+Daughter","price":"Free","mockupType":"ui","mockupTitle":"Architects Daughter Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"rock-salt","name":"Rock Salt","provider":"dafont","designer":"Designer 81","foundry":"Foundry 81","year":"2008","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Rock Salt is a versatile monospace font that perfectly captures a elegant aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Elegant","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Rock+Salt","price":"Free","mockupType":"ui","mockupTitle":"Rock Salt Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"patrick-hand","name":"Patrick Hand","provider":"google","designer":"Designer 82","foundry":"Foundry 82","year":"2009","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Patrick Hand is a versatile display font that perfectly captures a minimal aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Minimal","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Patrick+Hand","price":"Free","mockupType":"ui","mockupTitle":"Patrick Hand Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"neucha","name":"Neucha","provider":"fontshare","designer":"Designer 83","foundry":"Foundry 83","year":"2010","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Neucha is a versatile handwriting font that perfectly captures a bold aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Bold","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Neucha","price":"Free","mockupType":"ui","mockupTitle":"Neucha Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"covered-by-your-grace","name":"Covered By Your Grace","provider":"dafont","designer":"Designer 84","foundry":"Foundry 84","year":"2011","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Covered By Your Grace is a versatile script font that perfectly captures a vintage aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Vintage","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Covered+By+Your+Grace","price":"Free","mockupType":"ui","mockupTitle":"Covered By Your Grace Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"kaushan-script","name":"Kaushan Script","provider":"google","designer":"Designer 85","foundry":"Foundry 85","year":"2012","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Kaushan Script is a versatile sans-serif font that perfectly captures a modern aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Modern","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Kaushan+Script","price":"Free","mockupType":"ui","mockupTitle":"Kaushan Script Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"yellowtail","name":"Yellowtail","provider":"fontshare","designer":"Designer 86","foundry":"Foundry 86","year":"2013","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Yellowtail is a versatile serif font that perfectly captures a classic aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Classic","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Yellowtail","price":"Free","mockupType":"ui","mockupTitle":"Yellowtail Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"berkshire-swash","name":"Berkshire Swash","provider":"dafont","designer":"Designer 87","foundry":"Foundry 87","year":"2014","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Berkshire Swash is a versatile monospace font that perfectly captures a playful aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Playful","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Berkshire+Swash","price":"Free","mockupType":"ui","mockupTitle":"Berkshire Swash Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"leckerli-one","name":"Leckerli One","provider":"google","designer":"Designer 88","foundry":"Foundry 88","year":"2015","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Leckerli One is a versatile display font that perfectly captures a elegant aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Elegant","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Leckerli+One","price":"Free","mockupType":"ui","mockupTitle":"Leckerli One Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"alegreya-sans","name":"Alegreya Sans","provider":"fontshare","designer":"Designer 89","foundry":"Foundry 89","year":"2016","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Alegreya Sans is a versatile handwriting font that perfectly captures a minimal aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Minimal","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Alegreya+Sans","price":"Free","mockupType":"ui","mockupTitle":"Alegreya Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"muli","name":"Muli","provider":"dafont","designer":"Designer 90","foundry":"Foundry 90","year":"2017","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Muli is a versatile script font that perfectly captures a bold aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Bold","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Muli","price":"Free","mockupType":"ui","mockupTitle":"Muli Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"nunito-sans","name":"Nunito Sans","provider":"google","designer":"Designer 91","foundry":"Foundry 91","year":"2018","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Nunito Sans is a versatile sans-serif font that perfectly captures a vintage aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Vintage","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Nunito+Sans","price":"Free","mockupType":"ui","mockupTitle":"Nunito Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"titillium-web","name":"Titillium Web","provider":"fontshare","designer":"Designer 92","foundry":"Foundry 92","year":"2019","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Titillium Web is a versatile serif font that perfectly captures a modern aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Modern","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Titillium+Web","price":"Free","mockupType":"ui","mockupTitle":"Titillium Web Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"catamaran","name":"Catamaran","provider":"dafont","designer":"Designer 93","foundry":"Foundry 93","year":"2020","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Catamaran is a versatile monospace font that perfectly captures a classic aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Classic","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Catamaran","price":"Free","mockupType":"ui","mockupTitle":"Catamaran Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"heebo","name":"Heebo","provider":"google","designer":"Designer 94","foundry":"Foundry 94","year":"2021","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Heebo is a versatile display font that perfectly captures a playful aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Playful","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Heebo","price":"Free","mockupType":"ui","mockupTitle":"Heebo Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"kanit","name":"Kanit","provider":"fontshare","designer":"Designer 95","foundry":"Foundry 95","year":"2022","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Kanit is a versatile handwriting font that perfectly captures a elegant aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Elegant","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Kanit","price":"Free","mockupType":"ui","mockupTitle":"Kanit Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"rajdhani","name":"Rajdhani","provider":"dafont","designer":"Designer 96","foundry":"Foundry 96","year":"2023","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Rajdhani is a versatile script font that perfectly captures a minimal aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Minimal","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Rajdhani","price":"Free","mockupType":"ui","mockupTitle":"Rajdhani Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"yanone-kaffeesatz","name":"Yanone Kaffeesatz","provider":"google","designer":"Designer 97","foundry":"Foundry 97","year":"2000","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"Yanone Kaffeesatz is a versatile sans-serif font that perfectly captures a bold aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Bold","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Yanone+Kaffeesatz","price":"Free","mockupType":"ui","mockupTitle":"Yanone Kaffeesatz Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"ropa-sans","name":"Ropa Sans","provider":"fontshare","designer":"Designer 98","foundry":"Foundry 98","year":"2001","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Ropa Sans is a versatile serif font that perfectly captures a vintage aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Vintage","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Ropa+Sans","price":"Free","mockupType":"ui","mockupTitle":"Ropa Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"pathway-gothic-one","name":"Pathway Gothic One","provider":"dafont","designer":"Designer 99","foundry":"Foundry 99","year":"2002","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Pathway Gothic One is a versatile monospace font that perfectly captures a modern aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Modern","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Pathway+Gothic+One","price":"Free","mockupType":"ui","mockupTitle":"Pathway Gothic One Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"oleo-script","name":"Oleo Script","provider":"google","designer":"Designer 100","foundry":"Foundry 100","year":"2003","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Oleo Script is a versatile display font that perfectly captures a classic aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Classic","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Oleo+Script","price":"Free","mockupType":"ui","mockupTitle":"Oleo Script Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]}
];

// ─────────────────────────────────────────────────
//  TRENDING font IDs (shown in the top strip)
// ─────────────────────────────────────────────────
const trendingFontIds = [
  "instrument-serif","satoshi","clash-display",
  "switzer","boska","bebas-neue","tanker","zodiak"
];

// ─────────────────────────────────────────────────
//  FONT LOADER — Google / Fontshare / Dafont fallback
// ─────────────────────────────────────────────────
function loadExternalFont(font) {
  const linkId = `font-face-${font.id}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';

  if (font.provider === "google") {
    const n = font.name.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${n}:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap`;
  } else if (font.provider === "fontshare") {
    const slug = font.name.toLowerCase().replace(/\s+/g, '-');
    link.href = `https://api.fontshare.com/v2/css?f=${slug}@300,400,500,700&display=swap`;
  } else if (font.provider === "dafont") {
    // Dafont fonts aren't on a public CDN — use curated Google Font fallbacks for preview
    const fallbackMap = {
      "lemon-milk":     "Montserrat",
      "coolvetica":     "Rubik",
      "shoreline-script":"Great Vibes",
      "old-london":     "UnifrakturMaguntia",
      "freshman":       "Barlow Condensed",
      "capture-it":     "Special Elite",
      "milkshake":      "Pacifico",
      "edo-sz":         "Black Han Sans",
      "badaboom-pro":   "Boogaloo"
    };
    const fallback = fallbackMap[font.id] || "Playfair Display";
    const n = fallback.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${n}&display=swap`;
    font.cssFamily = `'${fallback}', cursive`;
  }

  document.head.appendChild(link);
}

// Pre-load all fonts
fontsData.forEach(f => loadExternalFont(f));

// ─────────────────────────────────────────────────
//  FILTER CONFIG & STATE
// ─────────────────────────────────────────────────
const filterGroups = {
  "Provider":     ["All Providers","Google Fonts","Fontshare","Dafont"],
  "Availability": ["All","Free","Free for Personal","Premium"],
  "Style":        ["Serif","Sans-Serif","Display","Monospace","Script"],
  "Mood":         ["Elegant","Minimal","Vintage","Bold","Playful","Formal","Modern"],
  "Use Case":     ["Editorial","UI","Poster","Web","Packaging","Branding"]
};

let activeFilters = {
  "Provider":     "All Providers",
  "Availability": "All",
  "Style":        null,
  "Mood":         null,
  "Use Case":     null
};

let searchQuery = "";
let selectedFont = null;

// ─────────────────────────────────────────────────
//  COMPARE STATE (max 3 fonts)
// ─────────────────────────────────────────────────
let compareSet = new Set();

// ─────────────────────────────────────────────────
//  DARK MODE
// ─────────────────────────────────────────────────
function applyTheme(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  const icon = document.getElementById("dark-icon");
  if (!icon) return;
  icon.innerHTML = dark
    ? `<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
    : `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const next = !isDark;
  localStorage.setItem("fontvault-dark", next ? "1" : "0");
  applyTheme(next);
}

// ─────────────────────────────────────────────────
//  SCROLL PROGRESS BAR
// ─────────────────────────────────────────────────
function updateScrollProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  const doc = document.documentElement;
  const scrolled = doc.scrollTop || document.body.scrollTop;
  const total = doc.scrollHeight - doc.clientHeight;
  bar.style.width = total > 0 ? (scrolled / total * 100) + "%" : "0%";
}

// ─────────────────────────────────────────────────
//  DOM ELEMENTS
// ─────────────────────────────────────────────────
const el = {
  fontGrid:        document.getElementById("font-grid"),
  filterContainer: document.getElementById("filter-groups-container"),
  clearFiltersBtn: document.getElementById("clear-filters-btn"),
  searchInput:     document.getElementById("search-input"),
  browseBtn:       document.getElementById("btn-browse-fonts"),
  freeDownloadsBtn:document.getElementById("btn-free-downloads"),
  scrollArrow:     document.getElementById("scroll-arrow"),
  trendingStrip:   document.getElementById("trending-strip"),
  darkToggle:      document.getElementById("dark-toggle"),
  progressBar:     document.getElementById("progress-bar"),
  // Detail panel
  detailOverlay:   document.getElementById("detail-overlay"),
  detailPanel:     document.getElementById("detail-panel"),
  closePanelBtn:   document.getElementById("close-panel-btn"),
  detailTitle:     document.getElementById("detail-title"),
  specimenDisplay: document.getElementById("specimen-display"),
  specimenInput:   document.getElementById("specimen-input"),
  sizeSlider:      document.getElementById("size-slider"),
  sizeDisplay:     document.getElementById("size-display"),
  tabBtns:         document.querySelectorAll(".tab-btn"),
  tabContents:     document.querySelectorAll(".tab-content"),
  infoDesigner:    document.getElementById("info-designer"),
  infoFoundry:     document.getElementById("info-foundry"),
  infoYear:        document.getElementById("info-year"),
  infoStyles:      document.getElementById("info-styles"),
  infoLanguages:   document.getElementById("info-languages"),
  infoDescription: document.getElementById("info-description"),
  stylesVariantList:document.getElementById("styles-variant-list"),
  licenseBadgePill:document.getElementById("license-badge-pill"),
  licenseDescription:document.getElementById("license-description"),
  designerProfileName:document.getElementById("designer-profile-name"),
  designerBio:     document.getElementById("designer-bio"),
  ctaPriceDisplay: document.getElementById("cta-price-display"),
  detailPrimaryCta:document.getElementById("detail-primary-cta"),
  downloadTooltip: document.getElementById("download-tooltip"),
  pairingSection:  document.getElementById("pairing-section"),
  // Compare
  compareTray:     document.getElementById("compare-tray"),
  compareTrayFonts:document.getElementById("compare-tray-fonts"),
  compareNowBtn:   document.getElementById("compare-now-btn"),
  compareClearBtn: document.getElementById("compare-tray-clear"),
  compareOverlay:  document.getElementById("compare-overlay"),
  compareOverlayBody:document.getElementById("compare-overlay-body"),
  compareCloseBtn: document.getElementById("compare-close-btn"),
  compareSharedInput:document.getElementById("compare-shared-input")
};

// ─────────────────────────────────────────────────
//  FILTERS
// ─────────────────────────────────────────────────
function setupFilters() {
  el.filterContainer.innerHTML = "";
  Object.entries(filterGroups).forEach(([group, options], idx) => {
    const groupEl = document.createElement("div");
    groupEl.className = "filter-group";
    const titleEl = document.createElement("span");
    titleEl.className = "filter-group-title";
    titleEl.textContent = group;
    groupEl.appendChild(titleEl);
    const pillWrap = document.createElement("div");
    pillWrap.className = "pill-container";
    options.forEach(opt => {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = opt;
      const isActive = activeFilters[group] === opt;
      if (isActive) pill.classList.add("active");
      pill.addEventListener("click", () => handleFilterClick(group, opt));
      pillWrap.appendChild(pill);
    });
    groupEl.appendChild(pillWrap);
    el.filterContainer.appendChild(groupEl);
    if (idx < Object.keys(filterGroups).length - 1) {
      const div = document.createElement("div");
      div.className = "divider";
      el.filterContainer.appendChild(div);
    }
  });
}

function handleFilterClick(group, value) {
  if (group === "Provider") {
    activeFilters[group] = value;
  } else if (group === "Availability") {
    activeFilters[group] = value;
  } else {
    activeFilters[group] = activeFilters[group] === value ? null : value;
  }
  updateClearButtonVisibility();
  setupFilters();
  renderGrid();
}

function updateClearButtonVisibility() {
  const hasActive = activeFilters["Provider"] !== "All Providers" ||
    activeFilters["Availability"] !== "All" ||
    Object.entries(activeFilters).some(([g,v]) =>
      g !== "Provider" && g !== "Availability" && v !== null
    );
  el.clearFiltersBtn.style.display = hasActive ? "block" : "none";
}

function clearAllFilters() {
  activeFilters = { "Provider":"All Providers","Availability":"All","Style":null,"Mood":null,"Use Case":null };
  searchQuery = "";
  el.searchInput.value = "";
  updateClearButtonVisibility();
  setupFilters();
  renderGrid();
}

// ─────────────────────────────────────────────────
//  MOCKUP HTML
// ─────────────────────────────────────────────────
function getBadgeClass(a) {
  return ({Free:"badge-free","Free for Personal":"badge-personal",Trial:"badge-trial",Premium:"badge-premium",Paid:"badge-paid"})[a] || "badge-free";
}

function getMockupHTML(font) {
  loadExternalFont(font);
  const fam = font.cssFamily || `'${font.name}'`;
  const badge = `<span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>`;

  const mockups = {
    magazine: (f,fam,badge) => `
      <div class="card-mockup" style="background:#F0EDE6;color:#0A0A0A;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div style="font-family:${fam},serif;font-size:2.2rem;font-style:italic;line-height:1;text-align:center;">${f.mockupTitle}</div>
        <div style="font-family:var(--font-mono);font-size:0.65rem;text-transform:uppercase;margin-top:0.8rem;letter-spacing:0.1em;color:#777;">${f.mockupSubtitle}</div>
      </div>`,
    ui: (f,fam,badge) => `
      <div class="card-mockup" style="background:#FAFAFA;color:#0A0A0A;display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div style="font-family:var(--font-mono);font-size:0.65rem;color:#888;">${f.mockupTitle}</div>
        <div style="font-family:${fam},sans-serif;font-size:1.2rem;font-weight:600;line-height:1.3;margin:1rem 0;">Unlock variable spacing values seamlessly.</div>
        <div style="display:flex;gap:0.5rem;">
          <div style="width:28px;height:12px;background:#000;border-radius:6px;"></div>
          <div style="width:12px;height:12px;background:#E0E0E0;border-radius:6px;"></div>
        </div>
      </div>`,
    code: (f,fam,badge) => `
      <div class="card-mockup" style="background:#111;color:#A9B1D6;display:flex;flex-direction:column;justify-content:center;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div style="font-family:${fam},monospace;font-size:0.85rem;line-height:1.5;color:#E0E0E0;">
          <span style="color:#FF3B00">const</span> config = {<br>
          &nbsp;&nbsp;theme: <span style="color:#A9B1D6">'mono-dark'</span>,<br>
          &nbsp;&nbsp;opacity: <span style="color:#00C853">0.95</span><br>
          }
        </div>
      </div>`,
    branding: (f,fam,badge) => `
      <div class="card-mockup" style="background:#0A0A0A;color:#FFF;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div style="font-family:${fam},sans-serif;font-size:2.5rem;font-weight:700;line-height:0.95;letter-spacing:-0.04em;text-align:center;">${f.mockupTitle}</div>
        <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--signal-red);margin-top:0.8rem;letter-spacing:0.2em;text-transform:uppercase;">${f.mockupSubtitle}</div>
      </div>`,
    poster: (f,fam,badge) => `
      <div class="card-mockup" style="background:#F5F5F5;color:#0A0A0A;display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div style="font-family:${fam},sans-serif;font-size:2.5rem;font-weight:800;line-height:0.85;letter-spacing:-0.02em;">${f.mockupTitle}</div>
        <div style="font-size:0.7rem;color:#555;text-transform:uppercase;font-weight:500;">${f.mockupSubtitle}</div>
      </div>`,
    invitation: (f,fam,badge) => `
      <div class="card-mockup" style="background:#FCF9F2;color:#2E2B2A;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:1.5rem;border:6px double #E6DFD3;margin:4px;border-radius:4px;">
        ${badge}
        <div style="font-family:${fam},serif;font-size:1.4rem;font-style:italic;text-align:center;margin-bottom:0.4rem;">${f.mockupTitle}</div>
        <div style="font-family:var(--font-body);font-size:0.55rem;text-align:center;color:#7c7774;letter-spacing:0.05em;text-transform:uppercase;">${f.mockupSubtitle}</div>
      </div>`,
    "bold-label": (f,fam,badge) => `
      <div class="card-mockup" style="background:#FF3B00;color:#FFF;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div style="font-family:${fam},sans-serif;font-size:3.2rem;line-height:0.9;font-weight:900;text-align:center;letter-spacing:-0.02em;">${f.mockupTitle}</div>
        <div style="font-family:var(--font-mono);font-size:0.6rem;color:#FFF;margin-top:0.6rem;letter-spacing:0.1em;">${f.mockupSubtitle}</div>
      </div>`,
    luxury: (f,fam,badge) => `
      <div class="card-mockup" style="background:#0E0E0E;color:#D4AF37;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div style="font-family:${fam},serif;font-size:1.8rem;font-weight:300;letter-spacing:0.3em;margin-bottom:0.5rem;text-align:center;">${f.mockupTitle}</div>
        <div style="font-family:var(--font-mono);font-size:0.55rem;color:#FFF;letter-spacing:0.15em;">${f.mockupSubtitle}</div>
      </div>`,
    book: (f,fam,badge) => `
      <div class="card-mockup" style="background:#FFF;color:#0A0A0A;display:flex;flex-direction:column;justify-content:space-between;padding:1.8rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div style="font-family:${fam},serif;font-size:1.5rem;line-height:1.1;margin-bottom:1rem;max-width:80%;">${f.mockupTitle}</div>
        <div style="font-family:var(--font-body);font-size:0.6rem;color:#888;">${f.mockupSubtitle}</div>
      </div>`
  };

  const fn = mockups[font.mockupType];
  if (fn) return fn(font, fam, badge);
  return `<div class="card-mockup" style="background:#FFF;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #E0E0E0;">${badge}<div style="font-family:${fam};font-size:2rem;">${font.name}</div></div>`;
}

// ─────────────────────────────────────────────────
//  FILTERING
// ─────────────────────────────────────────────────
function getFilteredFonts() {
  return fontsData.filter(font => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = [font.name, font.designer, font.foundry, font.style, font.provider, font.mood, font.useCase]
        .some(v => v && v.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (activeFilters["Provider"] !== "All Providers") {
      const provMap = {"Google Fonts":"google","Fontshare":"fontshare","Dafont":"dafont"};
      if (font.provider !== provMap[activeFilters["Provider"]]) return false;
    }
    if (activeFilters["Availability"] !== "All" && font.availability !== activeFilters["Availability"]) return false;
    if (activeFilters["Style"] && font.style !== activeFilters["Style"]) return false;
    if (activeFilters["Mood"] && font.mood !== activeFilters["Mood"]) return false;
    if (activeFilters["Use Case"] && font.useCase !== activeFilters["Use Case"]) return false;
    return true;
  });
}

// ─────────────────────────────────────────────────
//  FONT CARD
// ─────────────────────────────────────────────────
function appendFontCard(font, delay) {
  const isFree = font.availability === "Free" || font.availability === "Free for Personal";
  const statusDotClass = isFree ? "green" : "grey";
  const statusText = isFree ? "Free Download" : `${font.price} / Buy License`;
  const btnLabel = isFree ? "⬇ Try Free" : "Buy →";
  const providerLabel = { google:"GOOGLE FONTS", fontshare:"FONTSHARE", dafont:"DAFONT" }[font.provider] || font.provider.toUpperCase();
  const isInCompare = compareSet.has(font.id);

  const card = document.createElement("div");
  card.className = "font-card";
  card.setAttribute("aria-label", `${font.name}, ${font.style}, ${font.availability}`);
  card.style.animationDelay = `${delay * 0.04}s`;

  loadExternalFont(font);
  const fam = font.cssFamily || `'${font.name}'`;

  card.innerHTML = `
    ${getMockupHTML(font)}
    <button class="compare-add-btn ${isInCompare ? 'in-compare' : ''}" title="${isInCompare ? 'Remove from compare' : 'Add to compare'}" data-id="${font.id}">
      ${isInCompare ? '✕' : '+'}
    </button>
    <div class="card-info">
      <h3 class="card-font-name" style="font-family:${fam},var(--font-display);">${font.name}</h3>
      <p class="card-tags">
        <span style="text-transform:uppercase;font-weight:700;color:var(--near-black);background:#E0E0E0;padding:2px 6px;border-radius:3px;margin-right:6px;font-size:0.6rem;font-family:var(--font-mono);">${providerLabel}</span>
        ${font.style} · ${font.mood} · ${font.useCase}
      </p>
      <div class="card-footer">
        <span class="card-status">
          <span class="status-dot ${statusDotClass}"></span>
          ${statusText}
        </span>
        <button class="card-btn" data-id="${font.id}">${btnLabel}</button>
      </div>
    </div>
    <input class="card-live-input" type="text" placeholder="Type to preview in ${font.name}..." data-id="${font.id}">
  `;

  // Card click → open detail
  card.addEventListener("click", e => {
    if (e.target.closest(".card-btn") || e.target.closest(".compare-add-btn") || e.target.closest(".card-live-input")) return;
    openDetailPanel(font);
  });

  // Try Free / Buy button
  card.querySelector(".card-btn").addEventListener("click", () => openDetailPanel(font));

  // Compare add/remove button
  card.querySelector(".compare-add-btn").addEventListener("click", e => {
    e.stopPropagation();
    toggleCompare(font.id);
  });

  // Live preview input
  const liveInput = card.querySelector(".card-live-input");
  const mockupEl = card.querySelector(".card-mockup");
  let mockupTextEl = null;

  liveInput.addEventListener("focus", () => {
    // Find the largest text element in the mockup for live preview
    if (!mockupTextEl) {
      const divs = Array.from(mockupEl.querySelectorAll("div"));
      mockupTextEl = divs.reduce((best, d) =>
        (parseInt(getComputedStyle(d).fontSize) > (best ? parseInt(getComputedStyle(best).fontSize) : 0)) ? d : best
      , null);
    }
  });

  liveInput.addEventListener("input", e => {
    if (mockupTextEl && e.target.value.trim()) {
      mockupTextEl.textContent = e.target.value;
    }
  });

  liveInput.addEventListener("click", e => e.stopPropagation());

  el.fontGrid.appendChild(card);
}

// ─────────────────────────────────────────────────
//  GRID RENDER
// ─────────────────────────────────────────────────
function renderGrid() {
  el.fontGrid.innerHTML = "";
  const filtered = getFilteredFonts();

  // Show/update search result count
  let countEl = document.getElementById("search-result-count");
  if (!countEl) {
    countEl = document.createElement("p");
    countEl.id = "search-result-count";
    countEl.className = "search-result-count";
    el.fontGrid.parentElement.insertBefore(countEl, el.fontGrid);
  }
  if (searchQuery || Object.values(activeFilters).some(v => v && v !== "All Providers" && v !== "All")) {
    countEl.textContent = `Showing ${filtered.length} of ${fontsData.length} fonts`;
    countEl.classList.add("visible");
  } else {
    countEl.classList.remove("visible");
  }

  if (filtered.length === 0) {
    el.fontGrid.innerHTML = `
      <div style="grid-column:span 3;text-align:center;padding:4rem 1rem;color:#777;width:100%;">
        <p style="font-size:var(--ts-lg);font-family:var(--font-display);">No fonts matched your search.</p>
        <span style="font-size:var(--ts-sm);cursor:pointer;text-decoration:underline;margin-top:1rem;display:inline-block;" onclick="clearAllFilters()">Clear all filters</span>
      </div>`;
    return;
  }

  filtered.forEach((font, i) => appendFontCard(font, i));
}

// ─────────────────────────────────────────────────
//  TRENDING STRIP
// ─────────────────────────────────────────────────
function renderTrending() {
  const strip = el.trendingStrip;
  if (!strip) return;
  strip.innerHTML = "";

  const trending = trendingFontIds
    .map(id => fontsData.find(f => f.id === id))
    .filter(Boolean);

  trending.forEach((font, i) => {
    loadExternalFont(font);
    const fam = font.cssFamily || `'${font.name}'`;
    const providerLabel = { google:"GOOGLE FONTS", fontshare:"FONTSHARE", dafont:"DAFONT" }[font.provider] || font.provider.toUpperCase();

    const card = document.createElement("div");
    card.className = "trending-card";
    card.innerHTML = `
      <div class="trending-rank">#${String(i+1).padStart(2,'0')}</div>
      <div class="trending-name" style="font-family:${fam},serif;">${font.name}</div>
      <div class="trending-meta">
        <span class="trending-style-tag">${font.style}</span>
        <span class="trending-provider-tag">${providerLabel}</span>
      </div>
    `;
    card.addEventListener("click", () => openDetailPanel(font));
    strip.appendChild(card);
  });

  // Drag-to-scroll
  let isDown = false, startX, scrollLeft;
  strip.addEventListener("mousedown", e => { isDown = true; strip.classList.add("grabbing"); startX = e.pageX - strip.offsetLeft; scrollLeft = strip.scrollLeft; });
  strip.addEventListener("mouseleave", () => { isDown = false; strip.classList.remove("grabbing"); });
  strip.addEventListener("mouseup", () => { isDown = false; strip.classList.remove("grabbing"); });
  strip.addEventListener("mousemove", e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - strip.offsetLeft; strip.scrollLeft = scrollLeft - (x - startX) * 1.5; });
}

// ─────────────────────────────────────────────────
//  AUTH MODAL
// ─────────────────────────────────────────────────
function openAuthModal() {
  const overlay = document.getElementById("auth-overlay");
  if (overlay) {
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
    // Focus email field after animation
    setTimeout(() => {
      const emailField = document.getElementById("auth-email");
      if (emailField) emailField.focus();
    }, 350);
  }
}

function closeAuthModal() {
  const overlay = document.getElementById("auth-overlay");
  if (overlay) {
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }
}

function setupAuthModal() {
  // Close button
  const closeBtn = document.getElementById("auth-close");
  if (closeBtn) closeBtn.addEventListener("click", closeAuthModal);

  // Click overlay backdrop to close
  const overlay = document.getElementById("auth-overlay");
  if (overlay) {
    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeAuthModal();
    });
  }

  // Tab switching (Sign In / Create Account)
  const tabs = document.querySelectorAll(".auth-tab");
  const subtitle = document.getElementById("auth-subtitle");
  const submitBtn = document.getElementById("auth-submit-btn");
  const forgotLink = document.getElementById("auth-forgot");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const mode = tab.dataset.mode;
      if (mode === "signup") {
        if (subtitle) subtitle.textContent = "Create a free account to submit and save fonts.";
        if (submitBtn) submitBtn.textContent = "Create Account";
        if (forgotLink) forgotLink.style.display = "none";
      } else {
        if (subtitle) subtitle.textContent = "Sign in to submit and save fonts.";
        if (submitBtn) submitBtn.textContent = "Sign In";
        if (forgotLink) forgotLink.style.display = "";
      }
    });
  });

  // Google Sign-in button
  const googleBtn = document.getElementById("btn-google-signin");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      googleBtn.textContent = "Redirecting to Google...";
      googleBtn.disabled = true;
      setTimeout(() => {
        closeAuthModal();
        googleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/><path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/></svg> Continue with Google`;
        googleBtn.disabled = false;
        alert("Google Sign-in is not connected to a backend in this demo. This is a UI prototype.");
      }, 1200);
    });
  }

  // Form submit
  const form = document.getElementById("auth-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("auth-email")?.value.trim();
      const password = document.getElementById("auth-password")?.value;
      const activeTab = document.querySelector(".auth-tab.active")?.dataset.mode;

      if (!email || !password) { alert("Please fill in both email and password."); return; }
      if (password.length < 6) { alert("Password must be at least 6 characters."); return; }

      // Simulate loading state
      if (submitBtn) { submitBtn.textContent = "Please wait..."; submitBtn.disabled = true; }
      setTimeout(() => {
        closeAuthModal();
        if (submitBtn) { submitBtn.textContent = activeTab === "signup" ? "Create Account" : "Sign In"; submitBtn.disabled = false; }
        alert(`Welcome to FontVault! (This is a UI demo — no real backend is connected.)`);
      }, 1000);
    });
  }

  // Forgot password link
  if (forgotLink) {
    forgotLink.addEventListener("click", e => {
      e.preventDefault();
      alert("Password reset email would be sent in the live version.");
    });
  }
}

function toggleCompare(fontId) {
  if (compareSet.has(fontId)) {
    compareSet.delete(fontId);
  } else {
    if (compareSet.size >= 3) {
      const firstId = [...compareSet][0];
      compareSet.delete(firstId);
    }
    compareSet.add(fontId);
  }
  updateCompareTray();
  // Refresh compare buttons on all visible cards
  document.querySelectorAll(".compare-add-btn").forEach(btn => {
    const id = btn.dataset.id;
    const inSet = compareSet.has(id);
    btn.classList.toggle("in-compare", inSet);
    btn.textContent = inSet ? "✕" : "+";
    btn.title = inSet ? "Remove from compare" : "Add to compare";
  });
}

function updateCompareTray() {
  const tray = el.compareTray;
  const fontsEl = el.compareTrayFonts;
  if (!tray || !fontsEl) return;

  if (compareSet.size === 0) {
    tray.classList.remove("visible");
    return;
  }

  tray.classList.add("visible");
  fontsEl.innerHTML = "";
  [...compareSet].forEach(id => {
    const font = fontsData.find(f => f.id === id);
    if (!font) return;
    const chip = document.createElement("div");
    chip.className = "compare-chip";
    chip.innerHTML = `<span>${font.name}</span><span class="compare-chip-remove" data-id="${id}">✕</span>`;
    chip.querySelector(".compare-chip-remove").addEventListener("click", e => {
      e.stopPropagation();
      toggleCompare(id);
    });
    fontsEl.appendChild(chip);
  });
}

function openComparison() {
  if (compareSet.size < 2) {
    alert("Select at least 2 fonts to compare. Use the + button on any card.");
    return;
  }
  renderCompareOverlay();
  el.compareOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeComparison() {
  el.compareOverlay.classList.remove("visible");
  document.body.style.overflow = "";
}

function renderCompareOverlay() {
  const body = el.compareOverlayBody;
  body.innerHTML = "";
  const sharedText = el.compareSharedInput ? el.compareSharedInput.value || "The quick brown fox" : "The quick brown fox";

  [...compareSet].forEach(id => {
    const font = fontsData.find(f => f.id === id);
    if (!font) return;
    loadExternalFont(font);
    const fam = font.cssFamily || `'${font.name}'`;
    const providerLabel = { google:"GOOGLE FONTS", fontshare:"FONTSHARE", dafont:"DAFONT" }[font.provider] || font.provider.toUpperCase();

    const col = document.createElement("div");
    col.className = "compare-col";
    col.innerHTML = `
      <div class="compare-col-source">${providerLabel}</div>
      <div class="compare-col-name">${font.name}</div>
      <div class="compare-col-style">${font.style} · ${font.mood} · ${font.useCase}</div>
      <div class="compare-specimen" style="font-family:${fam},serif;" data-col-specimen>${sharedText}</div>
      <hr class="compare-col-divider">
      <div class="compare-col-meta">
        <div class="compare-meta-item"><label>Designer</label><span>${font.designer}</span></div>
        <div class="compare-meta-item"><label>Foundry</label><span>${font.foundry}</span></div>
        <div class="compare-meta-item"><label>Year</label><span>${font.year}</span></div>
        <div class="compare-meta-item"><label>Styles</label><span>${font.stylesCount}</span></div>
        <div class="compare-meta-item"><label>Availability</label><span>${font.availability}</span></div>
        <div class="compare-meta-item"><label>File Size</label><span>${font.fileSize}</span></div>
      </div>
      <div class="compare-col-download">
        <a href="${font.downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-black" style="display:inline-block;padding:0.6rem 1.2rem;font-size:0.75rem;font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.06em;">Download ↗</a>
      </div>
    `;
    body.appendChild(col);
  });

  // Sync shared input to all specimen columns
  if (el.compareSharedInput) {
    el.compareSharedInput.addEventListener("input", e => {
      const val = e.target.value || "The quick brown fox";
      body.querySelectorAll("[data-col-specimen]").forEach(sp => sp.textContent = val);
    });
  }
}

// ─────────────────────────────────────────────────
//  DETAIL PANEL
// ─────────────────────────────────────────────────
function openDetailPanel(font) {
  selectedFont = font;
  loadExternalFont(font);
  const fam = font.cssFamily || `'${font.name}'`;

  // Reset tabs
  el.tabBtns.forEach(b => b.classList.remove("active"));
  el.tabContents.forEach(c => c.classList.remove("active"));
  document.querySelector('[data-tab="overview"]').classList.add("active");
  document.getElementById("tab-overview").classList.add("active");

  // Header
  el.detailTitle.textContent = font.name;

  // Specimen
  el.specimenDisplay.textContent = "The quick brown fox jumps over the lazy dog.";
  el.specimenDisplay.style.fontFamily = `${fam}, serif`;
  el.specimenDisplay.style.fontSize = "48px";
  el.sizeSlider.value = 48;
  el.sizeDisplay.textContent = "48px";

  // Overview tab
  el.infoDesigner.textContent = font.designer;
  el.infoFoundry.textContent = font.foundry;
  el.infoYear.textContent = font.year;
  el.infoStyles.textContent = `${font.stylesCount} Styles`;
  el.infoLanguages.textContent = font.languages.join(", ");
  el.infoDescription.textContent = font.description;

  // Styles tab — weight specimens
  const weights = [300,400,500,700];
  el.stylesVariantList.innerHTML = weights.slice(0, Math.min(font.stylesCount, 4)).map(w => `
    <div style="border-bottom:1px solid var(--border-grey);padding-bottom:1rem;">
      <div style="font-family:var(--font-mono);font-size:0.6rem;color:#888;margin-bottom:0.3rem;">Weight ${w}</div>
      <div style="font-family:${fam},serif;font-size:1.6rem;font-weight:${w};line-height:1.2;">The quick brown fox</div>
    </div>
  `).join("");

  // License tab
  const licenseType = font.availability === "Free" ? "SIL Open Font License (OFL)" : font.availability === "Free for Personal" ? "Free for Personal Use" : "Commercial License";
  const licenseDesc = font.availability === "Free"
    ? "This font is free to use in personal and commercial projects under the SIL Open Font License. You may use it freely in print, web, and digital products without attribution."
    : font.availability === "Free for Personal"
    ? "This font is free for personal, non-commercial use. For commercial projects, publications, or client work, please purchase a commercial license from the designer."
    : "This is a paid font. Purchase a commercial license to use in client or commercial projects.";
  el.licenseBadgePill.textContent = font.availability === "Free" ? "OPEN SOURCE" : font.availability === "Free for Personal" ? "PERSONAL USE" : "COMMERCIAL";
  el.licenseDescription.textContent = licenseDesc;

  // Designer tab
  el.designerProfileName.textContent = font.designer;
  el.designerBio.textContent = `${font.designer} designed ${font.name} in ${font.year} for ${font.foundry}. This typeface represents ${font.mood.toLowerCase()} aesthetic sensibilities and is optimized for ${font.useCase.toLowerCase()} contexts.`;

  // CTA
  el.ctaPriceDisplay.textContent = font.availability === "Free" ? "Free Download" : font.availability === "Free for Personal" ? "Free (Personal)" : font.price;
  el.detailPrimaryCta.textContent = font.availability !== "Premium" ? "⬇ Download Free" : "Buy License →";
  el.downloadTooltip.textContent = `Opens the official download page for ${font.name} (${font.fileSize})`;

  // Pairing suggestions
  renderPairings(font);

  // Show panel
  el.detailPanel.classList.add("open");
  el.detailOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDetailPanel() {
  el.detailPanel.classList.remove("open");
  el.detailOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function renderPairings(font) {
  const section = el.pairingSection;
  if (!section) return;

  if (!font.pairsWith || font.pairsWith.length === 0) {
    section.innerHTML = "";
    return;
  }

  const pairFonts = font.pairsWith
    .map(p => ({ ...p, font: fontsData.find(f => f.id === p.id) }))
    .filter(p => p.font);

  if (pairFonts.length === 0) { section.innerHTML = ""; return; }

  section.innerHTML = `
    <div class="pairing-section">
      <p class="pairing-section-title">Pairs Well With</p>
      <div class="pairing-cards">
        ${pairFonts.map(p => {
          loadExternalFont(p.font);
          const fam = p.font.cssFamily || `'${p.font.name}'`;
          return `
            <div class="pairing-card" data-pair-id="${p.font.id}">
              <div class="pairing-preview" style="font-family:${fam},serif;">Aa</div>
              <div class="pairing-info">
                <div class="pairing-role">${p.role}</div>
                <div class="pairing-name">${p.font.name}</div>
                <div class="pairing-style">${p.font.style} · ${p.font.provider === 'google' ? 'Google Fonts' : p.font.provider === 'fontshare' ? 'Fontshare' : 'Dafont'}</div>
              </div>
              <div class="pairing-arrow">→</div>
            </div>`;
        }).join("")}
      </div>
    </div>`;

  // Click on pairing card → open that font's detail
  section.querySelectorAll(".pairing-card").forEach(card => {
    card.addEventListener("click", () => {
      const pairFont = fontsData.find(f => f.id === card.dataset.pairId);
      if (pairFont) openDetailPanel(pairFont);
    });
  });
}

// ─────────────────────────────────────────────────
//  COLLECTION CARDS
// ─────────────────────────────────────────────────
function setupCollectionCards() {
  document.querySelectorAll(".collection-card[data-filter]").forEach(card => {
    card.addEventListener("click", () => {
      const [group, value] = card.dataset.filter.split(":");
      activeFilters[group] = value;
      setupFilters();
      renderGrid();
      document.getElementById("main-content").scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ─────────────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────────────
function setupEventListeners() {
  // Logo click -> Home
  const logo = document.querySelector(".logo");
  logo?.addEventListener("click", (e) => {
    e.preventDefault();
    clearAllFilters();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Search input & dropdown logic
  const searchContainer = document.getElementById("search-container");
  const searchDropdown = document.getElementById("search-dropdown");
  const searchDropdownList = document.getElementById("search-dropdown-list");
  const searchDropdownFooter = document.getElementById("search-dropdown-footer");
  const searchDropdownTerm = document.getElementById("search-dropdown-term");

  function renderSearchDropdown(query) {
    if (!query) {
      searchDropdown.classList.remove("visible");
      return;
    }

    const q = query.toLowerCase();
    const matches = fontsData.filter(font => {
      return [font.name, font.designer, font.foundry, font.style, font.provider, font.mood, font.useCase]
        .some(v => v && v.toLowerCase().includes(q));
    }).slice(0, 5); // top 5 results

    if (matches.length === 0) {
      searchDropdownList.innerHTML = `<div class="search-dropdown-item" style="cursor:default;color:#888;">No fonts found matching "${query}"</div>`;
    } else {
      searchDropdownList.innerHTML = matches.map(font => {
        loadExternalFont(font);
        const fam = font.cssFamily || `'${font.name}'`;
        const providerLabel = { google:"Google Fonts", fontshare:"Fontshare", dafont:"Dafont" }[font.provider] || font.provider;
        return `
          <div class="search-dropdown-item" data-id="${font.id}">
            <div class="search-dropdown-item-left">
              <span class="search-dropdown-name" style="font-family:${fam},sans-serif;">${font.name}</span>
              <span class="search-dropdown-meta">${font.style} &middot; ${font.designer || font.foundry || 'Unknown Designer'}</span>
            </div>
            <span class="search-dropdown-provider">${providerLabel}</span>
          </div>
        `;
      }).join("");

      // Add click to dropdown items
      searchDropdownList.querySelectorAll(".search-dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
          const font = fontsData.find(f => f.id === item.dataset.id);
          if (font) openDetailPanel(font);
          searchDropdown.classList.remove("visible");
        });
      });
    }

    searchDropdownTerm.textContent = query;
    searchDropdown.classList.add("visible");
  }

  const searchClearBtn = document.getElementById("search-clear-btn");

  el.searchInput.addEventListener("input", e => {
    searchQuery = e.target.value.trim();
    renderSearchDropdown(searchQuery);
    renderGrid();
    
    if (searchQuery) searchClearBtn.classList.add("visible");
    else searchClearBtn.classList.remove("visible");
  });

  el.searchInput.addEventListener("focus", () => {
    if (el.searchInput.value.trim()) {
      searchDropdown.classList.add("visible");
    }
  });

  searchClearBtn?.addEventListener("click", () => {
    el.searchInput.value = "";
    searchQuery = "";
    searchClearBtn.classList.remove("visible");
    searchDropdown.classList.remove("visible");
    renderGrid();
    el.searchInput.focus();
  });

  // Footer click to scroll down to full results
  searchDropdownFooter?.addEventListener("click", () => {
    searchDropdown.classList.remove("visible");
    document.getElementById("main-content").scrollIntoView({ behavior: "smooth" });
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", e => {
    if (searchContainer && !searchContainer.contains(e.target)) {
      searchDropdown?.classList.remove("visible");
    }
  });

  // Clear filters
  el.clearFiltersBtn.addEventListener("click", clearAllFilters);

  // Hero browse button
  el.browseBtn?.addEventListener("click", () =>
    document.getElementById("main-content").scrollIntoView({ behavior: "smooth" })
  );

  // Scroll arrow
  el.scrollArrow?.addEventListener("click", () =>
    document.getElementById("trending-section").scrollIntoView({ behavior: "smooth" })
  );

  // Submit a Font nav button → open auth modal
  const submitNavBtn = document.getElementById("submit-font-nav-btn");
  if (submitNavBtn) submitNavBtn.addEventListener("click", openAuthModal);

  // Submit a Font footer form → open auth modal
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) newsletterForm.addEventListener("submit", e => { e.preventDefault(); openAuthModal(); });

  // Detail panel — close
  el.closePanelBtn.addEventListener("click", closeDetailPanel);
  el.detailOverlay.addEventListener("click", closeDetailPanel);

  // Detail panel — specimen input
  el.specimenInput.addEventListener("input", e => {
    if (e.target.value.trim()) el.specimenDisplay.textContent = e.target.value;
  });

  // Detail panel — size slider
  el.sizeSlider.addEventListener("input", e => {
    const size = e.target.value;
    el.specimenDisplay.style.fontSize = size + "px";
    el.sizeDisplay.textContent = size + "px";
  });

  // Detail panel — tabs
  el.tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      el.tabBtns.forEach(b => b.classList.remove("active"));
      el.tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  // Detail panel — CTA download
  el.detailPrimaryCta.addEventListener("click", () => {
    if (selectedFont) {
      window.open(selectedFont.downloadUrl, "_blank", "noopener,noreferrer");
    }
  });

  // Dark mode toggle
  el.darkToggle?.addEventListener("click", toggleDarkMode);

  // Keyboard: Escape closes all modals/panels
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      const authOverlay = document.getElementById("auth-overlay");
      if (authOverlay?.classList.contains("visible")) closeAuthModal();
      else if (el.compareOverlay.classList.contains("visible")) closeComparison();
      else closeDetailPanel();
    }
  });

  // Compare tray
  el.compareNowBtn?.addEventListener("click", openComparison);
  el.compareClearBtn?.addEventListener("click", () => {
    compareSet.clear();
    updateCompareTray();
    document.querySelectorAll(".compare-add-btn").forEach(btn => {
      btn.classList.remove("in-compare");
      btn.textContent = "+";
    });
  });

  // Compare overlay — close
  el.compareCloseBtn?.addEventListener("click", closeComparison);

  // Scroll — navbar collapse + progress bar
  window.addEventListener("scroll", () => {
    updateScrollProgress();
    const navbar = document.getElementById("navbar");
    if (navbar) navbar.classList.toggle("collapsed", window.scrollY > 80);
  }, { passive: true });

  // Collection cards
  setupCollectionCards();
}

// ─────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────
function init() {
  // Apply saved dark mode preference
  const savedDark = localStorage.getItem("fontvault-dark");
  if (savedDark === "1") applyTheme(true);

  setupFilters();
  renderGrid();
  renderTrending();
  setupEventListeners();
  setupAuthModal();
  updateClearButtonVisibility();
}

init();
