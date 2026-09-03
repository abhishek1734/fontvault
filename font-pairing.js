/* =============================================================
   FONTVAULT — font-pairing.js (v3.0)
   Rules-Based Typography Pairing Studio Controller
   Runs 100% on client-side typography design rules, curated seeds,
   and dynamic explanation generation with zero external APIs.
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE ---
  let activePairings = [];
  let comparedPairings = [];
  let savedCollections = JSON.parse(localStorage.getItem("fontvault-saved-pairings")) || [];

  // --- DOM ELEMENTS ---
  // Mode Switcher
  const modePromptBtn = document.getElementById("fp-mode-prompt");
  const modeBasefontBtn = document.getElementById("fp-mode-basefont");
  const panelPrompt = document.getElementById("fp-panel-prompt");
  const panelBasefont = document.getElementById("fp-panel-basefont");

  // Base Font Panel Controls
  const baseFontSelect = document.getElementById("fp-base-font-select");
  const baseRoleSelect = document.getElementById("fp-base-role-select");
  const baseSubmitBtn = document.getElementById("fp-base-submit-btn");

  // Natural Language & Mood Controls
  const promptTextarea = document.getElementById("fp-prompt-textarea");
  const advancedToggle = document.getElementById("fp-advanced-toggle");
  const advancedFilters = document.querySelector(".fp-advanced-filters");
  const generateBtn = document.getElementById("fp-generate-btn");
  const clearBtn = document.getElementById("fp-clear-btn");
  const randomBtn = document.getElementById("fp-random-inspiration-btn");

  // Loading & Results
  const processingState = document.getElementById("fp-processing-state");
  const loaderStatusText = document.getElementById("fp-loader-status-text");
  const stickyToolbar = document.getElementById("fp-sticky-toolbar");
  const resultsArea = document.getElementById("fp-results-area");
  const resultsGrid = document.getElementById("fp-results-grid");
  const savedSection = document.getElementById("fp-saved-section");
  const savedGrid = document.getElementById("fp-saved-grid");

  // Sticky Controls
  const customTextInput = document.getElementById("fp-custom-text-input");
  const sizeSlider = document.getElementById("fp-size-slider");
  const spacingSlider = document.getElementById("fp-spacing-slider");
  const pairFilters = document.getElementById("fp-pair-filters");

  // Drawers
  const compareDrawer = document.getElementById("fp-compare-drawer");
  const drawerCloseBtn = document.getElementById("fp-drawer-close-btn");
  const compareBody = document.getElementById("fp-compare-body");

  const detailsDrawer = document.getElementById("fp-details-drawer");
  const detailsCloseBtn = document.getElementById("fp-details-close-btn");
  const detailsBody = document.getElementById("fp-details-body");

  // --- POPULATE BASE FONT DROPDOWN ---
  function populateFontSelect() {
    if (!baseFontSelect || typeof fontsData === "undefined" || !Array.isArray(fontsData)) return;

    // Filter unique font names and sort alphabetically
    const uniqueFonts = [];
    const seen = new Set();
    fontsData.forEach(f => {
      if (f && f.name && !seen.has(f.name.toLowerCase())) {
        seen.add(f.name.toLowerCase());
        uniqueFonts.push(f);
      }
    });
    uniqueFonts.sort((a, b) => a.name.localeCompare(b.name));

    baseFontSelect.innerHTML = '<option value="">Choose a font to pair with...</option>';
    uniqueFonts.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f.name;
      opt.textContent = `${f.name} (${f.style || 'Font'} · ${f.provider || 'free'})`;
      baseFontSelect.appendChild(opt);
    });

    // Default select Playfair Display if available
    const defaultFont = uniqueFonts.find(f => f.name.toLowerCase() === "playfair display");
    if (defaultFont) {
      baseFontSelect.value = defaultFont.name;
    }
  }

  // Populate immediately or on delay if Supabase custom fonts are still loading
  populateFontSelect();
  setTimeout(populateFontSelect, 500);

  // --- MODE SWITCHER LOGIC ---
  if (modePromptBtn && modeBasefontBtn && panelPrompt && panelBasefont) {
    modePromptBtn.addEventListener("click", () => {
      modePromptBtn.classList.add("active");
      modeBasefontBtn.classList.remove("active");
      panelPrompt.style.display = "block";
      panelBasefont.style.display = "none";
    });

    modeBasefontBtn.addEventListener("click", () => {
      modeBasefontBtn.classList.add("active");
      modePromptBtn.classList.remove("active");
      panelPrompt.style.display = "none";
      panelBasefont.style.display = "flex";
    });
  }

  // --- COLLAPSIBLE ADVANCED FILTERS ---
  if (advancedToggle && advancedFilters) {
    advancedToggle.addEventListener("click", () => {
      advancedFilters.classList.toggle("open");
    });
  }

  // Tone Tags Toggle
  const toneTags = document.querySelectorAll(".fp-tone-tag");
  toneTags.forEach(tag => {
    tag.addEventListener("click", () => {
      tag.classList.toggle("selected");
    });
  });

  // Auto-resizing Textarea
  if (promptTextarea) {
    promptTextarea.addEventListener("input", function() {
      this.style.height = "auto";
      this.style.height = (this.scrollHeight) + "px";
    });
  }

  // Chips & Suggestions Click Fill
  const fillableElements = document.querySelectorAll(".fp-hero-chip, .fp-suggestion-link");
  fillableElements.forEach(el => {
    el.addEventListener("click", () => {
      const pr = el.dataset.prompt;
      if (promptTextarea && pr) {
        promptTextarea.value = pr;
        promptTextarea.style.height = "auto";
        promptTextarea.style.height = (promptTextarea.scrollHeight) + "px";
        promptTextarea.focus();
        document.querySelector(".fp-input-row-wrapper")?.classList.add("typing");
      }
    });
  });

  // Clear Prompt
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (promptTextarea) {
        promptTextarea.value = "";
        promptTextarea.style.height = "auto";
      }
      document.querySelector(".fp-input-row-wrapper")?.classList.remove("typing");
      toneTags.forEach(t => t.classList.remove("selected"));
      document.getElementById("fp-filter-project-type").value = "any";
      document.getElementById("fp-filter-industry").value = "any";
      document.getElementById("fp-filter-audience").value = "any";
    });
  }

  // Random Vibe Generator
  if (randomBtn) {
    const randomVibes = [
      "Brutalist tech portfolio with high stroke contrast and sharp layout hierarchy",
      "Organic luxury skincare brand with warm heritage typography",
      "Modern fintech dashboard interface requiring ultra-crisp mobile legibility",
      "Boutique coffee roastery and editorial cafe journal",
      "Architectural design agency with tight geometric grid layout",
      "Contemporary software documentation and developer tool blog",
      "High-fashion editorial magazine with classical Didone headlines"
    ];
    randomBtn.addEventListener("click", () => {
      const chosen = randomVibes[Math.floor(Math.random() * randomVibes.length)];
      if (promptTextarea) {
        promptTextarea.value = chosen;
        promptTextarea.style.height = "auto";
        promptTextarea.style.height = (promptTextarea.scrollHeight) + "px";
        document.querySelector(".fp-input-row-wrapper")?.classList.add("typing");
      }
    });
  }

  // --- DYNAMIC FONT CSS LOADER ---
  function loadAndInjectFont(fontName) {
    if (!fontName) return;
    const fontObj = (typeof fontsData !== "undefined" && Array.isArray(fontsData))
      ? fontsData.find(f => f.name.toLowerCase() === fontName.toLowerCase())
      : null;

    if (fontObj && fontObj.adobeCssUrl) {
      if (!document.querySelector(`link[href="${fontObj.adobeCssUrl}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = fontObj.adobeCssUrl;
        document.head.appendChild(link);
      }
      return;
    }

    // Google Fonts fallback
    const famClean = fontName.replace(/\s+/g, "+");
    const linkId = `font-link-${fontName.toLowerCase().replace(/\s+/g, "-")}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${famClean}:wght@300;400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    }
  }

  // --- FONT CATEGORY HELPER ---
  function getFontCategory(fontName) {
    const f = (typeof fontsData !== "undefined" && Array.isArray(fontsData))
      ? fontsData.find(x => x.name.toLowerCase() === fontName.toLowerCase())
      : null;
    if (f && f.style) return f.style;
    if (typeof FontVaultPairing !== "undefined" && typeof FontVaultPairing.classifyFont === "function") {
      const c = FontVaultPairing.classifyFont({ name: fontName });
      return c.category;
    }
    return "Serif";
  }

  // --- RENDER RESULTS IN GRID (REDESIGNED CARDS) ---
  function renderPairCards(pairingsList, targetGrid) {
    if (!targetGrid) return;
    targetGrid.innerHTML = "";

    if (pairingsList.length === 0) {
      targetGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:4rem; color:var(--fp-text-sec); font-family:var(--font-mono);">No pairings matched your current criteria. Try adjusting filters or select another base font.</div>';
      return;
    }

    const customText = (customTextInput?.value || "").trim();
    const currentSpacing = spacingSlider?.value || 0;
    const currentSize = sizeSlider?.value || 38;
    const cardHeadlineSize = Math.max(20, Math.min(32, Math.round(currentSize * 0.58)));

    const sampleTexts = [
      "Good design creates visual clarity without drawing undue attention to itself. Balanced letterforms and proportional spacing allow content to shine effortlessly.",
      "The interplay between expressive headline architecture and screen-optimized body text creates an intuitive visual hierarchy for modern digital interfaces.",
      "Refined typography commands attention at display sizes while providing calm, fatigue-free readability for long-form editorial paragraphs.",
      "Designed for seamless harmony across interfaces, combining distinct character in the header with ultra-crisp digital clarity in the body."
    ];

    pairingsList.forEach((pair, index) => {
      loadAndInjectFont(pair.header);
      loadAndInjectFont(pair.body);

      const headerCat = getFontCategory(pair.header);
      const bodyCat = getFontCategory(pair.body);
      const isSaved = savedCollections.some(s => s.pairName === pair.pairName);
      const sampleBody = sampleTexts[index % sampleTexts.length];
      const defaultHeadline = customText || pair.header;

      // Extract rule badges
      const ruleBadges = [];
      ruleBadges.push(headerCat + " + " + bodyCat);
      if (pair.matchedRules && pair.matchedRules.includes("curated_classic")) {
        ruleBadges.push("Curated Classic");
      } else if (pair.matchedRules && pair.matchedRules.includes("stroke_contrast_balance")) {
        ruleBadges.push("High Contrast");
      } else if (pair.tags && pair.tags.length > 0) {
        ruleBadges.push(pair.tags[0]);
      }
      const ruleBadgesHtml = ruleBadges.map(t => '<span class="fp-rule-tag">' + t + '</span>').join("");

      const card = document.createElement("div");
      card.className = "fp-pair-card animate-fade-in";
      card.style.animationDelay = (index * 0.08) + "s";
      card.dataset.id = pair.pairName.toLowerCase().replace(/\s+/g, "-");

      card.innerHTML = `
        <!-- 1. Card Top Bar -->
        <div class="fp-card-header">
          <div class="fp-card-font-tags">
            <span class="fp-role-badge fp-role-heading" title="Heading font: ${pair.header}">
              <span class="fp-badge-dot"></span>
              <span class="fp-badge-name">${pair.header}</span>
              <span class="fp-badge-cat">${headerCat}</span>
            </span>
            <span class="fp-pair-plus">+</span>
            <span class="fp-role-badge fp-role-body" title="Body font: ${pair.body}">
              <span class="fp-badge-dot"></span>
              <span class="fp-badge-name">${pair.body}</span>
              <span class="fp-badge-cat">${bodyCat}</span>
            </span>
          </div>
          <div class="fp-match-pill" title="Typographic compatibility score">
            <span class="fp-match-pct">${pair.matchScore}% Match</span>
          </div>
        </div>

        <!-- 2. Dual-Font Typographic Live Specimen Canvas -->
        <div class="fp-card-specimen">
          <h3 class="fp-specimen-headline specimen-title-elem" data-default-title="${pair.header}" style="font-family: '${pair.header}', serif; font-size: ${cardHeadlineSize}px; letter-spacing: ${currentSpacing}px;">
            ${defaultHeadline}
          </h3>
          <p class="fp-specimen-body" style="font-family: '${pair.body}', sans-serif;">
            ${sampleBody}
          </p>
          <div class="fp-specimen-hover-hint">
            <span>Click to open studio specimen &rarr;</span>
          </div>
        </div>

        <!-- 3. Typography Design Rationale & Tag Bar -->
        <div class="fp-card-meta-bar">
          <div class="fp-rule-tags">
            ${ruleBadgesHtml}
          </div>
          <p class="fp-card-rationale" title="${pair.reason}">
            ${pair.reason}
          </p>
        </div>

        <!-- 4. Quick Actions Footer -->
        <div class="fp-card-actions">
          <button class="fp-btn-inspect" type="button" title="Open full specimen & test layouts">
            <span>Inspect Pair</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          <div class="fp-action-icons">
            <button class="fp-icon-btn fp-swap-btn" type="button" title="Swap Heading & Body roles" aria-label="Swap roles">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4"/></svg>
            </button>
            <button class="fp-icon-btn fp-copy-css-btn" type="button" title="Copy CSS rules" aria-label="Copy CSS">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button class="fp-icon-btn fp-fav-btn ${isSaved ? "active" : ""}" type="button" title="${isSaved ? "Saved in Vault" : "Save to Vault"}" aria-label="Save pair">
              <svg class="heart-icon" width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>
      `;

      // Open drawer on whole card click or inspect button click
      card.addEventListener("click", () => {
        openPairDetailsDrawer(pair);
      });

      // Quick Swap Button
      const swapBtn = card.querySelector(".fp-swap-btn");
      if (swapBtn) {
        swapBtn.addEventListener("click", e => {
          e.stopPropagation();
          const temp = pair.header;
          pair.header = pair.body;
          pair.body = temp;
          pair.pairName = pair.header + " + " + pair.body;
          renderPairCards(pairingsList, targetGrid);
          if (window.showToast) {
            window.showToast("Swapped roles: " + pair.header + " (Heading) + " + pair.body + " (Body)");
          }
        });
      }

      // Quick Copy CSS Button
      const copyBtn = card.querySelector(".fp-copy-css-btn");
      if (copyBtn) {
        copyBtn.addEventListener("click", e => {
          e.stopPropagation();
          const cssSnippet = "/* FontVault Pairing: " + pair.pairName + " */\n/* Heading */\nfont-family: '" + pair.header + "', serif;\n\n/* Body */\nfont-family: '" + pair.body + "', sans-serif;";
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cssSnippet).then(() => {
              if (window.showToast) window.showToast("CSS copied to clipboard!");
              else alert("CSS copied to clipboard!");
            }).catch(() => {
              fallbackCopy(cssSnippet);
            });
          } else {
            fallbackCopy(cssSnippet);
          }
        });
      }

      function fallbackCopy(text) {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        if (window.showToast) window.showToast("CSS copied to clipboard!");
      }

      // Quick Favorite Button
      const favBtn = card.querySelector(".fp-fav-btn");
      if (favBtn) {
        favBtn.addEventListener("click", e => {
          e.stopPropagation();
          const savedIndex = savedCollections.findIndex(s => s.pairName === pair.pairName);
          if (savedIndex !== -1) {
            savedCollections.splice(savedIndex, 1);
            favBtn.classList.remove("active");
            favBtn.querySelector(".heart-icon")?.setAttribute("fill", "none");
            if (window.showToast) window.showToast("Removed from saved pairings");
          } else {
            savedCollections.push(pair);
            favBtn.classList.add("active");
            favBtn.querySelector(".heart-icon")?.setAttribute("fill", "currentColor");
            if (window.showToast) window.showToast("Saved to My Vault!");
          }
          localStorage.setItem("fontvault-saved-pairings", JSON.stringify(savedCollections));
          renderSavedCollections();
        });
      }

      targetGrid.appendChild(card);
    });
  }

  // --- PAIR DETAILS DRAWER ---
  function openPairDetailsDrawer(pair) {
    if (!detailsDrawer || !detailsBody) return;

    loadAndInjectFont(pair.header);
    loadAndInjectFont(pair.body);

    const isSaved = savedCollections.some(s => s.pairName === pair.pairName);
    const saveBtnText = isSaved ? "Saved" : "Save Pair";
    const saveBtnClass = isSaved ? "card-btn active" : "card-btn";

    const metrics = pair.strengthMetrics || { elegance: 88, readability: 92, contrast: 85, uniqueness: 75, versatility: 84 };
    const metricsHtml = Object.entries(metrics).map(([key, val]) => `
      <div class="metric-bar-wrapper">
        <div class="metric-label-row" style="display:flex; justify-content:space-between; font-size:0.75rem; font-family:var(--font-mono); text-transform:uppercase; color:var(--fp-text-sec); margin-bottom:0.25rem;">
          <span>${key}</span>
          <span>${val}%</span>
        </div>
        <div class="metric-bar-bg" style="height:4px; background:var(--fp-border); overflow:hidden;">
          <div class="metric-bar-fill" style="width: ${val}%; height:100%; background:var(--fp-text); transition:width 0.4s ease;"></div>
        </div>
      </div>
    `).join("");

    const customText = (customTextInput?.value || "The quick brown fox jumps over the lazy dog").trim();
    const currentSize = sizeSlider?.value || 38;
    const currentSpacing = spacingSlider?.value || 0;

    detailsBody.innerHTML = `
      <div class="fp-card-top" style="padding: 0 0 1.25rem 0; background: transparent; border-bottom: 1px solid var(--fp-border); margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
        <h3 class="card-pair-name" style="font-size: 1.4rem; margin: 0; font-family: var(--font-display);">${pair.pairName}</h3>
        <span class="card-match-badge" style="font-size: 0.8rem; padding: 4px 10px; font-family: var(--font-mono); background: var(--fp-gold-light); color: var(--fp-gold); font-weight: 700; border: 1px solid var(--fp-gold);">
          ${pair.matchScore}% Match
        </span>
      </div>

      <div class="fp-card-middle" style="padding: 0 0 1.25rem 0; border-bottom: 1px solid var(--fp-border); margin-bottom: 1.25rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        <div class="card-font-chip" style="background:var(--fp-box-bg); padding:6px 12px; border:1px solid var(--fp-border);">
          <span class="chip-label" style="font-size:0.65rem; text-transform:uppercase; font-family:var(--font-mono); color:var(--fp-text-sec); display:block;">Heading Font</span>
          <span class="chip-val" style="font-weight:600; font-size:0.85rem; color:var(--fp-text);">${pair.header}</span>
        </div>
        <div class="card-font-chip" style="background:var(--fp-box-bg); padding:6px 12px; border:1px solid var(--fp-border);">
          <span class="chip-label" style="font-size:0.65rem; text-transform:uppercase; font-family:var(--font-mono); color:var(--fp-text-sec); display:block;">Body Font</span>
          <span class="chip-val" style="font-weight:600; font-size:0.85rem; color:var(--fp-text);">${pair.body}</span>
        </div>
      </div>

      <!-- Live Preview Canvas -->
      <div class="fp-preview-canvas" style="text-align: left; padding: 2rem 1.5rem; border: 1px solid var(--fp-border); background-color: var(--fp-bg); margin-bottom: 1.5rem; border-radius: 0;">
        <h2 class="specimen-title specimen-title-elem" style="font-family: '${pair.header}', serif; font-size: ${currentSize}px; letter-spacing: ${currentSpacing}px; margin-top: 0; margin-bottom: 1rem; line-height: 1.15; color: var(--fp-text);">
          ${customText}
        </h2>
        <p class="specimen-para specimen-body-elem" style="font-family: '${pair.body}', sans-serif; line-height: 1.65; font-size: 1rem; margin-top: 0; margin-bottom: 1.5rem; color: var(--fp-text-sec);">
          Good typography establishes clear visual hierarchy without distracting the reader. When headings contrast harmoniously with body copy, long-form content becomes effortless to scan and absorb across all device formats.
        </p>
        <div class="specimen-cta-wrapper" style="margin-bottom: 1.75rem;">
          <button class="specimen-cta" type="button" style="font-family: '${pair.body}', sans-serif; display: inline-block; background-color: var(--fp-text); color: var(--fp-bg); padding: 10px 22px; font-size: 0.8rem; font-weight: 600; border: 1px solid var(--fp-text); cursor: pointer;">
            Explore Layout Example
          </button>
        </div>
        <div class="specimen-quote" style="font-family: '${pair.body}', sans-serif; font-size: 0.9rem; border-left: 2px solid var(--fp-gold); padding-left: 1.25rem; font-style: italic; line-height: 1.5; color: var(--fp-text-sec);">
          “Type is a beautiful group of letters, not a group of beautiful letters.” — Matthew Carter
        </div>
      </div>

      <!-- Design Rationale & Metrics -->
      <div class="fp-card-bottom" style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div>
          <h4 style="font-size:0.75rem; font-family:var(--font-mono); text-transform:uppercase; color:var(--fp-text-sec); letter-spacing:0.05em; margin:0 0 0.5rem;">Typography Rationale</h4>
          <p class="card-reasoning" style="margin: 0; font-size: 0.88rem; line-height: 1.6; color: var(--fp-text);">
            ${pair.reason}
          </p>
        </div>

        <div class="pair-strength-metrics" style="padding-top: 1.25rem; border-top: 1px solid var(--fp-border); display: flex; flex-direction: column; gap: 0.85rem;">
          ${metricsHtml}
        </div>

        <div class="card-actions-row" style="padding-top: 1.25rem; border-top: 1px solid var(--fp-border); display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="card-btn btn-drawer-swap" style="background: var(--fp-box-bg); border: 1px solid var(--fp-border); color: var(--fp-text); padding: 8px 14px; font-size: 0.75rem; font-family:var(--font-mono); cursor: pointer;">
              ⇄ Swap Heading/Body
            </button>
            <button class="card-btn btn-drawer-copy" style="background: var(--fp-box-bg); border: 1px solid var(--fp-border); color: var(--fp-text); padding: 8px 14px; font-size: 0.75rem; font-family:var(--font-mono); cursor: pointer;">
              Copy CSS
            </button>
          </div>
          <button class="card-btn btn-drawer-save ${saveBtnClass}" style="background: var(--fp-text); border: 1px solid var(--fp-text); color: var(--fp-bg); padding: 8px 16px; font-size: 0.75rem; font-family:var(--font-mono); font-weight:600; cursor: pointer;">
            ${saveBtnText}
          </button>
        </div>
      </div>
    `;

    // Swap Heading and Body
    detailsBody.querySelector(".btn-drawer-swap")?.addEventListener("click", () => {
      const oldHeader = pair.header;
      pair.header = pair.body;
      pair.body = oldHeader;
      pair.pairName = `${pair.header} + ${pair.body}`;

      // Re-evaluate rules with swap
      if (window.FontVaultPairing && typeof fontsData !== "undefined") {
        const hObj = fontsData.find(f => f.name.toLowerCase() === pair.header.toLowerCase());
        const bObj = fontsData.find(f => f.name.toLowerCase() === pair.body.toLowerCase());
        if (hObj && bObj) {
          const res = window.FontVaultPairing.scorePairing(hObj, bObj);
          pair.matchScore = res.matchPercentage;
          pair.reason = window.FontVaultPairing.generateExplanation(res.matchedRules, res.heading, res.body);
        }
      }

      openPairDetailsDrawer(pair);
      renderPairCards(activePairings, resultsGrid);
    });

    // Copy CSS
    detailsBody.querySelector(".btn-drawer-copy")?.addEventListener("click", () => {
      const css = `/* Typography Pair: ${pair.pairName} */\nh1, h2, h3, .heading-text {\n  font-family: "${pair.header}", serif;\n}\np, body, .body-text {\n  font-family: "${pair.body}", sans-serif;\n}`;
      navigator.clipboard.writeText(css).then(() => {
        alert("CSS rules copied to clipboard!");
      });
    });

    // Save Pair
    detailsBody.querySelector(".btn-drawer-save")?.addEventListener("click", function() {
      const idx = savedCollections.findIndex(s => s.pairName === pair.pairName);
      if (idx > -1) {
        savedCollections.splice(idx, 1);
        this.textContent = "Save Pair";
        this.classList.remove("active");
      } else {
        savedCollections.push(pair);
        this.textContent = "Saved";
        this.classList.add("active");
      }
      localStorage.setItem("fontvault-saved-pairings", JSON.stringify(savedCollections));
      renderSavedCollections();
    });

    detailsDrawer.classList.add("active");
  }

  // --- DRAWER CLOSES ---
  detailsCloseBtn?.addEventListener("click", () => detailsDrawer?.classList.remove("active"));
  drawerCloseBtn?.addEventListener("click", () => compareDrawer?.classList.remove("active"));

  // --- STICKY TOOLBAR EVENT LISTENERS (LIVE CARD & DRAWER SYNC) ---
  customTextInput?.addEventListener("input", e => {
    const val = e.target.value.trim();
    document.querySelectorAll(".specimen-title-elem").forEach(el => {
      el.textContent = val || el.getAttribute("data-default-title") || "FontVault is the future of typography";
    });
  });

  sizeSlider?.addEventListener("input", e => {
    const val = Number(e.target.value);
    document.querySelectorAll(".specimen-title-elem:not(.fp-specimen-headline)").forEach(el => {
      el.style.fontSize = val + "px";
    });
    const cardScale = Math.max(18, Math.min(34, Math.round(val * 0.55)));
    document.querySelectorAll(".fp-specimen-headline").forEach(el => {
      el.style.fontSize = cardScale + "px";
    });
  });

  spacingSlider?.addEventListener("input", e => {
    const val = e.target.value;
    document.querySelectorAll(".specimen-title-elem").forEach(el => {
      el.style.letterSpacing = val + "px";
    });
  });

  // Category filter tabs on sticky toolbar
  if (pairFilters) {
    const filterButtons = pairFilters.querySelectorAll(".fp-tb-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filterType = btn.dataset.filter;

        if (filterType === "all") {
          renderPairCards(activePairings, resultsGrid);
          return;
        }

        const filtered = activePairings.filter(p => {
          const hObj = fontsData?.find(f => f.name.toLowerCase() === p.header.toLowerCase());
          const bObj = fontsData?.find(f => f.name.toLowerCase() === p.body.toLowerCase());
          const hStyle = (hObj?.style || "Serif").toLowerCase();
          const bStyle = (bObj?.style || "Sans-Serif").toLowerCase();

          if (filterType === "serif-sans") return hStyle.includes("serif") && !hStyle.includes("sans") && bStyle.includes("sans");
          if (filterType === "sans-sans") return hStyle.includes("sans") && bStyle.includes("sans");
          if (filterType === "serif-serif") return hStyle.includes("serif") && !hStyle.includes("sans") && bStyle.includes("serif") && !bStyle.includes("sans");
          if (filterType === "display-sans") return hStyle.includes("display") && bStyle.includes("sans");
          return true;
        });

        renderPairCards(filtered, resultsGrid);
      });
    });
  }

  // --- SAVED PAIRINGS SECTION ---
  function renderSavedCollections() {
    if (!savedGrid || !savedSection) return;
    if (savedCollections.length === 0) {
      savedSection.style.display = "none";
      return;
    }

    savedSection.style.display = "block";
    savedGrid.innerHTML = "";

    savedCollections.forEach(pair => {
      const card = document.createElement("div");
      card.className = "fp-pair-card";
      card.innerHTML = `
        <div class="fp-card-info" style="padding: 1.25rem;">
          <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin: 0 0 0.5rem; color: var(--fp-text);">${pair.pairName}</h4>
          <p style="font-size: 0.78rem; color: var(--fp-text-sec); margin: 0;">${pair.header} + ${pair.body}</p>
        </div>
      `;
      card.addEventListener("click", () => openPairDetailsDrawer(pair));
      savedGrid.appendChild(card);
    });
  }
  renderSavedCollections();

  // --- RECOMMENDATION EXECUTION HELPERS ---
  function showProcessingAndDisplay(generatorFn) {
    if (!processingState || !resultsArea) {
      generatorFn();
      return;
    }

    // Show processing indicator
    processingState.style.display = "block";
    resultsArea.style.display = "none";
    if (stickyToolbar) stickyToolbar.style.display = "none";

    const appContainer = document.querySelector(".fp-app-container");
    if (appContainer) appContainer.style.display = "block";

    // Fast, local rule-based generation (400ms transition for visual polish)
    setTimeout(() => {
      generatorFn();
      processingState.style.display = "none";
      if (stickyToolbar) stickyToolbar.style.display = "block";
      resultsArea.style.display = "block";

      const footer = document.querySelector("footer");
      if (footer) footer.style.display = "block";

      if (stickyToolbar && typeof stickyToolbar.scrollIntoView === "function") {
        stickyToolbar.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);
  }

  // --- 1. BASE FONT TRIGGER ---
  if (baseSubmitBtn) {
    baseSubmitBtn.addEventListener("click", () => {
      const fontName = baseFontSelect?.value;
      if (!fontName) {
        alert("Please select a font from the dropdown list first.");
        return;
      }
      const role = baseRoleSelect?.value || "heading";

      showProcessingAndDisplay(() => {
        if (window.FontVaultPairing && typeof fontsData !== "undefined") {
          activePairings = window.FontVaultPairing.recommendPairingsForFont(fontName, fontsData, role, 4);
        }
        renderPairCards(activePairings, resultsGrid);
      });
    });
  }

  // --- 2. NATURAL LANGUAGE / PROMPT TRIGGER ---
  function triggerPromptPairing() {
    const prompt = promptTextarea?.value.trim() || "";
    const projectType = document.getElementById("fp-filter-project-type")?.value || "any";
    const industry = document.getElementById("fp-filter-industry")?.value || "any";
    const audience = document.getElementById("fp-filter-audience")?.value || "any";

    const selectedTones = [];
    document.querySelectorAll(".fp-tone-tag.selected").forEach(t => selectedTones.push(t.dataset.tone));

    showProcessingAndDisplay(() => {
      if (window.FontVaultPairing && typeof fontsData !== "undefined") {
        activePairings = window.FontVaultPairing.recommendPairingsForProject(fontsData, {
          prompt,
          projectType,
          industry,
          audience,
          tone: selectedTones[0] || ""
        }, 4);
      }
      renderPairCards(activePairings, resultsGrid);
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", triggerPromptPairing);
  }

  if (promptTextarea) {
    promptTextarea.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        triggerPromptPairing();
      }
    });
  }

  // Check URL parameters for pre-filled pairing (e.g. from a font detail page)
  const urlParams = new URLSearchParams(window.location.search);
  const fontParam = urlParams.get("font");
  if (fontParam) {
    const matched = fontsData?.find(f => f.id === fontParam || f.name.toLowerCase() === fontParam.toLowerCase());
    if (matched && baseFontSelect) {
      baseFontSelect.value = matched.name;
      modeBasefontBtn?.click();
      baseSubmitBtn?.click();
    }
  }
});
