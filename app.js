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
  const titleText = globalPreviewText || font.mockupTitle;

  const mockups = {
    magazine: (f,fam,badge) => `
      <div class="card-mockup" style="background:#F0EDE6;color:#0A0A0A;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div class="mockup-preview-text" style="font-family:${fam},serif;font-size:2.2rem;font-style:italic;line-height:1;text-align:center;">${titleText}</div>
        <div style="font-family:var(--font-mono);font-size:0.65rem;text-transform:uppercase;margin-top:0.8rem;letter-spacing:0.1em;color:#777;">${f.mockupSubtitle}</div>
      </div>`,
    ui: (f,fam,badge) => `
      <div class="card-mockup" style="background:#FAFAFA;color:#0A0A0A;display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div style="font-family:var(--font-mono);font-size:0.65rem;color:#888;">${f.mockupTitle}</div>
        <div class="mockup-preview-text" style="font-family:${fam},sans-serif;font-size:1.2rem;font-weight:600;line-height:1.3;margin:1rem 0;">${globalPreviewText || "Unlock variable spacing values seamlessly."}</div>
        <div style="display:flex;gap:0.5rem;">
          <div style="width:28px;height:12px;background:#000;border-radius:6px;"></div>
          <div style="width:12px;height:12px;background:#E0E0E0;border-radius:6px;"></div>
        </div>
      </div>`,
    code: (f,fam,badge) => `
      <div class="card-mockup" style="background:#111;color:#A9B1D6;display:flex;flex-direction:column;justify-content:center;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div class="mockup-preview-text" style="font-family:${fam},monospace;font-size:0.85rem;line-height:1.5;color:#E0E0E0;">
          ${globalPreviewText || `<span style="color:#FF3B00">const</span> config = {<br>
          &nbsp;&nbsp;theme: <span style="color:#A9B1D6">'mono-dark'</span>,<br>
          &nbsp;&nbsp;opacity: <span style="color:#00C853">0.95</span><br>
          }`}
        </div>
      </div>`,
    branding: (f,fam,badge) => `
      <div class="card-mockup" style="background:#0A0A0A;color:#FFF;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div class="mockup-preview-text" style="font-family:${fam},sans-serif;font-size:2.5rem;font-weight:700;line-height:0.95;letter-spacing:-0.04em;text-align:center;">${titleText}</div>
        <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--signal-red);margin-top:0.8rem;letter-spacing:0.2em;text-transform:uppercase;">${f.mockupSubtitle}</div>
      </div>`,
    poster: (f,fam,badge) => `
      <div class="card-mockup" style="background:#F5F5F5;color:#0A0A0A;display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem;border-bottom:1px solid var(--border-grey);">
        ${badge}
        <div class="mockup-preview-text" style="font-family:${fam},sans-serif;font-size:2.5rem;font-weight:800;line-height:0.85;letter-spacing:-0.02em;">${titleText}</div>
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
  `;

  // Card click → open detail
  card.addEventListener("click", e => {
    if (e.target.closest(".card-btn") || e.target.closest(".compare-add-btn")) return;
    openDetailPanel(font);
  });

  // Try Free / Buy button
  card.querySelector(".card-btn").addEventListener("click", () => openDetailPanel(font));

  // Compare add/remove button
  card.querySelector(".compare-add-btn").addEventListener("click", e => {
    e.stopPropagation();
    toggleCompare(font.id);
  });
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
//  DETAIL PANEL REDIRECT
// ─────────────────────────────────────────────────
function openDetailPanel(font) {
  window.location.href = `font.html?id=${font.id}`;
}

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
