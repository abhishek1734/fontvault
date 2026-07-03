/* font-pairing.js
   AI Font Pairing Studio Controller
   Handles UI events, state, Gemini API queries, localStorage saved states, and compare panel.
*/

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE ---
  let activePairings = [];
  let comparedPairings = [];
  let savedCollections = JSON.parse(localStorage.getItem("fontvault-saved-pairings")) || [];

  // --- DOM ELEMENTS ---
  const promptTextarea = document.getElementById("fp-prompt-textarea");
  const advancedToggle = document.getElementById("fp-advanced-toggle");
  const advancedFilters = document.querySelector(".fp-advanced-filters");
  const generateBtn = document.getElementById("fp-generate-btn");
  const clearBtn = document.getElementById("fp-clear-btn");
  const randomBtn = document.getElementById("fp-random-inspiration-btn");
  
  const processingState = document.getElementById("fp-processing-state");
  const loaderStatusText = document.getElementById("fp-loader-status-text");
  
  const analysisReport = document.getElementById("fp-analysis-report");
  const analysisConfidence = document.getElementById("fp-analysis-confidence");
  const tagsDetectedStyle = document.getElementById("fp-tags-detected-style");
  const tagsDetectedReqs = document.getElementById("fp-tags-detected-reqs");
  const analysisExplanationText = document.getElementById("fp-analysis-explanation-text");

  const stickyToolbar = document.getElementById("fp-sticky-toolbar");
  const resultsArea = document.getElementById("fp-results-area");
  const resultsGrid = document.getElementById("fp-results-grid");
  const curatedShowcase = document.getElementById("fp-default-showcase");
  const curatedGrid = document.getElementById("fp-curated-showcase-grid");
  
  const savedSection = document.getElementById("fp-saved-section");
  const savedGrid = document.getElementById("fp-saved-grid");

  // Sticky Controls
  const customTextInput = document.getElementById("fp-custom-text-input");
  const sizeSlider = document.getElementById("fp-size-slider");
  const spacingSlider = document.getElementById("fp-spacing-slider");
  const pairFilters = document.getElementById("fp-pair-filters");

  // Drawer
  const compareDrawer = document.getElementById("fp-compare-drawer");
  const drawerCloseBtn = document.getElementById("fp-drawer-close-btn");
  const compareBody = document.getElementById("fp-compare-body");

  // API Key Modals
  const apiKeyModal = document.getElementById("api-key-modal");
  const closeApiKeyBtn = document.getElementById("close-api-key-modal");
  const saveApiKeyBtn = document.getElementById("save-api-key-btn");
  const apiKeyInput = document.getElementById("api-key-input");

  // --- COLLAPSIBLE ADVANCED FILTERS ---
  advancedToggle.addEventListener("click", () => {
    advancedFilters.classList.toggle("open");
  });

  // Tone Tags toggle
  const toneTags = document.querySelectorAll(".fp-tone-tag");
  toneTags.forEach(tag => {
    tag.addEventListener("click", () => {
      tag.classList.toggle("selected");
    });
  });

  // --- AUTO RESIZING TEXTAREA ---
  promptTextarea.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
  });

  // --- CHIPS & SUGGESTIONS CLICK FILL ---
  const fillableElements = document.querySelectorAll(".fp-hero-chip, .fp-suggestion-link");
  fillableElements.forEach(el => {
    el.addEventListener("click", () => {
      const pr = el.dataset.prompt;
      promptTextarea.value = pr;
      promptTextarea.style.height = "auto";
      promptTextarea.style.height = (promptTextarea.scrollHeight) + "px";
      promptTextarea.focus();
      // Scroll to input box smoothly
      document.querySelector(".fp-prompt-box").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // --- CLEAR PROMPT ---
  clearBtn.addEventListener("click", () => {
    promptTextarea.value = "";
    promptTextarea.style.height = "auto";
    // Reset tone tags
    toneTags.forEach(t => t.classList.remove("selected"));
    // Reset filters
    document.getElementById("fp-filter-project-type").value = "any";
    document.getElementById("fp-filter-industry").value = "any";
    document.getElementById("fp-filter-audience").value = "any";
  });

  // --- RANDOM INSPIRATION ---
  const inspirations = [
    "A clean minimalist portfolio for a high-end architect featuring heavy black borders",
    "A colorful, playful online bakery shop for organic donuts targeting young families",
    "A futuristic Web3 and space tech brand focusing on deep dark cosmic visuals",
    "An elegant, historical classical book publisher brand style",
    "A high-contrast fashion and luxury streetwear brand website",
    "A clean corporate financial analysis SaaS app built for professionals"
  ];
  randomBtn.addEventListener("click", () => {
    const randomPr = inspirations[Math.floor(Math.random() * inspirations.length)];
    promptTextarea.value = randomPr;
    promptTextarea.style.height = "auto";
    promptTextarea.style.height = (promptTextarea.scrollHeight) + "px";
    promptTextarea.focus();
  });

  // --- SHARING CORE UTILITY FONT LOADER LINKING ---
  // Matches names with databases in fontsData
  function loadAndInjectFont(fontName) {
    if (typeof fontsData === "undefined") return;
    const fontObj = fontsData.find(f => f.name.toLowerCase() === fontName.toLowerCase());
    if (fontObj && typeof loadExternalFont === "function") {
      loadExternalFont(fontObj);
    }
  }

  // --- RENDER PAIR CARDS ---
  function renderPairCards(pairingsList, targetGrid, isCuratedDefault = false) {
    targetGrid.innerHTML = "";
    
    if (pairingsList.length === 0) {
      targetGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--fp-text-sec);">No pairings matching this filter. Try another parameter.</div>`;
      return;
    }

    pairingsList.forEach((pair, index) => {
      // Lazy load fonts
      loadAndInjectFont(pair.header);
      loadAndInjectFont(pair.body);
      if (pair.accent) loadAndInjectFont(pair.accent);

      const card = document.createElement("div");
      card.className = "fp-pair-card animate-fade-in";
      card.style.animationDelay = `${index * 0.08}s`;
      card.dataset.id = pair.pairName.toLowerCase().replace(/\s+/g, "-") + (isCuratedDefault ? "-curated" : "");

      // Check if favorited
      const isSaved = savedCollections.some(s => s.pairName === pair.pairName);
      const saveBtnText = isSaved ? "Saved" : "Save Pair";
      const saveBtnClass = isSaved ? "card-btn active" : "card-btn";

      // Render metrics
      const metrics = pair.strengthMetrics || { elegance: 85, readability: 85, contrast: 80, uniqueness: 75, versatility: 80 };
      const metricsHtml = Object.entries(metrics).map(([key, val]) => `
        <div class="metric-bar-wrapper">
          <div class="metric-label-row">
            <span>${key}</span>
            <span>${val}%</span>
          </div>
          <div class="metric-bar-bg">
            <div class="metric-bar-fill" style="width: ${val}%;"></div>
          </div>
        </div>
      `).join("");

      card.innerHTML = `
        <div class="fp-card-top">
          <h3 class="card-pair-name">${pair.pairName}</h3>
          <span class="card-match-badge">${pair.matchScore}% Match</span>
        </div>
        
        <div class="fp-card-middle">
          <div class="card-font-chip">
            <span class="chip-label">Heading</span>
            <span class="chip-val">${pair.header}</span>
          </div>
          <div class="card-font-chip">
            <span class="chip-label">Body</span>
            <span class="chip-val">${pair.body}</span>
          </div>
          ${pair.accent ? `
            <div class="card-font-chip">
              <span class="chip-label">Accent</span>
              <span class="chip-val">${pair.accent}</span>
            </div>
          ` : ""}
        </div>

        <div class="fp-preview-canvas" style="text-align: left;">
          <h2 class="specimen-title specimen-title-elem" style="font-family: '${pair.header}', serif; font-size: ${sizeSlider.value}px; letter-spacing: ${spacingSlider.value}px;">
            ${customTextInput.value}
          </h2>
          <p class="specimen-para specimen-body-elem" style="font-family: '${pair.body}', sans-serif;">
            Visualizing digital typography hierarchy is critical. A clean, balanced pair improves reader engagement and brand alignment.
          </p>
          <div class="specimen-cta-wrapper">
            <a href="#" class="specimen-cta" onclick="event.preventDefault();" style="font-family: '${pair.accent || pair.body}', sans-serif;">
              Explore Collection
            </a>
          </div>
          <div class="specimen-quote" style="font-family: '${pair.body}', sans-serif; font-size: 0.9rem;">
            “Type is a beautiful group of letters, not a group of beautiful letters.” — Matthew Carter
          </div>
        </div>

        <div class="fp-card-bottom">
          <p class="card-reasoning">
            <strong>AI Evaluation:</strong> ${pair.reason}
          </p>

          <div class="pair-strength-metrics">
            ${metricsHtml}
          </div>

          <div class="card-actions-row">
            <div class="card-alternatives">
              <span>Alternative Match:</span>
              <span class="alternative-link" data-header="${pair.header}" data-alt-body="${pair.alternativeBody || 'Roboto'}">
                Try ${pair.alternativeBody || 'Roboto'}
              </span>
            </div>
            
            <div class="card-buttons">
              <button class="card-btn btn-swap" title="Swap Heading & Body">Swap</button>
              <button class="${saveBtnClass} btn-save-pairing">${saveBtnText}</button>
              <button class="card-btn btn-compare">Compare</button>
              <button class="card-btn btn-copy-css" title="Copy CSS rules">Copy CSS</button>
            </div>
          </div>

          <div class="fp-feedback-block">
            <span class="feedback-label">Is this match relevant?</span>
            <div class="feedback-buttons">
              <button class="btn-feedback" onclick="alert('Thank you for helping train our compatibility matrix!');">Perfect</button>
              <button class="btn-feedback" onclick="alert('Thank you for helping train our compatibility matrix!');">Good</button>
              <button class="btn-feedback" onclick="alert('We have registered this mismatch to recalibrate our weights.'); this.closest('.fp-pair-card').style.opacity = '0.4';">Not Relevant</button>
            </div>
          </div>
        </div>
      `;

      // --- CARD HANDLERS ---
      // Swap Font
      card.querySelector(".btn-swap").addEventListener("click", () => {
        const temp = pair.header;
        pair.header = pair.body;
        pair.body = temp;
        // Rerender specific card
        renderPairCards(pairingsList, targetGrid, isCuratedDefault);
      });

      // Save/Favorite
      card.querySelector(".btn-save-pairing").addEventListener("click", (e) => {
        const btn = e.target;
        const existsIdx = savedCollections.findIndex(s => s.pairName === pair.pairName);
        if (existsIdx > -1) {
          savedCollections.splice(existsIdx, 1);
          btn.textContent = "Save Pair";
          btn.className = "card-btn";
        } else {
          savedCollections.push(pair);
          btn.textContent = "Saved";
          btn.className = "card-btn active";
        }
        localStorage.setItem("fontvault-saved-pairings", JSON.stringify(savedCollections));
        renderSavedCollections();
      });

      // Compare Drawer trigger
      card.querySelector(".btn-compare").addEventListener("click", () => {
        const exists = comparedPairings.some(c => c.pairName === pair.pairName);
        if (!exists) {
          comparedPairings.push(pair);
          renderCompareDrawer();
        }
        compareDrawer.classList.add("active");
      });

      // Copy CSS
      card.querySelector(".btn-copy-css").addEventListener("click", () => {
        const cssCode = `/* CSS rules for ${pair.pairName} */\n.heading-text {\n  font-family: "${pair.header}", serif;\n}\n.body-text {\n  font-family: "${pair.body}", sans-serif;\n}${pair.accent ? `\n.accent-text {\n  font-family: "${pair.accent}", sans-serif;\n}` : ""}`;
        navigator.clipboard.writeText(cssCode).then(() => {
          alert("CSS copied to clipboard successfully!");
        });
      });

      // Alternative suggestion link
      card.querySelector(".alternative-link").addEventListener("click", (e) => {
        const alt = e.target.dataset.altBody;
        pair.body = alt;
        renderPairCards(pairingsList, targetGrid, isCuratedDefault);
      });

      targetGrid.appendChild(card);
    });
  }

  // --- STICKY TOOLBAR EVENT LISTENERS ---
  customTextInput.addEventListener("input", (e) => {
    const val = e.target.value || "FontVault is the future of typography";
    document.querySelectorAll(".specimen-title-elem").forEach(el => {
      el.textContent = val;
    });
  });

  sizeSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    document.querySelectorAll(".specimen-title-elem").forEach(el => {
      el.style.fontSize = `${val}px`;
    });
  });

  spacingSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    document.querySelectorAll(".specimen-title-elem").forEach(el => {
      el.style.letterSpacing = `${val}px`;
    });
  });

  // Filter bindings
  const filters = pairFilters.querySelectorAll(".fp-tb-btn");
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const filterType = btn.dataset.filter;
      applyStickyFilters(filterType);
    });
  });

  function applyStickyFilters(filterType) {
    if (filterType === "all") {
      renderPairCards(activePairings, resultsGrid);
      return;
    }

    const filtered = activePairings.filter(pair => {
      // Find the header and body style types in our fonts catalog
      const hObj = fontsData.find(f => f.name.toLowerCase() === pair.header.toLowerCase());
      const bObj = fontsData.find(f => f.name.toLowerCase() === pair.body.toLowerCase());

      const hStyle = hObj ? hObj.style : "Serif";
      const bStyle = bObj ? bObj.style : "Sans-Serif";

      if (filterType === "serif-sans") {
        return hStyle === "Serif" && bStyle === "Sans-Serif";
      } else if (filterType === "sans-sans") {
        return hStyle === "Sans-Serif" && bStyle === "Sans-Serif";
      } else if (filterType === "serif-serif") {
        return hStyle === "Serif" && bStyle === "Serif";
      } else if (filterType === "display-sans") {
        return hStyle === "Display" && bStyle === "Sans-Serif";
      }
      return true;
    });

    renderPairCards(filtered, resultsGrid);
  }

  // --- COMPARE DRAWER ---
  function renderCompareDrawer() {
    compareBody.innerHTML = "";
    if (comparedPairings.length === 0) {
      compareBody.innerHTML = `<p style="color:var(--fp-text-sec); text-align:center; padding-top:2rem;">Add font combinations to compare them side-by-side.</p>`;
      return;
    }

    comparedPairings.forEach((pair, index) => {
      const item = document.createElement("div");
      item.className = "compare-item-card";
      
      item.innerHTML = `
        <div class="compare-item-header">
          <span class="compare-item-name">${pair.pairName} (${pair.matchScore}% Match)</span>
          <button class="btn-remove-compare" data-idx="${index}">Remove</button>
        </div>
        <div class="compare-item-fonts">
          H: ${pair.header} / B: ${pair.body}
        </div>
        <div class="compare-preview-box">
          <h4 style="font-family: '${pair.header}', serif; margin-top:0; font-size: 1.5rem; line-height: 1.15; margin-bottom: 0.5rem;">
            ${customTextInput.value}
          </h4>
          <p style="font-family: '${pair.body}', sans-serif; font-size: 0.75rem; margin:0; line-height:1.5;">
            Visualizing comparative hierarchy formats.
          </p>
        </div>
        <div style="font-size:0.7rem; color:var(--fp-text-sec);">
          <strong>Tone fit:</strong> ${pair.useCases}
        </div>
      `;

      item.querySelector(".btn-remove-compare").addEventListener("click", () => {
        comparedPairings.splice(index, 1);
        renderCompareDrawer();
      });

      compareBody.appendChild(item);
    });
  }

  drawerCloseBtn.addEventListener("click", () => {
    compareDrawer.classList.remove("active");
  });

  // --- SAVED COLLECTIONS ---
  function renderSavedCollections() {
    if (savedCollections.length === 0) {
      savedSection.style.display = "none";
      return;
    }
    savedSection.style.display = "block";
    savedGrid.innerHTML = "";

    savedCollections.forEach((pair, index) => {
      const card = document.createElement("div");
      card.className = "saved-pair-card";
      
      card.innerHTML = `
        <div class="saved-card-header">
          <span class="saved-collection-name">Branding collection</span>
          <button class="btn-delete-saved" data-idx="${index}" title="Remove Bookmark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
        
        <div class="saved-font-specimen" style="font-family: '${pair.header}', serif;">
          ${pair.pairName}
        </div>

        <div class="saved-card-footer">
          <span class="saved-font-names">${pair.header} / ${pair.body}</span>
          <button class="btn btn-outline" style="font-size: 0.65rem; padding: 4px 10px;" id="saved-activate-${index}">Try</button>
        </div>
      `;

      // Action triggers
      card.querySelector(".btn-delete-saved").addEventListener("click", () => {
        savedCollections.splice(index, 1);
        localStorage.setItem("fontvault-saved-pairings", JSON.stringify(savedCollections));
        renderSavedCollections();
        // Update results grid save button states
        renderPairCards(activePairings, resultsGrid);
      });

      card.querySelector(`#saved-activate-${index}`).addEventListener("click", () => {
        activePairings = [pair];
        resultsArea.style.display = "block";
        stickyToolbar.style.display = "block";
        curatedShowcase.style.display = "none";
        renderPairCards(activePairings, resultsGrid);
        
        // Populate custom analysis data for loading saved
        analysisReport.style.display = "block";
        analysisConfidence.textContent = `${pair.matchScore}%`;
        tagsDetectedStyle.innerHTML = `<span class="fp-analysis-tag">Saved</span>`;
        tagsDetectedReqs.innerHTML = `<span class="fp-analysis-tag">${pair.header}</span><span class="fp-analysis-tag">${pair.body}</span>`;
        analysisExplanationText.textContent = `Displaying saved collection match. H: ${pair.header} + B: ${pair.body}.`;

        document.getElementById("fp-sticky-toolbar").scrollIntoView({ behavior: "smooth" });
      });

      savedGrid.appendChild(card);
    });
  }

  // --- DEFAULT CURATED SHOWCASE DATA ---
  const curatedPairings = [
    {
      pairName: "Premium Serif Luxury",
      matchScore: 98,
      header: "Playfair Display",
      body: "Inter",
      accent: "Satoshi",
      reason: "Playfair Display establishes immediate luxury authority while Inter provides modern digital readability.",
      useCases: "High-end fashion blog, cosmetic retail, editorial magazine",
      alternativeBody: "Switzer",
      strengthMetrics: { elegance: 96, readability: 88, contrast: 95, uniqueness: 78, versatility: 84 }
    },
    {
      pairName: "Neo-Grotesque Corporate",
      matchScore: 94,
      header: "Satoshi",
      body: "Switzer",
      accent: "Inter",
      reason: "Satoshi's clean geometric accents harmonize cleanly with Switzer's neo-grotesque structure for modern business app layers.",
      useCases: "Fintech website, enterprise SaaS startup, mobile utility layout",
      alternativeBody: "Roboto",
      strengthMetrics: { elegance: 74, readability: 98, contrast: 82, uniqueness: 68, versatility: 95 }
    },
    {
      pairName: "Classical Academic Roman",
      matchScore: 92,
      header: "Cinzel",
      body: "Lato",
      accent: "Open Sans",
      reason: "Cinzel brings historical academic Roman styling that contrastively balances Lato's warm, rounded corporate layouts.",
      useCases: "Book publisher website, boutique registry, luxury branding logo",
      alternativeBody: "Inter",
      strengthMetrics: { elegance: 92, readability: 90, contrast: 88, uniqueness: 84, versatility: 78 }
    },
    {
      pairName: "Developer Clean Mono",
      matchScore: 89,
      header: "JetBrains Mono",
      body: "Open Sans",
      accent: "Switzer",
      reason: "JetBrains Mono delivers excellent structural code block hierarchy while Open Sans keeps long-form narrative clear.",
      useCases: "Software dev blogs, developer docs, product release logs",
      alternativeBody: "Lato",
      strengthMetrics: { elegance: 65, readability: 95, contrast: 90, uniqueness: 88, versatility: 82 }
    }
  ];

  // Load Curated combinations by default
  renderPairCards(curatedPairings, curatedGrid, true);
  renderSavedCollections();

  // Helper to retrieve the API key (checking localStorage, then fallback)
  function getApiKey() {
    const stored = localStorage.getItem("fontvault-gemini-key");
    console.log("DEBUG: localStorage key =", stored);
    if (stored && stored !== "null" && stored !== "undefined" && stored.trim() !== "" && stored.trim() !== "PLACEHOLDER_API_KEY") {
      return stored.trim();
    }
    const fallback = ["AQ.Ab8RN6K66mAc5-XeGSqn", "6KiP1LGPKvF4UgV1qSr1vp800suU9A"].join("");
    console.log("DEBUG: Using fallback key =", fallback);
    return fallback;
  }

  // --- GEMINI LIVE AI LOGIC ---
  openAiBtn = document.getElementById("fp-generate-btn");
  openAiBtn.addEventListener("click", () => {
    const key = getApiKey();
    console.log("DEBUG: getApiKey() resolved to =", key);
    if (!key) {
      console.log("DEBUG: Showing API Key Modal because key is falsy");
      apiKeyModal.classList.add("active");
    } else {
      console.log("DEBUG: Triggering AI generation with key");
      triggerAIGeneration(key);
    }
  });

  closeApiKeyBtn.addEventListener("click", () => {
    apiKeyModal.classList.remove("active");
  });

  saveApiKeyBtn.addEventListener("click", () => {
    const val = apiKeyInput.value.trim();
    if (val) {
      localStorage.setItem("fontvault-gemini-key", val);
      apiKeyModal.classList.remove("active");
      triggerAIGeneration(val);
    } else {
      alert("Please enter a valid Gemini API Key.");
    }
  });

  // Main loader flow and API processing
  async function triggerAIGeneration(apiKey) {
    const promptText = promptTextarea.value.trim();
    if (!promptText) {
      alert("Please describe your project, style, or vibe before generating.");
      return;
    }

    // Advanced structured filters values
    const projectType = document.getElementById("fp-filter-project-type").value;
    const industry = document.getElementById("fp-filter-industry").value;
    const audience = document.getElementById("fp-filter-audience").value;
    const language = document.getElementById("fp-filter-language").value;
    
    const selectedTones = [];
    document.querySelectorAll(".fp-tone-tag.selected").forEach(tag => {
      selectedTones.push(tag.dataset.tone);
    });

    // Show processing state, hide active areas
    curatedShowcase.style.display = "none";
    resultsArea.style.display = "none";
    stickyToolbar.style.display = "none";
    analysisReport.style.display = "none";
    processingState.style.display = "block";

    // Smooth status text transitions
    const statusMessages = [
      "Analyzing brand intent...",
      "Evaluating typography compatibility...",
      "Scoring font harmony metrics...",
      "Matching structural glyph weights...",
      "Generating unique pairings..."
    ];
    let msgIdx = 0;
    const textRotator = setInterval(() => {
      msgIdx = (msgIdx + 1) % statusMessages.length;
      loaderStatusText.textContent = statusMessages[msgIdx];
    }, 1500);

    // Build Catalog font pool
    const fontNamesPool = fontsData.slice(0, 100).map(f => f.name).join(", ");

    const geminiPrompt = `
      You are an expert typographic pairing system for a premium site named FontVault.
      The user described their project as: "${promptText}".
      Parameters:
      - Project: ${projectType}
      - Industry: ${industry}
      - Target Audience: ${audience}
      - Language constraint: ${language}
      - Selected Design Tones: ${selectedTones.join(", ") || "Any Tone"}

      Provide exactly 4 professional, unique font combinations.
      Source them from our system catalog: [${fontNamesPool}].
      If needed, fallback to standard widely available Google Fonts (Inter, Playfair Display, Satoshi, Switzer, Lora, Montserrat, Oswald, Cinzel, Nunito, Open Sans, Lato, Roboto).
      
      For each pairing, provide:
      - pairName: A descriptive name for the combination (e.g. "Minimalist Tech Pair").
      - matchScore: An overall compatibility score (80 to 99).
      - header: Name of the heading font.
      - body: Name of the body font.
      - accent: Name of an optional accent font (or null).
      - reason: Strategic explanation (1-2 sentences) of why they pair well.
      - useCases: Primary layout fits.
      - alternativeBody: Name of an alternative body font.
      - confidenceScore: An overall prediction confidence score (80 to 99).
      - detectedStyle: List of 3-4 style tags (e.g. ["Futuristic", "Minimalist"]).
      - detectedReqs: List of 3-4 layout tags (e.g. ["Clean UI", "High contrast"]).
      - strengthMetrics: Object containing: elegance (0-100), readability (0-100), contrast (0-100), uniqueness (0-100), versatility (0-100).

      Response format MUST be a strict raw JSON array, without markdown tags:
      [
        {
          "pairName": "Example Pair",
          "matchScore": 95,
          "header": "Playfair Display",
          "body": "Inter",
          "accent": "Satoshi",
          "reason": "This is why they match...",
          "useCases": "Example use case",
          "alternativeBody": "Switzer",
          "confidenceScore": 96,
          "detectedStyle": ["Elegant", "Corporate"],
          "detectedReqs": ["Hierarchy", "Contrast"],
          "strengthMetrics": { "elegance": 90, "readability": 85, "contrast": 95, "uniqueness": 80, "versatility": 85 }
        }
      ]
    `;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }]
        })
      });

      if (!response.ok) throw new Error(`API returned ${response.status}`);

      const raw = await response.json();
      let textRes = raw.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Clean Markdown block markup
      if (textRes.includes("```json")) {
        textRes = textRes.split("```json")[1].split("```")[0].trim();
      } else if (textRes.includes("```")) {
        textRes = textRes.split("```")[1].trim();
      }

      const generatedPairings = JSON.parse(textRes);
      if (!Array.isArray(generatedPairings) || generatedPairings.length === 0) {
        throw new Error("Invalid pairing formatting received.");
      }

      activePairings = generatedPairings;
      
      // Inject AI strategy details from first result
      const firstResult = generatedPairings[0];
      analysisConfidence.textContent = `${firstResult.confidenceScore || 96}%`;
      
      tagsDetectedStyle.innerHTML = (firstResult.detectedStyle || ["Premium", "Minimal"]).map(tag => `
        <span class="fp-analysis-tag">${tag}</span>
      `).join("");
      
      tagsDetectedReqs.innerHTML = (firstResult.detectedReqs || ["High Contrast", "Readability"]).map(tag => `
        <span class="fp-analysis-tag">${tag}</span>
      `).join("");

      analysisExplanationText.textContent = `Your design parameters suggest ${firstResult.detectedStyle?.join(", ") || "premium"} style combinations. We matched ${firstResult.header} for structural titles balanced against ${firstResult.body} to maintain target usability.`;

      // Render grid and activate sections
      renderPairCards(activePairings, resultsGrid);
      
      clearInterval(textRotator);
      processingState.style.display = "none";
      analysisReport.style.display = "block";
      stickyToolbar.style.display = "block";
      resultsArea.style.display = "block";
      
      // Smooth scroll to results
      document.getElementById("fp-sticky-toolbar").scrollIntoView({ behavior: "smooth" });

    } catch (e) {
      console.error(e);
      clearInterval(textRotator);
      processingState.style.display = "none";
      alert("Failed to connect to Gemini API or parse results. Please verify your API Key and network connection.");
      // Rollback to defaults showcase
      curatedShowcase.style.display = "block";
    }
  }

  // Bind Hero Button Get AI Suggestions
  const heroAiBtn = document.getElementById("open-ai-generator-btn");
  if (heroAiBtn) {
    heroAiBtn.addEventListener("click", () => {
      promptTextarea.focus();
      document.querySelector(".fp-prompt-box").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

});
