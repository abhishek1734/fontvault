// --- CURATED MULTI-PROVIDER DATABASE (Google, Fontshare, Dafont) ---
const fontsData = [
  // --- GOOGLE FONTS (Sourced from fonts.google.com) ---
  {
    id: "instrument-serif",
    name: "Instrument Serif",
    provider: "google",
    designer: "Jordan Bell",
    foundry: "Instrument",
    year: "2023",
    stylesCount: 4,
    languages: ["Latin", "Latin Extended"],
    description: "Instrument Serif is a elegant, high-contrast serif typeface designed for headlines and brand presentation. It draws inspiration from early 20th-century metal type, displaying soft curves and sharp counters.",
    availability: "Free for Personal",
    mood: "Elegant",
    useCase: "Editorial",
    style: "Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Instrument+Serif",
    price: "Free",
    mockupType: "magazine",
    mockupTitle: "L'HORIZON",
    mockupSubtitle: "Volume 24 / Autumn Edition",
    fileSize: "1.4 MB"
  },
  {
    id: "inter",
    name: "Inter",
    provider: "google",
    designer: "Rasmus Andersson",
    foundry: "RSMS",
    year: "2016",
    stylesCount: 18,
    languages: ["Latin", "Cyrillic", "Greek"],
    description: "Inter is a variable font family carefully crafted and designed for computer screens. It features a tall x-height to aid in readability of mixed-case and lower-case text. Inter is widely used for user interfaces, web applications, and dense dashboard styling.",
    availability: "Free",
    mood: "Minimal",
    useCase: "UI",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Inter",
    price: "Free",
    mockupType: "ui",
    mockupTitle: "Settings / Advanced",
    mockupSubtitle: "Enable system-wide variable properties",
    fileSize: "2.3 MB"
  },
  {
    id: "dm-serif-display",
    name: "DM Serif Display",
    provider: "google",
    designer: "Colophon Foundry",
    foundry: "Colophon",
    year: "2019",
    stylesCount: 2,
    languages: ["Latin", "Latin Extended"],
    description: "DM Serif Display is a high-contrast transitional serif typeface, designed for headline and display use. It is a sibling to DM Serif Text and pairs exceptionally well with clean sans-serif body typefaces in editorial layouts.",
    availability: "Free",
    mood: "Vintage",
    useCase: "Poster",
    style: "Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/DM+Serif+Display",
    price: "Free",
    mockupType: "poster",
    mockupTitle: "BAUHAUS",
    mockupSubtitle: "Retrospective Exhibition 1919-1933",
    fileSize: "0.8 MB"
  },
  {
    id: "jetbrains-mono",
    name: "JetBrains Mono",
    provider: "google",
    designer: "Philipp Nurullin",
    foundry: "JetBrains",
    year: "2020",
    stylesCount: 8,
    languages: ["Latin", "Cyrillic", "Greek"],
    description: "JetBrains Mono is a typeface specifically designed for developers. It has specific letterforms that reduce eye strain during long coding sessions, with optimized spacing, distinct shapes for similar characters, and code ligatures.",
    availability: "Free",
    mood: "Minimal",
    useCase: "Web",
    style: "Monospace",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/JetBrains+Mono",
    price: "Free",
    mockupType: "code",
    mockupTitle: "const config = {",
    mockupSubtitle: "  theme: 'mono-dark',\n  opacity: 0.95\n}",
    fileSize: "1.9 MB"
  },
  {
    id: "syne",
    name: "Syne",
    provider: "google",
    designer: "Bonjour Monde",
    foundry: "Synesthesia",
    year: "2017",
    stylesCount: 5,
    languages: ["Latin"],
    description: "Syne was originally designed for an art center in France. It features unique wide, expressive letterforms in its heavier weights (extra bold/italic) while remaining clean and architectural in its regular weights.",
    availability: "Free",
    mood: "Playful",
    useCase: "Branding",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Syne",
    price: "Free",
    mockupType: "branding",
    mockupTitle: "FUTURE",
    mockupSubtitle: "Design Collective 2026",
    fileSize: "1.2 MB"
  },
  {
    id: "playfair-display",
    name: "Playfair Display",
    provider: "google",
    designer: "Claus Eggers Sørensen",
    foundry: "Claus Sørensen",
    year: "2011",
    stylesCount: 6,
    languages: ["Latin", "Cyrillic"],
    description: "Playfair Display is a transitional serif typeface. Influenced by printer John Baskerville's style and the emergence of thin steel pens, it features elegant high-contrast strokes that work beautifully in titles and invitations.",
    availability: "Free",
    mood: "Elegant",
    useCase: "Editorial",
    style: "Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Playfair+Display",
    price: "Free",
    mockupType: "invitation",
    mockupTitle: "Charlotte & Julian",
    mockupSubtitle: "Request the pleasure of your company",
    fileSize: "2.1 MB"
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    provider: "google",
    designer: "Florian Karsten",
    foundry: "FK Foundry",
    year: "2018",
    stylesCount: 5,
    languages: ["Latin", "Latin Extended"],
    description: "Space Grotesk is a proportional sans-serif typeface based on Space Mono. It maintains the technical and quirky characteristics of the monospaced parent while optimizing readability for body copy and titles.",
    availability: "Free",
    mood: "Bold",
    useCase: "Branding",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Space+Grotesk",
    price: "Free",
    mockupType: "poster",
    mockupTitle: "DATA-FLEX",
    mockupSubtitle: "Decentralized Cybernetic Hubs",
    fileSize: "1.1 MB"
  },
  {
    id: "bebas-neue",
    name: "Bebas Neue",
    provider: "google",
    designer: "Ryoichi Tsunekawa",
    foundry: "Dharma Type",
    year: "2010",
    stylesCount: 5,
    languages: ["Latin", "Cyrillic"],
    description: "Bebas Neue is a highly popular display sans-serif typeface based on the original Bebas free font. It is characterised by its clean lines, condensed cap-height, and bold, punchy presence suitable for headings.",
    availability: "Free",
    mood: "Bold",
    useCase: "Poster",
    style: "Display",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Bebas+Neue",
    price: "Free",
    mockupType: "bold-label",
    mockupTitle: "LIMITED ED.",
    mockupSubtitle: "BATCH NO. 4882 / ARCHIVE",
    fileSize: "0.6 MB"
  },
  {
    id: "cinzel",
    name: "Cinzel",
    provider: "google",
    designer: "Natanael Gama",
    foundry: "N Gama",
    year: "2012",
    stylesCount: 6,
    languages: ["Latin"],
    description: "Cinzel is a typeface inspired by first-century Roman inscriptions. It follows classical proportions while incorporating a contemporary flare. Cinzel is perfect for luxury labels and historical displays.",
    availability: "Free",
    mood: "Formal",
    useCase: "Packaging",
    style: "Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Cinzel",
    price: "Free",
    mockupType: "luxury",
    mockupTitle: "RESERVE",
    mockupSubtitle: "Single Vineyard / Cabernet Franc",
    fileSize: "1.7 MB"
  },
  {
    id: "cormorant-garamond",
    name: "Cormorant Garamond",
    provider: "google",
    designer: "Christian Thalmann",
    foundry: "Catharsis",
    year: "2015",
    stylesCount: 10,
    languages: ["Latin", "Cyrillic"],
    description: "Cormorant Garamond is a large, high-fidelity Garamond family designed for large display use. It features ultra-thin serifs and elegant curves.",
    availability: "Free",
    mood: "Elegant",
    useCase: "Editorial",
    style: "Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Cormorant+Garamond",
    price: "Free",
    mockupType: "book",
    mockupTitle: "THE METAMORPHOSIS",
    mockupSubtitle: "Translated from the original German text",
    fileSize: "2.5 MB"
  },
  {
    id: "outfit",
    name: "Outfit",
    provider: "google",
    designer: "Outfit Foundry",
    foundry: "Outfit",
    year: "2021",
    stylesCount: 9,
    languages: ["Latin"],
    description: "Outfit is a playful, clean, geometric sans-serif font family. It is optimized for web screens, mobile UI products, and smart device applications.",
    availability: "Free",
    mood: "Playful",
    useCase: "UI",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Outfit",
    price: "Free",
    mockupType: "ui",
    mockupTitle: "Explore // Dynamic",
    mockupSubtitle: "Quick interactive UI configurations",
    fileSize: "1.0 MB"
  },
  {
    id: "montserrat",
    name: "Montserrat",
    provider: "google",
    designer: "Julieta Ulanovsky",
    foundry: "Montserrat Project",
    year: "2011",
    stylesCount: 18,
    languages: ["Latin", "Cyrillic"],
    description: "Montserrat is inspired by posters, signs and old windows from the historic Buenos Aires neighborhood. It has a beautiful geometric layout that is highly readable.",
    availability: "Free",
    mood: "Modern",
    useCase: "Web",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://fonts.google.com/specimen/Montserrat",
    price: "Free",
    mockupType: "poster",
    mockupTitle: "MUNICIPAL",
    mockupSubtitle: "BUENOS AIRES NEIGHBORHOOD",
    fileSize: "2.8 MB"
  },

  // --- FONTSHARE FONTS (Sourced from fontshare.com) ---
  {
    id: "satoshi",
    name: "Satoshi",
    provider: "fontshare",
    designer: "Indian Type Foundry",
    foundry: "ITF",
    year: "2021",
    stylesCount: 10,
    languages: ["Latin"],
    description: "Satoshi is a modernist neo-grotesque sans-serif typeface. It is clean, minimalist, and highly adaptable for modern digital interfaces, posters, and body layouts.",
    availability: "Free",
    mood: "Minimal",
    useCase: "UI",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://www.fontshare.com/fonts/satoshi",
    price: "Free",
    mockupType: "ui",
    mockupTitle: "Interface // Satoshi",
    mockupSubtitle: "Optimal layout configurations",
    fileSize: "1.8 MB"
  },
  {
    id: "clash-display",
    name: "Clash Display",
    provider: "fontshare",
    designer: "Indian Type Foundry",
    foundry: "ITF",
    year: "2021",
    stylesCount: 6,
    languages: ["Latin"],
    description: "Clash Display is a display sans-serif typeface. Its designs feature very small counters and thick strokes, giving it a heavy, high-contrast personality ideal for headline posters.",
    availability: "Free",
    mood: "Bold",
    useCase: "Poster",
    style: "Display",
    language: "Latin",
    downloadUrl: "https://www.fontshare.com/fonts/clash-display",
    price: "Free",
    mockupType: "bold-label",
    mockupTitle: "ATTENTION",
    mockupSubtitle: "THIS PRODUCT IS HIGHLY EXPERIMENTAL",
    fileSize: "1.1 MB"
  },
  {
    id: "cabinet-grotesk-free",
    name: "Cabinet Grotesk",
    provider: "fontshare",
    designer: "Indian Type Foundry",
    foundry: "ITF",
    year: "2021",
    stylesCount: 8,
    languages: ["Latin"],
    description: "Cabinet Grotesk is a premium sans-serif family designed specifically for branding, digital UI, and high-impact identity headers. It shifts between architectural geometry and elegant curves.",
    availability: "Free",
    mood: "Modern",
    useCase: "Branding",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://www.fontshare.com/fonts/cabinet-grotesk",
    price: "Free",
    mockupType: "branding",
    mockupTitle: "ITF DESIGN",
    mockupSubtitle: "Branding Collective 2026",
    fileSize: "2.4 MB"
  },
  {
    id: "general-sans",
    name: "General Sans",
    provider: "fontshare",
    designer: "Indian Type Foundry",
    foundry: "ITF",
    year: "2021",
    stylesCount: 12,
    languages: ["Latin"],
    description: "General Sans is a neutral, highly readable grotesque typeface. Ideal for settings where legibility is paramount, like technical web documentation and long editorial reviews.",
    availability: "Free",
    mood: "Formal",
    useCase: "Web",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://www.fontshare.com/fonts/general-sans",
    price: "Free",
    mockupType: "book",
    mockupTitle: "SPECIFICATION NOTES",
    mockupSubtitle: "Compiled technical data sheet",
    fileSize: "2.0 MB"
  },
  {
    id: "zodiak",
    name: "Zodiak",
    provider: "fontshare",
    designer: "Jérémie Hornus",
    foundry: "ITF",
    year: "2021",
    stylesCount: 8,
    languages: ["Latin"],
    description: "Zodiak is an elegant serif typeface. Featuring exceptionally thin, delicate horizontal serifs, it shines in luxurious magazine titles and literary publications.",
    availability: "Free",
    mood: "Elegant",
    useCase: "Editorial",
    style: "Serif",
    language: "Latin",
    downloadUrl: "https://www.fontshare.com/fonts/zodiak",
    price: "Free",
    mockupType: "magazine",
    mockupTitle: "ELEGANTIA",
    mockupSubtitle: "High Fashion / Winter Issue",
    fileSize: "1.6 MB"
  },

  // --- DAFONT FONTS (Sourced from dafont.com) ---
  {
    id: "lemon-milk",
    name: "Lemon Milk",
    provider: "dafont",
    designer: "Muhammad Faisal",
    foundry: "Ariq Sya",
    year: "2016",
    stylesCount: 4,
    languages: ["Latin"],
    description: "Lemon Milk is a extremely popular geometric display sans-serif typeface available on Dafont. Known for its sharp corners and modern uppercase letters, it is widely featured in YouTube videos, streetwear, and active posters.",
    availability: "Free for Personal",
    mood: "Bold",
    useCase: "Branding",
    style: "Display",
    language: "Latin",
    downloadUrl: "https://www.dafont.com/lemon-milk.font",
    price: "Free",
    mockupType: "branding",
    mockupTitle: "LEMON",
    mockupSubtitle: "CREATIVE HUB / STREETWEAR",
    fileSize: "0.9 MB"
  },
  {
    id: "coolvetica",
    name: "Coolvetica",
    provider: "dafont",
    designer: "Ray Larabie",
    foundry: "Typodermic",
    year: "1999",
    stylesCount: 4,
    languages: ["Latin"],
    description: "Coolvetica is a display sans-serif inspired by the custom Helvetica logos of the 1970s. It features tight kerning, funky curves, and a vintage retro presence suitable for branding.",
    availability: "Free for Personal",
    mood: "Vintage",
    useCase: "Branding",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://www.dafont.com/coolvetica.font",
    price: "Free",
    mockupType: "poster",
    mockupTitle: "RETRO-WAVE",
    mockupSubtitle: "Custom Typography Era",
    fileSize: "1.2 MB"
  },
  {
    id: "shoreline-script",
    name: "Shoreline Script",
    provider: "dafont",
    designer: "Billy Argel",
    foundry: "Billy Argel",
    year: "2018",
    stylesCount: 1,
    languages: ["Latin"],
    description: "Shoreline Script is a fluid, flowing script typeface with elaborate flourishes. Ideal for organic packaging, wedding invites, and signature branding items.",
    availability: "Free for Personal",
    mood: "Elegant",
    useCase: "Packaging",
    style: "Script",
    language: "Latin",
    downloadUrl: "https://www.dafont.com/shoreline-script.font",
    price: "Free",
    mockupType: "invitation",
    mockupTitle: "Serenade of the Sea",
    mockupSubtitle: "Premium Organic Reserve",
    fileSize: "2.1 MB"
  },
  {
    id: "old-london",
    name: "Old London",
    provider: "dafont",
    designer: "Dieter Steffmann",
    foundry: "Steffmann",
    year: "2002",
    stylesCount: 2,
    languages: ["Latin"],
    description: "Old London is a classic gothic blackletter font. It recreates old English typography beautifully, making it perfect for vintage editorial work, heavy metal band logos, and historic certificates.",
    availability: "Free",
    mood: "Vintage",
    useCase: "Editorial",
    style: "Serif",
    language: "Latin",
    downloadUrl: "https://www.dafont.com/old-london.font",
    price: "Free",
    mockupType: "luxury",
    mockupTitle: "Chronicles",
    mockupSubtitle: "ESTABLISHED ANNO DOMINI 1884",
    fileSize: "0.7 MB"
  }
];

