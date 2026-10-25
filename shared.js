// shared.js

function getBadgeClass(a) {
  return ({Free:"badge-free","Free for Personal":"badge-personal",Trial:"badge-trial",Premium:"badge-premium",Paid:"badge-paid",Custom:"badge-custom"})[a] || "badge-free";
}

// ─────────────────────────────────────────────────
//  UNIVERSAL TOAST NOTIFICATION SYSTEM
// ─────────────────────────────────────────────────
window.showToast = function(message, type = "success", duration = 3500) {
  let container = document.getElementById("fv-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "fv-toast-container";
    container.className = "fv-toast-container";
    container.setAttribute("role", "status");
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `fv-toast fv-toast-${type}`;
  
  let iconSvg = "";
  if (type === "success") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    <div class="fv-toast-icon">${iconSvg}</div>
    <div class="fv-toast-msg">${message}</div>
    <button class="fv-toast-close" aria-label="Close notification">&times;</button>
  `;

  const closeBtn = toast.querySelector(".fv-toast-close");
  closeBtn.addEventListener("click", () => {
    toast.classList.add("fv-toast-hiding");
    setTimeout(() => toast.remove(), 250);
  });

  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add("fv-toast-hiding");
      setTimeout(() => toast.remove(), 250);
    }
  }, duration);
};

// ─────────────────────────────────────────────────
//  FORM VALIDATION & SUPPORT HELPERS
// ─────────────────────────────────────────────────
window.handleFontSubmission = function(e, form) {
  if (e) e.preventDefault();
  const input = form ? form.querySelector("input") : document.querySelector(".newsletter-form input");
  if (!input) return false;
  
  const val = input.value.trim();
  if (!val) {
    window.showToast("Please enter a font name or foundry link to submit.", "error");
    input.focus();
    return false;
  }
  
  if (val.length < 2) {
    window.showToast("Please provide a valid font name or URL.", "error");
    input.focus();
    return false;
  }

  window.showToast("Thank you! Your font submission has been received for review.", "success");
  input.value = "";
  return false;
};

window.openContactSupport = function(e) {
  if (e) e.preventDefault();
  const email = "support@fontvault.com";
  const subject = encodeURIComponent("FontVault Support & Inquiries");
  const body = encodeURIComponent("Hi FontVault Team,\n\nI need assistance with: \n\n[Please describe your question or issue here]\n\nBest,\n");
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};

// ─────────────────────────────────────────────────
//  SHARED: LOAD CUSTOM FONTS FROM SUPABASE
//  Called on both index.html and font.html (detail page)
//  so admin-uploaded fonts appear everywhere.
// ─────────────────────────────────────────────────
async function loadCustomFontsFromSupabase() {
  // Fallback credentials — config.js may not be deployed (gitignored)
  const url = window.SUPABASE_URL || "https://alvarlzjtdmkvbxehppt.supabase.co";
  const key = window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdmFybHpqdGRta3ZieGVocHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjA3MDIsImV4cCI6MjA5ODI5NjcwMn0.kopGopXghwNdHM6cawDhpjrYui0MzqpAROsYHHMZEeE";

  if (!window.supabase) return;

  try {
    const sb = window.supabase.createClient(url, key);
    const { data, error } = await sb.from('custom_fonts').select('*').order('created_at', { ascending: false });
    if (error) { console.warn('[FontVault] Supabase fetch error:', error.message); return; }
    if (!data || data.length === 0) return;

    data.forEach(row => {
      // Skip if already loaded (e.g. called twice)
      if (fontsData.find(f => f.id === row.id)) return;

      // Register @font-face so the font actually renders
      if (row.css_family && row.public_url) {
        const styleEl = document.createElement('style');
        styleEl.textContent = `@font-face { font-family: '${row.css_family}'; src: url('${row.public_url}') format('${row.format || 'woff2'}'); font-display: swap; }`;
        document.head.appendChild(styleEl);
      }

      fontsData.unshift({
        id: row.id,
        name: row.name,
        provider: 'custom',
        designer: row.designer || 'Unknown',
        foundry: row.foundry || '—',
        year: new Date(row.created_at).getFullYear().toString(),
        stylesCount: 1,
        languages: ['Latin'],
        description: row.description || `Uploaded font: ${row.name}`,
        availability: 'Custom',
        mood: row.tags?.[0] || 'Modern',
        useCase: 'Web',
        style: row.category || 'Sans-Serif',
        language: 'Latin',
        downloadUrl: row.public_url,
        price: row.is_free ? 'Free' : 'Paid',
        fileSize: row.file_size || '—',
        cssFamily: row.css_family ? `'${row.css_family}'` : `'${row.name}'`,
        format: row.format,
        slug: row.slug,
        pairsWith: []
      });
    });
  } catch (err) {
    console.warn('[FontVault] Failed to load custom fonts:', err);
  }
}

function loadExternalFont(font) {
  const linkId = `font-face-${font.id}`;
  if (document.getElementById(linkId)) return;

  // Custom Hosted Fonts Support
  if (font.localUrl) {
    const style = document.createElement("style");
    style.id = linkId;
    let format = font.format || 'woff2';
    if (!font.format) {
      if (font.localUrl.endsWith('.ttf')) format = 'truetype';
      else if (font.localUrl.endsWith('.otf')) format = 'opentype';
      else if (font.localUrl.endsWith('.woff')) format = 'woff';
    }

    style.innerHTML = `
      @font-face {
        font-family: '${font.name}';
        src: url('${font.localUrl}') format('${format}');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    return;
  }

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';

  if (font.provider === "google") {
    const n = font.name.replace(/\s+/g, '+');
    if (font.variants && Array.isArray(font.variants)) {
      const wghts = new Set();
      let hasItalic = false;
      let hasNormal = false;
      
      font.variants.forEach(v => {
        if (v.includes('italic')) hasItalic = true;
        else hasNormal = true;
        
        const num = v.match(/\d+/);
        if (num) {
          wghts.add(num[0]);
        } else if (v === 'regular') {
          wghts.add('400');
        }
      });
      
      if (wghts.size === 0) wghts.add('400');
      const sortedWghts = Array.from(wghts).sort((a,b) => parseInt(a) - parseInt(b));
      
      if (hasItalic && hasNormal) {
        const pairs = [];
        sortedWghts.forEach(w => {
          const wStr = w === '400' ? 'regular' : w;
          if (font.variants.includes(wStr) || font.variants.includes(w)) {
            pairs.push(`0,${w}`);
          }
          if (font.variants.includes(`${w}italic`) || (w === '400' && font.variants.includes('italic'))) {
            pairs.push(`1,${w}`);
          }
        });
        pairs.sort((a,b) => {
          const [italA, wA] = a.split(',').map(Number);
          const [italB, wB] = b.split(',').map(Number);
          if (italA !== italB) return italA - italB;
          return wA - wB;
        });
        link.href = `https://fonts.googleapis.com/css2?family=${n}:ital,wght@${pairs.join(';')}&display=swap`;
      } else if (hasItalic) {
        link.href = `https://fonts.googleapis.com/css2?family=${n}:ital,wght@1,${sortedWghts.join(';')}&display=swap`;
      } else {
        link.href = `https://fonts.googleapis.com/css2?family=${n}:wght@${sortedWghts.join(';')}&display=swap`;
      }
    } else {
      link.href = `https://fonts.googleapis.com/css2?family=${n}:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap`;
    }
  } else if (font.provider === "fontshare") {
    const slug = font.name.toLowerCase().replace(/\s+/g, '-');
    link.href = `https://api.fontshare.com/v2/css?f=${slug}@100,200,300,400,500,600,700,800,900&display=swap`;
  } else if (font.provider === "dafont") {
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
  } else if (font.provider === "adobe") {
    const savedKit = localStorage.getItem('fontvault-adobe-kit-id');
    const kitId = font.adobeKitId || savedKit;
    if (font.adobeCssUrl) {
      link.href = font.adobeCssUrl;
    } else if (kitId) {
      link.href = kitId.startsWith('http') ? kitId : `https://use.typekit.net/${kitId}.css`;
    } else {
      link.href = `https://use.typekit.net/${font.id}.css`;
    }
  }

  document.head.appendChild(link);
}

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

function openAuthModal() {
  const overlay = document.getElementById("auth-overlay");
  if (overlay) {
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
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

function renderUniversalNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  // If the navbar already has our logo image, do NOT overwrite it
  if (navbar.querySelector('.logo-img')) {
    return;
  }

  navbar.innerHTML = `
    <a href="index.html" class="logo logo-link" aria-label="FontVault Homepage">
      <img src="data:image/png;base64,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" alt="FontVault" class="logo-img logo-img-light" style="height:32px;width:auto;display:block;">
      <img src="data:image/png;base64,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" alt="FontVault" class="logo-img logo-img-dark" style="height:32px;width:auto;display:none;">
    </a>
    <div class="nav-actions">
      <a href="font-pairing.html" class="nav-link">Font Pairing</a>
      <a href="collections.html" class="nav-link">Collections</a>
      <a href="blog.html" class="nav-link">Blog</a>
      <div class="search-container" id="search-container" role="search">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" id="search-input" placeholder="Search fonts, categories, designers..." autocomplete="off" aria-label="Search fonts by name, category, or designer" aria-autocomplete="list" aria-controls="search-dropdown">
        <svg id="search-clear-btn" class="search-clear-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="button" aria-label="Clear search">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        
        <div class="search-dropdown" id="search-dropdown">
          <div class="search-dropdown-list" id="search-dropdown-list"></div>
          <div class="search-dropdown-footer" id="search-dropdown-footer">
            See all results for "<span id="search-dropdown-term"></span>" &rarr;
          </div>
        </div>
      </div>
      <button id="vault-btn" class="nav-btn">My Vault</button>
      <button id="mobile-search-toggle-btn" class="nav-btn mobile-search-toggle-btn" aria-label="Search fonts" title="Search fonts">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
      <button id="dark-toggle" class="nav-btn dark-toggle-btn" aria-label="Toggle dark mode" title="Toggle dark mode">
        <svg id="dark-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button id="hamburger-btn" class="hamburger-btn" aria-label="Open menu" aria-expanded="false">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
    <div id="mobile-search-drawer" class="mobile-search-drawer" aria-hidden="true">
      <div class="mobile-search-drawer-inner">
        <svg class="mobile-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="mobile-header-search-input" placeholder="Search fonts, styles, designers..." autocomplete="off" aria-label="Search fonts on mobile">
        <button type="button" id="mobile-search-clear-btn" class="mobile-search-clear" aria-label="Clear search text">&times;</button>
      </div>
    </div>
    <div id="mobile-menu" class="mobile-menu">
      <div class="mobile-search-wrap">
        <div class="mobile-search-input-row">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" id="mobile-search-input" placeholder="Search fonts..." autocomplete="off" aria-label="Search fonts">
        </div>
      </div>
      <a href="index.html" class="mobile-menu-item">Home</a>
      <a href="font-pairing.html" class="mobile-menu-item">Font Pairing</a>
      <a href="collections.html" class="mobile-menu-item">Collections</a>
      <a href="blog.html" class="mobile-menu-item">Blog</a>
      <div class="mobile-menu-divider"></div>
      <button id="mobile-login-btn" class="mobile-menu-item accent-item">My Vault</button>
    </div>
  `;
}

let sharedEventListenersSetup = false;
function setupSharedEventListeners() {
  if (sharedEventListenersSetup) return;
  sharedEventListenersSetup = true;

  const darkToggle = document.getElementById("dark-toggle");
  if (darkToggle) darkToggle.addEventListener("click", toggleDarkMode);

  // Logo home click
  const logos = document.querySelectorAll(".logo");
  logos.forEach(logo => {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      const isHomePage = window.location.pathname === '/' || 
                         window.location.pathname.endsWith('index.html') ||
                         window.location.pathname === '';
      if (!isHomePage) {
        window.location.href = '/index.html';
      } else {
        if (typeof clearAllFilters === "function") clearAllFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  const vaultBtn = document.getElementById("vault-btn");
  if (vaultBtn) {
    vaultBtn.addEventListener("click", () => {
      const isHome = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
      if (!isHome) {
        window.location.href = '/index.html?vault=true';
      }
    });
  }

  const submitNavBtn = document.getElementById("submit-font-nav-btn");
  if (submitNavBtn) {
    submitNavBtn.addEventListener("click", () => {
      if (typeof openAuthModal === "function") {
        openAuthModal();
      } else {
        window.location.href = '/index.html#submit';
      }
    });
  }

  // Search input & dropdown logic
  const searchInput = document.getElementById("search-input");
  const searchContainer = document.getElementById("search-container");
  const searchDropdown = document.getElementById("search-dropdown");
  const searchDropdownList = document.getElementById("search-dropdown-list");
  const searchDropdownFooter = document.getElementById("search-dropdown-footer");
  const searchDropdownTerm = document.getElementById("search-dropdown-term");
  const searchClearBtn = document.getElementById("search-clear-btn");

  if (searchInput && searchDropdown) {
    function saveRecentSearch(query) {
      if (!query) return;
      try {
        const saved = localStorage.getItem("fontvault-recent-searches");
        let searches = saved ? JSON.parse(saved) : [];
        searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
        searches.unshift(query);
        if (searches.length > 5) {
          searches.pop();
        }
        localStorage.setItem("fontvault-recent-searches", JSON.stringify(searches));
      } catch (e) {
        console.error("Failed to save recent search:", e);
      }
    }

    window.deleteRecentSearch = function(query) {
      try {
        const saved = localStorage.getItem("fontvault-recent-searches");
        if (saved) {
          let searches = JSON.parse(saved);
          searches = searches.filter(s => s !== query);
          localStorage.setItem("fontvault-recent-searches", JSON.stringify(searches));
        }
      } catch (e) {
        console.error("Failed to delete recent search:", e);
      }
      renderRecentSearches();
    };

    function renderRecentSearches() {
      try {
        const saved = localStorage.getItem("fontvault-recent-searches");
        const searches = saved ? JSON.parse(saved) : [];
        
        if (searches.length === 0) {
          searchDropdown.classList.remove("visible");
          return;
        }

        if (searchDropdownFooter) {
          searchDropdownFooter.style.display = "none";
        }

        searchDropdownList.innerHTML = `
          <div style="padding: 0.5rem 1rem; font-size: 0.7rem; text-transform: uppercase; color: #888; font-family: var(--font-mono); font-weight: 700; border-bottom: 1px solid var(--border-grey); display: flex; justify-content: space-between; align-items: center;">
            <span>Recent Searches</span>
            <button id="clear-recent-searches-btn" style="background: none; border: none; color: var(--signal-red); font-size: 0.7rem; cursor: pointer; text-transform: uppercase; font-weight: 700;">Clear All</button>
          </div>
          ${searches.map(query => `
            <div class="search-dropdown-recent-item" data-query="${query}" style="display: flex; align-items: center; justify-content: space-between; color: var(--near-black);">
              <div style="display: flex; align-items: center; gap: 0.75rem; width: 100%;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #888; flex-shrink: 0;">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${query}</span>
              </div>
              <button class="delete-recent-search-btn" data-query="${query}" style="background: none; border: none; color: #888; font-size: 1rem; cursor: pointer; padding: 0.25rem;" onclick="event.stopPropagation(); deleteRecentSearch('${query}')">✕</button>
            </div>
          `).join("")}
        `;

        searchDropdownList.querySelectorAll(".search-dropdown-recent-item").forEach(item => {
          item.addEventListener("click", (e) => {
            if (e.target.closest(".delete-recent-search-btn")) return;
            const q = item.dataset.query;
            searchInput.value = q;
            searchDropdown.classList.remove("visible");
            if (searchClearBtn) searchClearBtn.classList.add("visible");

            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
              if (typeof renderGrid === "function" && typeof window.searchQuery !== "undefined") {
                window.searchQuery = q;
                renderGrid();
                const gridSection = document.getElementById("font-grid");
                if (gridSection) {
                  gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            } else {
              window.location.href = `/index.html?search=${encodeURIComponent(q)}&scroll=true`;
            }
          });
        });

        const clearBtn = document.getElementById("clear-recent-searches-btn");
        if (clearBtn) {
          clearBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            localStorage.removeItem("fontvault-recent-searches");
            searchDropdown.classList.remove("visible");
          });
        }

        searchDropdown.classList.add("visible");
      } catch (e) {
        console.error("Error rendering recent searches:", e);
      }
    }

    function renderSearchDropdown(query) {
      if (!query) {
        renderRecentSearches();
        return;
      }
  
      if (searchDropdownFooter) {
        searchDropdownFooter.style.display = "";
      }

      const q = query.toLowerCase();
      const fontList = typeof fontsData !== "undefined" ? fontsData : [];
      const matches = fontList.filter(font => {
        const tagsStr = Array.isArray(font.tags) ? font.tags.join(' ') : (font.tags || '');
        return [font.name, font.designer, font.foundry, font.style, font.provider, font.mood, font.useCase, tagsStr]
          .some(v => v && String(v).toLowerCase().includes(q));
      }).slice(0, 5); // top 5 results
  
      if (matches.length === 0) {
        searchDropdownList.innerHTML = `<div class="search-dropdown-item" style="cursor:default;color:#888;">No fonts found matching "${query}"</div>`;
      } else {
        searchDropdownList.innerHTML = matches.map(font => {
          if (typeof loadExternalFont === "function") loadExternalFont(font);
          const fam = font.cssFamily || `'${font.name}'`;
          const providerLabel = { google:"Google Fonts", fontshare:"Fontshare", dafont:"Dafont", adobe:"Adobe Fonts" }[font.provider] || font.provider || "Font";
          return `
            <div class="search-dropdown-item" data-id="${font.id}">
              <div class="search-dropdown-item-left">
                <span class="search-dropdown-name" style="font-family:${fam},sans-serif;">${font.name}</span>
                <span class="search-dropdown-meta">${font.style || 'Sans-Serif'} &middot; ${font.designer || font.foundry || 'Unknown Designer'}</span>
              </div>
              <span class="search-dropdown-provider">${providerLabel}</span>
            </div>
          `;
        }).join("");
  
        // Add click to dropdown items
        searchDropdownList.querySelectorAll(".search-dropdown-item").forEach(item => {
          item.addEventListener("click", () => {
            const fontList = typeof fontsData !== "undefined" ? fontsData : [];
            const font = fontList.find(f => f.id === item.dataset.id);
            const query = searchInput.value.trim();
            saveRecentSearch(query);
            if (window.FontVaultAnalytics) {
              window.FontVaultAnalytics.trackSearch(query, 1);
            }
            if (font) window.location.href = `/fonts/${font.id}`;
            searchDropdown.classList.remove("visible");
          });
        });
      }
  
      if (searchDropdownTerm) searchDropdownTerm.textContent = query;
      searchDropdown.classList.add("visible");
    }
  
    searchInput.addEventListener("input", e => {
      const query = e.target.value.trim();
      renderSearchDropdown(query);
      
      if (query) searchClearBtn?.classList.add("visible");
      else searchClearBtn?.classList.remove("visible");
  
      if (typeof renderGrid === "function" && typeof window.searchQuery !== "undefined") {
        window.searchQuery = query;
        renderGrid();
      }
    });

    let activeDropdownIndex = -1;

    searchInput.addEventListener("keydown", e => {
      const items = searchDropdownList ? Array.from(searchDropdownList.querySelectorAll(".search-dropdown-item, .search-dropdown-recent-item")) : [];

      if (e.key === "Escape") {
        searchDropdown.classList.remove("visible");
        activeDropdownIndex = -1;
        return;
      }

      if (e.key === "ArrowDown" && items.length > 0) {
        e.preventDefault();
        activeDropdownIndex = (activeDropdownIndex + 1) % items.length;
        items.forEach((it, idx) => it.classList.toggle("dropdown-keyboard-active", idx === activeDropdownIndex));
        if (items[activeDropdownIndex]) {
          items[activeDropdownIndex].scrollIntoView({ block: "nearest" });
        }
        return;
      }

      if (e.key === "ArrowUp" && items.length > 0) {
        e.preventDefault();
        activeDropdownIndex = (activeDropdownIndex - 1 + items.length) % items.length;
        items.forEach((it, idx) => it.classList.toggle("dropdown-keyboard-active", idx === activeDropdownIndex));
        if (items[activeDropdownIndex]) {
          items[activeDropdownIndex].scrollIntoView({ block: "nearest" });
        }
        return;
      }

      if (e.key === "Enter") {
        if (activeDropdownIndex >= 0 && items[activeDropdownIndex]) {
          e.preventDefault();
          items[activeDropdownIndex].click();
          activeDropdownIndex = -1;
          return;
        }

        const query = searchInput.value.trim();
        saveRecentSearch(query);
        
        if (window.FontVaultAnalytics) {
          const matchesCount = typeof fontsData !== "undefined" ? fontsData.filter(font => {
            const tagsStr = Array.isArray(font.tags) ? font.tags.join(' ') : (font.tags || '');
            return [font.name, font.designer, font.foundry, font.style, font.provider, font.mood, font.useCase, tagsStr]
              .some(v => v && String(v).toLowerCase().includes(query.toLowerCase()));
          }).length : 0;
          window.FontVaultAnalytics.trackSearch(query, matchesCount);
        }

        e.preventDefault();
        searchDropdown.classList.remove("visible");
        activeDropdownIndex = -1;
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
          const gridSection = document.getElementById("font-grid");
          if (gridSection) {
            gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          window.location.href = `/index.html?search=${encodeURIComponent(query)}&scroll=true`;
        }
      }
    });
  
    searchInput.addEventListener("focus", () => {
      const q = searchInput.value.trim();
      if (q) {
        renderSearchDropdown(q);
      } else {
        renderRecentSearches();
      }
    });

    searchInput.addEventListener("click", () => {
      const q = searchInput.value.trim();
      if (!q) {
        renderRecentSearches();
      }
    });
  
    searchClearBtn?.addEventListener("click", () => {
      searchInput.value = "";
      searchClearBtn.classList.remove("visible");
      searchDropdown.classList.remove("visible");
      if (typeof renderGrid === "function" && typeof window.searchQuery !== "undefined") {
        window.searchQuery = "";
        renderGrid();
      }
      searchInput.focus();
    });
  
    // Footer click to scroll down to full results (only on index)
    searchDropdownFooter?.addEventListener("click", () => {
      const query = searchInput.value.trim();
      saveRecentSearch(query);
      searchDropdown.classList.remove("visible");
      if (window.location.pathname.includes('font.html')) {
        window.location.href = `/index.html?search=${encodeURIComponent(query)}`;
      } else {
        document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  
    // Hide dropdown when clicking outside
    document.addEventListener("click", e => {
      if (searchContainer && !searchContainer.contains(e.target)) {
        searchDropdown?.classList.remove("visible");
      }
    });
  }

  // Auth modal handlers
  const authTabBtns = document.querySelectorAll(".auth-tab");
  const overlay = document.getElementById("auth-overlay");
  if (overlay) {
    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeAuthModal();
    });
  }
  const closeAuthBtn = document.getElementById("auth-close") || document.getElementById("close-auth-btn");
  if (closeAuthBtn) {
    closeAuthBtn.addEventListener("click", closeAuthModal);
  }

  authTabBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      authTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.mode;
      const subtitle = document.getElementById("auth-subtitle");
      const submitBtn = document.getElementById("btn-auth-submit");
      const forgotLink = document.getElementById("auth-forgot");
      if (mode === "signup") {
        if (subtitle) subtitle.textContent = "Create an account to submit and save fonts.";
        if (submitBtn) submitBtn.textContent = "Create Account";
        if (forgotLink) forgotLink.style.display = "none";
      } else {
        if (subtitle) subtitle.textContent = "Sign in to submit and save fonts.";
        if (submitBtn) submitBtn.textContent = "Sign In";
        if (forgotLink) forgotLink.style.display = "";
      }
    });
  });

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

  const form = document.getElementById("auth-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("auth-email")?.value.trim();
      const password = document.getElementById("auth-password")?.value;
      const activeTab = document.querySelector(".auth-tab.active")?.dataset.mode;

      if (!email || !password) { alert("Please fill in both email and password."); return; }
      if (password.length < 6) { alert("Password must be at least 6 characters."); return; }

      const submitBtn = document.getElementById("btn-auth-submit");
      if (submitBtn) { submitBtn.textContent = "Please wait..."; submitBtn.disabled = true; }
      setTimeout(() => {
        closeAuthModal();
        if (submitBtn) { submitBtn.textContent = activeTab === "signup" ? "Create Account" : "Sign In"; submitBtn.disabled = false; }
        alert(`Welcome to FontVault!`);
      }, 1000);
    });
  }

  const submitFontBtn = document.getElementById("btn-submit-font");
  if (submitFontBtn) {
    submitFontBtn.addEventListener("click", () => {
      openAuthModal();
    });
  }

  // Mobile Search Drawer Logic
  const mobileSearchToggleBtn = document.getElementById("mobile-search-toggle-btn");
  const mobileSearchDrawer = document.getElementById("mobile-search-drawer");
  const mobileHeaderSearchInput = document.getElementById("mobile-header-search-input");
  const mobileSearchClearBtn = document.getElementById("mobile-search-clear-btn");

  if (mobileSearchToggleBtn && mobileSearchDrawer) {
    mobileSearchToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mobileSearchDrawer.classList.toggle("open");
      mobileSearchToggleBtn.classList.toggle("active", isOpen);
      mobileSearchDrawer.setAttribute("aria-hidden", !isOpen);
      if (isOpen) {
        const mobileMenu = document.getElementById("mobile-menu");
        const hamburgerBtn = document.getElementById("hamburger-btn");
        if (mobileMenu && hamburgerBtn) {
          mobileMenu.classList.remove("open");
          hamburgerBtn.classList.remove("open");
          hamburgerBtn.setAttribute("aria-expanded", "false");
        }
        if (mobileHeaderSearchInput) {
          setTimeout(() => mobileHeaderSearchInput.focus(), 150);
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (!mobileSearchDrawer.contains(e.target) && !mobileSearchToggleBtn.contains(e.target)) {
        mobileSearchDrawer.classList.remove("open");
        mobileSearchToggleBtn.classList.remove("active");
        mobileSearchDrawer.setAttribute("aria-hidden", "true");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        mobileSearchDrawer.classList.remove("open");
        mobileSearchToggleBtn.classList.remove("active");
        mobileSearchDrawer.setAttribute("aria-hidden", "true");
      }
    });
  }

  if (mobileSearchClearBtn && mobileHeaderSearchInput) {
    mobileSearchClearBtn.addEventListener("click", () => {
      mobileHeaderSearchInput.value = "";
      const mainSearch = document.getElementById("search-input");
      if (mainSearch) {
        mainSearch.value = "";
        mainSearch.dispatchEvent(new Event("input", { bubbles: true }));
      }
      mobileHeaderSearchInput.focus();
    });
  }

  if (mobileHeaderSearchInput) {
    mobileHeaderSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = mobileHeaderSearchInput.value.trim();
        if (!q) return;
        const mainSearch = document.getElementById("search-input");
        if (mainSearch) {
          mainSearch.value = q;
          mainSearch.dispatchEvent(new Event("input", { bubbles: true }));
          mobileSearchDrawer?.classList.remove("open");
          mobileSearchToggleBtn?.classList.remove("active");
          mobileSearchDrawer?.setAttribute("aria-hidden", "true");
          const grid = document.getElementById("font-library-section") || document.getElementById("main-content");
          if (grid) grid.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = `index.html?search=${encodeURIComponent(q)}`;
        }
      }
    });

    mobileHeaderSearchInput.addEventListener("input", (e) => {
      const mainSearch = document.getElementById("search-input");
      if (mainSearch) {
        mainSearch.value = e.target.value;
        mainSearch.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }

  // Mobile Hamburger Menu Logic
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileSubmitBtn = document.getElementById("mobile-submit-btn");
  const mobileLoginBtn = document.getElementById("mobile-login-btn");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (mobileSearchDrawer) {
        mobileSearchDrawer.classList.remove("open");
        mobileSearchToggleBtn?.classList.remove("active");
        mobileSearchDrawer.setAttribute("aria-hidden", "true");
      }
      const isOpen = mobileMenu.classList.toggle("open");
      hamburgerBtn.classList.toggle("open");
      hamburgerBtn.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        mobileMenu.classList.remove("open");
        hamburgerBtn.classList.remove("open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (mobileSubmitBtn) {
    mobileSubmitBtn.addEventListener("click", () => {
      if (mobileMenu && hamburgerBtn) {
        mobileMenu.classList.remove("open");
        hamburgerBtn.classList.remove("open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      }
      openAuthModal();
    });
  }

  if (mobileLoginBtn) {
    mobileLoginBtn.addEventListener("click", () => {
      if (mobileMenu && hamburgerBtn) {
        mobileMenu.classList.remove("open");
        hamburgerBtn.classList.remove("open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      }
      // Explicitly switch to Sign In mode
      const signinTab = document.querySelector('.auth-tab[data-mode="signin"]');
      if (signinTab) {
        signinTab.click();
      }
      openAuthModal();
    });
  }

  // Mobile search input — redirect to homepage with query, or wire to main search
  const mobileSearchInput = document.getElementById("mobile-search-input");
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = mobileSearchInput.value.trim();
        if (!q) return;
        // If main search input exists on this page, sync and trigger it
        const mainSearch = document.getElementById("search-input");
        if (mainSearch) {
          mainSearch.value = q;
          mainSearch.dispatchEvent(new Event("input", { bubbles: true }));
          // Close mobile menu
          if (mobileMenu && hamburgerBtn) {
            mobileMenu.classList.remove("open");
            hamburgerBtn.classList.remove("open");
            hamburgerBtn.setAttribute("aria-expanded", "false");
          }
        } else {
          // Navigate to home with search query
          window.location.href = `/index.html?search=${encodeURIComponent(q)}`;
        }
      }
    });
  }
}

// Global Favorites Logic
window.favoritesSet = new Set(JSON.parse(localStorage.getItem('fontvault-favorites') || '[]'));
window.toggleFavorite = function(fontId, btnElement) {
  if (window.favoritesSet.has(fontId)) {
    window.favoritesSet.delete(fontId);
    if (btnElement) {
      btnElement.classList.remove('active');
      const isHeartSVG = btnElement.querySelector('svg.heart-icon');
      if (isHeartSVG) {
        isHeartSVG.setAttribute('fill', 'none');
      }
      btnElement.style.color = 'var(--text-secondary)';
      if (btnElement.id !== 'btn-fd-download') btnElement.style.borderColor = 'var(--border-grey)';
    }
  } else {
    window.favoritesSet.add(fontId);
    if (btnElement) {
      btnElement.classList.add('active');
      const isHeartSVG = btnElement.querySelector('svg.heart-icon');
      if (isHeartSVG) {
        isHeartSVG.setAttribute('fill', 'currentColor');
      }
      btnElement.style.color = 'var(--signal-red)';
      btnElement.style.transform = 'scale(1.2)';
      setTimeout(() => { if (btnElement) btnElement.style.transform = 'scale(1)'; }, 200);
      if (btnElement.id !== 'btn-fd-download') btnElement.style.borderColor = 'var(--signal-red)';
    }
  }
  localStorage.setItem('fontvault-favorites', JSON.stringify([...window.favoritesSet]));
  
  if (window.FontVaultAnalytics) {
    const fontObj = typeof fontsData !== "undefined" ? fontsData.find(f => f.id === fontId) : null;
    const fontName = fontObj ? fontObj.name : fontId;
    window.FontVaultAnalytics.trackFavorite(fontName, window.favoritesSet.has(fontId));
  }
  
  if (typeof activeFilters !== 'undefined' && activeFilters["Favorites"] && typeof renderGrid === 'function') {
    renderGrid(true);
  }
};

// Navbar scroll effect
(function setupNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  
  const handleScroll = () => {
    // Height collapse globally on scroll
    navbar.classList.toggle("collapsed", window.scrollY > 80);

    const hero = document.querySelector(".hero, .fp-hero-section");
    if (!hero) {
      navbar.classList.add("navbar-scrolled");
      return;
    }
    const heroHeight = hero.offsetHeight || 300;
    if (window.scrollY > Math.max(80, heroHeight - 80)) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };
  
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
  document.addEventListener("DOMContentLoaded", handleScroll);
  setTimeout(handleScroll, 50);
})();

// Automatically initialize dynamic navbar and listeners on load
(function initSharedNavbar() {
  const runInit = () => {
    renderUniversalNavbar();
    setupSharedEventListeners();
    if (typeof loadCustomFontsFromSupabase === "function") {
      loadCustomFontsFromSupabase().catch(err => console.warn(err));
    }
  };
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInit);
  } else {
    runInit();
  }
})();
