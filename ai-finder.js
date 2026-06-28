/* ═══════════════════════════════════════════════════
   AI FONT FINDER PAGE — JavaScript
   ai-finder.js
═══════════════════════════════════════════════════ */

// ── Shared dark mode toggle ──────────────────────
function applyThemeAiff(dark) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem("fontvault-dark", dark ? "1" : "0");
}

document.getElementById("dark-toggle")?.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  applyThemeAiff(!isDark);
});

// ── Shared hamburger menu ───────────────────────
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu   = document.getElementById("mobile-menu");
if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("mobile-menu--open");
    hamburgerBtn.setAttribute("aria-expanded", open.toString());
  });
}

// ── Shared API key modal ─────────────────────────
function showApiKeyModal(onSave) {
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

  document.getElementById("api-key-modal-cancel").addEventListener("click", () => overlay.remove());
  document.querySelector(".api-key-modal-backdrop").addEventListener("click", () => overlay.remove());
  document.getElementById("api-key-modal-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("api-key-modal-save").click();
  });
  setTimeout(() => document.getElementById("api-key-modal-input")?.focus(), 50);
}

// ── Main AI Finder Logic ─────────────────────────
const aiffInput      = document.getElementById("aiff-input");
const aiffSubmitBtn  = document.getElementById("aiff-submit-btn");
const aiffLoading    = document.getElementById("aiff-loading");
const aiffLoadingTxt = document.getElementById("aiff-loading-text");
const aiffResults    = document.getElementById("aiff-results");
const aiffErrorBox   = document.getElementById("aiff-error-box");

// Suggestion pills
document.querySelectorAll(".aiff-suggestion").forEach(pill => {
  pill.addEventListener("click", () => {
    aiffInput.value = pill.getAttribute("data-prompt");
    aiffInput.focus();
    aiffSubmitBtn.click();
  });
});

// Submit
aiffSubmitBtn?.addEventListener("click", async () => {
  const prompt = aiffInput?.value.trim();
  if (!prompt) {
    aiffInput?.focus();
    return;
  }

  // Check API key
  const apiKey = localStorage.getItem("fontvault-gemini-key") || window.GEMINI_API_KEY || "";
  if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
    showApiKeyModal(() => aiffSubmitBtn.click());
    return;
  }

  // Show loading
  aiffLoading.style.display = "flex";
  aiffResults.style.display = "none";
  aiffErrorBox.style.display = "none";
  aiffSubmitBtn.disabled = true;

  // Loading message rotation
  const msgs = [
    "Analyzing typography style…",
    "Matching font personalities…",
    "Finding best combinations…",
    "Checking spacing guidelines…",
    "Crafting your recommendations…"
  ];
  let msgIdx = 0;
  aiffLoadingTxt.textContent = msgs[msgIdx];
  const msgTimer = setInterval(() => {
    msgIdx = (msgIdx + 1) % msgs.length;
    aiffLoadingTxt.textContent = msgs[msgIdx];
  }, 1600);

  try {
    // Build font list — wait for fontsData (from fonts.js) to be ready
    await waitForFonts();

    const allFontsList = fontsData.map(f => ({
      name: f.name,
      category: f.style || "Sans-Serif",
      provider: f.provider || "google"
    }));

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
  ],
  "body_fonts": [
    {
      "name": "string (Exact font name from database)",
      "explanation": "string (Why it is perfect for body text/interface readability)"
    }
  ],
  "pairings": [
    {
      "heading_font": "string (Exact font name from database)",
      "body_font": "string (Exact font name from database)",
      "score": 9.2,
      "reason": "string (Why this pair works well together)"
    }
  ],
  "insights": {
    "emotional_tone": "string",
    "brand_positioning": "string",
    "visual_strategy": "string"
  }
}`;

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
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      let errDetails = "";
      try {
        const errJson = await response.json();
        errDetails = errJson.error?.message || JSON.stringify(errJson);
      } catch (e) {
        errDetails = await response.text().catch(() => "Unknown error");
      }
      throw new Error(`HTTP ${response.status} — ${errDetails}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty response from AI");

    let cleaned = rawText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    }

    const result = JSON.parse(cleaned);
    renderAiffResults(result, prompt);

  } catch (err) {
    console.error("AI Finder Error:", err);
    showAiffError(err.message);
  } finally {
    clearInterval(msgTimer);
    aiffLoading.style.display = "none";
    aiffSubmitBtn.disabled = false;
  }
});

// Enter key support
aiffInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") aiffSubmitBtn.click();
});

// Wait for fontsData to be populated
function waitForFonts(maxWait = 8000) {
  return new Promise((resolve, reject) => {
    if (typeof fontsData !== "undefined" && fontsData.length > 10) return resolve();
    const start = Date.now();
    const poll = setInterval(() => {
      if (typeof fontsData !== "undefined" && fontsData.length > 10) {
        clearInterval(poll);
        resolve();
      } else if (Date.now() - start > maxWait) {
        clearInterval(poll);
        reject(new Error("Font database took too long to load. Please refresh."));
      }
    }, 150);
  });
}

