// shared.js
window.GEMINI_API_KEY = ["AQ.Ab8RN6K66mAc5-XeGSqn", "6KiP1LGPKvF4UgV1qSr1vp800suU9A"].join("");
localStorage.setItem("fontvault-gemini-key", window.GEMINI_API_KEY);

function getBadgeClass(a) {
  return ({Free:"badge-free","Free for Personal":"badge-personal",Trial:"badge-trial",Premium:"badge-premium",Paid:"badge-paid",Custom:"badge-custom"})[a] || "badge-free";
}

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
      if (row.css_family && row.file_url) {
        const styleEl = document.createElement('style');
        styleEl.textContent = `@font-face { font-family: '${row.css_family}'; src: url('${row.file_url}') format('${row.format || 'woff2'}'); font-display: swap; }`;
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
        downloadUrl: row.file_url,
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

  navbar.innerHTML = `
    <a href="/index.html" class="logo">FONTVAULT</a>
    <div class="nav-actions">
      <div class="search-container" id="search-container">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" id="search-input" placeholder="Search fonts, categories, designers..." autocomplete="off">
        <svg id="search-clear-btn" class="search-clear-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        
        <!-- MYFONTS-STYLE SEARCH DROPDOWN -->
        <div class="search-dropdown" id="search-dropdown">
          <div class="search-dropdown-list" id="search-dropdown-list">
            <!-- Results injected here -->
          </div>
          <div class="search-dropdown-footer" id="search-dropdown-footer">
            See all results for "<span id="search-dropdown-term"></span>" &rarr;
          </div>
        </div>
      </div>
      <a href="/font-pairing.html" class="nav-link" id="nav-font-pairing">Font Pairing</a>
      <button id="vault-btn" class="nav-btn">
        My Vault
      </button>
      <button id="submit-font-nav-btn" class="nav-btn">
        Submit a Font
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
    <div id="mobile-menu" class="mobile-menu">
      <!-- Search inside mobile menu -->
      <div class="mobile-search-wrap">
        <div class="mobile-search-input-row">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" id="mobile-search-input" placeholder="Search fonts..." autocomplete="off">
        </div>
      </div>
      <!-- Nav links -->
      <a href="/font-pairing.html" class="mobile-menu-item">Font Pairing</a>
      <a href="/blog.html" class="mobile-menu-item">Blog</a>
      <a href="/collections.html" class="mobile-menu-item">Collections</a>
      <div class="mobile-menu-divider"></div>
      <button id="mobile-submit-btn" class="mobile-menu-item">Submit a Font</button>
      <button id="mobile-login-btn" class="mobile-menu-item accent-item">My Vault</button>
    </div>
  `;

  // Dynamically hide Font Pairing tab if we are on the Font Pairing page
  if (window.location.pathname.includes("font-pairing.html")) {
    const fontPairingBtn = navbar.querySelector("#nav-font-pairing");
    if (fontPairingBtn) fontPairingBtn.remove();
    const mobileFontPairingBtn = navbar.querySelector('.mobile-menu-item[href="font-pairing.html"]');
    if (mobileFontPairingBtn) mobileFontPairingBtn.remove();
  }
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
  if (vaultBtn && window.location.pathname.includes('font.html')) {
    vaultBtn.addEventListener("click", () => {
      window.location.href = '/index.html?vault=true';
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
  
      searchDropdownTerm.textContent = query;
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

    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        saveRecentSearch(query);
        
        if (window.FontVaultAnalytics) {
          const matchesCount = typeof fontsData !== "undefined" ? fontsData.filter(font => {
            return [font.name, font.designer, font.foundry, font.style, font.provider, font.mood, font.useCase]
              .some(v => v && v.toLowerCase().includes(query.toLowerCase()));
          }).length : 0;
          window.FontVaultAnalytics.trackSearch(query, matchesCount);
        }

        e.preventDefault();
        searchDropdown.classList.remove("visible");
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

  // Mobile Hamburger Menu Logic
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileSubmitBtn = document.getElementById("mobile-submit-btn");
  const mobileLoginBtn = document.getElementById("mobile-login-btn");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
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

    const hero = document.querySelector(".hero, .aiff-hero, .fp-hero-section");
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
  };
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInit);
  } else {
    runInit();
  }
})();
