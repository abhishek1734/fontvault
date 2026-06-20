// --- GOOGLE FONTS DATABASE ---
const fontsData = [
  {
    id: "instrument-serif",
    name: "Instrument Serif",
    designer: "Jordan Bell",
    foundry: "Instrument",
    year: "2023",
    stylesCount: 4,
    languages: ["Latin", "Latin Extended"],
    description: "Instrument Serif is a elegant, high-contrast serif typeface designed for headlines and brand presentation. It draws inspiration from early 20th-century metal type, displaying soft curves and sharp counters that evoke luxury and editorial precision.",
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
    designer: "Bonjour Monde",
    foundry: "Synesthesia",
    year: "2017",
    stylesCount: 5,
    languages: ["Latin"],
    description: "Syne was originally designed for an art center in France. It features unique wide, expressive letterforms in its heavier weights (extra bold/italic) while remaining clean and architectural in its regular weights. Perfect for posters and branding.",
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
    designer: "Claus Eggers Sørensen",
    foundry: "Claus Sørensen",
    year: "2011",
    stylesCount: 6,
    languages: ["Latin", "Cyrillic"],
    description: "Playfair Display is a transitional serif typeface. Influenced by printer John Baskerville's style and the emergence of thin steel pens, it features elegant high-contrast strokes that work beautifully in titles, invitations, and high-fashion editorial.",
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
    designer: "Florian Karsten",
    foundry: "FK Foundry",
    year: "2018",
    stylesCount: 5,
    languages: ["Latin", "Latin Extended"],
    description: "Space Grotesk is a proportional sans-serif typeface based on Space Mono (designed by Colophon Foundry). It maintains the technical and quirky characteristics of the monospaced parent while optimizing readability for body copy and titles.",
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
    designer: "Ryoichi Tsunekawa",
    foundry: "Dharma Type",
    year: "2010",
    stylesCount: 5,
    languages: ["Latin", "Cyrillic"],
    description: "Bebas Neue is a highly popular display sans-serif typeface based on the original Bebas free font. It is characterised by its clean lines, condensed cap-height, and bold, punchy presence suitable for headings, captions, and posters.",
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
    designer: "Natanael Gama",
    foundry: "N Gama",
    year: "2012",
    stylesCount: 6,
    languages: ["Latin"],
    description: "Cinzel is a typeface inspired by first-century Roman inscriptions. It follows classical proportions while incorporating a contemporary flare. Cinzel is perfect for fantasy titles, premium packaging, luxury labels, and historical displays.",
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
    designer: "Christian Thalmann",
    foundry: "Catharsis",
    year: "2015",
    stylesCount: 10,
    languages: ["Latin", "Cyrillic"],
    description: "Cormorant Garamond is a large, high-fidelity Garamond family designed for large display use. It is a stunning tribute to Claude Garamont's classic type designs, featuring ultra-thin serifs and elegant curves.",
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
    id: "cabinet-grotesk",
    name: "Cabinet Grotesk",
    designer: "Indian Type Foundry",
    foundry: "ITF",
    year: "2021",
    stylesCount: 8,
    languages: ["Latin"],
    description: "Cabinet Grotesk is a premium sans-serif family designed specifically for branding, digital UI, and high-impact identity headers. It shifts between architectural geometry and elegant curves, creating high brand value.",
    availability: "Premium",
    mood: "Modern",
    useCase: "Branding",
    style: "Sans-Serif",
    language: "Latin",
    downloadUrl: "https://fontshare.com/fonts/cabinet-grotesk",
    price: "$29",
    mockupType: "branding",
    mockupTitle: "STUDIO",
    mockupSubtitle: "Creative Consultancy & Partner",
    fileSize: "3.2 MB"
  },
  {
    id: "outfit",
    name: "Outfit",
    designer: "Outfit Foundry",
    foundry: "Outfit",
    year: "2021",
    stylesCount: 9,
    languages: ["Latin"],
    description: "Outfit is a playful, clean, geometric sans-serif font family. It is optimized for web screens, mobile UI products, and smart device applications. Its friendly shapes make it a modern classic.",
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
  }
];

// --- DYNAMIC GOOGLE FONTS LOADER ---
function loadGoogleFont(fontName) {
  const formattedName = fontName.replace(/\s+/g, '+');
  const linkId = `gfont-${formattedName}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500&display=swap`;
    document.head.appendChild(link);
  }
}

// --- PRE-LOAD POPULAR FONTS FOR HERO & CARDS ---
fontsData.forEach(font => {
  if (font.availability === "Free" || font.availability === "Free for Personal") {
    loadGoogleFont(font.name);
  }
});