// --- DYNAMIC MULTI-PROVIDER FONT FACE LOADER ---
function loadExternalFont(font) {
  const linkId = `font-face-${font.id}`;
  if (document.getElementById(linkId)) return;
  
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  
  if (font.provider === "google") {
    const formattedName = font.name.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500&display=swap`;
  } else if (font.provider === "fontshare") {
    const slug = font.name.toLowerCase().replace(/\s+/g, '-');
    link.href = `https://api.fontshare.com/v2/css?f=${slug}@300,400,500,700&display=swap`;
  } else if (font.provider === "dafont") {
    // Dafont files are not served over direct CDN links. 
    // We dynamically map them to matching Google Font fallback families for browser previewing
    let fallbackGoogleFont = "";
    if (font.name.includes("Lemon Milk")) fallbackGoogleFont = "Montserrat";
    else if (font.name.includes("Coolvetica")) fallbackGoogleFont = "Rubik";
    else if (font.name.includes("Shoreline Script")) fallbackGoogleFont = "Great Vibes";
    else if (font.name.includes("Old London")) fallbackGoogleFont = "UnifrakturMaguntia";
    else fallbackGoogleFont = "Playfair Display"; // fallback default
    
    if (fallbackGoogleFont) {
      const formattedName = fallbackGoogleFont.replace(/\s+/g, '+');
      link.href = `https://fonts.googleapis.com/css2?family=${formattedName}&display=swap`;
      font.cssFamily = `'${fallbackGoogleFont}', cursive, sans-serif`;
    }
  }
  
  document.head.appendChild(link);
}

