// =============================================================
//  FONTVAULT — app.js  (50+ fonts, dark mode, compare, pairings)
// =============================================================

// --- CURATED MULTI-PROVIDER DATABASE ---

// ─────────────────────────────────────────────────
//  TRENDING font IDs (shown in the top strip)
// ─────────────────────────────────────────────────
const trendingFontIds = [
  "instrument-serif", "satoshi", "clash-display", "switzer", "boska", 
  "bebas-neue", "tanker", "zodiak", "roboto", "open-sans", "lato", 
  "montserrat", "oswald", "source-sans-pro", "raleway", "ubuntu", 
  "playfair-display", "merriweather", "nunito", "rubik", "work-sans"
];

// Pre-load all fonts
fontsData.forEach(f => loadExternalFont(f));

// ─────────────────────────────────────────────────
//  FILTER CONFIG & STATE
// ─────────────────────────────────────────────────
const filterGroups = {
  "Provider":     ["All Providers","Google Fonts","Fontshare","Dafont"],
  "Availability": ["All","Free","Free for Personal","Premium","Custom"],
  "Style":        ["Serif","Sans-Serif","Display","Monospace","Script"],
  "Mood":         ["Elegant","Minimal","Vintage","Bold","Playful","Formal","Modern"],
  "Use Case":     ["Editorial","UI","Poster","Web","Packaging","Branding"]
};

let activeFilters = {
  "Provider":     "All Providers",
  "Availability": "All",
  "Style":        null,
  "Mood":         null,
  "Use Case":     null,
  "Favorites":    false
};

window.searchQuery = "";
let globalPreviewText = "";
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
    const groupEl = document.createElement("details");
    groupEl.className = "filter-group";
    groupEl.open = true; // Open by default
    
    const titleEl = document.createElement("summary");
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
  activeFilters = { "Provider":"All Providers","Availability":"All","Style":null,"Mood":null,"Use Case":null, "Favorites": false };
  window.searchQuery = "";
  el.searchInput.value = "";
  updateClearButtonVisibility();
  setupFilters();
  renderGrid();
}