// --- FILTER CONFIGURATION ---
const filterGroups = {
  "Availability": ["All", "Free", "Free for Personal", "Premium"],
  "Style": ["Serif", "Sans-Serif", "Display", "Monospace"],
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
    // Toggle active state
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
// Generates clean styled inline typographic mockups based on the font style
function getMockupHTML(font) {
  const fontNameSafe = font.name;
  let customStyle = "";
  
  // Ensure the custom font style is loaded dynamically
  loadGoogleFont(font.name);
  
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
        <div style="font-family: '${fontNameSafe}', serif; font-size: 2.2rem; font-style: italic; line-height: 1; text-align: center;">${font.mockupTitle}</div>
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
        <div style="font-family: '${fontNameSafe}', sans-serif; font-size: 1.2rem; font-weight: 600; line-height: 1.3; margin: 1rem 0;">
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
        <div style="font-family: '${fontNameSafe}', monospace; font-size: 0.85rem; line-height: 1.5; color: #E0E0E0;">
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
        <div style="font-family: '${fontNameSafe}', sans-serif; font-size: 2.8rem; font-weight: 700; line-height: 0.95; letter-spacing: -0.04em;">${font.mockupTitle}</div>
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
        <div style="font-family: '${fontNameSafe}', sans-serif; font-size: 2.5rem; font-weight: 800; line-height: 0.85; letter-spacing: -0.02em;">${font.mockupTitle}</div>
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
        <div style="font-family: '${fontNameSafe}', serif; font-size: 1.4rem; font-style: italic; text-align: center; margin-bottom: 0.4rem;">${font.mockupTitle}</div>
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
        <div style="font-family: '${fontNameSafe}', sans-serif; font-size: 3.2rem; line-height: 0.9; font-weight: 900; text-align: center; letter-spacing: -0.02em;">${font.mockupTitle}</div>
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
        <div style="font-family: '${fontNameSafe}', serif; font-size: 1.8rem; font-weight: 300; letter-spacing: 0.3em; margin-bottom: 0.5rem; text-align: center;">${font.mockupTitle}</div>
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
        <div style="font-family: '${fontNameSafe}', serif; font-size: 1.5rem; line-height: 1.1; margin-bottom: 1rem; max-width: 80%;">${font.mockupTitle}</div>
        <div style="font-family: var(--font-body); font-size: 0.6rem; color: #888;">${font.mockupSubtitle}</div>
      </div>
    `;
  }

  // Fallback
  return `
    <div class="card-mockup" style="background-color:#FFF; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #E0E0E0;">
      <span class="badge-availability ${getBadgeClass(font.availability)}">${font.availability}</span>
      <div style="font-family:'${fontNameSafe}'; font-size:2rem;">${font.name}</div>
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
  
  const card = document.createElement("div");
  card.className = "font-card";
  card.setAttribute("aria-label", `${font.name}, ${font.style}, ${font.availability}`);
  card.innerHTML = `
    ${getMockupHTML(font)}
    <div class="card-info">
      <h3 class="card-font-name" style="font-family: '${font.name}', var(--font-display);">${font.name}</h3>
      <p class="card-tags">${font.style} · ${font.mood} · ${font.useCase}</p>
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
  
  // Add a slight delay to simulate loading feel
  setTimeout(() => {
    for (let i = 0; i < 6; i++) {
      const idx = (infiniteScrollCounter + i) % filteredFonts.length;
      const baseFont = filteredFonts[idx];
      
      // Select a family name extension to differentiate repeated scroll entries
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
  loadGoogleFont(font.name);
  
  elements.detailTitle.textContent = font.name;
  
  // Set specimen preview style
  elements.specimenDisplay.style.fontFamily = `'${font.name}', serif`;
  
  // Reset custom text preview input
  elements.specimenInput.value = "";
  elements.specimenDisplay.textContent = "The quick brown fox jumps over the lazy dog.";
  
  // Setup Meta Info Tabs
  elements.infoDesigner.textContent = font.designer;
  elements.infoFoundry.textContent = font.foundry;
  elements.infoYear.textContent = font.year;
  elements.infoStyles.textContent = `${font.stylesCount} Styles`;
  elements.infoLanguages.textContent = font.languages.join(", ");
  elements.infoDescription.textContent = font.description;
  
  // Style tab variants list
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
      <div style="font-family: '${font.name}'; font-weight: ${w.weight}; font-size: 1.8rem; word-break: break-word;">
        Agile specimen lines.
      </div>
    `;
    elements.stylesVariantList.appendChild(item);
  });
  
  // License text setup
  elements.licenseBadgePill.textContent = font.availability.toUpperCase();
  elements.licenseBadgePill.className = `badge-license ${getBadgeClass(font.availability)}`;
  
  if (font.availability === "Free") {
    elements.licenseDescription.textContent = "Open Source License. This font is available for commercial & personal projects alike without any licensing fee.";
  } else if (font.availability === "Free for Personal") {
    elements.licenseDescription.textContent = "Free for Personal Use. You may use this font for design exploration, personal projects, or mockups. Commercial use requires licensing.";
  } else {
    elements.licenseDescription.textContent = "Commercial licensing required. Purchase or request access through the foundry or digital distribution service.";
  }
  
  // Designer tab setup
  elements.designerProfileName.textContent = font.designer;
  elements.designerBio.textContent = `${font.designer} is an acclaimed type designer known for their precise geometries and artistic layouts. They work collaboratively with global foundries to push type boundaries.`;
  
  // Bottom CTAs
  elements.ctaPriceDisplay.textContent = font.availability === "Free" || font.availability === "Free for Personal" ? 
    "Free Download" : `License starting from ${font.price}`;
    
  if (font.availability === "Free" || font.availability === "Free for Personal") {
    elements.detailPrimaryCta.textContent = "⬇ Download Free";
    elements.detailPrimaryCta.style.backgroundColor = "var(--near-black)";
    elements.detailPrimaryCta.style.color = "var(--pure-white)";
  } else {
    elements.detailPrimaryCta.textContent = `🛒 Buy from ${font.foundry}`;
    elements.detailPrimaryCta.style.backgroundColor = "var(--signal-red)";
    elements.detailPrimaryCta.style.color = "var(--pure-white)";
  }
  
  // Reset tooltip
  elements.downloadTooltip.classList.remove("active");
  
  // Show drawer/overlay
  elements.detailOverlay.classList.add("active");
  elements.detailPanel.classList.add("active");
  document.body.style.overflow = "hidden"; // disable background scroll
}