// --- PRE-LOAD CORE FONTS FOR HOMEPAGE ---
fontsData.forEach(font => {
  if (font.availability === "Free" || font.availability === "Free for Personal") {
    loadExternalFont(font);
  }
});

// --- FILTER CONFIGURATION ---
const filterGroups = {
  "Availability": ["All", "Free", "Free for Personal", "Premium"],
  "Style": ["Serif", "Sans-Serif", "Display", "Monospace", "Script"],
  "Mood": ["Elegant", "Minimal", "Vintage", "Bold", "Playful", "Formal", "Modern"],
  "Use Case": ["Editorial", "UI", "Poster", "Web", "Packaging", "Branding"],
  "Language": ["Latin", "Cyrillic"]
};

let activeFilters = {
  "Availability": "All",
  "Style": null,
  "Mood": null,
  "Use Case": null,
  "Language": null
};

let searchQuery = "";
let selectedFont = null;

// --- STATE MANAGEMENT ---
const elements = {
  fontGrid: document.getElementById("font-grid"),
  filterContainer: document.getElementById("filter-groups-container"),
  clearFiltersBtn: document.getElementById("clear-filters-btn"),
  searchInput: document.getElementById("search-input"),
  browseBtn: document.getElementById("btn-browse-fonts"),
  freeDownloadsBtn: document.getElementById("btn-free-downloads"),
  scrollArrow: document.getElementById("scroll-arrow"),
  
  // Detail sheet elements
  detailOverlay: document.getElementById("detail-overlay"),
  detailPanel: document.getElementById("detail-panel"),
  closePanelBtn: document.getElementById("close-panel-btn"),
  detailTitle: document.getElementById("detail-title"),
  specimenDisplay: document.getElementById("specimen-display"),
  specimenInput: document.getElementById("specimen-input"),
  sizeSlider: document.getElementById("size-slider"),
  sizeDisplay: document.getElementById("size-display"),
  
  // Detail tabs
  tabBtns: document.querySelectorAll(".tab-btn"),
  tabContents: document.querySelectorAll(".tab-content"),
  
  // Specimen meta elements
  infoDesigner: document.getElementById("info-designer"),
  infoFoundry: document.getElementById("info-foundry"),
  infoYear: document.getElementById("info-year"),
  infoStyles: document.getElementById("info-styles"),
  infoLanguages: document.getElementById("info-languages"),
  infoDescription: document.getElementById("info-description"),
  stylesVariantList: document.getElementById("styles-variant-list"),
  licenseBadgePill: document.getElementById("license-badge-pill"),
  licenseDescription: document.getElementById("license-description"),
  designerProfileName: document.getElementById("designer-profile-name"),
  designerBio: document.getElementById("designer-bio"),
  
  // CTA bottom panel
  ctaPriceDisplay: document.getElementById("cta-price-display"),
  detailPrimaryCta: document.getElementById("detail-primary-cta"),
  downloadTooltip: document.getElementById("download-tooltip")
};