// ─────────────────────────────────────────────────
//  MOCKUP HTML
// ─────────────────────────────────────────────────
function getMockupHTML(font) {
  loadExternalFont(font);
  const fam = font.cssFamily || `'${font.name}'`;
  const titleText = globalPreviewText || font.name;
  const designerText = font.designer || font.foundry || 'Independent';

  // Deterministic hues based on font ID for the holographic glow
  let hash = 0;
  for (let i = 0; i < font.id.length; i++) hash = font.id.charCodeAt(i) + ((hash << 5) - hash);
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 120) % 360;

  return `
    <div class="card-mockup" style="position:relative; display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2rem; overflow:hidden; min-height:220px; border-bottom:1px solid var(--border-grey); width:100%; max-width:100%; box-sizing:border-box;">
      
      <!-- Holographic Glows -->
      <div class="glow-orb" style="position:absolute; top:-30%; left:-10%; width:80%; height:80%; background: radial-gradient(circle, hsl(${hue1}, 100%, 75%) 0%, transparent 70%); opacity: 0.5; filter: blur(30px); z-index: 0;"></div>
      <div class="glow-orb" style="position:absolute; bottom:-30%; right:-10%; width:80%; height:80%; background: radial-gradient(circle, hsl(${hue2}, 100%, 75%) 0%, transparent 70%); opacity: 0.5; filter: blur(30px); z-index: 0;"></div>
      
      <!-- Futuristic Grid/Dots -->
      <div style="position:absolute; inset:0; background-image: radial-gradient(rgba(128,128,128,0.2) 1px, transparent 1px); background-size: 15px 15px; z-index: 0;"></div>

      <!-- Glassmorphic Plate -->
      <div class="futuristic-glass" style="position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; max-width:100%; box-sizing:border-box; padding:1.5rem 1rem; overflow:hidden;">
        
        <!-- Tech Corner Accents -->
        <div class="tech-corner" style="top: 10px; left: 10px; border-top-width: 2px; border-left-width: 2px;"></div>
        <div class="tech-corner" style="top: 10px; right: 10px; border-top-width: 2px; border-right-width: 2px;"></div>
        <div class="tech-corner" style="bottom: 10px; left: 10px; border-bottom-width: 2px; border-left-width: 2px;"></div>
        <div class="tech-corner" style="bottom: 10px; right: 10px; border-bottom-width: 2px; border-right-width: 2px;"></div>
        
        <div class="mockup-preview-text futuristic-text" style="font-family:${fam},sans-serif; font-size:clamp(1.4rem,5vw,2.6rem); line-height:1.1; text-align:center; z-index:3; max-width:100%; overflow:hidden; word-break:break-word;">
          ${titleText}
        </div>
        
        <div class="futuristic-designer" style="font-family:var(--font-mono); font-size:0.7rem; margin-top:1.2rem; letter-spacing:0.2em; text-transform:uppercase; font-weight:700; z-index:3; padding: 4px 10px; border-radius: 20px;">
          <span style="opacity:0.4; margin-right:4px;">SYS.</span>${designerText}
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────
//  FILTERING
// ─────────────────────────────────────────────────
function getFilteredFonts() {
  const filtered = fontsData.filter(font => {
    if (activeFilters["Favorites"] && !window.favoritesSet.has(font.id)) return false;
    if (window.searchQuery) {
      const q = window.searchQuery.toLowerCase();
      const match = [font.name, font.designer, font.foundry, font.style, font.provider, font.mood, font.useCase]
        .some(v => v && v.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (activeFilters["Provider"] !== "All Providers") {
      const provMap = {"Google Fonts":"google","Fontshare":"fontshare","Dafont":"dafont"};
      if (font.provider !== provMap[activeFilters["Provider"]]) return false;
    }
    if (activeFilters["Availability"] !== "All") {
      if (activeFilters["Availability"] === "Custom") {
        if (font.provider !== "custom") return false;
      } else {
        if (font.availability !== activeFilters["Availability"]) return false;
      }
    }
    if (activeFilters["Style"] && font.style !== activeFilters["Style"]) return false;
    if (activeFilters["Mood"] && font.mood !== activeFilters["Mood"]) return false;
    if (activeFilters["Use Case"] && font.useCase !== activeFilters["Use Case"]) return false;
    return true;
  });

  return filtered;
}

// ─────────────────────────────────────────────────
//  FONT CARD & SCROLL ANIMATION
// ─────────────────────────────────────────────────
const cardObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { root: null, rootMargin: '50px', threshold: 0.1 });

function appendFontCard(font, delay, index) {
  const providerLabel = { google:"GOOGLE FONTS", fontshare:"FONTSHARE", dafont:"DAFONT" }[font.provider] || font.provider.toUpperCase();
  const isInCompare = compareSet.has(font.id);

  const card = document.createElement("div");
  card.className = "font-card";
  card.setAttribute("aria-label", `${font.name}, ${font.style}, ${font.availability}`);
  card.style.animationDelay = `${delay * 0.04}s`;

  loadExternalFont(font);
  const fam = font.cssFamily || `'${font.name}'`;
  const titleText = globalPreviewText || font.name;
  const inFavorites = window.favoritesSet.has(font.id);
  const currentGlobalSize = document.getElementById("font-size-slider")?.value || 120;
  const rankStr = `No. ${String(index || 1).padStart(3, '0')}`;

  card.innerHTML = `
    <!-- GRID VIEW SPECIFIC HEADER (Shown only in grid layout active) -->
    <div class="grid-card-header" style="display: none; justify-content: space-between; align-items: center; width: 100%;">
      <span class="grid-card-rank" style="font-family: var(--font-mono); font-size: 11px; font-weight: 500; color: var(--text-secondary); opacity: 0.6; letter-spacing: 0.08em;">${rankStr}</span>
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="grid-card-badge ${font.availability.toLowerCase().includes('free') ? 'free' : ''}" style="font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 8px; border-radius: 20px; border: 0.5px solid var(--trending-tag-border); background: var(--trending-tag-bg); color: var(--text-secondary);">${font.availability}</span>
        <button class="favorite-add-btn ${inFavorites ? 'active' : ''}" title="${inFavorites ? 'Remove from Vault' : 'Save to Vault'}" data-id="${font.id}" onclick="event.stopPropagation(); toggleFavorite('${font.id}', this)" style="background:none; border:none; cursor:pointer; color:${inFavorites ? 'var(--signal-red)' : 'var(--text-secondary)'}; padding:0; display:flex; align-items:center; transition: color 0.2s;">
          <svg class="heart-icon" width="14" height="14" viewBox="0 0 24 24" fill="${inFavorites ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Top Row: Name and Meta (List View) -->
    <div class="card-header-row">
      <span class="font-name-label" style="font-family:${fam},var(--font-display); font-size:1.2rem; opacity: 1; text-transform: none; letter-spacing: normal;">${font.name}</span>
      <div class="card-meta-right">
        <!-- Card-specific size slider -->
        <div class="card-size-slider-wrap" style="display: flex; align-items: center; gap: 0.4rem; margin-right: 1.2rem; font-family: var(--font-mono); font-size: 0.65rem;" onclick="event.stopPropagation();">
          <span style="opacity: 0.6;">SIZE</span>
          <input type="range" class="card-size-slider" min="20" max="200" value="${currentGlobalSize}" style="width: 60px; cursor: pointer; height: 3px; accent-color: var(--signal-red);" oninput="updateCardFontSize(this, '${font.id}')">
          <div style="display: flex; align-items: center; gap: 0.15rem;">
            <input type="number" class="card-size-input" value="${currentGlobalSize}" min="20" max="200" style="width: 30px; background: transparent; border: none; border-bottom: 1px dashed var(--border-grey); color: inherit; font-family: var(--font-mono); font-size: 0.65rem; text-align: right;" oninput="updateCardFontSizeFromInput(this, '${font.id}')" onblur="finalizeCardFontSizeFromInput(this, '${font.id}')" onchange="finalizeCardFontSizeFromInput(this, '${font.id}')">
            <span style="opacity: 0.6;">px</span>
            <span class="card-size-reset size-reset-btn" style="margin-left: 0.3rem; display: none;" onclick="resetCardFontSize(this, '${font.id}')">Reset</span>
          </div>
        </div>
        <span class="meta-item">${font.stylesCount || 1} Style${(font.stylesCount || 1) > 1 ? 's' : ''}</span>
        <span class="meta-item">${font.variants ? 'Variable' : 'Static'}</span>
        <span class="meta-item">${font.availability}</span>
        
        <button class="favorite-add-btn ${inFavorites ? 'active' : ''}" title="${inFavorites ? 'Remove from Vault' : 'Save to Vault'}" data-id="${font.id}" onclick="event.stopPropagation(); toggleFavorite('${font.id}', this)" style="background:none; border:none; cursor:pointer; color:${inFavorites ? 'var(--signal-red)' : 'var(--text-secondary)'}; padding:0; display:flex; align-items:center;">
          <svg class="heart-icon" width="16" height="16" viewBox="0 0 24 24" fill="${inFavorites ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button class="compare-add-btn ${isInCompare ? 'in-compare' : ''}" title="${isInCompare ? 'Remove from compare' : 'Add to compare'}" data-id="${font.id}">
          ${isInCompare ? '✕ COMPARE' : '+ COMPARE'}
        </button>
      </div>
    </div>

    <!-- Center Row: Huge Preview Text -->
    <div class="card-body-row">
      <div class="huge-preview-text" contenteditable="false" spellcheck="false" data-font-name="${font.name.replace(/"/g,'&quot;')}" style="font-family:${fam},sans-serif;">
        ${titleText}
      </div>
    </div>

    <!-- Bottom Row: Foundry and View Family (List View) -->
    <div class="card-footer-row">
      <span class="foundry-label">by ${font.foundry || font.designer || 'Independent'} &middot; <span style="opacity:0.6;font-family:var(--font-mono);">${providerLabel}</span></span>
      <div class="card-footer-right" style="display:flex; align-items:center; gap:1rem;">
        ${(font.provider === 'custom' && font.id.startsWith('preview-')) ? `
          <button class="custom-font-delete-btn" title="Remove preview font" onclick="event.stopPropagation(); removeCustomFont('${font.id}')" style="background:none; border:none; cursor:pointer; color:var(--signal-red); font-family:var(--font-mono); font-size:10px; font-weight:700;">
            ✕ REMOVE PREVIEW
          </button>
        ` : ''}
        ${(font.downloadUrl && font.downloadUrl !== '#') ? `
          <button
            class="card-download-btn"
            id="dl-btn-${font.id}"
            title="Download ${font.name}"
            onclick="event.stopPropagation(); downloadFont('${font.id}', '${font.downloadUrl}', '${font.name}', '${font.format || 'woff2'}')"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;flex-shrink:0;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span class="dl-count" id="dl-count-${font.id}">${font.downloadCount > 0 ? formatDownloadCount(font.downloadCount) : 'DOWNLOAD'}</span>
          </button>
        ` : ''}
        <a class="view-family-hover-btn" href="/fonts/${font.id}" target="_blank">
          VIEW FAMILY
        </a>
      </div>
    </div>

    <!-- GRID VIEW SPECIFIC FOOTER (Shown only in grid layout active) -->
    <div class="grid-card-footer" style="display: none; width: 100%; flex-direction: column; gap: 4px;">
      <p class="grid-card-name" style="font-family:${fam},var(--font-display); font-size: 14px; font-weight: 600; color: var(--near-black); margin-bottom: 2px;">${font.name}</p>
      <p class="grid-card-foundry" style="font-size: 11px; color: var(--text-secondary); opacity: 0.7; margin-bottom: 10px;">by ${font.foundry || font.designer || 'Independent'}</p>
      <div class="grid-card-tags-row" style="display: flex; gap: 5px; flex-wrap: wrap;">
        ${(font.tags || []).map(t => `<span class="grid-card-tag" style="font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; color: var(--text-secondary); opacity: 0.75; background: var(--trending-tag-bg); border: 0.5px solid var(--trending-tag-border); padding: 2px 8px; border-radius: 20px; letter-spacing: 0.04em;">${t}</span>`).join('')}
      </div>
    </div>
  `;

  // Compare add/remove button
  card.querySelector(".compare-add-btn").addEventListener("click", e => {
    e.stopPropagation();
    toggleCompare(font.id);
  });

  // Prevent click propagation on View Family hover button
  const viewFamilyBtn = card.querySelector(".view-family-hover-btn");
  if (viewFamilyBtn) {
    viewFamilyBtn.addEventListener("click", e => {
      e.stopPropagation();
    });
  }

  // Navigation on card click when in grid view
  card.addEventListener("click", e => {
    const grid = document.getElementById("font-grid");
    if (grid && grid.classList.contains("layout-grid-active")) {
      // Don't trigger navigation if user clicked inside form controls or buttons
      if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a") || e.target.closest("[contenteditable]")) {
        return;
      }
      openDetailPanel(font);
    }
  });

  // Inline editing on card preview text
  const previewTextEl = card.querySelector(".huge-preview-text");
  if (previewTextEl) {
    // Click: make editable and stop card navigation
    previewTextEl.addEventListener("click", e => {
      e.stopPropagation();
      previewTextEl.contentEditable = "true";
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(previewTextEl);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    });
    // Enter key: commit and exit
    previewTextEl.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        previewTextEl.blur();
      }
    });
    // Blur: revert to non-editable if still showing default font name
    previewTextEl.addEventListener("blur", () => {
      if (!globalPreviewText) {
        // If user cleared it back to empty, restore font name
        const fontName = previewTextEl.dataset.fontName;
        if (!previewTextEl.textContent.trim()) {
          previewTextEl.textContent = fontName;
        }
        previewTextEl.contentEditable = "false";
      }
    });
  }

  el.fontGrid.appendChild(card);
  
  // Observe for scroll animation
  cardObserver.observe(card);
}

// ─────────────────────────────────────────────────
//  SUPABASE CLIENT
// ─────────────────────────────────────────────────
// Fallback credentials in case config.js is gitignored and not deployed
window.SUPABASE_URL = window.SUPABASE_URL || "https://alvarlzjtdmkvbxehppt.supabase.co";
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdmFybHpqdGRta3ZieGVocHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjA3MDIsImV4cCI6MjA5ODI5NjcwMn0.kopGopXghwNdHM6cawDhpjrYui0MzqpAROsYHHMZEeE";

let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient && window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

// ─────────────────────────────────────────────────
//  LOAD CUSTOM FONTS FROM SUPABASE
// ─────────────────────────────────────────────────
async function loadCustomFontsFromSupabase() {
  const sb = getSupabase();
  if (!sb) return;

  try {
    const { data, error } = await sb.from('custom_fonts').select('*').order('created_at', { ascending: false });
    if (error) { console.warn('Supabase fetch error:', error.message); return; }
    if (!data || data.length === 0) return;

    data.forEach(row => {
      // Register @font-face using the public URL from Supabase Storage
      const style = document.createElement('style');
      style.textContent = `@font-face { font-family: '${row.css_family}'; src: url('${row.public_url}') format('${row.format}'); font-display: swap; }`;
      document.head.appendChild(style);

      const fontObj = {
        id: row.id,
        name: row.name,
        provider: 'custom',
        designer: row.designer || 'Self-Uploaded File',
        foundry: row.foundry || row.file_name,
        year: new Date(row.created_at).getFullYear().toString(),
        stylesCount: row.styles_count || 1,
        languages: ['Latin'],
        description: `Custom uploaded font: ${row.file_name}`,
        availability: 'Custom',
        mood: 'Modern',
        useCase: 'Web',
        style: row.style || 'Sans-Serif',
        language: 'Latin',
        downloadUrl: row.public_url,
        downloadCount: row.download_count || 0,
        price: 'Free',
        fileSize: row.file_size || '—',
        cssFamily: `'${row.css_family}'`,
        format: row.format,
        storagePath: row.storage_path,
        pairsWith: []
      };

      // Prepend so custom fonts appear first
      if (!fontsData.find(f => f.id === row.id)) {
        fontsData.unshift(fontObj);
      }
    });

    renderGrid(true);
  } catch (err) {
    console.warn('Failed to load custom fonts from Supabase:', err);
  }
}

// ─────────────────────────────────────────────────
//  DYNAMIC DRAG-AND-DROP FONT UPLOADER (LOCAL PREVIEW ONLY)
//  Fonts dropped here are previewed temporarily in this session only.
//  They are NOT uploaded to the server or saved to the database.
//  Permanent fonts are managed via the Admin Dashboard.
// ─────────────────────────────────────────────────
function handleFontFile(file) {
  const name = file.name;
  const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
  if (!['.ttf', '.otf', '.woff', '.woff2'].includes(ext)) {
    alert('Please upload a valid font file (.ttf, .otf, .woff, .woff2)');
    return;
  }

  const cleanName = name.substring(0, name.lastIndexOf('.')).replace(/[_-]/g, ' ').trim();
  const fontId = `preview-${Date.now()}`;
  const format = ext === '.ttf' ? 'truetype' : (ext === '.otf' ? 'opentype' : (ext === '.woff' ? 'woff' : 'woff2'));

  // Show loading state
  const uploaderCard = document.getElementById('font-uploader-card');
  const dropzone = uploaderCard?.querySelector('.uploader-dropzone');
  const originalHTML = dropzone?.innerHTML;
  if (dropzone) dropzone.innerHTML = `<p style="font-family:var(--font-mono);font-size:0.75rem;color:var(--signal-red);animation:pulse 1.5s infinite;">LOADING PREVIEW...</p>`;

  // Read file locally using FileReader — no network request, no database
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;

    // Register @font-face directly from local data URL
    const styleEl = document.createElement('style');
    styleEl.textContent = `@font-face { font-family: '${cleanName}'; src: url('${dataUrl}') format('${format}'); font-display: swap; }`;
    document.head.appendChild(styleEl);

    const newFont = {
      id: fontId,
      name: cleanName + ' (Preview)',
      provider: 'custom',
      designer: 'Local Preview',
      foundry: 'Temporary — this session only',
      year: new Date().getFullYear().toString(),
      stylesCount: 1,
      languages: ['Latin'],
      description: `Local preview of ${name}. Not saved to the database.`,
      availability: 'Preview',
      mood: 'Modern',
      useCase: 'Web',
      style: 'Sans-Serif',
      language: 'Latin',
      downloadUrl: dataUrl,
      price: 'Free',
      fileSize: `${Math.round(file.size / 1024)} KB`,
      cssFamily: `'${cleanName}'`,
      format: format,
      pairsWith: []
    };

    fontsData.unshift(newFont);
    renderGrid(true);

    // Scroll to and highlight the new preview card
    setTimeout(() => {
      const allCards = el.fontGrid?.querySelectorAll('.font-card');
      const newCard = allCards?.[0]; // unshifted so it's first
      if (newCard) {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        newCard.style.outline = '2px solid var(--signal-red)';
        setTimeout(() => { newCard.style.outline = 'none'; }, 2000);
      }
    }, 300);

    // Restore dropzone
    if (dropzone && originalHTML) dropzone.innerHTML = originalHTML;
  };

  reader.onerror = function() {
    alert('Failed to read font file. Please try again.');
    if (dropzone && originalHTML) dropzone.innerHTML = originalHTML;
  };

  reader.readAsDataURL(file);
}

function setupFontUploader() {
  const card = document.getElementById("font-uploader-card");
  const input = document.getElementById("hidden-font-input");
  if (!card || !input) return;

  card.addEventListener("click", () => {
    input.click();
  });

  input.addEventListener("change", e => {
    if (e.target.files.length > 0) {
      handleFontFile(e.target.files[0]);
    }
  });

  const dropzone = card.querySelector(".uploader-dropzone");
  if (!dropzone) return;

  ["dragenter", "dragover"].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("dragover");
    }, false);
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("dragover");
    }, false);
  });

  dropzone.addEventListener("drop", e => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFontFile(files[0]);
    }
  });
}

function appendUploaderCard() {
  const card = document.createElement("div");
  card.className = "font-card uploader-card";
  card.id = "font-uploader-card";
  card.innerHTML = `
    <!-- Top Row: Name and Meta -->
    <div class="card-header-row">
      <span class="font-name-label" style="font-family:var(--font-body); font-size:1.1rem; opacity: 1; text-transform: none; letter-spacing: normal;">Drag & Drop Font</span>
      <div class="card-meta-right">
        <span class="meta-item">SELF-HOSTED PREVIEW</span>
      </div>
    </div>

    <!-- Center Row: Dropzone UI -->
    <div class="card-body-row uploader-dropzone" style="display:flex; flex-direction:column; justify-content:center; align-items:center; border:2px dashed var(--border-grey); border-radius:12px; background:rgba(255,255,255,0.01); transition: all 0.3s ease; cursor: pointer; padding: 1.5rem; width:100%; height:100%; box-sizing:border-box;">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-secondary); margin-bottom:0.5rem; transition: transform 0.3s ease;">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      <span class="uploader-title" style="font-family:var(--font-mono); font-size:var(--ts-xs); font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--near-black);">Drop Custom Font</span>
      <span class="uploader-subtitle" style="font-size:0.7rem; color:#888; margin-top:0.2rem; text-align:center;">Drag & Drop or Click to Browse</span>
      <input type="file" id="hidden-font-input" accept=".ttf,.otf,.woff,.woff2" style="display:none;">
    </div>

    <!-- Bottom Row: Info -->
    <div class="card-footer-row">
      <span class="foundry-label">Render any local font (.ttf, .otf, .woff2) instantly on the main grid</span>
    </div>
  `;
  el.fontGrid.appendChild(card);
  setupFontUploader();
}

// ─────────────────────────────────────────────────
//  GRID RENDER
// ─────────────────────────────────────────────────
let currentRenderLimit = 30;

function renderGrid(resetLimit = true) {
  el.fontGrid.innerHTML = "";
  if (resetLimit) currentRenderLimit = 30;
  
  const filtered = getFilteredFonts();

  // Show/update search result count
  let countEl = document.getElementById("search-result-count");
  if (!countEl) {
    countEl = document.createElement("p");
    countEl.id = "search-result-count";
    countEl.className = "search-result-count";
    el.fontGrid.parentElement.insertBefore(countEl, el.fontGrid);
  }
  if (window.searchQuery || Object.values(activeFilters).some(v => v && v !== "All Providers" && v !== "All")) {
    countEl.textContent = `Showing ${Math.min(currentRenderLimit, filtered.length)} of ${filtered.length} matching fonts (Total: ${fontsData.length})`;
    countEl.classList.add("visible");
  } else {
    countEl.classList.remove("visible");
  }

  // Prepend uploader card if no search/filter is active
  const hasFiltersActive = window.searchQuery || Object.values(activeFilters).some(v => v && v !== "All Providers" && v !== "All");
  if (!hasFiltersActive) {
    appendUploaderCard();
  }

  if (filtered.length === 0) {
    el.fontGrid.innerHTML = `
      <div style="grid-column:span 3;text-align:center;padding:4rem 1rem;color:#777;width:100%;">
        <p style="font-size:var(--ts-lg);font-family:var(--font-display);">No fonts matched your search.</p>
        <span style="font-size:var(--ts-sm);cursor:pointer;text-decoration:underline;margin-top:1rem;display:inline-block;" onclick="clearAllFilters()">Clear all filters</span>
      </div>`;
    updateLoadMoreBtn(0, 0);
    return;
  }

  const toRender = filtered.slice(0, currentRenderLimit);
  toRender.forEach((font, i) => appendFontCard(font, i, i + 1));
  updateLoadMoreBtn(filtered.length, currentRenderLimit);
}

function updateLoadMoreBtn(totalFiltered, currentLimit) {
  let btn = document.getElementById("load-more-fonts-btn");
  if (totalFiltered <= currentLimit) {
    if (btn) btn.style.display = "none";
    return;
  }
  
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "load-more-fonts-btn";
    btn.className = "btn btn-outline";
    btn.style.margin = "3rem auto";
    btn.style.display = "block";
    btn.textContent = "Load More Fonts";
    btn.addEventListener("click", () => {
      currentRenderLimit += 30;
      renderGrid(false);
    });
    el.fontGrid.parentElement.appendChild(btn);
  } else {
    btn.style.display = "block";
  }
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
    card.dataset.id = font.id; // Store ID for delegation
    strip.appendChild(card);
  });

  // Duplicate the entire inner HTML to create a seamless infinite loop
  strip.innerHTML += strip.innerHTML;

  // Event delegation for clicks
  strip.addEventListener("click", e => {
    const card = e.target.closest(".trending-card");
    if (card && card.dataset.id) {
      const font = fontsData.find(f => f.id === card.dataset.id);
      if (font) openDetailPanel(font);
    }
  });

  // Drag-to-scroll
  let isDown = false, startX, scrollLeft;
  strip.addEventListener("mousedown", e => { isDown = true; strip.classList.add("grabbing"); startX = e.pageX - strip.offsetLeft; scrollLeft = strip.scrollLeft; });
  strip.addEventListener("mouseleave", () => { isDown = false; strip.classList.remove("grabbing"); });
  strip.addEventListener("mouseup", () => { isDown = false; strip.classList.remove("grabbing"); });
  strip.addEventListener("mousemove", e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - strip.offsetLeft; strip.scrollLeft = scrollLeft - (x - startX) * 1.5; });
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
    if (btn.classList.contains("grid-stack-btn")) {
      btn.textContent = inSet ? "— STACK" : "+ STACK";
      btn.title = inSet ? "Remove from stack" : "Add to stack";
    } else {
      btn.textContent = inSet ? "✕ COMPARE" : "+ COMPARE";
      btn.title = inSet ? "Remove from compare" : "Add to compare";
    }
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
//  DETAIL PANEL REDIRECT
// ─────────────────────────────────────────────────
function openDetailPanel(font) {
  window.location.href = `font.html?id=${font.id}`;
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
  const vaultBtn = document.getElementById("vault-btn");
  if (vaultBtn) {
    vaultBtn.addEventListener("click", () => {
      activeFilters["Favorites"] = !activeFilters["Favorites"];
      vaultBtn.classList.toggle("active", activeFilters["Favorites"]);
      
      if (activeFilters["Favorites"]) {
        // Smooth scroll to the font grid
        if (el.fontGrid) {
          setTimeout(() => {
            el.fontGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
      renderGrid(true);
    });
  }

  // Global Text Preview
  const globalPreviewInput = document.getElementById("global-preview-input");
  const globalPreviewClear = document.getElementById("global-preview-clear");
  
  globalPreviewInput?.addEventListener("input", e => {
    globalPreviewText = e.target.value;
    
    if (globalPreviewClear) {
      if (globalPreviewText) globalPreviewClear.classList.add("visible");
      else globalPreviewClear.classList.remove("visible");
    }

    // Don't re-render the whole grid on every keystroke, just update the text in DOM
    document.querySelectorAll(".huge-preview-text").forEach(el => {
      if (globalPreviewText) {
        // Custom text: make editable so user can click & type
        el.contentEditable = "true";
        el.textContent = globalPreviewText;
      } else {
        // No custom text: restore font name, make non-editable so CSS ellipsis kicks in
        const fontName = el.dataset.fontName;
        el.textContent = fontName || el.textContent;
        el.contentEditable = "false";
      }
    });
  });

  globalPreviewClear?.addEventListener("click", () => {
    if (globalPreviewInput) {
      globalPreviewInput.value = "";
      globalPreviewInput.dispatchEvent(new Event("input")); // trigger the input logic to clear UI
      globalPreviewInput.focus();
    }
  });

  // Font Size Slider & Number Input
  const fontSizeSlider = document.getElementById("font-size-slider");
  const globalSizeInput = document.getElementById("global-size-input");
  const globalSizeReset = document.getElementById("global-size-reset");

  function syncGlobalSize(size) {
    if (fontSizeSlider) fontSizeSlider.value = size;
    if (globalSizeInput) globalSizeInput.value = size;
    
    // Toggle reset button (default is 120)
    if (globalSizeReset) {
      globalSizeReset.style.display = (parseInt(size) === 120) ? "none" : "inline";
    }

    if (el.fontGrid) {
      el.fontGrid.style.setProperty("--preview-font-size", `${size}px`);
      
      // Sync all card-specific sliders, inputs, and hide card resets
      const cardSliders = el.fontGrid.querySelectorAll(".card-size-slider");
      cardSliders.forEach(slider => {
        slider.value = size;
        const parentWrap = slider.closest(".card-size-slider-wrap");
        if (parentWrap) {
          const cardInput = parentWrap.querySelector(".card-size-input");
          if (cardInput) cardInput.value = size;
          const cardReset = parentWrap.querySelector(".card-size-reset");
          if (cardReset) cardReset.style.display = "none";
        }
      });
      // Remove individual font-size overrides on preview texts
      const previews = el.fontGrid.querySelectorAll(".huge-preview-text");
      previews.forEach(p => {
        p.style.fontSize = "";
      });
    }
  }

  if (fontSizeSlider) {
    fontSizeSlider.addEventListener("input", e => syncGlobalSize(e.target.value));
  }
  if (globalSizeInput) {
    globalSizeInput.addEventListener("input", e => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) return;
      
      // Update preview and slider with clamped value, but DO NOT overwrite input value itself yet
      let clampedVal = Math.min(220, Math.max(40, val));
      if (fontSizeSlider) fontSizeSlider.value = clampedVal;
      
      if (el.fontGrid) {
        el.fontGrid.style.setProperty("--preview-font-size", `${clampedVal}px`);
        
        // Sync all card-specific sliders and inputs (safe since global input is focused, not card inputs)
        const cardSliders = el.fontGrid.querySelectorAll(".card-size-slider");
        cardSliders.forEach(slider => {
          slider.value = clampedVal;
          const parentWrap = slider.closest(".card-size-slider-wrap");
          if (parentWrap) {
            const cardInput = parentWrap.querySelector(".card-size-input");
            if (cardInput) cardInput.value = clampedVal;
          }
        });
        
        // Remove individual font-size overrides on preview texts
        const previews = el.fontGrid.querySelectorAll(".huge-preview-text");
        previews.forEach(p => {
          p.style.fontSize = "";
        });
      }
      
      if (globalSizeReset) {
        globalSizeReset.style.display = (clampedVal === 120) ? "none" : "inline";
      }
    });

    // Clamp and fully sync when user finished typing or leaves the field
    globalSizeInput.addEventListener("change", e => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) {
        syncGlobalSize(120);
      } else {
        let clamped = Math.min(220, Math.max(40, val));
        syncGlobalSize(clamped);
      }
    });
    globalSizeInput.addEventListener("blur", e => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) {
        syncGlobalSize(120);
      } else {
        let clamped = Math.min(220, Math.max(40, val));
        syncGlobalSize(clamped);
      }
    });
  }

  if (globalSizeReset) {
    globalSizeReset.addEventListener("click", () => {
      syncGlobalSize(120);
    });
  }

  window.resetGlobalFontSize = function() {
    syncGlobalSize(120);
  };

  // Clear filters
  el.clearFiltersBtn.addEventListener("click", clearAllFilters);


  el.browseBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("main-content").scrollIntoView({ behavior: "smooth" });
  });

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



  // Dark mode toggle
  el.darkToggle?.addEventListener("click", toggleDarkMode);

  // Keyboard: Escape closes all modals/panels
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      const authOverlay = document.getElementById("auth-overlay");
      if (authOverlay?.classList.contains("visible")) {
        authOverlay.classList.remove("visible");
        document.body.style.overflow = "";
      }
      else if (el.compareOverlay.classList.contains("visible")) closeComparison();
    }
  });

  // Compare tray
  el.compareNowBtn?.addEventListener("click", openComparison);
  el.compareClearBtn?.addEventListener("click", () => {
    compareSet.clear();
    updateCompareTray();
    document.querySelectorAll(".compare-add-btn").forEach(btn => {
      btn.classList.remove("in-compare");
      btn.textContent = "+ COMPARE";
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

  // Mobile Collapsible Filters
  const filterWrapper = document.getElementById("filter-wrapper");
  const filterHeader = filterWrapper?.querySelector(".sidebar-filters-header");
  if (filterWrapper && filterHeader) {
    filterHeader.addEventListener("click", (e) => {
      // Don't toggle expansion if clicking on "Clear all" button
      if (e.target.closest("#clear-filters-btn")) return;
      
      // Only toggle on mobile screens
      if (window.innerWidth <= 640) {
        filterWrapper.classList.toggle("expanded");
      }
    });
  }

  // Collection cards
  setupCollectionCards();
}

// ─────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────
async function init() {
  // Apply saved dark mode preference
  const savedDark = localStorage.getItem("fontvault-dark");
  if (savedDark === "1") {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  // Show a loading state
  if (el.fontGrid) {
    el.fontGrid.innerHTML = `
      <div style="grid-column:span 3;text-align:center;padding:4rem 1rem;color:var(--signal-red);width:100%;">
        <p style="font-size:var(--ts-xl);font-family:var(--font-mono);animation:pulse 1.5s infinite;">CONNECTING TO GOOGLE FONTS API...</p>
      </div>`;
  }

  // Await the fetch
  await initGoogleFonts('AIzaSyBEmEMaIu15j6c1zxo2OlPnzfHTcfZYasY');

  // Parse search query from URL if coming from font detail page
  const params = new URLSearchParams(window.location.search);
  const q = params.get("search");
  if (q && el.searchInput) {
    el.searchInput.value = q;
    window.searchQuery = q;
  }
  if (params.get("vault") === "true") {
    activeFilters["Favorites"] = true;
    const vaultBtn = document.getElementById("vault-btn");
    if (vaultBtn) {
      vaultBtn.classList.add("active");
    }
  }

  setupFilters();
  renderGrid(true);
  renderTrending();
  setupEventListeners();

  // Load custom fonts from Supabase
  await loadCustomFontsFromSupabase();

  if ((params.get("scroll") === "true" || params.get("vault") === "true") && el.fontGrid) {
    // Small timeout to allow grid to render
    setTimeout(() => {
      el.fontGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  setupSharedEventListeners();
  updateClearButtonVisibility();

  // Create global edit tooltip dynamically
  const tooltip = document.createElement("div");
  tooltip.id = "edit-tooltip";
  tooltip.className = "edit-tooltip";
  tooltip.textContent = "Click on text to edit";
  document.body.appendChild(tooltip);

  // Tooltip mouse movement listener with 5s fade timeout
  if (el.fontGrid) {
    let lastHoveredCard = null;
    let tooltipTimeout = null;
    let fadeOutTimeout = null;

    // Instantly hide tooltip when entering edit mode
    document.addEventListener("focusin", e => {
      if (e.target.closest(".huge-preview-text")) {
        const tooltipEl = document.getElementById("edit-tooltip");
        if (tooltipEl) {
          tooltipEl.style.display = "none";
          tooltipEl.classList.add("fade-out");
          clearTimeout(tooltipTimeout);
          clearTimeout(fadeOutTimeout);
          lastHoveredCard = null;
        }
      }
    });

    el.fontGrid.addEventListener("mousemove", e => {
      const card = e.target.closest(".font-card");
      const tooltipEl = document.getElementById("edit-tooltip");
      if (card && tooltipEl) {
        const activeEl = document.activeElement;
        const isEditing = activeEl && activeEl.closest(".huge-preview-text") && activeEl.closest(".font-card") === card;

        // Hide tooltip if hovering interactive controls or currently editing
        if (e.target.closest(".compare-add-btn") || e.target.closest(".favorite-add-btn") || e.target.closest(".view-family-hover-btn") || e.target.closest(".custom-font-delete-btn") || isEditing) {
          tooltipEl.style.display = "none";
          clearTimeout(tooltipTimeout);
          clearTimeout(fadeOutTimeout);
          lastHoveredCard = null;
          return;
        }

        // If entering a different card, show tooltip and start 5-second timer
        if (card !== lastHoveredCard) {
          lastHoveredCard = card;
          clearTimeout(tooltipTimeout);
          clearTimeout(fadeOutTimeout);
          
          tooltipEl.style.display = "block";
          tooltipEl.offsetHeight; // Force reflow for smooth transition
          tooltipEl.classList.remove("fade-out");
          
          tooltipTimeout = setTimeout(() => {
            tooltipEl.classList.add("fade-out");
            fadeOutTimeout = setTimeout(() => {
              tooltipEl.style.display = "none";
            }, 300);
          }, 5000);
        }

        // Only update position if it's currently visible
        if (tooltipEl.style.display !== "none" && !tooltipEl.classList.contains("fade-out")) {
          tooltipEl.style.left = (e.clientX + 15) + "px";
          tooltipEl.style.top = (e.clientY + 15) + "px";
        }
      } else if (tooltipEl) {
        tooltipEl.style.display = "none";
        clearTimeout(tooltipTimeout);
        clearTimeout(fadeOutTimeout);
        lastHoveredCard = null;
      }
    });

    el.fontGrid.addEventListener("mouseleave", () => {
      const tooltipEl = document.getElementById("edit-tooltip");
      if (tooltipEl) {
        tooltipEl.style.display = "none";
        tooltipEl.classList.remove("fade-out");
      }
      clearTimeout(tooltipTimeout);
      clearTimeout(fadeOutTimeout);
      lastHoveredCard = null;
    });
  }

  if (q && document.getElementById("search-clear-btn")) {
    document.getElementById("search-clear-btn").classList.add("visible");
  }
}

// removeCustomFont: only removes LOCAL preview fonts (those dragged & dropped this session).
// Admin-uploaded fonts (from Supabase) can only be deleted via the Admin Dashboard.
// This function never touches Supabase storage or database.
window.removeCustomFont = function(fontId) {
  // Safety: only allow removing session-preview fonts, never DB-backed ones
  const font = fontsData.find(f => f.id === fontId);
  if (!font || !font.id.startsWith('preview-')) {
    console.warn('[FontVault] removeCustomFont: refusing to remove non-preview font', fontId);
    return;
  }

  // Remove from in-memory array only (no Supabase calls)
  fontsData = fontsData.filter(f => f.id !== fontId);

  if (window.favoritesSet) {
    window.favoritesSet.delete(fontId);
    try {
      localStorage.setItem('fontvault-favorites', JSON.stringify(Array.from(window.favoritesSet)));
    } catch (e) {}
  }

  if (typeof renderGrid === 'function') {
    renderGrid(true);
  }
};

// ─────────────────────────────────────────────────
//  DOWNLOAD COUNT HELPERS
// ─────────────────────────────────────────────────

// Format number: 1234 → "1.2k", 999 → "999"
window.formatDownloadCount = function(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
};

// Trigger real font file download via our /api/download proxy + increment DB counter
window.downloadFont = async function(fontId, url, fontName, format) {
  if (!url || url === '#') return;

  const isGoogleFont = url.includes('fonts.google.com');
  const ext = isGoogleFont ? 'zip'
            : format === 'truetype' ? 'ttf'
            : format === 'opentype' ? 'otf'
            : (format || 'woff2');
  const safeFilename = `${fontName.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_')}${isGoogleFont ? '_fonts' : ''}.${ext}`;

  if (window.FontVaultAnalytics) {
    window.FontVaultAnalytics.trackDownload(fontName, ext);
  }

  // ── Animate button: downloading state ────────────────────────
  const btn  = document.getElementById(`dl-btn-${fontId}`);
  const countEl = document.getElementById(`dl-count-${fontId}`);
  if (btn) {
    btn.classList.add('downloading');
    if (countEl) countEl.textContent = '↓ FETCHING...';
    btn.style.pointerEvents = 'none';
  }

  // If the url is a data URL (base64 local custom font), download directly
  if (url.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = url;
    a.download = safeFilename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (btn) {
      btn.classList.remove('downloading');
      btn.classList.add('downloaded');
      btn.style.pointerEvents = '';
    }
    return;
  }

  try {
    // ── Build the proxy URL ───────────────────────────────────
    let proxyUrl;

    if (isGoogleFont) {
      // Extract family name from Google Fonts specimen URL
      const familyMatch = url.match(/specimen\/([^?#]+)/);
      const family = familyMatch
        ? decodeURIComponent(familyMatch[1].replace(/\+/g, ' '))
        : fontName;
      proxyUrl = `/api/download?family=${encodeURIComponent(family)}&filename=${encodeURIComponent(safeFilename)}`;
    } else {
      // Direct font file URL (Supabase, gstatic, Fontshare, etc.)
      proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(safeFilename)}`;
    }

    // ── Fetch blob through proxy ──────────────────────────────
    const resp = await fetch(proxyUrl);
    if (!resp.ok) throw new Error(`Proxy returned ${resp.status}`);
    const blob = await resp.blob();

    // ── Trigger browser save dialog ───────────────────────────
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = safeFilename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    // ── Success state on button ───────────────────────────────
    if (btn) {
      btn.classList.remove('downloading');
      btn.classList.add('downloaded');
      btn.style.pointerEvents = '';
    }

  } catch (err) {
    console.warn('[FontVault] Download failed:', err);
    if (btn) {
      btn.classList.remove('downloading');
      btn.style.pointerEvents = '';
      if (countEl) countEl.textContent = 'RETRY';
    }
  }

  // ── Increment counter in Supabase via RPC (non-blocking) ─────
  const sb = getSupabase();
  if (sb) {
    sb.rpc('increment_download_count', { font_id: fontId })
      .then(() => {
        const fontObj = fontsData.find(f => f.id === fontId);
        if (fontObj) {
          fontObj.downloadCount = (fontObj.downloadCount || 0) + 1;
          const el = document.getElementById(`dl-count-${fontId}`);
          if (el && !el.textContent.includes('RETRY')) {
            el.textContent = formatDownloadCount(fontObj.downloadCount);
          }
        }
      })
      .catch(() => {}); // silently ignore RPC errors for non-Supabase fonts
  }
};


window.updateCardFontSize = function(slider, fontId) {
  const card = slider.closest(".font-card");
  if (card) {
    const size = slider.value;
    const previewText = card.querySelector(".huge-preview-text");
    if (previewText) previewText.style.fontSize = `${size}px`;

    const sizeInput = card.querySelector(".card-size-input");
    if (sizeInput) sizeInput.value = size;

    const globalSize = parseInt(document.getElementById("font-size-slider")?.value || 120);
    const resetBtn = card.querySelector(".card-size-reset");
    if (resetBtn) {
      resetBtn.style.display = (parseInt(size) === globalSize) ? "none" : "inline";
    }
  }
};

window.updateCardFontSizeFromInput = function(input, fontId) {
  const card = input.closest(".font-card");
  if (card) {
    let size = parseInt(input.value);
    if (isNaN(size)) return;
    
    // Update preview and slider with clamped value, but DO NOT overwrite input.value yet
    let clampedVal = Math.min(200, Math.max(20, size));

    const previewText = card.querySelector(".huge-preview-text");
    if (previewText) previewText.style.fontSize = `${clampedVal}px`;

    const slider = card.querySelector(".card-size-slider");
    if (slider) slider.value = clampedVal;

    const globalSize = parseInt(document.getElementById("font-size-slider")?.value || 120);
    const resetBtn = card.querySelector(".card-size-reset");
    if (resetBtn) {
      resetBtn.style.display = (clampedVal === globalSize) ? "none" : "inline";
    }
  }
};

window.finalizeCardFontSizeFromInput = function(input, fontId) {
  const card = input.closest(".font-card");
  if (card) {
    let size = parseInt(input.value);
    if (isNaN(size)) {
      resetCardFontSize(card.querySelector(".card-size-reset"), fontId);
      return;
    }
    let clampedVal = Math.min(200, Math.max(20, size));
    input.value = clampedVal;

    const previewText = card.querySelector(".huge-preview-text");
    if (previewText) previewText.style.fontSize = `${clampedVal}px`;

    const slider = card.querySelector(".card-size-slider");
    if (slider) slider.value = clampedVal;
  }
};
window.resetCardFontSize = function(btn, fontId) {
  const card = btn.closest(".font-card");
  if (card) {
    const globalSize = parseInt(document.getElementById("font-size-slider")?.value || 120);
    
    const slider = card.querySelector(".card-size-slider");
    if (slider) slider.value = globalSize;

    const sizeInput = card.querySelector(".card-size-input");
    if (sizeInput) sizeInput.value = globalSize;

    const previewText = card.querySelector(".huge-preview-text");
    if (previewText) previewText.style.fontSize = "";

    btn.style.display = "none";
  }
};

// ─────────────────────────────────────────────────
//  API KEY SETUP MODAL
// ─────────────────────────────────────────────────
function showApiKeyModal(onSave) {
  // Don't show twice
  if (document.getElementById("api-key-modal")) return;

  const overlay = document.createElement("div");
  overlay.id = "api-key-modal";
  overlay.innerHTML = `
    <div class="api-key-modal-backdrop"></div>
    <div class="api-key-modal-box">
      <div class="api-key-modal-icon">🔑</div>
      <h2 class="api-key-modal-title">Enter your Gemini API Key</h2>
      <p class="api-key-modal-desc">
        FontVault's AI Font Finder uses Google Gemini. Your key is stored only in your browser's local storage and never sent to any server other than Google.
      </p>
      <p class="api-key-modal-desc">
        Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">aistudio.google.com</a>
      </p>
      <input
        type="text"
        id="api-key-modal-input"
        class="api-key-modal-input"
        placeholder="Paste your Gemini API key here…"
        spellcheck="false"
        autocomplete="off"
      />
      <div class="api-key-modal-actions">
        <button id="api-key-modal-save" class="api-key-modal-btn-save">Save &amp; Search</button>
        <button id="api-key-modal-cancel" class="api-key-modal-btn-cancel">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Pre-fill if there's an existing key
  const existing = localStorage.getItem("fontvault-gemini-key") || "";
  if (existing && existing !== "PLACEHOLDER_API_KEY") {
    document.getElementById("api-key-modal-input").value = existing;
  }

  document.getElementById("api-key-modal-save").addEventListener("click", () => {
    const key = document.getElementById("api-key-modal-input").value.trim();
    if (!key) {
      document.getElementById("api-key-modal-input").classList.add("api-key-modal-input--error");
      return;
    }
    localStorage.setItem("fontvault-gemini-key", key);
    overlay.remove();
    if (typeof onSave === "function") onSave();
  });

  document.getElementById("api-key-modal-cancel").addEventListener("click", () => {
    overlay.remove();
  });

  document.querySelector(".api-key-modal-backdrop").addEventListener("click", () => {
    overlay.remove();
  });

  document.getElementById("api-key-modal-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("api-key-modal-save").click();
    }
  });

  // Focus input
  setTimeout(() => document.getElementById("api-key-modal-input")?.focus(), 50);
}

// ─────────────────────────────────────────────────
//  AI FONT FINDER LOGIC
// ─────────────────────────────────────────────────
function setupAiFontFinder() {
  const finderInput = document.getElementById("ai-finder-input");
  const submitBtn = document.getElementById("ai-finder-submit-btn");
  const loadingState = document.getElementById("ai-finder-loading");
  const loadingText = document.getElementById("ai-finder-loading-text");
  const resultsContainer = document.getElementById("ai-finder-results");
  const suggestions = document.querySelectorAll(".suggestion-tag");

  if (!submitBtn || !finderInput) return;

  // Handle suggestion tags clicks
  suggestions.forEach(tag => {
    tag.addEventListener("click", () => {
      finderInput.value = tag.getAttribute("data-prompt");
      submitBtn.click();
    });
  });

  // Handle CTA Submit button click
  submitBtn.addEventListener("click", async () => {
    const prompt = finderInput.value.trim();
    if (!prompt) return;

    if (window.FontVaultAnalytics) {
      window.FontVaultAnalytics.trackAISearch(prompt, "ai-finder");
    }

    // Show loading state, hide results
    loadingState.style.display = "block";
    resultsContainer.style.display = "none";
    submitBtn.disabled = true;

    // Loading texts rotation
    const loadingMsgs = [
      "Analyzing typography style...",
      "Matching font personalities...",
      "Finding best combinations...",
      "Checking spacing guidelines..."
    ];
    let msgIdx = 0;
    loadingText.textContent = loadingMsgs[msgIdx];
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMsgs.length;
      loadingText.textContent = loadingMsgs[msgIdx];
    }, 1500);

    try {
      // Build dynamically loaded font database to restrict recommendations
      const allFontsList = fontsData.map(f => ({
        name: f.name,
        category: f.style || "Sans-Serif",
        provider: f.provider || "google"
      }));

      const apiKey = localStorage.getItem("fontvault-gemini-key") || window.GEMINI_API_KEY || "";
      if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
        // Show the API key setup modal instead of throwing
        showApiKeyModal(() => {
          // After key is saved, re-trigger the search
          submitBtn.click();
        });
        clearInterval(msgInterval);
        loadingState.style.display = "none";
        submitBtn.disabled = false;
        return;
      }

      // Gemini Prompt structure
      const systemPrompt = `You are a typography specialist. Analyze the user's project intent/design goal and recommend the best fonts from the provided database.
Available Font Database:
${JSON.stringify(allFontsList)}

Return a JSON object matching this schema exactly. You must ONLY recommend font names that exist in the provided database. Do not hallucinate or use external font names.

JSON Schema:
{
  "headline_fonts": [
    {
      "name": "string (Exact font name from database)",
      "explanation": "string (Why it is perfect for headlines/logos/hero section)"
    }
  ], // Recommend exactly 3 headline fonts
  "body_fonts": [
    {
      "name": "string (Exact font name from database)",
      "explanation": "string (Why it is perfect for body text/interface readability)"
    }
  ], // Recommend exactly 3 body fonts
  "pairings": [
    {
      "heading_font": "string (Exact font name from database)",
      "body_font": "string (Exact font name from database)",
      "score": number (out of 10, e.g. 9.3),
      "reason": "string (Why this pair works well together)"
    }
  ], // Generate 2-3 pairings
  "insights": {
    "emotional_tone": "string",
    "brand_positioning": "string",
    "visual_strategy": "string"
  }
}`;

      // Call API via standard fetch
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: systemPrompt },
              { text: `User request: ${prompt}` }
            ]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        let errDetails = "";
        try {
          const errJson = await response.json();
          errDetails = errJson.error?.message || JSON.stringify(errJson);
        } catch (e) {
          try {
            errDetails = await response.text();
          } catch (t) {
            errDetails = "Could not read error details";
          }
        }
        throw new Error(`HTTP ${response.status} - ${errDetails}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Empty response from AI");
      let cleanedText = rawText.trim();
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```(json)?/i, "");
        cleanedText = cleanedText.replace(/```$/, "");
        cleanedText = cleanedText.trim();
      }
      const result = JSON.parse(cleanedText);
      renderAiResults(result);

    } catch (err) {
      console.error("AI Finder Error:", err);
      showAiError(`Error: ${err.message}. Please check your browser console or network tab.`);
    } finally {
      clearInterval(msgInterval);
      loadingState.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  // Action Buttons handlers
  document.getElementById("ai-action-regenerate")?.addEventListener("click", () => {
    submitBtn.click();
  });

  document.getElementById("ai-action-similar")?.addEventListener("click", () => {
    // Look at first headline font recommendation
    const firstHeadlineEl = document.querySelector("#headline-recommendations .ai-rec-card");
    if (!firstHeadlineEl) return;
    const name = firstHeadlineEl.getAttribute("data-ai-font-name");
    const found = fontsData.find(f => f.name.toLowerCase() === name.toLowerCase());
    if (found && found.style) {
      // Toggle category filter
      activeFilters["Style"] = [found.style];
      // Sync filter UI checkboxes
      const checkboxes = document.querySelectorAll(".filter-checkbox");
      checkboxes.forEach(cb => {
        if (cb.dataset.group === "Style") {
          cb.checked = (cb.dataset.value === found.style);
        }
      });
      renderGrid(true);
      document.getElementById("main-content").scrollIntoView({ behavior: "smooth" });
    }
  });

  document.getElementById("ai-action-save")?.addEventListener("click", () => {
    const recommendedNames = Array.from(document.querySelectorAll("[data-ai-font-name]")).map(el => el.getAttribute("data-ai-font-name"));
    if (recommendedNames.length === 0) return;
    
    let addedCount = 0;
    recommendedNames.forEach(name => {
      const found = fontsData.find(f => f.name.toLowerCase() === name.toLowerCase());
      if (found) {
        let favorites = JSON.parse(localStorage.getItem("fontvault-favorites") || "[]");
        if (!favorites.includes(found.id)) {
          favorites.push(found.id);
          localStorage.setItem("fontvault-favorites", JSON.stringify(favorites));
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      alert(`Added ${addedCount} recommended fonts to My Vault (Favorites)!`);
    } else {
      alert("These recommended fonts are already in My Vault!");
    }
  });

  document.getElementById("ai-action-compare")?.addEventListener("click", () => {
    // Add recommended fonts to compareSet
    const recommendedNames = Array.from(document.querySelectorAll("[data-ai-font-name]")).map(el => el.getAttribute("data-ai-font-name"));
    if (recommendedNames.length === 0) return;
    
    let addedCount = 0;
    recommendedNames.forEach(name => {
      const found = fontsData.find(f => f.name.toLowerCase() === name.toLowerCase());
      if (found) {
        if (!compareSet.has(found.id)) {
          if (compareSet.size >= 3) {
            // Remove first added to stay under 3 fonts limit
            const firstId = [...compareSet][0];
            compareSet.delete(firstId);
          }
          compareSet.add(found.id);
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      updateCompareTray();
      // Also refresh all compare buttons on visible cards
      document.querySelectorAll(".compare-add-btn").forEach(btn => {
        const id = btn.dataset.id;
        const inSet = compareSet.has(id);
        btn.classList.toggle("in-compare", inSet);
        btn.textContent = inSet ? "✕ COMPARE" : "+ COMPARE";
        btn.title = inSet ? "Remove from compare" : "Add to compare";
      });
      alert(`Added ${addedCount} recommended fonts to Compare tray!`);
    } else {
      alert("These fonts are already in your Compare list!");
    }
  });
}

function renderAiResults(data) {
  const headlineList = document.getElementById("headline-recommendations");
  const bodyList = document.getElementById("body-recommendations");
  const pairingsList = document.getElementById("ai-pairings-list");
  const insightsBox = document.getElementById("ai-insights-content");

  if (!headlineList || !bodyList || !pairingsList || !insightsBox) return;

  headlineList.innerHTML = "";
  bodyList.innerHTML = "";
  pairingsList.innerHTML = "";
  insightsBox.innerHTML = "";

  const defaultSpecimen = "Design is intelligence made visible.";

  // Helper to render card
  const renderCard = (fontData, explanation) => {
    const matchedFont = fontsData.find(f => f.name.toLowerCase() === fontData.name.toLowerCase()) || {
      name: fontData.name,
      style: "Sans-Serif",
      cssFamily: `'${fontData.name}', sans-serif`
    };

    // Load webfont dynamically if it's a Google Font and we haven't loaded it
    if (matchedFont.provider === "google") {
      const linkId = `ai-font-${matchedFont.id}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${matchedFont.name.replace(/\s+/g, "+")}:wght@400;700&display=swap`;
        document.head.appendChild(link);
      }
    }

    return `
      <div class="ai-rec-card" data-ai-font-name="${matchedFont.name}">
        <div class="ai-rec-header">
          <span class="ai-rec-name">${matchedFont.name}</span>
          <span class="ai-rec-tag">${matchedFont.style || 'Sans-Serif'}</span>
        </div>
        <div class="ai-rec-preview" contenteditable="true" spellcheck="false" style="font-family:${matchedFont.cssFamily || `'` + matchedFont.name + `'`};">
          ${defaultSpecimen}
        </div>
        <p class="ai-rec-explanation">${explanation}</p>
      </div>
    `;
  };

  // 1. Headline Fonts
  if (data.headline_fonts) {
    data.headline_fonts.forEach(item => {
      headlineList.innerHTML += renderCard(item, item.explanation);
    });
  }

  // 2. Body Fonts
  if (data.body_fonts) {
    data.body_fonts.forEach(item => {
      bodyList.innerHTML += renderCard(item, item.explanation);
    });
  }

  // 3. Best Pairings
  if (data.pairings) {
    data.pairings.forEach(pair => {
      pairingsList.innerHTML += `
        <div class="ai-pairing-card">
          <div class="ai-pairing-names-row">
            <span class="ai-pairing-names">${pair.heading_font} + ${pair.body_font}</span>
            <span class="ai-pairing-score">Score: ${pair.score}/10</span>
          </div>
          <p class="ai-pairing-reason">${pair.reason}</p>
        </div>
      `;
    });
  }

  // 4. AI Insights
  if (data.insights) {
    insightsBox.innerHTML = `
      <div class="ai-insights-card">
        <div class="ai-insight-item">
          <span class="ai-insight-label">Emotional Tone</span>
          <p class="ai-insight-text">${data.insights.emotional_tone || 'Elegant and professional'}</p>
        </div>
        <div class="ai-insight-item">
          <span class="ai-insight-label">Brand Positioning</span>
          <p class="ai-insight-text">${data.insights.brand_positioning || 'Premium market positioning'}</p>
        </div>
        <div class="ai-insight-item">
          <span class="ai-insight-label">Visual Strategy</span>
          <p class="ai-insight-text">${data.insights.visual_strategy || 'Balanced hierarchy'}</p>
        </div>
      </div>
    `;
  }

  // Show results panel with fade/slide
  const resultsContainer = document.getElementById("ai-finder-results");
  if (resultsContainer) {
    resultsContainer.style.display = "block";
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showAiError(errMsg) {
  const headlineList = document.getElementById("headline-recommendations");
  const bodyList = document.getElementById("body-recommendations");
  const msg = errMsg || "Unable to generate recommendations right now. Please try again.";
  if (headlineList) headlineList.innerHTML = `<p style="color:var(--signal-red);">${msg}</p>`;
  if (bodyList) bodyList.innerHTML = `<p style="color:var(--signal-red);">${msg}</p>`;
  
  const resultsContainer = document.getElementById("ai-finder-results");
  if (resultsContainer) {
    resultsContainer.style.display = "block";
  }
}

// ─────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────
async function init() {
  // Apply saved dark mode preference
  const savedDark = localStorage.getItem("fontvault-dark");
  if (savedDark === "1") {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  // Show a loading state
  if (el.fontGrid) {
    el.fontGrid.innerHTML = `
      <div style="grid-column:span 3;text-align:center;padding:4rem 1rem;color:var(--signal-red);width:100%;">
        <p style="font-size:var(--ts-xl);font-family:var(--font-mono);animation:pulse 1.5s infinite;">CONNECTING TO GOOGLE FONTS API...</p>
      </div>`;
  }

  // Await the fetch
  await initGoogleFonts('AIzaSyBEmEMaIu15j6c1zxo2OlPnzfHTcfZYasY');

  // Parse search query from URL if coming from font detail page
  const params = new URLSearchParams(window.location.search);
  const q = params.get("search");
  if (q && el.searchInput) {
    el.searchInput.value = q;
    window.searchQuery = q;
  }
  if (params.get("vault") === "true") {
    activeFilters["Favorites"] = true;
    const vaultBtn = document.getElementById("vault-btn");
    if (vaultBtn) {
      vaultBtn.classList.add("active");
    }
  }

  setupFilters();
  renderGrid(true);
  renderTrending();
  setupEventListeners();
  setupAiFontFinder();

  // Load custom fonts from Supabase
  await loadCustomFontsFromSupabase();

  if ((params.get("scroll") === "true" || params.get("vault") === "true") && el.fontGrid) {
    // Small timeout to allow grid to render
    setTimeout(() => {
      el.fontGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  setupSharedEventListeners();
  updateClearButtonVisibility();

  // Create global edit tooltip dynamically
  const tooltip = document.createElement("div");
  tooltip.id = "edit-tooltip";
  tooltip.className = "edit-tooltip";
  tooltip.textContent = "Click on text to edit";
  document.body.appendChild(tooltip);

  // Collection cards
  setupCollectionCards();
  
  // Initialize new trending section grid and mood filter
  setupTrendingNew();

  // Initialize display layout toggles (List/Grid)
  setupLayoutToggles();
}

// ─────────────────────────────────────────────────
//  NEW TRENDING SECTION BINDINGS & FILTERING
// ─────────────────────────────────────────────────
function setupTrendingNew() {
  const grid = document.querySelector(".trending-new-grid");
  if (grid) {
    // Duplicate innerHTML to create a seamless infinite marquee scroll loop
    grid.innerHTML += grid.innerHTML;
  }

  const cards = document.querySelectorAll(".trending-new-card");
  const chips = document.querySelectorAll(".trending-mood-chip");

  // Click on cards to open detail panel
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const fontId = card.dataset.id;
      if (!fontId) return;
      
      let font = fontsData.find(f => f.id === fontId);
      if (!font) {
        // Fallback case-insensitive / space match
        font = fontsData.find(f => f.name.toLowerCase() === fontId.replace(/-/g, ' '));
      }

      if (font) {
        openDetailPanel(font);
      } else {
        // Direct redirection fallback
        window.location.href = `font.html?id=${fontId}`;
      }
    });
  });

  // Mood filter chip toggles & list filtering
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const mood = chip.dataset.mood;
      if (!mood) return;

      cards.forEach(card => {
        const tags = Array.from(card.querySelectorAll(".trending-new-tag"))
          .map(t => t.textContent.trim().toLowerCase());

        if (mood === "all" || tags.includes(mood)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ─────────────────────────────────────────────────
//  DISPLAY LAYOUT VIEW TOGGLES (LIST / GRID)
// ─────────────────────────────────────────────────
function setupLayoutToggles() {
  const listBtn = document.getElementById("layout-list-btn");
  const gridBtn = document.getElementById("layout-grid-btn");
  const grid = document.getElementById("font-grid");

  if (!listBtn || !gridBtn || !grid) return;

  // Restore saved layout mode
  const savedLayout = localStorage.getItem("fontvault-layout") || "list";
  if (savedLayout === "grid") {
    grid.classList.add("layout-grid-active");
    listBtn.classList.remove("active");
    gridBtn.classList.add("active");
  }

  listBtn.addEventListener("click", () => {
    grid.classList.remove("layout-grid-active");
    gridBtn.classList.remove("active");
    listBtn.classList.add("active");
    localStorage.setItem("fontvault-layout", "list");
  });

  gridBtn.addEventListener("click", () => {
    grid.classList.add("layout-grid-active");
    listBtn.classList.remove("active");
    gridBtn.classList.add("active");
    localStorage.setItem("fontvault-layout", "grid");
  });
}

init();

// ─────────────────────────────────────────────────
//  HERO CURSOR GLOW — mouse-reactive spotlight
// ─────────────────────────────────────────────────
(function setupHeroCursorGlow() {
  const hero = document.getElementById("hero");
  const glow = document.getElementById("hero-cursor-glow");
  if (!hero || !glow) return;

  let raf;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
  });

  hero.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
    cancelAnimationFrame(raf);
  });

  hero.addEventListener("mouseenter", () => {
    glow.style.opacity = "1";
    animate();
  });

  function animate() {
    // Smooth lerp
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    glow.style.left = currentX + "px";
    glow.style.top  = currentY + "px";
    raf = requestAnimationFrame(animate);
  }
})();