// --- CLOSE DETAIL SHEET/PANEL ---
function closeDetailPanel() {
  elements.detailOverlay.classList.remove("active");
  elements.detailPanel.classList.remove("active");
  document.body.style.overflow = ""; // enable background scroll
}

// --- TRIGGER DOWNLOAD SEQ ---
function handleDownloadClick() {
  if (!selectedFont) return;
  
  // If paid, redirect to purchase site directly
  if (selectedFont.availability === "Premium" || selectedFont.availability === "Paid") {
    window.open(selectedFont.downloadUrl, '_blank');
    return;
  }
  
  // Confirmation Tooltip
  elements.downloadTooltip.textContent = `This will download ${selectedFont.name.replace(/\s+/g, '_')}.zip (${selectedFont.fileSize || '1.5 MB'})`;
  elements.downloadTooltip.classList.add("active");
  
  // Perform download step with delay
  setTimeout(() => {
    // Show success state on button
    const prevText = elements.detailPrimaryCta.textContent;
    elements.detailPrimaryCta.textContent = "✓ Downloading...";
    elements.detailPrimaryCta.style.backgroundColor = "#00C853";
    
    setTimeout(() => {
      // Restore CTA
      elements.detailPrimaryCta.textContent = prevText;
      elements.detailPrimaryCta.style.backgroundColor = "var(--near-black)";
      
      // Trigger actual download page redirection
      window.open(selectedFont.downloadUrl, '_blank');
      closeDetailPanel();
    }, 1200);
  }, 1000);
}

// --- SETUP EVENT LISTENERS ---
function setupEventListeners() {
  // Navigation scrolling collapse & Infinite scroll trigger
  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      elements.detailPanel.classList.add("collapsed"); // reduce gap
      document.getElementById("navbar").classList.add("collapsed");
    } else {
      document.getElementById("navbar").classList.remove("collapsed");
    }

    // Check if scrolled near bottom for infinite scroll trigger
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 800) {
      loadMoreFonts();
    }
  });

  // Search input query
  elements.searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderGrid();
  });
  
  // Browse Buttons & Arrow Clicks
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
  
  // Detail Panel close
  elements.closePanelBtn.addEventListener("click", closeDetailPanel);
  elements.detailOverlay.addEventListener("click", closeDetailPanel);
  
  // Custom type preview input
  elements.specimenInput.addEventListener("input", (e) => {
    const text = e.target.value.trim() || "The quick brown fox jumps over the lazy dog.";
    elements.specimenDisplay.textContent = text;
  });
  
  // Custom typography live typing area
  elements.specimenDisplay.addEventListener("blur", (e) => {
    if (!e.target.textContent.trim()) {
      e.target.textContent = "The quick brown fox jumps over the lazy dog.";
    }
  });
  
  // Font Size Slider
  elements.sizeSlider.addEventListener("input", (e) => {
    const size = e.target.value;
    elements.sizeDisplay.textContent = `${size}px`;
    elements.specimenDisplay.style.fontSize = `${size}px`;
  });
  
  // Detail Tab clicks
  elements.tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active from all btns & contents
      elements.tabBtns.forEach(b => b.classList.remove("active"));
      elements.tabContents.forEach(c => c.classList.remove("active"));
      
      // Add active to current
      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.getElementById(`tab-${targetTab}`).classList.add("active");
    });
  });
  
  // Primary CTA click (Download/Buy)
  elements.detailPrimaryCta.addEventListener("click", handleDownloadClick);
  
  // Curated Collections clicking
  document.querySelectorAll(".collection-card").forEach(card => {
    card.addEventListener("click", () => {
      const filterData = card.getAttribute("data-filter");
      const [group, value] = filterData.split(":");
      clearAllFilters();
      handleFilterClick(group, value);
      document.getElementById("filter-wrapper").scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // Footer browse links
  document.getElementById("footer-browse-link").addEventListener("click", (e) => {
    e.preventDefault();
    clearAllFilters();
    elements.searchInput.scrollIntoView({ behavior: 'smooth' });
  });

  // Keyboard accessibility
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elements.detailPanel.classList.contains("active")) {
      closeDetailPanel();
    }
  });
}

// Start application
init();