// --- INITIALIZE WEB APP ---
function init() {
  setupFilters();
  renderGrid();
  setupEventListeners();
}

// --- SETUP FILTER BAR ---
function setupFilters() {
  elements.filterContainer.innerHTML = "";
  
  Object.entries(filterGroups).forEach(([groupName, options], index) => {
    const groupElement = document.createElement("div");
    groupElement.className = "filter-group";
    
    const titleElement = document.createElement("span");
    titleElement.className = "filter-group-title";
    titleElement.textContent = groupName;
    groupElement.appendChild(titleElement);
    
    const pillContainer = document.createElement("div");
    pillContainer.className = "pill-container";
    
    options.forEach(option => {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = option;
      
      // Determine if active
      if (groupName === "Availability" && activeFilters[groupName] === option) {
        pill.classList.add("active");
      } else if (activeFilters[groupName] === option) {
        pill.classList.add("active");
      }
      
      pill.addEventListener("click", () => handleFilterClick(groupName, option));
      pillContainer.appendChild(pill);
    });
    
    groupElement.appendChild(pillContainer);
    elements.filterContainer.appendChild(groupElement);
    
    // Add divider except for last
    if (index < Object.keys(filterGroups).length - 1) {
      const divider = document.createElement("div");
      divider.className = "divider";
      elements.filterContainer.appendChild(divider);
    }
  });
}

