// shared.js

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

function setupSharedEventListeners() {
  const darkToggle = document.getElementById("dark-toggle");
  if (darkToggle) darkToggle.addEventListener("click", toggleDarkMode);

  // Logo home click
  const logos = document.querySelectorAll(".logo");
  logos.forEach(logo => {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      // If we are on font.html, navigate back to index.html
      if (window.location.pathname.includes('font.html')) {
        window.location.href = 'index.html';
      } else {
        if (typeof clearAllFilters === "function") clearAllFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  const vaultBtn = document.getElementById("vault-btn");
  if (vaultBtn && window.location.pathname.includes('font.html')) {
    vaultBtn.addEventListener("click", () => {
      window.location.href = 'index.html?vault=true';
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
            if (font) window.location.href = `font.html?id=${font.id}`;
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
        e.preventDefault();
        searchDropdown.classList.remove("visible");
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
          const gridSection = document.getElementById("font-grid");
          if (gridSection) {
            gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          const query = searchInput.value.trim();
          window.location.href = `index.html?search=${encodeURIComponent(query)}&scroll=true`;
        }
      }
    });
  
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim()) {
        searchDropdown.classList.add("visible");
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
      searchDropdown.classList.remove("visible");
      if (window.location.pathname.includes('font.html')) {
        window.location.href = `index.html?search=${encodeURIComponent(searchInput.value.trim())}`;
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
  const closeAuthBtn = document.getElementById("close-auth-btn");
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
}

// Global Favorites Logic
window.favoritesSet = new Set(JSON.parse(localStorage.getItem('fontvault-favorites') || '[]'));
window.toggleFavorite = function(fontId, btnElement) {
  if (window.favoritesSet.has(fontId)) {
    window.favoritesSet.delete(fontId);
    if (btnElement) {
      btnElement.classList.remove('active');
      btnElement.innerHTML = '♡';
      btnElement.style.color = 'var(--text-secondary)';
      if (btnElement.id !== 'btn-fd-download') btnElement.style.borderColor = 'var(--border-grey)';
    }
  } else {
    window.favoritesSet.add(fontId);
    if (btnElement) {
      btnElement.classList.add('active');
      btnElement.innerHTML = '♥';
      btnElement.style.color = 'var(--signal-red)';
      btnElement.style.transform = 'scale(1.2)';
      setTimeout(() => { if (btnElement) btnElement.style.transform = 'scale(1)'; }, 200);
      if (btnElement.id !== 'btn-fd-download') btnElement.style.borderColor = 'var(--signal-red)';
    }
  }
  localStorage.setItem('fontvault-favorites', JSON.stringify([...window.favoritesSet]));
  
  if (typeof activeFilters !== 'undefined' && activeFilters["Favorites"] && typeof renderGrid === 'function') {
    renderGrid(true);
  }
};
