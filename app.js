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
  return fontsData.filter(font => {
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

function appendFontCard(font, delay) {

  const providerLabel = { google:"GOOGLE FONTS", fontshare:"FONTSHARE", dafont:"DAFONT" }[font.provider] || font.provider.toUpperCase();
  const isInCompare = compareSet.has(font.id);

  const card = document.createElement("div");
  card.className = "font-card";
  card.setAttribute("aria-label", `${font.name}, ${font.style}, ${font.availability}`);
  card.style.animationDelay = `${delay * 0.04}s`;
  
  // Deterministic matte background color based on font ID
  let hash = 0;
  for (let i = 0; i < font.id.length; i++) {
    hash = font.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % 8;

  loadExternalFont(font);
  const fam = font.cssFamily || `'${font.name}'`;

  const inFavorites = window.favoritesSet.has(font.id);
  card.innerHTML = `
    <div style="position: relative; background-color: var(--thumbnail-bg);">
      ${getMockupHTML(font)}
      ${(font.availability === 'Custom' || font.id.startsWith('custom-upload-')) ? `
        <button class="custom-font-delete-btn" title="Remove custom font" onclick="event.stopPropagation(); removeCustomFont('${font.id}')">
          ✕
        </button>
      ` : ''}
    </div>
    <div class="card-info">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
        <span class="badge-availability-inline ${getBadgeClass(font.availability)}">${font.availability}</span>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="favorite-add-btn ${inFavorites ? 'active' : ''}" title="${inFavorites ? 'Remove from Vault' : 'Save to Vault'}" data-id="${font.id}" onclick="event.stopPropagation(); toggleFavorite('${font.id}', this)" style="opacity: 1; transform: scale(1);">
            <svg class="heart-icon" width="16" height="16" viewBox="0 0 24 24" fill="${inFavorites ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button class="compare-add-btn ${isInCompare ? 'in-compare' : ''}" title="${isInCompare ? 'Remove from compare' : 'Add to compare'}" data-id="${font.id}" style="opacity: 1; transform: scale(1);">
            ${isInCompare ? '✕' : '+'}
          </button>
        </div>
      </div>
      <h3 class="card-font-name" style="font-family:${fam},var(--font-display);">${font.name}</h3>
      <p class="card-tags">
        <span style="text-transform:uppercase;font-weight:700;color:var(--near-black);background:#E0E0E0;padding:2px 6px;border-radius:3px;margin-right:6px;font-size:0.6rem;font-family:var(--font-mono);">${providerLabel}</span>
        ${font.style} · ${font.mood} · ${font.useCase}
      </p>
    </div>
  `;

  // Card click → open detail
  card.addEventListener("click", e => {
    if (e.target.closest(".compare-add-btn") || e.target.closest(".favorite-add-btn")) return;
    openDetailPanel(font);
  });

  // Compare add/remove button
  card.querySelector(".compare-add-btn").addEventListener("click", e => {
    e.stopPropagation();
    toggleCompare(font.id);
  });
  el.fontGrid.appendChild(card);
  
  // Observe for scroll animation
  cardObserver.observe(card);
}

// ─────────────────────────────────────────────────
//  DYNAMIC DRAG-AND-DROP FONT UPLOADER
// ─────────────────────────────────────────────────
function handleFontFile(file) {
  const name = file.name;
  const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
  if (!['.ttf', '.otf', '.woff', '.woff2'].includes(ext)) {
    alert("Please upload a valid font file (.ttf, .otf, .woff, .woff2)");
    return;
  }

  // LocalStorage has a 5MB limit. Warn user if file is too large (1.5MB threshold)
  if (file.size > 1.5 * 1024 * 1024) {
    alert(`This font file is too large (${Math.round(file.size / 1024)} KB). To make it persist across pages, please upload a compressed webfont file (like .woff2, which is usually under 100KB).`);
    return;
  }

  const cleanName = name
    .substring(0, name.lastIndexOf('.'))
    .replace(/[_-]/g, ' ')
    .trim();
  
  const fontId = `custom-upload-${Date.now()}`;
  const format = ext === '.ttf' ? 'truetype' : (ext === '.otf' ? 'opentype' : (ext === '.woff' ? 'woff' : 'woff2'));

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Url = e.target.result;

    const newFont = {
      id: fontId,
      name: cleanName + " (Uploaded)",
      provider: "custom",
      designer: "Self-Uploaded File",
      foundry: file.name,
      year: new Date().getFullYear().toString(),
      stylesCount: 1,
      languages: ["Latin"],
      description: `This is your local font file "${file.name}" loaded dynamically in your browser.`,
      availability: "Custom",
      mood: "Modern",
      useCase: "Web",
      style: ext === '.ttf' ? 'Sans-Serif' : (ext === '.otf' ? 'Serif' : 'Display'),
      language: "Latin",
      downloadUrl: "#",
      price: "Free",
      fileSize: `${Math.round(file.size / 1024)} KB`,
      cssFamily: `'${cleanName}'`,
      localUrl: base64Url,
      format: format,
      pairsWith: []
    };

    // Save to localStorage so it persists across page navigations (like details page)
    try {
      const saved = localStorage.getItem("fontvault-uploads");
      const currentUploads = saved ? JSON.parse(saved) : [];
      currentUploads.unshift(newFont);
      // Keep only last 3 custom uploads to avoid filling storage
      if (currentUploads.length > 3) {
        currentUploads.pop();
      }
      localStorage.setItem("fontvault-uploads", JSON.stringify(currentUploads));
    } catch (err) {
      console.warn("Storage quota exceeded:", err);
      alert("Local storage is full. This font will work for this session but won't persist across page reloads.");
    }

    // Add to fontsData in the current session
    fontsData.unshift(newFont);
    renderGrid(true);
    loadExternalFont(newFont);

    setTimeout(() => {
      const newCard = el.fontGrid.querySelector(`.font-card[aria-label*="${newFont.name}"]`);
      if (newCard) {
        newCard.scrollIntoView({ behavior: "smooth", block: "center" });
        newCard.style.outline = "2px solid var(--signal-red)";
        setTimeout(() => { newCard.style.outline = "none"; }, 1500);
      }
    }, 300);
  };

  reader.onerror = function() {
    alert("Failed to read the font file.");
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
    <div class="card-mockup uploader-dropzone" style="display:flex; flex-direction:column; justify-content:center; align-items:center; border:2px dashed var(--border-grey); border-radius:12px; background:rgba(0,0,0,0.02); min-height: 220px; transition: all 0.3s ease; cursor: pointer; padding: 2rem;">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-secondary); margin-bottom:1rem; transition: transform 0.3s ease;">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      <span class="uploader-title" style="font-family:var(--font-mono); font-size:var(--ts-xs); font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--near-black);">Drop Custom Font</span>
      <span class="uploader-subtitle" style="font-size:0.75rem; color:#888; margin-top:0.4rem; text-align:center;">Drag & Drop or Click to Browse</span>
      <input type="file" id="hidden-font-input" accept=".ttf,.otf,.woff,.woff2" style="display:none;">
    </div>
    <div class="card-info" style="border-top: none; padding: 1.5rem 1rem 1rem;">
      <h3 class="card-font-name" style="font-family:var(--font-body); font-size:var(--ts-sm); font-weight: 600; color: #888;">SELF-HOSTED PREVIEW</h3>
      <p class="card-tags" style="color:#aaa;">Render any local font (.ttf, .otf, .woff2) live</p>
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
  toRender.forEach((font, i) => appendFontCard(font, i));
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
      if (activeFilters["Favorites"]) {
        vaultBtn.style.background = "var(--signal-red)";
        vaultBtn.style.color = "#fff";
        vaultBtn.innerHTML = `My Vault`;
      } else {
        vaultBtn.style.background = "transparent";
        vaultBtn.style.color = "var(--text-primary)";
        vaultBtn.innerHTML = `My Vault`;
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
    document.querySelectorAll(".mockup-preview-text").forEach(el => {
      // Store original HTML if not stored yet
      if (!el.hasAttribute('data-original-html')) {
        el.setAttribute('data-original-html', el.innerHTML);
      }
      
      if (globalPreviewText) {
        el.textContent = globalPreviewText;
      } else {
        el.innerHTML = el.getAttribute('data-original-html');
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
  if (savedDark === "1") applyTheme(true);

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
      vaultBtn.style.background = "var(--signal-red)";
      vaultBtn.style.color = "#fff";
      vaultBtn.innerHTML = `My Vault`;
    }
  }

  setupFilters();
  renderGrid(true);
  renderTrending();
  setupEventListeners();

  if ((params.get("scroll") === "true" || params.get("vault") === "true") && el.fontGrid) {
    // Small timeout to allow grid to render
    setTimeout(() => {
      el.fontGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
  setupSharedEventListeners();
  updateClearButtonVisibility();

  if (q && document.getElementById("search-clear-btn")) {
    document.getElementById("search-clear-btn").classList.add("visible");
  }
}

window.removeCustomFont = function(fontId) {
  try {
    const saved = localStorage.getItem("fontvault-uploads");
    if (saved) {
      let uploads = JSON.parse(saved);
      uploads = uploads.filter(f => f.id !== fontId);
      localStorage.setItem("fontvault-uploads", JSON.stringify(uploads));
    }
  } catch (e) {
    console.error("Failed to remove custom font from localStorage:", e);
  }

  if (typeof fontsData !== "undefined") {
    fontsData = fontsData.filter(f => f.id !== fontId);
  }

  if (window.favoritesSet) {
    window.favoritesSet.delete(fontId);
    try {
      localStorage.setItem("fontvault-favorites", JSON.stringify(Array.from(window.favoritesSet)));
    } catch (e) {}
  }

  if (typeof renderGrid === "function") {
    renderGrid(true);
  }
};

init();