// --- HANDLE FILTER CLICKS ---
function handleFilterClick(group, value) {
  if (group === "Availability") {
    activeFilters[group] = value;
  } else {
    if (activeFilters[group] === value) {
      activeFilters[group] = null;
    } else {
      activeFilters[group] = value;
    }
  }
  
  updateClearButtonVisibility();
  setupFilters();
  renderGrid();
}

// --- UPDATE CLEAR BUTTON ---
function updateClearButtonVisibility() {
  const hasActiveFilters = activeFilters["Availability"] !== "All" ||
    Object.entries(activeFilters).some(([g, v]) => g !== "Availability" && v !== null);
  
  if (hasActiveFilters) {
    elements.clearFiltersBtn.style.display = "block";
  } else {
    elements.clearFiltersBtn.style.display = "none";
  }
}

// --- CLEAR ALL FILTERS ---
function clearAllFilters() {
  activeFilters = {
    "Availability": "All",
    "Style": null,
    "Mood": null,
    "Use Case": null,
    "Language": null
  };
  updateClearButtonVisibility();
  setupFilters();
  renderGrid();
}

// --- MOCKUP INLINE CSS GENERATOR ---
function getMockupHTML(font) {
  const fontNameSafe = font.name;
  let customStyle = "";
  
  loadExternalFont(font);
  const targetFamily = font.cssFamily || `'${fontNameSafe}'`;
  
  if (font.mockupType === "magazine") {
    customStyle = `
      background-color: #F0EDE6;
      color: #0A0A0A;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-grey);
    `;
    return `
      <div class="card-mockup" style="${customStyle}">
        <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="font-family: ${targetFamily}, serif; font-size: 2.2rem; font-style: italic; line-height: 1; text-align: center;">${font.mockupTitle}</div>
        <div style="font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; margin-top: 0.8rem; letter-spacing: 0.1em; color: #777;">${font.mockupSubtitle}</div>
      </div>
    `;
  }
  
  if (font.mockupType === "ui") {
    customStyle = `
      background-color: #FAFAFA;
      color: #0A0A0A;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-grey);
    `;
    return `
      <div class="card-mockup" style="${customStyle}">
        <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="font-family: var(--font-mono); font-size: 0.65rem; color: #888;">${font.mockupTitle}</div>
        <div style="font-family: ${targetFamily}, sans-serif; font-size: 1.2rem; font-weight: 600; line-height: 1.3; margin: 1rem 0;">
          Unlock variable spacing values seamlessly.
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <div style="width: 28px; height: 12px; background: #000; border-radius: 6px;"></div>
          <div style="width: 12px; height: 12px; background: #E0E0E0; border-radius: 6px;"></div>
        </div>
      </div>
    `;
  }

  if (font.mockupType === "code") {
    customStyle = `
      background-color: #111111;
      color: #A9B1D6;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-grey);
    `;
    return `
      <div class="card-mockup" style="${customStyle}">
        <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="font-family: ${targetFamily}, monospace; font-size: 0.85rem; line-height: 1.5; color: #E0E0E0;">
          <span style="color: #FF3B00">const</span> config = {<br>
          &nbsp;&nbsp;theme: <span style="color: #A9B1D6">'mono-dark'</span>,<br>
          &nbsp;&nbsp;opacity: <span style="color: #00C853">0.95</span><br>
          }
        </div>
      </div>
    `;
  }

  if (font.mockupType === "branding") {
    customStyle = `
      background-color: #0A0A0A;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-grey);
    `;
    return `
      <div class="card-mockup" style="${customStyle}">
        <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="font-family: ${targetFamily}, sans-serif; font-size: 2.5rem; font-weight: 700; line-height: 0.95; letter-spacing: -0.04em; text-align:center;">${font.mockupTitle}</div>
        <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--signal-red); margin-top: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase;">${font.mockupSubtitle}</div>
      </div>
    `;
  }

  if (font.mockupType === "poster") {
    customStyle = `
      background-color: #F5F5F5;
      color: #0A0A0A;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-grey);
    `;
    return `
      <div class="card-mockup" style="${customStyle}">
        <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="font-family: ${targetFamily}, sans-serif; font-size: 2.5rem; font-weight: 800; line-height: 0.85; letter-spacing: -0.02em;">${font.mockupTitle}</div>
        <div style="font-size: 0.7rem; color: #555; text-transform: uppercase; font-weight: 500;">${font.mockupSubtitle}</div>
      </div>
    `;
  }

  if (font.mockupType === "invitation") {
    customStyle = `
      background-color: #FCF9F2;
      color: #2E2B2A;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-grey);
      border: 6px double #E6DFD3;
      margin: 4px;
      border-radius: 4px;
    `;
    return `
      <div class="card-mockup" style="${customStyle}">
        <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="font-family: ${targetFamily}, serif; font-size: 1.4rem; font-style: italic; text-align: center; margin-bottom: 0.4rem;">${font.mockupTitle}</div>
        <div style="font-family: var(--font-body); font-size: 0.55rem; text-align: center; color: #7c7774; letter-spacing: 0.05em; text-transform: uppercase;">${font.mockupSubtitle}</div>
      </div>
    `;
  }

  if (font.mockupType === "bold-label") {
    customStyle = `
      background-color: #FF3B00;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-grey);
    `;
    return `
      <div class="card-mockup" style="${customStyle}">
        <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="font-family: ${targetFamily}, sans-serif; font-size: 3.2rem; line-height: 0.9; font-weight: 900; text-align: center; letter-spacing: -0.02em;">${font.mockupTitle}</div>
        <div style="font-family: var(--font-mono); font-size: 0.6rem; color: #FFFFFF; margin-top: 0.6rem; letter-spacing: 0.1em;">${font.mockupSubtitle}</div>
      </div>
    `;
  }

  if (font.mockupType === "luxury") {
    customStyle = `
      background-color: #0E0E0E;
      color: #D4AF37;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-grey);
    `;
    return `
      <div class="card-mockup" style="${customStyle}">
        <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="font-family: ${targetFamily}, serif; font-size: 1.8rem; font-weight: 300; letter-spacing: 0.3em; margin-bottom: 0.5rem; text-align: center;">${font.mockupTitle}</div>
        <div style="font-family: var(--font-mono); font-size: 0.55rem; color: #FFFFFF; letter-spacing: 0.15em;">${font.mockupSubtitle}</div>
      </div>
    `;
  }

  if (font.mockupType === "book") {
    customStyle = `
      background-color: #FFFFFF;
      color: #0A0A0A;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.8rem;
      border-bottom: 1px solid var(--border-grey);
    `;
    return `
      <div class="card-mockup" style="${customStyle}">
        <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="font-family: ${targetFamily}, serif; font-size: 1.5rem; line-height: 1.1; margin-bottom: 1rem; max-width: 80%;">${font.mockupTitle}</div>
        <div style="font-family: var(--font-body); font-size: 0.6rem; color: #888;">${font.mockupSubtitle}</div>
      </div>
    `;
  }

  return `
    <div class="card-mockup" style="background-color:#FFF; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #E0E0E0;">
      <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
      <div style="font-family:${targetFamily}; font-size:2rem;">${font.name}</div>
    </div>
  `;
}

