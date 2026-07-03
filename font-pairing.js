/* font-pairing.js */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const headerSelect = document.getElementById("header-font-select");
  const bodySelect = document.getElementById("body-font-select");
  const swapBtn = document.getElementById("swap-fonts-btn");
  const randomizeBtn = document.getElementById("randomize-fonts-btn");
  
  const headerSizeSlider = document.getElementById("header-size-slider");
  const headerSizeVal = document.getElementById("header-size-val");
  const bodySizeSlider = document.getElementById("body-size-slider");
  const bodySizeVal = document.getElementById("body-size-val");
  const lhSlider = document.getElementById("lh-slider");
  const lhVal = document.getElementById("lh-val");
  
  const previewCanvas = document.getElementById("preview-canvas");
  const previewTitle = document.getElementById("preview-title");
  const previewSubtitle = document.getElementById("preview-subtitle");
  const previewBody1 = document.getElementById("preview-body-1");
  const previewBody2 = document.getElementById("preview-body-2");
  const previewList = document.getElementById("preview-list");
  
  const dlHeaderBtn = document.getElementById("dl-header-font-btn");
  const dlBodyBtn = document.getElementById("dl-body-font-btn");
  
  // Modals
  const aiModal = document.getElementById("ai-modal");
  const openAiBtn = document.getElementById("open-ai-generator-btn");
  const closeAiBtn = document.getElementById("close-ai-modal");
  
  const apiKeyModal = document.getElementById("api-key-modal");
  const closeApiKeyBtn = document.getElementById("close-api-key-modal");
  const saveApiKeyBtn = document.getElementById("save-api-key-btn");
  const apiKeyInput = document.getElementById("api-key-input");
  
  const aiPromptInput = document.getElementById("ai-prompt-input");
  const aiCategorySelect = document.getElementById("ai-category-select");
  const aiGenerateBtn = document.getElementById("ai-generate-submit-btn");
  const aiLoading = document.getElementById("ai-loading");
  const aiResults = document.getElementById("ai-results");
  
  // Navigation scrolling
  const scrollToVisBtn = document.getElementById("scroll-to-visualizer-btn");
  if (scrollToVisBtn) {
    scrollToVisBtn.addEventListener("click", () => {
      document.getElementById("visualizer").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Ensure fontsData exists (from fonts.js)
  if (typeof fontsData === "undefined" || !Array.isArray(fontsData)) {
    console.error("fontsData not found. Make sure fonts.js is loaded first.");
    return;
  }

  // Populate Font Select Dropdowns
  // Filter out any invalid entries and sort alphabetically by name
  const sortedFonts = [...fontsData]
    .filter(f => f && f.name && f.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  function populateDropdowns() {
    headerSelect.innerHTML = "";
    bodySelect.innerHTML = "";
    
    sortedFonts.forEach(font => {
      const opt1 = document.createElement("option");
      opt1.value = font.id;
      opt1.textContent = font.name;
      headerSelect.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = font.id;
      opt2.textContent = font.name;
      bodySelect.appendChild(opt2);
    });
  }

  populateDropdowns();

  // Load a font and update CSS variable/font-family
  function applyFont(fontId, isHeader = true) {
    const fontObj = fontsData.find(f => f.id === fontId);
    if (!fontObj) return;

    // Call shared.js function to load @font-face or link stylesheet
    if (typeof loadExternalFont === "function") {
      loadExternalFont(fontObj);
    }

    if (isHeader) {
      previewTitle.style.fontFamily = `"${fontObj.name}", serif`;
      dlHeaderBtn.textContent = `Download Header (${fontObj.name})`;
      dlHeaderBtn.onclick = () => triggerDownload(fontObj);
    } else {
      const bodyFamily = `"${fontObj.name}", sans-serif`;
      previewSubtitle.style.fontFamily = bodyFamily;
      previewBody1.style.fontFamily = bodyFamily;
      previewBody2.style.fontFamily = bodyFamily;
      previewList.style.fontFamily = bodyFamily;
      dlBodyBtn.textContent = `Download Body (${fontObj.name})`;
      dlBodyBtn.onclick = () => triggerDownload(fontObj);
    }
  }

  // Trigger proxy download (matching homepage logic)
  function triggerDownload(fontObj) {
    if (fontObj.provider === "custom" && fontObj.downloadUrl) {
      window.location.href = `/api/download?url=${encodeURIComponent(fontObj.downloadUrl)}&filename=${fontObj.name.replace(/\s+/g, '_')}.${fontObj.format === 'truetype' ? 'ttf' : fontObj.format === 'opentype' ? 'otf' : 'woff2'}`;
    } else {
      window.location.href = `/api/download?family=${encodeURIComponent(fontObj.name)}`;
    }
    
    // Tracks download count if custom font
    if (fontObj.provider === "custom" && typeof incrementDownloadCount === "function") {
      incrementDownloadCount(fontObj.id);
    }
  }

  // Sync Dropdowns with Selections
  headerSelect.addEventListener("change", (e) => {
    applyFont(e.target.value, true);
  });

  bodySelect.addEventListener("change", (e) => {
    applyFont(e.target.value, false);
  });

  // Size and Spacing Sliders
  headerSizeSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    headerSizeVal.textContent = `${val}px`;
    previewTitle.style.fontSize = `${val}px`;
  });

  bodySizeSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    bodySizeVal.textContent = `${val}px`;
    previewSubtitle.style.fontSize = `${parseFloat(val) * 1.1}px`;
    previewBody1.style.fontSize = `${val}px`;
    previewBody2.style.fontSize = `${val}px`;
    previewList.style.fontSize = `${val}px`;
  });

  lhSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    lhVal.textContent = val;
    previewBody1.style.lineHeight = val;
    previewBody2.style.lineHeight = val;
    previewList.style.lineHeight = val;
  });

  // Alignment Buttons
  const alignButtons = document.querySelectorAll(".align-btn");
  alignButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      alignButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const align = btn.dataset.align;
      previewCanvas.style.textAlign = align;
      if (align === "center") {
        previewList.style.listStylePosition = "inside";
      } else {
        previewList.style.listStylePosition = "outside";
      }
    });
  });

  // Utility Preset actions
  swapBtn.addEventListener("click", () => {
    const hVal = headerSelect.value;
    const bVal = bodySelect.value;
    headerSelect.value = bVal;
    bodySelect.value = hVal;
    applyFont(bVal, true);
    applyFont(hVal, false);
  });

  randomizeBtn.addEventListener("click", () => {
    const randH = sortedFonts[Math.floor(Math.random() * sortedFonts.length)];
    const randB = sortedFonts[Math.floor(Math.random() * sortedFonts.length)];
    
    headerSelect.value = randH.id;
    bodySelect.value = randB.id;
    
    applyFont(randH.id, true);
    applyFont(randB.id, false);
  });

  // Category Presets
  const categoryPresets = document.querySelectorAll(".preset-cat-btn");
  categoryPresets.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.preset;
      let matchedHeaders = [];
      let matchedBodies = [];

      if (type === "serif-sans") {
        matchedHeaders = fontsData.filter(f => f.style === "Serif");
        matchedBodies = fontsData.filter(f => f.style === "Sans-Serif");
      } else if (type === "sans-sans") {
        matchedHeaders = fontsData.filter(f => f.style === "Sans-Serif");
        matchedBodies = fontsData.filter(f => f.style === "Sans-Serif");
      } else if (type === "display-serif") {
        matchedHeaders = fontsData.filter(f => f.style === "Display");
        matchedBodies = fontsData.filter(f => f.style === "Serif");
      } else if (type === "mono-sans") {
        matchedHeaders = fontsData.filter(f => f.style === "Monospace");
        matchedBodies = fontsData.filter(f => f.style === "Sans-Serif");
      }

      if (matchedHeaders.length === 0) matchedHeaders = fontsData;
      if (matchedBodies.length === 0) matchedBodies = fontsData;

      const randomH = matchedHeaders[Math.floor(Math.random() * matchedHeaders.length)];
      const randomB = matchedBodies[Math.floor(Math.random() * matchedBodies.length)];

      headerSelect.value = randomH.id;
      bodySelect.value = randomB.id;
      
      applyFont(randomH.id, true);
      applyFont(randomB.id, false);
    });
  });

  // Curated list actions ("Use Pairing")
  const applyPairButtons = document.querySelectorAll(".btn-apply-pair");
  applyPairButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const headerId = btn.dataset.header;
      const bodyId = btn.dataset.body;
      
      // Select in dropdowns
      headerSelect.value = headerId;
      bodySelect.value = bodyId;
      
      // Apply and render
      applyFont(headerId, true);
      applyFont(bodyId, false);
      
      // Smooth scroll to visualizer
      document.getElementById("visualizer").scrollIntoView({ behavior: "smooth" });
    });
  });

  // ── INITIAL SETTINGS ──
  // Default combination: Playfair Display + Inter (ID matches)
  const defaultHeader = "playfair-display";
  const defaultBody = "inter";
  
  if (fontsData.some(f => f.id === defaultHeader)) {
    headerSelect.value = defaultHeader;
    bodySelect.value = defaultBody;
    applyFont(defaultHeader, true);
    applyFont(defaultBody, false);
  } else {
    // If defaults not present, take first two
    const h = sortedFonts[0]?.id;
    const b = sortedFonts[1]?.id;
    if (h && b) {
      headerSelect.value = h;
      bodySelect.value = b;
      applyFont(h, true);
      applyFont(b, false);
    }
  }

  // ── AI SUGGESTIONS LOGIC ──
  openAiBtn.addEventListener("click", () => {
    const key = localStorage.getItem("fontvault-gemini-key") || "";
    if (!key) {
      apiKeyModal.classList.add("active");
    } else {
      aiModal.classList.add("active");
    }
  });

  closeAiBtn.addEventListener("click", () => {
    aiModal.classList.remove("active");
  });

  closeApiKeyBtn.addEventListener("click", () => {
    apiKeyModal.classList.remove("active");
  });

  saveApiKeyBtn.addEventListener("click", () => {
    const val = apiKeyInput.value.trim();
    if (val) {
      localStorage.setItem("fontvault-gemini-key", val);
      apiKeyModal.classList.remove("active");
      aiModal.classList.add("active");
    } else {
      alert("Please enter a valid Gemini API Key.");
    }
  });

  // Query Gemini API
  aiGenerateBtn.addEventListener("click", async () => {
    const key = localStorage.getItem("fontvault-gemini-key");
    const prompt = aiPromptInput.value.trim();
    const stylePreference = aiCategorySelect.value;
    
    if (!prompt) {
      alert("Please describe your project first!");
      return;
    }

    aiGenerateBtn.disabled = true;
    aiLoading.style.display = "flex";
    aiResults.style.display = "none";
    aiResults.innerHTML = "";

    // Gather available font names in the catalog to feed the AI
    const catalogFonts = fontsData.slice(0, 100).map(f => f.name).join(", ");

    const finalPrompt = `
      You are an expert typographic pairing system for a premium website called FontVault.
      The user describes their project as: "${prompt}".
      They prefer the primary heading style to be: "${stylePreference}".
      
      We have these fonts available in our system catalog: ${catalogFonts}.
      
      Suggest exactly 3 font combinations from the available catalog (or standard Google Fonts like Inter, Playfair Display, Roboto, Lora, Satoshi, Switzer, Montserrat, Oswald, Cinzel, Nunito, Open Sans, Lato, etc.).
      
      For each suggestion, provide:
      1. Heading Font name
      2. Body Font name
      3. Brief explanation (1-2 sentences) of why they pair well for this specific project.
      
      Format the response strictly as a JSON array like this (do not wrap in markdown quotes, just raw JSON):
      [
        {
          "header": "Heading Font Name",
          "body": "Body Font Name",
          "reason": "Why this combination works..."
        },
        ...
      ]
    `;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: finalPrompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const raw = await response.json();
      let textResponse = raw.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Clean up potential markdown formatting block if Gemini wraps it
      if (textResponse.includes("```json")) {
        textResponse = textResponse.split("```json")[1].split("```")[0].trim();
      } else if (textResponse.includes("```")) {
        textResponse = textResponse.split("```")[1].trim();
      }

      const suggestions = JSON.parse(textResponse);
      
      if (!Array.isArray(suggestions)) {
        throw new Error("Invalid format returned by AI.");
      }

      renderAiSuggestions(suggestions);

    } catch (e) {
      console.error(e);
      aiResults.innerHTML = `
        <div style="color:#ef4444; text-align:center; padding:1rem; font-family:var(--font-mono); font-size:0.75rem;">
          Error generating pairings. Ensure your API key is correct and valid.<br><br>
          <span style="text-decoration:underline; cursor:pointer;" onclick="localStorage.removeItem('fontvault-gemini-key'); location.reload();">Reset API Key</span>
        </div>`;
      aiResults.style.display = "block";
    } finally {
      aiLoading.style.display = "none";
      aiGenerateBtn.disabled = false;
    }
  });

  function renderAiSuggestions(list) {
    aiResults.innerHTML = '<h4 style="font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.05em; color:var(--text-secondary); margin-bottom:1rem; text-transform:uppercase;">Gemini Recommendations</h4>';
    
    list.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.className = "ai-suggestion-item";
      
      // Clean target matching for header and body
      const headerObj = findFontByName(item.header);
      const bodyObj = findFontByName(item.body);
      
      itemEl.innerHTML = `
        <div class="ai-suggestion-header">
          <span class="ai-suggestion-title">${item.header} + ${item.body}</span>
          ${(headerObj && bodyObj) ? `
            <button class="btn-apply-suggestion" data-header="${headerObj.id}" data-body="${bodyObj.id}">
              Apply Pairing
            </button>
          ` : `<span style="font-size:0.65rem; color:#888;">Catalog Match Drafted</span>`}
        </div>
        <div class="ai-suggestion-names">${item.header} / ${item.body}</div>
        <p class="ai-suggestion-desc">${item.reason}</p>
      `;
      
      aiResults.appendChild(itemEl);
    });

    // Listeners for newly created buttons inside modal
    aiResults.querySelectorAll(".btn-apply-suggestion").forEach(btn => {
      btn.addEventListener("click", () => {
        const hId = btn.dataset.header;
        const bId = btn.dataset.body;
        
        headerSelect.value = hId;
        bodySelect.value = bId;
        applyFont(hId, true);
        applyFont(bId, false);
        
        // Close modal and scroll
        aiModal.classList.remove("active");
        document.getElementById("visualizer").scrollIntoView({ behavior: "smooth" });
      });
    });

    aiResults.style.display = "block";
  }

  // Find font object by name search (supporting partial matches)
  function findFontByName(name) {
    if (!name) return null;
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Exact match search
    let match = fontsData.find(f => f.name.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanName);
    
    // Partial match search fallback
    if (!match) {
      match = fontsData.find(f => f.name.toLowerCase().includes(cleanName) || cleanName.includes(f.name.toLowerCase()));
    }
    
    return match;
  }
});