// ── Render results ───────────────────────────────
function renderAiffResults(data, prompt) {
  const headlineList = document.getElementById("aiff-headline-list");
  const bodyList     = document.getElementById("aiff-body-list");
  const pairingsList = document.getElementById("aiff-pairings-list");
  const insightsBox  = document.getElementById("aiff-insights-content");
  const queryEl      = document.getElementById("aiff-results-query");

  if (!headlineList || !bodyList) return;

  headlineList.innerHTML = "";
  bodyList.innerHTML     = "";
  pairingsList.innerHTML = "";
  insightsBox.innerHTML  = "";

  if (queryEl) queryEl.textContent = `Results for: "${prompt}"`;

  const specimen = "Design is intelligence made visible.";

  const renderCard = (fontData, explanation) => {
    const matched = fontsData.find(f => f.name.toLowerCase() === fontData.name.toLowerCase()) || {
      name: fontData.name,
      style: "Sans-Serif",
      cssFamily: `'${fontData.name}', sans-serif`
    };

    // Load google font dynamically
    if (matched.provider === "google" || !matched.provider) {
      const linkId = `aiff-font-${matched.name.replace(/\s+/g, "-").toLowerCase()}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${matched.name.replace(/\s+/g, "+")}:wght@400;700&display=swap`;
        document.head.appendChild(link);
      }
    }

    const fontFamily = matched.cssFamily || `'${matched.name}', sans-serif`;
    return `
      <div class="aiff-font-card" data-aiff-font="${matched.name}">
        <div class="aiff-card-header">
          <span class="aiff-card-name">${matched.name}</span>
          <span class="aiff-card-tag">${matched.style || "Sans-Serif"}</span>
        </div>
        <div class="aiff-card-preview" contenteditable="true" spellcheck="false" style="font-family: ${fontFamily};">
          ${specimen}
        </div>
        <p class="aiff-card-explanation">${explanation}</p>
      </div>
    `;
  };

  // Headline fonts
  if (data.headline_fonts?.length) {
    data.headline_fonts.forEach(item => {
      headlineList.innerHTML += renderCard(item, item.explanation);
    });
  }

  // Body fonts
  if (data.body_fonts?.length) {
    data.body_fonts.forEach(item => {
      bodyList.innerHTML += renderCard(item, item.explanation);
    });
  }

  // Pairings
  if (data.pairings?.length) {
    data.pairings.forEach(pair => {
      pairingsList.innerHTML += `
        <div class="aiff-pairing-card">
          <div class="aiff-pairing-names-row">
            <span class="aiff-pairing-names">${pair.heading_font} + ${pair.body_font}</span>
            <span class="aiff-pairing-score">Score: ${pair.score}/10</span>
          </div>
          <p class="aiff-pairing-reason">${pair.reason}</p>
        </div>
      `;
    });
  }

  // Insights
  if (data.insights) {
    insightsBox.innerHTML = `
      <div class="aiff-insight-item">
        <span class="aiff-insight-label">Emotional Tone</span>
        <p class="aiff-insight-text">${data.insights.emotional_tone || "—"}</p>
      </div>
      <div class="aiff-insight-item">
        <span class="aiff-insight-label">Brand Positioning</span>
        <p class="aiff-insight-text">${data.insights.brand_positioning || "—"}</p>
      </div>
      <div class="aiff-insight-item">
        <span class="aiff-insight-label">Visual Strategy</span>
        <p class="aiff-insight-text">${data.insights.visual_strategy || "—"}</p>
      </div>
    `;
  }

  // Show results
  aiffResults.style.display = "block";
  aiffResults.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showAiffError(msg) {
  aiffErrorBox.textContent = `Error: ${msg}`;
  aiffErrorBox.style.display = "block";
  aiffErrorBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ── Action buttons ───────────────────────────────
document.getElementById("aiff-action-regenerate")?.addEventListener("click", () => {
  aiffSubmitBtn.click();
});

document.getElementById("aiff-action-save")?.addEventListener("click", () => {
  const names = Array.from(document.querySelectorAll("[data-aiff-font]")).map(el => el.getAttribute("data-aiff-font"));
  if (!names.length) return;
  let added = 0;
  names.forEach(name => {
    const found = fontsData.find(f => f.name.toLowerCase() === name.toLowerCase());
    if (found) {
      let favs = JSON.parse(localStorage.getItem("fontvault-favorites") || "[]");
      if (!favs.includes(found.id)) {
        favs.push(found.id);
        localStorage.setItem("fontvault-favorites", JSON.stringify(favs));
        added++;
      }
    }
  });
  alert(added > 0 ? `Added ${added} recommended fonts to My Vault!` : "These fonts are already in My Vault!");
});

// ── Init Google Fonts if available in fonts.js ───
(async () => {
  try {
    if (typeof initGoogleFonts === "function") {
      await initGoogleFonts("AIzaSyBEmEMaIu15j6c1zxo2OlPnzfHTcfZYasY");
    }
  } catch (e) {
    console.warn("Could not load Google Fonts for AI Finder:", e);
  }
})();