function getBadgeClass(availability) {
  switch (availability) {
    case "Free": return "badge-free";
    case "Free for Personal": return "badge-personal";
    case "Trial": return "badge-trial";
    case "Premium": return "badge-premium";
    case "Paid": return "badge-paid";
    default: return "badge-free";
  }
}

// --- GET FILTERED FONTS DATA ---
function getFilteredFonts() {
  return fontsData.filter(font => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = font.name.toLowerCase().includes(query) || 
                            font.designer.toLowerCase().includes(query) ||
                            font.foundry.toLowerCase().includes(query) ||
                            font.style.toLowerCase().includes(query) ||
                            font.provider.toLowerCase().includes(query) ||
                            font.mood.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    // Availability Filter
    if (activeFilters["Availability"] !== "All") {
      if (font.availability !== activeFilters["Availability"]) return false;
    }
    
    // Group Filters
    for (const [group, value] of Object.entries(activeFilters)) {
      if (group === "Availability" || value === null) continue;
      
      const key = group.toLowerCase().replace(" ", "");
      if (key === "usecase" && font.useCase !== value) return false;
      if (key === "style" && font.style !== value) return false;
      if (key === "mood" && font.mood !== value) return false;
      if (key === "language" && font.language !== value) return false;
    }
    
    return true;
  });
}

// --- APPEND FONT CARD ---
function appendFontCard(font) {
  const isFree = font.availability === "Free" || font.availability === "Free for Personal";
  const statusDotClass = isFree ? "green" : "grey";
  const statusText = isFree ? "Free Download" : `${font.price} / Buy License`;
  const btnLabel = isFree ? "⬇ Try Free" : "Buy →";
  
  // Format source label nicely
  let providerLabel = font.provider.toUpperCase();
  if (providerLabel === "GOOGLE") providerLabel = "GOOGLE FONTS";
  
  const card = document.createElement("div");
  card.className = "font-card";
  card.setAttribute("aria-label", `${font.name}, ${font.style}, ${font.availability}`);
  
  loadExternalFont(font);
  const targetFamily = font.cssFamily || `'${font.name}'`;
  
  card.innerHTML = `
    ${getMockupHTML(font)}
    <div class="card-info">
      <h3 class="card-font-name" style="font-family: ${targetFamily}, var(--font-display);">${font.name}</h3>
      <p class="card-tags">
        <span style="text-transform: uppercase; font-weight:700; color:var(--near-black); background:#E0E0E0; padding:2px 6px; border-radius:3px; margin-right:6px; font-size:0.6rem; font-family:var(--font-mono);">${providerLabel}</span>
        ${font.style} · ${font.mood} · ${font.useCase}
      </p>
      <div class="card-footer">
        <span class="card-status">
          <span class="status-dot ${statusDotClass}"></span>
          ${statusText}
        </span>
        <button class="card-btn" data-id="${font.id}">
          ${btnLabel}
        </button>
      </div>
    </div>
  `;
  
  // Card clicks open details panel
  card.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    openDetailPanel(font);
  });
  
  // Action button clicks
  card.querySelector(".card-btn").addEventListener("click", () => {
    openDetailPanel(font);
  });
  
  elements.fontGrid.appendChild(card);
}

