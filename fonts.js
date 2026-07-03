let fontsData = [
  // ══════════════ CUSTOM HOSTED FONTS ══════════════
  {
    id: "impact-local", name: "Impact Local", provider: "custom",
    designer: "Geoffrey Lee", foundry: "Stephenson Blake", year: "1965", stylesCount: 1,
    languages: ["Latin", "Cyrillic"],
    description: "Impact is a realist sans-serif typeface designed by Geoffrey Lee in 1965. This is a local test font loaded directly from our assets folder.",
    availability: "Free for Personal", mood: "Loud", useCase: "Poster", style: "Sans-Serif", language: "Latin",
    downloadUrl: "#", price: "Free", fileSize: "140 KB",
    cssFamily: "'Impact Local'", localUrl: "assets/fonts/impact.ttf",
    pairsWith: []
  },
  {
    id: "Realistic-Nature", 
    name: "Realistic Nature", 
    provider: "custom",
    designer: "Unknown Designer",
    foundry: "Independent",
    year: "N/A",
    stylesCount: 1,
    languages: ["Latin"],
    description: "Realistic Nature is a custom elegant script typeface loaded locally from our assets directory.",
    availability: "Free for Personal",
    mood: "Elegant",
    useCase: "Editorial",
    style: "Script",
    language: "Latin",
    downloadUrl: "#",
    price: "Free",
    fileSize: "160 KB",
    cssFamily: "'Realistic Nature'", 
    localUrl: "assets/fonts/Realistic Nature.otf",
    pairsWith: []
  },
  {
    id: "coolvetica-local",
    name: "Coolvetica",
    provider: "custom",
    designer: "Ray Larabie",
    foundry: "Typodermic Fonts",
    year: "1999",
    stylesCount: 5,
    languages: ["Latin"],
    description: "Coolvetica is a sans-serif font designed by Ray Larabie, based on the logo of the American store chain Helvetica. This is a local version hosted in our assets.",
    availability: "Free for Personal",
    mood: "Bold",
    useCase: "Poster",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "#",
    price: "Free",
    fileSize: "330 KB",
    cssFamily: "'Coolvetica'",
    localUrl: "assets/fonts/Coolvetica Rg.otf",
    pairsWith: []
  },
  {
    id: "galaxy-dingbats-local",
    name: "Galaxy Dingbats",
    provider: "custom",
    designer: "Unknown Designer",
    foundry: "Independent",
    year: "N/A",
    stylesCount: 1,
    languages: ["Latin"],
    description: "Galaxy Dingbats is a sci-fi/dingbat style custom typeface loaded locally from our assets.",
    availability: "Free",
    mood: "Playful",
    useCase: "Poster",
    style: "Display",
    language: "Latin",
    downloadUrl: "#",
    price: "Free",
    fileSize: "94 KB",
    cssFamily: "'Galaxy Dingbats'",
    localUrl: "assets/fonts/Galaxy_dingbats-Regular.ttf",
    pairsWith: []
  },

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
  {"id":"montserrat","name":"Montserrat","provider":"google","designer":"Designer 4","foundry":"Foundry 4","year":"2003","stylesCount":4,"languages":["Latin","Cyrillic"],"description":"Montserrat is a versatile display font that perfectly captures a elegant aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Elegant","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Montserrat","price":"Free","mockupType":"ui","mockupTitle":"Montserrat Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"oswald","name":"Oswald","provider":"fontshare","designer":"Designer 5","foundry":"Foundry 5","year":"2004","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Oswald is a versatile handwriting font that perfectly captures a minimal aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Minimal","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Oswald","price":"Free","mockupType":"ui","mockupTitle":"Oswald Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"source-sans-pro","name":"Source Sans Pro","provider":"dafont","designer":"Designer 6","foundry":"Foundry 6","year":"2005","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Source Sans Pro is a versatile script font that perfectly captures a bold aesthetic. It is highly recommended for packaging applications.","availability":"Free for Personal","mood":"Bold","useCase":"Packaging","style":"Script","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=Source+Sans+Pro","price":"Free","mockupType":"ui","mockupTitle":"Source Sans Pro Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"slabo-27px","name":"Slabo 27px","provider":"google","designer":"Designer 7","foundry":"Foundry 7","year":"2006","stylesCount":7,"languages":["Latin","Cyrillic"],"description":"Slabo 27px is a versatile sans-serif font that perfectly captures a vintage aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Vintage","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Slabo+27px","price":"Free","mockupType":"ui","mockupTitle":"Slabo 27px Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"raleway","name":"Raleway","provider":"fontshare","designer":"Designer 8","foundry":"Foundry 8","year":"2007","stylesCount":8,"languages":["Latin","Cyrillic"],"description":"Raleway is a versatile serif font that perfectly captures a modern aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Modern","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Raleway","price":"Free","mockupType":"ui","mockupTitle":"Raleway Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"pt-sans","name":"PT Sans","provider":"dafont","designer":"Designer 9","foundry":"Foundry 9","year":"2008","stylesCount":1,"languages":["Latin","Cyrillic"],"description":"PT Sans is a versatile monospace font that perfectly captures a classic aesthetic. It is highly recommended for code applications.","availability":"Free for Personal","mood":"Classic","useCase":"Code","style":"Monospace","language":"Latin","downloadUrl":"https://www.dafont.com/search?q=PT+Sans","price":"Free","mockupType":"ui","mockupTitle":"PT Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"merriweather","name":"Merriweather","provider":"google","designer":"Designer 10","foundry":"Foundry 10","year":"2009","stylesCount":2,"languages":["Latin","Cyrillic"],"description":"Merriweather is a versatile display font that perfectly captures a playful aesthetic. It is highly recommended for branding applications.","availability":"Free","mood":"Playful","useCase":"Branding","style":"Display","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Merriweather","price":"Free","mockupType":"ui","mockupTitle":"Merriweather Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
  {"id":"noto-sans","name":"Noto Sans","provider":"fontshare","designer":"Designer 11","foundry":"Foundry 11","year":"2010","stylesCount":3,"languages":["Latin","Cyrillic"],"description":"Noto Sans is a versatile handwriting font that perfectly captures a elegant aesthetic. It is highly recommended for posters applications.","availability":"Free","mood":"Elegant","useCase":"Posters","style":"Handwriting","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Noto+Sans","price":"Free","mockupType":"ui","mockupTitle":"Noto Sans Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"concert-one","name":"Concert One","provider":"google","designer":"Designer 13","foundry":"Foundry 13","year":"2012","stylesCount":5,"languages":["Latin","Cyrillic"],"description":"Concert One is a versatile sans-serif font that perfectly captures a bold aesthetic. It is highly recommended for ui applications.","availability":"Free","mood":"Bold","useCase":"UI","style":"Sans-Serif","language":"Latin","downloadUrl":"https://fonts.google.com/specimen/Concert+One","price":"Free","mockupType":"ui","mockupTitle":"Concert One Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"0.1 MB","pairsWith":[]},
  {"id":"promesh","name":"Promesh","provider":"fontshare","designer":"Designer 14","foundry":"Foundry 14","year":"2013","stylesCount":6,"languages":["Latin","Cyrillic"],"description":"Promesh is a versatile serif font that perfectly captures a vintage aesthetic. It is highly recommended for editorial applications.","availability":"Free","mood":"Vintage","useCase":"Editorial","style":"Serif","language":"Latin","downloadUrl":"https://www.fontshare.com/search?q=Promesh","price":"Free","mockupType":"ui","mockupTitle":"Promesh Showcase","mockupSubtitle":"A premium typographic experience","fileSize":"1.1 MB","pairsWith":[]},
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

// -------------------------------------------------
// DYNAMIC GOOGLE FONTS API INTEGRATION
// -------------------------------------------------

async function initGoogleFonts(apiKey) {
  try {
    const cacheKey = "fontvault-cached-google-fonts";
    const cacheTimeKey = "fontvault-cached-time";
    const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours

    let items = null;
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);

    if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime) < cacheDuration)) {
      try {
        items = JSON.parse(cachedData);
        console.log("Loaded Google Fonts from cache.");
      } catch (e) {
        console.warn("Failed to parse cached Google Fonts, refetching...", e);
      }
    }

    if (!items) {
      console.log("Fetching Google Fonts from API...");
      const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`);
      if (!response.ok) throw new Error("Failed to fetch Google Fonts");
      
      const data = await response.json();
      if (data.items) {
        items = data.items;
        try {
          localStorage.setItem(cacheKey, JSON.stringify(items));
          localStorage.setItem(cacheTimeKey, Date.now().toString());
        } catch (e) {
          console.warn("Storage quota exceeded, could not cache Google Fonts locally:", e);
        }
      }
    }

    if (!items) return;

    // Filter out fonts we already have hardcoded so we don't duplicate them
    const existingIds = new Set(fontsData.map(f => f.id));

    const mappedFonts = items.map(item => {
      const id = item.family.toLowerCase().replace(/\s+/g, '-');
      if (existingIds.has(id)) {
        const existingFont = fontsData.find(f => f.id === id);
        if (existingFont) {
          existingFont.variants = item.variants;
        }
        return null;
      }

      // Map Google category to our style labels
      let mappedStyle = "Sans-Serif";
      if (item.category === "serif") mappedStyle = "Serif";
      else if (item.category === "display") mappedStyle = "Display";
      else if (item.category === "handwriting") mappedStyle = "Handwriting";
      else if (item.category === "monospace") mappedStyle = "Monospace";

      return {
        id: id,
        name: item.family,
        provider: "google",
        designer: "Google Fonts",
        foundry: "Google",
        year: item.lastModified ? item.lastModified.split("-")[0] : "N/A",
        stylesCount: item.variants.length,
        languages: item.subsets,
        description: `${item.family} is a high-quality ${mappedStyle.toLowerCase()} typeface available from the Google Fonts library. It supports ${item.subsets.length} languages and comes in ${item.variants.length} styles.`,
        availability: "Free",
        mood: "Modern", // Default mood
        useCase: "Web", // Default use case
        style: mappedStyle,
        language: "Latin", // Simplified
        downloadUrl: `https://fonts.google.com/specimen/${item.family.replace(/\s+/g, '+')}`,
        price: "Free",
        mockupType: "ui",
        mockupTitle: item.family,
        mockupSubtitle: "Google Fonts Showcase",
        fileSize: "~1 MB",
        pairsWith: [],
        cssFamily: `'${item.family}', ${mappedStyle.toLowerCase()}`,
        variants: item.variants
      };
    }).filter(Boolean);

    // Append to our existing curated list
    fontsData = [...fontsData, ...mappedFonts];
    console.log(`Successfully loaded ${mappedFonts.length} fonts.`);
  } catch (error) {
    console.error("Error loading Google Fonts:", error);
  }
}

// Load persisted user-uploaded fonts from localStorage
try {
  const saved = localStorage.getItem("fontvault-uploads");
  if (saved) {
    const parsed = JSON.parse(saved);
    fontsData = [...parsed, ...fontsData];
  }
} catch (e) {
  console.error("Failed to load uploaded fonts from localStorage:", e);
}