// --- INFINITE SCROLL STATE ---
let isLoadingMore = false;
let infiniteScrollCounter = 0;

// --- RENDER GRID ---
function renderGrid() {
  elements.fontGrid.innerHTML = "";
  infiniteScrollCounter = 0;
  
  const filteredFonts = getFilteredFonts();
  
  if (filteredFonts.length === 0) {
    elements.fontGrid.innerHTML = `
      <div style="grid-column: span 3; text-align: center; padding: 4rem 1rem; color: #777; width: 100%;">
        <p style="font-size: var(--ts-lg); font-family: var(--font-display);">No fonts matched your search.</p>
        <span style="font-size: var(--ts-sm); cursor: pointer; text-decoration: underline; margin-top: 1rem; display: inline-block;" onclick="clearAllFilters()">Clear all filters</span>
      </div>
    `;
    return;
  }
  
  // Render initial list (up to 9 items for faster load)
  const initialBatch = filteredFonts.slice(0, 9);
  initialBatch.forEach(font => appendFontCard(font));
  infiniteScrollCounter = initialBatch.length;
}

// --- LOAD MORE FONTS (INFINITE SCROLL) ---
function loadMoreFonts() {
  if (isLoadingMore) return;
  
  const filteredFonts = getFilteredFonts();
  if (filteredFonts.length === 0) return;
  
  isLoadingMore = true;
  
  setTimeout(() => {
    for (let i = 0; i < 6; i++) {
      const idx = (infiniteScrollCounter + i) % filteredFonts.length;
      const baseFont = filteredFonts[idx];
      
      const variantSuffix = ["Condensed", "Wide", "Pro", "Display", "Text", "Variable", "SemiBold", "UltraBold", "Micro"][Math.floor((infiniteScrollCounter + i) / filteredFonts.length) % 9];
      
      const infiniteFontInstance = {
        ...baseFont,
        id: `${baseFont.id}-inf-${infiniteScrollCounter}`,
        name: `${baseFont.name} ${variantSuffix}`
      };
      
      appendFontCard(infiniteFontInstance);
    }
    
    infiniteScrollCounter += 6;
    isLoadingMore = false;
  }, 250);
}

// --- OPEN DETAIL SHEET/PANEL ---
function openDetailPanel(font) {
  selectedFont = font;
  loadExternalFont(font);
  
  elements.detailTitle.textContent = font.name;
  
  // Set specimen preview style
  const targetFamily = font.cssFamily || `'${font.name}'`;
  elements.specimenDisplay.style.fontFamily = `${targetFamily}, serif`;
  
  elements.specimenInput.value = "";
  elements.specimenDisplay.textContent = "The quick brown fox jumps over the lazy dog.";
  
  elements.infoDesigner.textContent = font.designer;
  elements.infoFoundry.textContent = font.foundry;
  elements.infoYear.textContent = font.year;
  elements.infoStyles.textContent = `${font.stylesCount} Styles`;
  elements.infoLanguages.textContent = font.languages.join(", ");
  elements.infoDescription.textContent = font.description;
  
  elements.stylesVariantList.innerHTML = "";
  const weights = [
    { label: "Light 300", weight: 300 },
    { label: "Regular 400", weight: 400 },
    { label: "Medium 500", weight: 500 },
    { label: "Bold 700", weight: 700 }
  ];
  weights.forEach(w => {
    const item = document.createElement("div");
    item.style.borderBottom = "1px solid var(--border-grey)";
    item.style.paddingBottom = "0.8rem";
    item.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.65rem; color:#888; margin-bottom:0.2rem;">${w.label}</div>
      <div style="font-family: ${targetFamily}; font-weight: ${w.weight}; font-size: 1.8rem; word-break: break-word;">
        Agile specimen lines.
      </div>
    `;
    elements.stylesVariantList.appendChild(item);
  });
  
  elements.licenseBadgePill.textContent = font.availability.toUpperCase();
  elements.licenseBadgePill.className = `badge-license ${getBadgeClass(font.availability)}`;
  
  let sourceUrlLabel = "Google Fonts";
  if (font.provider === "fontshare") sourceUrlLabel = "Fontshare";
  else if (font.provider === "dafont") sourceUrlLabel = "Dafont";
  
  if (font.availability === "Free") {
    elements.licenseDescription.textContent = `Open Source License. This font is available for commercial & personal projects alike without any licensing fee, hosted on ${sourceUrlLabel}.`;
  } else if (font.availability === "Free for Personal") {
    elements.licenseDescription.textContent = `Free for Personal Use. You may use this font for design exploration, personal projects, or mockups. Sourced from ${sourceUrlLabel}. Commercial use requires purchasing a license.`;
  } else {
    elements.licenseDescription.textContent = `Commercial licensing required. Purchase or request access through the foundry or official vendor at ${sourceUrlLabel}.`;
  }
  
  elements.designerProfileName.textContent = font.designer;
  elements.designerBio.textContent = `${font.designer} is a typographer who publishes designs on ${sourceUrlLabel}. They work to build expressive and functional glyph sets for global communication design.`;
  
  elements.ctaPriceDisplay.textContent = font.availability === "Free" || font.availability === "Free for Personal" ? 
    "Free Download" : `License starting from ${font.price}`;
    
  if (font.availability === "Free" || font.availability === "Free for Personal") {
    elements.detailPrimaryCta.textContent = `⬇ Download from ${sourceUrlLabel}`;
    elements.detailPrimaryCta.style.backgroundColor = "var(--near-black)";
    elements.detailPrimaryCta.style.color = "var(--pure-white)";
  } else {
    elements.detailPrimaryCta.textContent = `🛒 Buy from ${font.foundry}`;
    elements.detailPrimaryCta.style.backgroundColor = "var(--signal-red)";
    elements.detailPrimaryCta.style.color = "var(--pure-white)";
  }
  
  elements.downloadTooltip.classList.remove("active");
  
  elements.detailOverlay.classList.add("active");
  elements.detailPanel.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDetailPanel() {
  elements.detailOverlay.classList.remove("active");
  elements.detailPanel.classList.remove("active");
  document.body.style.overflow = "";
}

function handleDownloadClick() {
  if (!selectedFont) return;
  
  let sourceName = "Google Fonts";
  if (selectedFont.provider === "fontshare") sourceName = "Fontshare";
  else if (selectedFont.provider === "dafont") sourceName = "Dafont";
  
  elements.downloadTooltip.textContent = `Redirecting to official ${sourceName} download page for "${selectedFont.name}"`;
  elements.downloadTooltip.classList.add("active");
  
  setTimeout(() => {
    const prevText = elements.detailPrimaryCta.textContent;
    elements.detailPrimaryCta.textContent = "✓ Redirecting...";
    elements.detailPrimaryCta.style.backgroundColor = "#00C853";
    
    setTimeout(() => {
      elements.detailPrimaryCta.textContent = prevText;
      elements.detailPrimaryCta.style.backgroundColor = "var(--near-black)";
      
      window.open(selectedFont.downloadUrl, '_blank');
      closeDetailPanel();
    }, 1000);
  }, 800);
}

// --- SETUP EVENT LISTENERS ---
function setupEventListeners() {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      elements.detailPanel.classList.add("collapsed");
      document.getElementById("navbar").classList.add("collapsed");
    } else {
      document.getElementById("navbar").classList.remove("collapsed");
    }

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 800) {
      loadMoreFonts();
    }
  });

  elements.searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderGrid();
  });
  
  elements.browseBtn.addEventListener("click", () => {
    elements.searchInput.focus();
    elements.searchInput.scrollIntoView({ behavior: 'smooth' });
  });
  
  elements.freeDownloadsBtn.addEventListener("click", () => {
    handleFilterClick("Availability", "Free");
    elements.searchInput.scrollIntoView({ behavior: 'smooth' });
  });
  
  elements.scrollArrow.addEventListener("click", () => {
    document.getElementById("filter-wrapper").scrollIntoView({ behavior: 'smooth' });
  });
  
  elements.clearFiltersBtn.addEventListener("click", clearAllFilters);
  
  elements.closePanelBtn.addEventListener("click", closeDetailPanel);
  elements.detailOverlay.addEventListener("click", closeDetailPanel);
  
  elements.specimenInput.addEventListener("input", (e) => {
    const text = e.target.value.trim() || "The quick brown fox jumps over the lazy dog.";
    elements.specimenDisplay.textContent = text;
  });
  
  elements.specimenDisplay.addEventListener("blur", (e) => {
    if (!e.target.textContent.trim()) {
      e.target.textContent = "The quick brown fox jumps over the lazy dog.";
    }
  });
  
  elements.sizeSlider.addEventListener("input", (e) => {
    const size = e.target.value;
    elements.sizeDisplay.textContent = `${size}px`;
    elements.specimenDisplay.style.fontSize = `${size}px`;
  });
  
  elements.tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      elements.tabBtns.forEach(b => b.classList.remove("active"));
      elements.tabContents.forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.getElementById(`tab-${targetTab}`).classList.add("active");
    });
  });
  
  elements.detailPrimaryCta.addEventListener("click", handleDownloadClick);
  
  document.querySelectorAll(".collection-card").forEach(card => {
    card.addEventListener("click", () => {
      const filterData = card.getAttribute("data-filter");
      const [group, value] = filterData.split(":");
      clearAllFilters();
      handleFilterClick(group, value);
      document.getElementById("filter-wrapper").scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  document.getElementById("footer-browse-link").addEventListener("click", (e) => {
    e.preventDefault();
    clearAllFilters();
    elements.searchInput.scrollIntoView({ behavior: 'smooth' });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elements.detailPanel.classList.contains("active")) {
      closeDetailPanel();
    }
  });
}

// Start application
init();
