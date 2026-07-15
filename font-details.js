// font-details.js

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Apply dark mode preference immediately
    const savedDark = localStorage.getItem("fontvault-dark");
    if (savedDark === "1") {
      applyTheme(true);
    } else {
      applyTheme(false);
    }

    setupSharedEventListeners();
    const urlParams = new URLSearchParams(window.location.search);
    let fontId = urlParams.get('id');
    if (!fontId) {
      const pathParts = window.location.pathname.split('/');
      const fontsIndex = pathParts.indexOf('fonts');
      if (fontsIndex !== -1 && pathParts[fontsIndex + 1]) {
        fontId = decodeURIComponent(pathParts[fontsIndex + 1]);
      }
    }
    
    if (!fontId) {
      document.getElementById('font-detail-root').innerHTML = `
        <div style="text-align:center; padding:10rem 2rem;">
          <h2>Font not found.</h2>
          <a href="/index.html" class="cta-btn cta-primary" style="margin-top:2rem;">Return to Home</a>
        </div>
      `;
      return;
    }

    // Show premium loading state
    const root = document.getElementById('font-detail-root');
    root.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto; padding: 4rem 1.5rem; color: var(--text-primary);">
        <div style="width: 180px; height: 16px; background: #F3F3F3; margin-bottom: 2.5rem; animation: skeleton-pulse 1.5s infinite;"></div>
        <div style="width: 50%; height: 80px; background: #F3F3F3; margin-bottom: 2rem; animation: skeleton-pulse 1.5s infinite;"></div>
        <div style="width: 70%; height: 24px; background: #F3F3F3; margin-bottom: 1rem; animation: skeleton-pulse 1.5s infinite;"></div>
        <div style="width: 40%; height: 24px; background: #F3F3F3; margin-bottom: 4rem; animation: skeleton-pulse 1.5s infinite;"></div>
        <div style="width: 100%; height: 240px; background: #FAFAFA; border: 1px solid #ECECEC; animation: skeleton-pulse 1.5s infinite;"></div>
      </div>
      <style>
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      </style>
    `;

    // Load Google Fonts AND custom admin-uploaded fonts in parallel with a timeout race
    try {
      await Promise.race([
        Promise.all([
          initGoogleFonts('AIzaSyBEmEMaIu15j6c1zxo2OlPnzfHTcfZYasY'),
          loadCustomFontsFromSupabase()
        ]),
        new Promise(resolve => setTimeout(resolve, 2000)) // 2-second fallback timeout
      ]);
    } catch (e) {
      console.warn("Non-blocking load error:", e);
    }

    const font = fontsData.find(f => f.id === fontId);
    if (!font) {
      root.innerHTML = `
        <div style="text-align:center; padding:10rem 2rem;">
          <h2>Font not found in the database.</h2>
          <p style="color:#888; margin-top:1rem;">The font may have been removed or the link is invalid.</p>
          <a href="/index.html" class="cta-btn cta-primary" style="margin-top:2rem;">Return to Home</a>
        </div>
      `;
      return;
    }

    // Load the external font stylesheet/rules
    loadExternalFont(font);

    // Render cinematic page
    renderFontDetails(font);
    updateDynamicSEO(font);
    
    // Initialize Premium Interactions (Scroll, Animations, Controls)
    initPremiumInteractions(font);

  } catch (globalError) {
    console.error("Global Details Initialization Error:", globalError);
    const root = document.getElementById('font-detail-root');
    if (root) {
      root.innerHTML = `
        <div style="text-align:center; padding:10rem 2rem; color:var(--text-primary);">
          <h2>Initialization Error</h2>
          <p style="color:#EF4444; margin-top:1rem; font-family:monospace; font-size:0.9rem;">${globalError.name}: ${globalError.message}</p>
          <p style="color:#888; margin-top:0.5rem; font-size:0.85rem;">Stack trace: ${globalError.stack ? globalError.stack.split('\n')[0] : ''}</p>
          <a href="/index.html" class="cta-btn cta-primary" style="margin-top:2rem;">Return to Home</a>
        </div>
      `;
    }
  }
});

// Dynamic SEO Injector
function updateDynamicSEO(font) {
  if (!window.FontVaultSEO) return;

  const fontId = font.id || font.slug || font.name.toLowerCase().replace(/\s+/g, '-');
  const title = `${font.name} Font — Specimen, Playground & Alternatives | FontVault`;
  const desc = font.description || `Explore ${font.name} typeface, test the live specimen playground, download font family files, and browse pairings.`;
  const canonicalUrl = `${window.FontVaultSEO.CANONICAL_HOST}/fonts/${fontId}`;

  window.FontVaultSEO.updateMetadata(title, desc, canonicalUrl, "font");

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Fonts", url: "/#hero" },
    { name: font.name, url: `/fonts/${fontId}` }
  ];
  const breadcrumbHtml = window.FontVaultSEO.renderBreadcrumbs(crumbs);
  const breadcrumbContainer = document.getElementById('breadcrumbs-injection-point');
  if (breadcrumbContainer) {
    breadcrumbContainer.innerHTML = breadcrumbHtml;
  }
}

// Render dynamic sections
function renderFontDetails(font) {
  const root = document.getElementById('font-detail-root');
  const fam = font.cssFamily || `'${font.name}'`;
  
  const weights = getFontWeights(font);
  const defaultWeight = weights.includes(400) ? 400 : weights[0];
  
  // Generate styles grid preview cards HTML
  const stylesHtml = weights.map(w => `
    <div class="style-card cascade-item" data-weight="${w}">
      <div class="style-card-header">
        <span class="style-weight-name">${getWeightLabel(w)}</span>
        <span class="style-weight-num">${w}</span>
      </div>
      <div class="style-preview-text" style="font-family: ${fam}, serif; font-weight: ${w};">
        ${font.name} Specimen
      </div>
    </div>
  `).join('');

  // Generate pairing cards
  const pairingFonts = fontsData.filter(f => f.id !== font.id).slice(0, 2);
  const pairingsHtml = pairingFonts.map((pFont, idx) => {
    const categories = ["Editorial", "SaaS Startup", "Luxury Boutique", "Branding"];
    const activeCategory = categories[idx % categories.length];
    const matchScores = [98, 95];
    const activeScore = matchScores[idx % matchScores.length];
    
    // Lazy load the pairing body font
    loadExternalFont(pFont);
    const pFam = pFont.cssFamily || `'${pFont.name}'`;
    
    return `
      <div class="pairing-showcase-card cascade-item">
        <div class="pairing-card-header">
          <div class="pairing-fonts-meta">
            <span class="pairing-font-role">Heading / Body</span>
            <span class="pairing-font-name">${font.name} + ${pFont.name}</span>
          </div>
          <span class="pairing-match-pill">${activeScore}% Match</span>
        </div>
        <div class="pairing-preview-box">
          <h4 class="pairing-headline" style="font-family: ${fam}, serif;">We design interfaces that shape cultural perception.</h4>
          <p class="pairing-paragraph" style="font-family: ${pFam}, sans-serif;">
            Typography holds the visual structure of message intent. By balancing heading terminals with neutral body paragraphs, reader engagement remains consistent.
          </p>
        </div>
        <div class="pairing-card-footer">
          <span class="pairing-use-tag">${activeCategory}</span>
          <button class="cta-btn cta-secondary" style="padding: 0.5rem 1.25rem; font-size: 0.78rem;" onclick="copyCSSPairing('${font.name}', '${pFont.name}')">
            <i data-lucide="code" style="width: 13px; height: 13px;"></i> Copy Rules
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Main UI skeleton
  root.innerHTML = `
    <!-- Ambient mesh background & noise filter -->
    <div class="mesh-glow"></div>
    <div class="noise-overlay"></div>

    <!-- 1. CINEMATIC HERO -->
    <section class="hero-section" id="hero" style="padding-top: 4rem;">
      <div class="container hero-wrapper">
        <div class="breadcrumb-nav">
          <a href="index.html">Home</a>
          <span>/</span>
          <a href="index.html#hero">Fonts</a>
          <span>/</span>
          <span style="color: var(--text-primary); font-weight: 500;">${font.name}</span>
        </div>

        <div class="hero-font-title-wrapper" style="margin-top: 1.5rem;">
          <h1 class="hero-font-title" style="font-family: ${fam}, serif;">${font.name}</h1>
        </div>

        <p class="hero-font-description">
          ${font.description || 'A highly crafted typographic specimen optimized for digital interfaces, editorial layout, and modern brand design languages.'}
        </p>

        <!-- Metadata Row -->
        <div class="hero-metadata-grid cascade-item">
          <div class="metadata-item">
            <span class="metadata-label">Designer</span>
            <span class="metadata-value" title="${font.designer || 'Independent'}">${font.designer || 'Independent'}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Foundry</span>
            <span class="metadata-value" title="${font.foundry || 'Independent'}">${font.foundry || 'Independent'}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Category</span>
            <span class="metadata-value" title="${font.style || 'Display'}">${font.style || 'Display'}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">License</span>
            <span class="metadata-value" title="${font.price || 'Free'}">${font.price || 'Free'}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">Languages</span>
            <span class="metadata-value" title="${font.languages ? font.languages.join(', ') : 'Latin'}">${font.languages ? font.languages.join(', ') : 'Latin'}</span>
          </div>
        </div>

        <!-- Primary Action buttons -->
        <div class="hero-actions cascade-item">
          <button class="cta-btn cta-primary" id="btn-hero-download">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Download Family
          </button>
          <button class="cta-icon-btn ${window.favoritesSet && window.favoritesSet.has(font.id) ? 'active' : ''}" id="btn-hero-favorite" title="Save to Vault" onclick="toggleFavoriteState('${font.id}', this)">
            <i data-lucide="heart" style="width: 18 height: 18px; pointer-events: none;"></i>
          </button>
          <button class="cta-icon-btn" id="btn-hero-share" title="Share typeface">
            <i data-lucide="share-2" style="width: 18px; height: 18px;"></i>
          </button>
          <button class="cta-icon-btn" id="btn-hero-copy-css" title="Copy CSS rules">
            <i data-lucide="code" style="width: 18px; height: 18px;"></i>
          </button>
        </div>

        <!-- Huge editable specimen card -->
        <div class="hero-specimen-card cascade-item">
          <div class="specimen-card-header">
            <span class="specimen-card-tag">${font.name} Regular specimen</span>
            <span class="specimen-card-indicator">Interactive Canvas</span>
          </div>
          <div class="hero-specimen-editable" id="hero-editable-specimen" contenteditable="true" spellcheck="false" style="font-family: ${fam}, serif;">
            Typing updates this specimen instantly.
          </div>
        </div>
      </div>
    </section>

    <!-- 2. SPECIMEN PLAYGROUND (Highlight) -->
    <section class="playground-section" id="playground">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Interactive Playground</h2>
        <p style="color: var(--text-secondary); margin: 0 0 4rem 0; font-size: 1.1rem; max-width: 600px;">Customize design axes, adjust variable sliders, alignment, or canvas colors to see the letters react.</p>

        <div class="playground-grid">
          <!-- Left: Big Specimen Preview -->
          <div class="playground-canvas" id="p-canvas" style="background-color: var(--card-bg-subtle);">
            <div class="playground-canvas-header">
              <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;" id="p-canvas-label">Active specs</span>
              <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;" id="p-canvas-font-name">${font.name}</span>
            </div>
            <div class="playground-editable-text" id="p-editable-text" contenteditable="true" spellcheck="false" style="font-family: ${fam}, serif; font-weight: ${defaultWeight};">
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>

          <!-- Right: Controls -->
          <div class="playground-controls">
            <!-- Font Size -->
            <div class="control-group">
              <div class="control-header">
                <span class="control-label">Size</span>
                <span class="control-value" id="val-size">64px</span>
              </div>
              <input type="range" class="custom-range" id="slider-size" min="16" max="180" value="64">
            </div>

            <!-- Font Weight -->
            <div class="control-group">
              <div class="control-header">
                <span class="control-label">Weight</span>
                <span class="control-value" id="val-weight">${defaultWeight}</span>
              </div>
              <input type="range" class="custom-range" id="slider-weight" min="100" max="900" step="100" value="${defaultWeight}">
            </div>

            <!-- Letter Spacing -->
            <div class="control-group">
              <div class="control-header">
                <span class="control-label">Letter Spacing</span>
                <span class="control-value" id="val-tracking">0.00em</span>
              </div>
              <input type="range" class="custom-range" id="slider-tracking" min="-0.1" max="0.3" step="0.01" value="0">
            </div>

            <!-- Line Height -->
            <div class="control-group">
              <div class="control-header">
                <span class="control-label">Line Height</span>
                <span class="control-value" id="val-leading">1.2</span>
              </div>
              <input type="range" class="custom-range" id="slider-leading" min="0.8" max="2.5" step="0.1" value="1.2">
            </div>

            <!-- Variable axes if available (Weight, Width, Optical Size) -->
            ${font.isVariable || font.name.toLowerCase().includes('variable') ? `
              <div class="control-group">
                <div class="control-header">
                  <span class="control-label" style="color: var(--accent-color);">Variable Width</span>
                  <span class="control-value" id="val-var-width">100</span>
                </div>
                <input type="range" class="custom-range" id="slider-var-width" min="50" max="150" value="100">
              </div>
              <div class="control-group">
                <div class="control-header">
                  <span class="control-label" style="color: var(--accent-color);">Optical Size</span>
                  <span class="control-value" id="val-var-opsz">14</span>
                </div>
                <input type="range" class="custom-range" id="slider-var-opsz" min="6" max="72" value="14">
              </div>
            ` : ""}

            <!-- Alignment -->
            <div class="control-group">
              <span class="control-label">Alignment</span>
              <div class="segmented-control" id="seg-alignment">
                <button class="segment-btn active" data-align="left">Left</button>
                <button class="segment-btn" data-align="center">Center</button>
                <button class="segment-btn" data-align="right">Right</button>
                <button class="segment-btn" data-align="justify">Justify</button>
              </div>
            </div>

            <!-- Text Transform -->
            <div class="control-group">
              <span class="control-label">Text Transform</span>
              <div class="segmented-control" id="seg-transform">
                <button class="segment-btn active" data-transform="none">None</button>
                <button class="segment-btn" data-transform="uppercase">Caps</button>
                <button class="segment-btn" data-transform="lowercase">Lower</button>
              </div>
            </div>

            <!-- Canvas Theme Picker -->
            <div class="control-group">
              <span class="control-label">Theme</span>              <div class="color-theme-picker" id="color-theme-picker" style="display: flex; gap: 0.5rem;">
                <div class="color-circle active" data-bg="#F9F9F9" data-text="#111" style="background-color: #F9F9F9; border: 1px solid #ddd; width: 24px; height: 24px; cursor: pointer;"></div>
                <div class="color-circle" data-bg="#111" data-text="#FFF" style="background-color: #111; width: 24px; height: 24px; cursor: pointer;"></div>
                <div class="color-circle" data-bg="rgba(var(--accent-rgb), 0.05)" data-text="var(--accent-color)" style="background-color: rgba(255, 59, 0, 0.2); width: 24px; height: 24px; cursor: pointer;"></div>
                <div class="color-circle" data-bg="#090909" data-text="#34D399" style="background-color: #090909; color: #34D399; font-family: monospace; font-size: 8px; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">&lt;&gt;</div>
              </div>
            </div>

            <!-- Switch: Italic -->
            <div class="control-group switch-control">
              <span class="control-label">Italic Overlay</span>
              <div>
                <input type="checkbox" id="switch-italic" class="switch-input">
                <label for="switch-italic" class="switch-label"></label>
              </div>
            </div>

            <!-- Reset Button -->
            <button class="cta-btn cta-secondary" id="btn-reset-playground" style="margin-top: 1rem; width: 100%; justify-content: center;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i> Reset Playground
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. STYLE FAMILY DETAILS -->
    <section class="styles-section" id="styles">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Styles &amp; Weights</h2>
        <p style="color: var(--text-secondary); margin: 0 0 4rem 0; font-size: 1.1rem; max-width: 600px;">Review weights from thin hairline formats to heavy black profiles. Hover cards to test previews, click to load weight directly to playground.</p>
        <div class="styles-grid" id="weights-grid-container">
          ${stylesHtml}
        </div>
      </div>
    </section>

    <!-- 4. GLYPHS EXPLORER -->
    <section class="glyphs-section" id="glyphs">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Glyphs &amp; Characters</h2>
        <p style="color: var(--text-secondary); margin: 0 0 4rem 0; font-size: 1.1rem; max-width: 600px;">Inspect character shapes, metrics rules, vectors structure, and copy unicodes directly to your codebase clipboard.</p>

        <div class="glyphs-layout">
          <!-- Left Panel: Sticky Large Preview -->
          <div class="glyphs-sticky-panel">
            <div class="glyph-large-card">
              <!-- Metrics Guidelines overlay -->
              <div class="glyph-guidelines">
                <div class="guideline-line" id="guide-cap" style="top: 25%;"><span>Cap Height</span><span id="label-cap">700</span></div>
                <div class="guideline-line" id="guide-x" style="top: 45%;"><span>X-Height</span><span id="label-x">480</span></div>
                <div class="guideline-line" id="guide-base" style="top: 76%;"><span>Baseline</span><span>0</span></div>
                <div class="guideline-line" id="guide-desc" style="top: 88%;"><span>Descender</span><span id="label-desc">-220</span></div>
              </div>
              
              <!-- Large Display Character -->
              <div class="glyph-large-display" id="large-glyph-char" style="font-family: ${fam}, serif;">A</div>

              <div class="glyph-meta-row">
                <div class="glyph-meta-text">
                  <span class="glyph-meta-name" id="glyph-char-name">Capital Letter A</span>
                  <span class="glyph-meta-unicode" id="glyph-char-unicode">U+0041</span>
                </div>
                <button class="cta-btn cta-secondary" style="padding: 0.5rem 1rem; font-size: 0.75rem;" id="btn-copy-glyph-unicode">
                  <i data-lucide="copy" style="width: 12px; height: 12px;"></i> Copy Code
                </button>
              </div>
            </div>
          </div>

          <!-- Right Panel: Browse characters -->
          <div>
            <!-- Category Tabs -->
            <div class="glyph-category-tabs" id="glyph-tabs-container">
              <button class="glyph-tab active" data-set="uppercase">Uppercase</button>
              <button class="glyph-tab" data-set="lowercase">Lowercase</button>
              <button class="glyph-tab" data-set="numbers">Numbers</button>
              <button class="glyph-tab" data-set="symbols">Symbols</button>
              <button class="glyph-tab" data-set="punctuation">Punctuation</button>
              <button class="glyph-tab" data-set="latin-ext">Latin Extended</button>
            </div>

            <!-- Custom Glyph Search -->
            <div style="margin-bottom: 2rem;">
              <input type="text" class="custom-range" id="glyph-custom-text-search" placeholder="Type custom characters to inspect..." style="padding: 0.8rem 1.5rem; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; font-size: 0.95rem; color: var(--text-primary); height: auto;">
            </div>

            <!-- Grid container -->
            <div class="glyphs-cell-grid" id="glyphs-cells-container">
              <!-- Loaded dynamically via js -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. FONT IN USE SHOWCASE (Parallax Mockups) -->
    <section class="showcase-section" id="showcase">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Font in Use</h2>
        <p style="color: var(--text-secondary); margin: 0 0 4rem 0; font-size: 1.1rem; max-width: 600px;">Review real-world typographic compositions and mockups displaying the typeface layout potentials.</p>

        <div class="showcase-grid">
          <!-- Card 1: Landing Page Hero -->
          <div class="showcase-card-wrapper cascade-item">
            <div class="showcase-card">
              <div class="showcase-layout-demo" style="text-align: center; justify-content: center; padding: 2rem;">
                <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-color); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem;">Next-Gen Platform</span>
                <h3 style="font-family: ${fam}, serif; font-size: clamp(1.5rem, 3vw, 2.2rem); margin: 0 0 0.8rem; font-weight: 700; line-height: 1.1; color: var(--text-primary);">Accelerating developers velocity.</h3>
                <p style="font-size: 0.8rem; max-width: 290px; margin: 0 auto; color: var(--text-secondary); line-height: 1.5;">Deploy serverless websites, host assets globally, and run databases instantly.</p>
              </div>
            </div>
            <div class="showcase-meta" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.2rem;">
              <span class="showcase-tag" style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-color); text-transform: uppercase;">App UI Mockup</span>
              <h3 class="showcase-title" style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-primary);">Vercel-style Landing Hero</h3>
            </div>
          </div>

          <!-- Card 2: Editorial Magazine -->
          <div class="showcase-card-wrapper cascade-item">
            <div class="showcase-card">
              <div class="showcase-layout-demo" style="padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; text-align: left; background-color: #111; color: #FFF;">
                <span style="font-family: var(--font-mono); font-size: 0.65rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.05em;">Issue 27 — Summer 2026</span>
                <h3 style="font-family: ${fam}, serif; font-size: clamp(1.8rem, 3.5vw, 2.4rem); margin: 1.5rem 0; line-height: 1.1; font-weight: 300; color: #FFF;">Silent forms of visual culture.</h3>
                <p style="font-size: 0.78rem; margin: 0; color: #888; line-height: 1.5; max-width: 240px;">An analytical review of classic Roman typography balanced against Swiss architecture.</p>
              </div>
            </div>
            <div class="showcase-meta" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.2rem;">
              <span class="showcase-tag" style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-color); text-transform: uppercase;">Editorial Composition</span>
              <h3 class="showcase-title" style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-primary);">Brutalist Magazine Cover</h3>
            </div>
          </div>

          <!-- Card 3: Dashboard Typography Grid -->
          <div class="showcase-card-wrapper showcase-grid-full cascade-item">
            <div class="showcase-card" style="height: 290px;">
              <div class="showcase-layout-demo" style="padding: 2rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; align-items: center; background-color: var(--bg-color);">
                <div style="border-right: 1px solid var(--border-color); padding-right: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                  <div>
                    <span style="font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.05em;">CONVERSION RATE</span>
                    <h4 style="font-family: ${fam}, serif; font-size: clamp(2rem, 3vw, 2.8rem); margin: 0.2rem 0 0; font-weight: 500; color: var(--text-primary);">94.2%</h4>
                    <p style="font-size: 0.7rem; color: #22c55e; margin: 0.1rem 0 0; font-family: var(--font-mono); font-weight: 500;">&uarr; 12.4%</p>
                  </div>
                  <!-- Premium Minimal Bar Chart -->
                  <div style="display: flex; gap: 4px; align-items: flex-end; height: 35px; margin-top: 0.8rem; width: 100%;">
                    <div style="flex: 1; height: 10px; background: #22c55e; opacity: 0.4;"></div>
                    <div style="flex: 1; height: 14px; background: #22c55e; opacity: 0.5;"></div>
                    <div style="flex: 1; height: 12px; background: #22c55e; opacity: 0.6;"></div>
                    <div style="flex: 1; height: 20px; background: #22c55e; opacity: 0.7;"></div>
                    <div style="flex: 1; height: 16px; background: #22c55e; opacity: 0.8;"></div>
                    <div style="flex: 1; height: 24px; background: #22c55e; opacity: 0.9;"></div>
                    <div style="flex: 1; height: 18px; background: #22c55e;"></div>
                    <div style="flex: 1; height: 26px; background: #22c55e;"></div>
                    <div style="flex: 1; height: 32px; background: #22c55e;"></div>
                  </div>
                </div>
                
                <div style="border-right: 1px solid var(--border-color); padding-right: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                  <div>
                    <span style="font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.05em;">ACTIVE USERS</span>
                    <h4 style="font-family: ${fam}, serif; font-size: clamp(2rem, 3vw, 2.8rem); margin: 0.2rem 0 0; font-weight: 500; color: var(--text-primary);">18.5k</h4>
                    <p style="font-size: 0.7rem; color: var(--text-muted); margin: 0.1rem 0 0; font-family: var(--font-mono);">Peak: 2.4k/min</p>
                  </div>
                  <!-- Premium Minimal Bar Chart -->
                  <div style="display: flex; gap: 4px; align-items: flex-end; height: 35px; margin-top: 0.8rem; width: 100%;">
                    <div style="flex: 1; height: 22px; background: var(--text-primary); opacity: 0.15;"></div>
                    <div style="flex: 1; height: 18px; background: var(--text-primary); opacity: 0.25;"></div>
                    <div style="flex: 1; height: 26px; background: var(--text-primary); opacity: 0.35;"></div>
                    <div style="flex: 1; height: 14px; background: var(--text-primary); opacity: 0.45;"></div>
                    <div style="flex: 1; height: 24px; background: var(--text-primary); opacity: 0.6;"></div>
                    <div style="flex: 1; height: 30px; background: var(--text-primary); opacity: 0.75;"></div>
                    <div style="flex: 1; height: 20px; background: var(--text-primary); opacity: 0.85;"></div>
                    <div style="flex: 1; height: 28px; background: var(--accent-color);"></div>
                    <div style="flex: 1; height: 35px; background: var(--accent-color);"></div>
                  </div>
                </div>
                
                <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                  <div>
                    <span style="font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.05em;">TOTAL DISK USED</span>
                    <h4 style="font-family: ${fam}, serif; font-size: clamp(2rem, 3vw, 2.8rem); margin: 0.2rem 0 0; font-weight: 500; color: var(--text-primary);">8.42<span style="font-size: 1.1rem;">TB</span></h4>
                    <p style="font-size: 0.7rem; color: #EF4444; margin: 0.1rem 0 0; font-family: var(--font-mono); font-weight: 500;">82% Capacity</p>
                  </div>
                  <!-- Premium Segmented Storage Bar -->
                  <div style="display: flex; gap: 3px; margin-top: 1rem; width: 100%;">
                    <div style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div style="flex: 1; height: 6px; background: var(--border-color);"></div>
                    <div style="flex: 1; height: 6px; background: var(--border-color);"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="showcase-meta" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.2rem;">
              <span class="showcase-tag" style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-color); text-transform: uppercase;">SaaS Dashboard</span>
              <h3 class="showcase-title" style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-primary);">Numerical Metrics UI</h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. FONT PAIRINGS -->
    <section class="pairings-section" id="pairings">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Recommended Pairings</h2>
        <p style="color: var(--text-secondary); margin: 0 0 4rem 0; font-size: 1.1rem; max-width: 600px;">Combine header weights with body typefaces selected dynamically using typographic balance rules.</p>
        <div class="pairings-row">
          ${pairingsHtml}
        </div>
      </div>
    </section>

    <!-- 7. TECHNICAL SPECIFICATIONS -->
    <section class="specs-section" id="specs">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Specifications</h2>
        <p style="color: var(--text-secondary); margin: 0 0 4rem 0; font-size: 1.1rem; max-width: 600px;">Technical attributes, supported character boundaries, weights count, and file sizes.</p>

        <div class="details-list-grid">
          <!-- Card 1 -->
          <div class="detail-list-card cascade-item">
            <div class="detail-list-icon"><i data-lucide="user"></i></div>
            <div class="detail-list-info">
              <span class="detail-list-label">Designer</span>
              <span class="detail-list-val" title="${font.designer || 'Independent'}">${font.designer || 'Independent'}</span>
            </div>
          </div>
          <!-- Card 2 -->
          <div class="detail-list-card cascade-item">
            <div class="detail-list-icon"><i data-lucide="building"></i></div>
            <div class="detail-list-info">
              <span class="detail-list-label">Foundry</span>
              <span class="detail-list-val" title="${font.foundry || 'Independent'}">${font.foundry || 'Independent'}</span>
            </div>
          </div>
          <!-- Card 3 -->
          <div class="detail-list-card cascade-item">
            <div class="detail-list-icon"><i data-lucide="award"></i></div>
            <div class="detail-list-info">
              <span class="detail-list-label">License</span>
              <span class="detail-list-val">${font.price || 'Free'}</span>
            </div>
          </div>
          <!-- Card 4 -->
          <div class="detail-list-card cascade-item">
            <div class="detail-list-icon"><i data-lucide="file-type"></i></div>
            <div class="detail-list-info">
              <span class="detail-list-label">File Size</span>
              <span class="detail-list-val">${font.fileSize || 'N/A'}</span>
            </div>
          </div>
          <!-- Card 5 -->
          <div class="detail-list-card cascade-item">
            <div class="detail-list-icon"><i data-lucide="layers"></i></div>
            <div class="detail-list-info">
              <span class="detail-list-label">Styles</span>
              <span class="detail-list-val">${font.stylesCount || 1} available</span>
            </div>
          </div>
          <!-- Card 6 -->
          <div class="detail-list-card cascade-item">
            <div class="detail-list-icon"><i data-lucide="languages"></i></div>
            <div class="detail-list-info">
              <span class="detail-list-label">Languages</span>
              <span class="detail-list-val">${font.languages ? font.languages.join(', ') : 'Latin'}</span>
            </div>
          </div>
          <!-- Card 7 -->
          <div class="detail-list-card cascade-item">
            <div class="detail-list-icon"><i data-lucide="binary"></i></div>
            <div class="detail-list-info">
              <span class="detail-list-label">Glyphs Count</span>
              <span class="detail-list-val">240 characters</span>
            </div>
          </div>
          <!-- Card 8 -->
          <div class="detail-list-card cascade-item">
            <div class="detail-list-icon"><i data-lucide="sliders"></i></div>
            <div class="detail-list-info">
              <span class="detail-list-label">Variable Font</span>
              <span class="detail-list-val">${font.isVariable || font.name.toLowerCase().includes('variable') ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. APPLE-STYLE DOWNLOAD BANNER -->
    <section class="download-cta-section" id="download-banner">
      <div class="container">
        <div class="download-cta-banner cascade-item">
          <div class="mesh-glow" style="opacity: 0.1;"></div>
          <h2 class="download-banner-title">Ready to build with ${font.name}?</h2>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; z-index: 2;">
            <button class="cta-btn cta-primary" id="btn-banner-download" style="padding: 1.2rem 3.5rem; font-size: 1.05rem;">
              <i data-lucide="download" style="width: 18px; height: 18px;"></i> Download Font Family
            </button>
            <button class="cta-btn cta-secondary" id="btn-banner-fav" style="padding: 1.2rem 2.2rem;" onclick="toggleFavoriteState('${font.id}', this)">
              <i data-lucide="heart" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. RELATED FONTS CAROUSEL -->
    <section class="related-section" id="related-fonts">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4rem;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Related Fonts</h2>
            <p style="color: var(--text-secondary); margin: 0; font-size: 1.1rem; max-width: 600px;">Explore similar typefaces in the FontVault catalog.</p>
          </div>
          <div style="display: flex; gap: 0.5rem; z-index: 2;">
            <button class="cta-icon-btn" id="btn-carousel-left" title="Scroll left"><i data-lucide="chevron-left" style="width: 18px; height: 18px;"></i></button>
            <button class="cta-icon-btn" id="btn-carousel-right" title="Scroll right"><i data-lucide="chevron-right" style="width: 18px; height: 18px;"></i></button>
          </div>
        </div>

        <div class="carousel-wrapper">
          <div class="carousel-track" id="carousel-track-container">
            <!-- Dynamic related cards loaded in init -->
          </div>
        </div>
      </div>
    </section>
  `;
}

// -------------------------------------------------
// PREMIUM ACTIONS & LISTENERS SETUP
// -------------------------------------------------
function initPremiumInteractions(font) {
  const fam = font.cssFamily || `'${font.name}'`;
  const weights = getFontWeights(font);
  const defaultWeight = weights.includes(400) ? 400 : weights[0];
  
  // Re-generate Lucide Icons in injected DOM
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- 1. INITIALIZE LENIS SMOOTH SCROLL ---
  let lenis;
  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --- 2. GSAP & SCROLLTRIGGER SCRUB ANIMATIONS ---
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    // Immediate fade-in for hero elements on load
    window.gsap.to("#hero .cascade-item", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Hero title scale down and fade out on scroll
    window.gsap.to(".hero-font-title", {
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom center",
        scrub: true,
      },
      scale: 0.85,
      opacity: 0.15,
      ease: "power2.out",
    });

    // Massive Specimen card slide up on scroll
    window.gsap.to(".hero-specimen-card", {
      scrollTrigger: {
        trigger: "#hero",
        start: "top center",
        end: "bottom top",
        scrub: true,
      },
      y: -60,
      ease: "power2.out",
    });

    // Sections fade-in cascade staggered scrub animations (scrubs both directions!)
    const cascadeSections = ["#playground", "#styles", "#glyphs", "#showcase", "#pairings", "#specs", "#download-banner", "#related-fonts"];
    cascadeSections.forEach(sectionId => {
      const section = document.querySelector(sectionId);
      if (!section) return;

      const elements = section.querySelectorAll(".cascade-item");
      if (elements.length === 0) return;

      window.gsap.fromTo(elements, 
        {
          opacity: 0,
          y: 60,
          filter: "blur(8px)",
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play reverse play reverse",
            scrub: 1
          }
        }
      );
    });
  }

  // --- 3. DYNAMIC SCROLL ACTIONS & STICKY Floating Action BAR ---
  const floatingBar = document.getElementById("sticky-floating-actions-bar");
  const floatingBarName = document.getElementById("floating-bar-font-name");
  if (floatingBarName) floatingBarName.textContent = font.name;

  const backToTopBtn = document.getElementById("back-to-top-btn");
  const progressEdge = document.getElementById("scroll-progress-edge");

  window.addEventListener("scroll", () => {
    const sTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Scroll progress bar
    if (progressEdge && docHeight > 0) {
      const pct = (sTop / docHeight) * 100;
      progressEdge.style.width = `${pct}%`;
    }

    // Floating Sticky Action Bar visibility
    if (floatingBar) {
      if (sTop > 600) {
        floatingBar.classList.add("active");
      } else {
        floatingBar.classList.remove("active");
      }
    }

    // Back to top morph visibility
    if (backToTopBtn) {
      if (sTop > 800) {
        backToTopBtn.classList.add("active");
      } else {
        backToTopBtn.classList.remove("active");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // --- 4. PLAYGROUND INTERACTIVE CONTROLS BINDING ---
  const pEditableText = document.getElementById("p-editable-text");
  const sliderSize = document.getElementById("slider-size");
  const sliderWeight = document.getElementById("slider-weight");
  const sliderTracking = document.getElementById("slider-tracking");
  const sliderLeading = document.getElementById("slider-leading");
  
  const valSize = document.getElementById("val-size");
  const valWeight = document.getElementById("val-weight");
  const valTracking = document.getElementById("val-tracking");
  const valLeading = document.getElementById("val-leading");

  // Sync Slider values in real time with transitions
  function updatePlaygroundValues() {
    if (!pEditableText) return;
    const size = sliderSize.value;
    const weight = sliderWeight.value;
    const tracking = sliderTracking.value;
    const leading = sliderLeading.value;

    valSize.textContent = `${size}px`;
    valWeight.textContent = weight;
    valTracking.textContent = `${Number(tracking).toFixed(2)}em`;
    valLeading.textContent = Number(leading).toFixed(1);

    // CSS variables / styles updates
    pEditableText.style.fontSize = `${size}px`;
    pEditableText.style.fontWeight = weight;
    pEditableText.style.letterSpacing = `${tracking}em`;
    pEditableText.style.lineHeight = leading;

    // Optional Variable Font parameters
    const sliderWidth = document.getElementById("slider-var-width");
    const sliderOpsz = document.getElementById("slider-var-opsz");
    const valWidth = document.getElementById("val-var-width");
    const valOpsz = document.getElementById("val-var-opsz");

    let varSettings = "";
    if (sliderWidth && valWidth) {
      valWidth.textContent = sliderWidth.value;
      varSettings += `"wdth" ${sliderWidth.value}`;
    }
    if (sliderOpsz && valOpsz) {
      valOpsz.textContent = sliderOpsz.value;
      varSettings += varSettings ? `, "opsz" ${sliderOpsz.value}` : `"opsz" ${sliderOpsz.value}`;
    }
    if (varSettings) {
      pEditableText.style.fontVariationSettings = varSettings;
    }
  }

  [sliderSize, sliderWeight, sliderTracking, sliderLeading].forEach(slider => {
    if (slider) slider.addEventListener("input", updatePlaygroundValues);
  });

  // Dynamic variable slider bindings
  const sliderWidth = document.getElementById("slider-var-width");
  const sliderOpsz = document.getElementById("slider-var-opsz");
  if (sliderWidth) sliderWidth.addEventListener("input", updatePlaygroundValues);
  if (sliderOpsz) sliderOpsz.addEventListener("input", updatePlaygroundValues);

  // Alignment Segmented Button binding
  const alignBtns = document.querySelectorAll("#seg-alignment .segment-btn");
  alignBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      alignBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (pEditableText) pEditableText.style.textAlign = btn.dataset.align;
    });
  });

  // Transform Segmented Button binding
  const transBtns = document.querySelectorAll("#seg-transform .segment-btn");
  transBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      transBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (pEditableText) pEditableText.style.textTransform = btn.dataset.transform;
    });
  });

  // Canvas Theme Circle selection binding
  const themeCircles = document.querySelectorAll("#color-theme-picker .color-circle");
  themeCircles.forEach(circle => {
    circle.addEventListener("click", () => {
      themeCircles.forEach(c => c.classList.remove("active"));
      circle.classList.add("active");
      const canvas = document.getElementById("p-canvas");
      if (canvas) {
        canvas.style.backgroundColor = circle.dataset.bg;
        pEditableText.style.color = circle.dataset.text;
        
        const canvasLabel = document.getElementById("p-canvas-label");
        const canvasFont = document.getElementById("p-canvas-font-name");
        if (canvasLabel) canvasLabel.style.color = circle.dataset.text;
        if (canvasFont) canvasFont.style.color = circle.dataset.text;
        if (canvasLabel) canvasLabel.style.opacity = 0.5;
        if (canvasFont) canvasFont.style.opacity = 0.5;
      }
    });
  });

  // Italic switch binding
  const switchItalic = document.getElementById("switch-italic");
  if (switchItalic) {
    switchItalic.addEventListener("change", () => {
      if (pEditableText) {
        pEditableText.style.fontStyle = switchItalic.checked ? "italic" : "normal";
      }
    });
  }

  // Reset Playground
  const resetBtn = document.getElementById("btn-reset-playground");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      sliderSize.value = 64;
      sliderWeight.value = defaultWeight;
      sliderTracking.value = 0;
      sliderLeading.value = 1.2;
      if (sliderWidth) sliderWidth.value = 100;
      if (sliderOpsz) sliderOpsz.value = 14;

      if (switchItalic) switchItalic.checked = false;
      alignBtns.forEach(b => b.classList.remove("active"));
      alignBtns[0].classList.add("active");
      transBtns.forEach(b => b.classList.remove("active"));
      transBtns[0].classList.add("active");
      themeCircles.forEach(c => c.classList.remove("active"));
      themeCircles[0].classList.add("active");

      const canvas = document.getElementById("p-canvas");
      if (canvas) {
        canvas.style.backgroundColor = themeCircles[0].dataset.bg;
        pEditableText.style.color = themeCircles[0].dataset.text;
        pEditableText.style.textAlign = "left";
        pEditableText.style.textTransform = "none";
        pEditableText.style.fontStyle = "normal";
      }

      updatePlaygroundValues();
    });
  }

  // --- 5. STYLES CARDS EVENT LISTENERS ---
  const styleCards = document.querySelectorAll(".style-card");
  styleCards.forEach(card => {
    card.addEventListener("click", () => {
      const w = card.dataset.weight;
      if (sliderWeight) {
        sliderWeight.value = w;
        updatePlaygroundValues();
        document.getElementById("playground").scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // --- 6. GLYPHS EXPLORER GRID & METRICS ---
  let selectedGlyphSet = "uppercase";
  const glyphTabs = document.querySelectorAll("#glyph-tabs-container .glyph-tab");
  
  function getGlyphCharsForSet(setName) {
    const uppercaseSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const lowercaseSet = "abcdefghijklmnopqrstuvwxyz".split('');
    const numbersSet = "0123456789".split('');
    const symbolsSet = "@#$-+=*/%^&_[]{}<>|~".split('');
    const punctuationSet = ".,;:!?\"'()".split('');
    const latinExtSet = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ".split('');
    
    switch(setName) {
      case "uppercase": return uppercaseSet;
      case "lowercase": return lowercaseSet;
      case "numbers": return numbersSet;
      case "symbols": return symbolsSet;
      case "punctuation": return punctuationSet;
      case "latin-ext": return latinExtSet;
      default: return uppercaseSet;
    }
  }

  function renderSelectedGlyphGrid() {
    const cellsContainer = document.getElementById("glyphs-cells-container");
    if (!cellsContainer) return;

    const chars = getGlyphCharsForSet(selectedGlyphSet);
    
    cellsContainer.innerHTML = chars.map((char, index) => `
      <div class="glyph-grid-cell" data-char="${char}">
        ${char}
      </div>
    `).join('');

    // Bind click events on glyph grid cells
    const cells = cellsContainer.querySelectorAll(".glyph-grid-cell");
    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        cells.forEach(c => c.classList.remove("active"));
        cell.classList.add("active");
        loadGlyphMeta(cell.dataset.char);
      });
    });

    // Make first element active by default
    if (cells.length > 0) {
      cells[0].classList.add("active");
      loadGlyphMeta(cells[0].dataset.char);
    }
  }

  function loadGlyphMeta(char) {
    const largeChar = document.getElementById("large-glyph-char");
    const metaName = document.getElementById("glyph-char-name");
    const metaUnicode = document.getElementById("glyph-char-unicode");
    
    if (!largeChar) return;

    largeChar.classList.add("scale-pop");
    
    setTimeout(() => {
      largeChar.textContent = char;
      const metadata = getGlyphMetadata(char);
      if (metaName) metaName.textContent = metadata.name;
      if (metaUnicode) metaUnicode.textContent = metadata.unicode;
      
      largeChar.classList.remove("scale-pop");
    }, 150);
  }

  // Tab switching click events
  glyphTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      glyphTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      selectedGlyphSet = tab.dataset.set;
      renderSelectedGlyphGrid();
    });
  });

  // Custom text character browser search bar
  const glyphCustomSearch = document.getElementById("glyph-custom-text-search");
  if (glyphCustomSearch) {
    glyphCustomSearch.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      const cellsContainer = document.getElementById("glyphs-cells-container");
      if (!cellsContainer) return;

      if (!val) {
        renderSelectedGlyphGrid();
        return;
      }

      const uniqueChars = Array.from(new Set(val.split('')));
      cellsContainer.innerHTML = uniqueChars.map(char => `
        <div class="glyph-grid-cell" data-char="${char}">
          ${char}
        </div>
      `).join('');

      const cells = cellsContainer.querySelectorAll(".glyph-grid-cell");
      cells.forEach(cell => {
        cell.addEventListener("click", () => {
          cells.forEach(c => c.classList.remove("active"));
          cell.classList.add("active");
          loadGlyphMeta(cell.dataset.char);
        });
      });

      if (cells.length > 0) {
        cells[0].classList.add("active");
        loadGlyphMeta(cells[0].dataset.char);
      }
    });
  }

  // Copy Glyph Unicode
  const copyGlyphUnicodeBtn = document.getElementById("btn-copy-glyph-unicode");
  if (copyGlyphUnicodeBtn) {
    copyGlyphUnicodeBtn.addEventListener("click", () => {
      const unicode = document.getElementById("glyph-char-unicode").textContent;
      navigator.clipboard.writeText(unicode).then(() => {
        alert(`Unicode code point ${unicode} copied to clipboard!`);
      });
    });
  }

  // Initialize Glyph section
  renderSelectedGlyphGrid();
  updateGlyphGuidelines(font.name);

  // --- 7. RELATED FONTS CAROUSEL SLIDE BINDINGS ---
  const carouselTrack = document.getElementById("carousel-track-container");
  const btnCarouselLeft = document.getElementById("btn-carousel-left");
  const btnCarouselRight = document.getElementById("btn-carousel-right");

  if (carouselTrack) {
    const relatedFonts = fontsData.filter(f => f.id !== font.id).slice(0, 6);
    
    carouselTrack.innerHTML = relatedFonts.map(rf => `
      <div class="carousel-card" onclick="window.location.href='font.html?id=${rf.id}'">
        <div>
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">${rf.style}</span>
          <h4 style="font-family: ${rf.cssFamily || `'${rf.name}'`}, serif; font-size: 1.6rem; font-weight: 500; margin: 0.5rem 0 0;">${rf.name}</h4>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 2rem;">
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary);">${rf.designer || 'Independent'}</span>
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-color); font-weight: 600;">View →</span>
        </div>
      </div>
    `).join('');

    let slideOffset = 0;
    const maxOffset = Math.max(0, (relatedFonts.length * 352) - carouselTrack.parentElement.clientWidth);

    if (btnCarouselRight) {
      btnCarouselRight.addEventListener("click", () => {
        slideOffset = Math.min(slideOffset + 352, maxOffset);
        window.gsap.to(carouselTrack, { x: -slideOffset, duration: 0.8, ease: "power3.out" });
      });
    }

    if (btnCarouselLeft) {
      btnCarouselLeft.addEventListener("click", () => {
        slideOffset = Math.max(slideOffset - 352, 0);
        window.gsap.to(carouselTrack, { x: -slideOffset, duration: 0.8, ease: "power3.out" });
      });
    }
  }

  // --- 8. DOWNLOAD PROXY BUTTON BINDINGS ---
  const downloadTriggers = [
    document.getElementById("btn-hero-download"),
    document.getElementById("floating-btn-download"),
    document.getElementById("btn-banner-download")
  ];

  downloadTriggers.forEach(btn => {
    if (btn) {
      btn.addEventListener("click", async () => {
        const url = font.downloadUrl;
        if (!url || url === '#') {
          alert("This font is external or does not have a direct file download path.");
          return;
        }

        const isGoogleFont = url.includes('fonts.google.com');
        const ext = isGoogleFont ? 'zip'
                  : (font.format === 'truetype' ? 'ttf'
                  : font.format === 'opentype' ? 'otf'
                  : font.format || 'woff2');

        if (window.FontVaultAnalytics) {
          window.FontVaultAnalytics.trackDownload(font.name, ext);
        }
        const safeName = (font.name || 'font').replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');
        const safeFilename = `${safeName}${isGoogleFont ? '_fonts' : ''}.${ext}`;

        btn.textContent = '↓ Fetching...';
        btn.disabled = true;

        try {
          let proxyUrl;
          if (isGoogleFont) {
            const familyMatch = url.match(/specimen\/([^?#]+)/);
            const family = familyMatch
              ? decodeURIComponent(familyMatch[1].replace(/\+/g, ' '))
              : font.name;
            proxyUrl = `/api/download?family=${encodeURIComponent(family)}&filename=${encodeURIComponent(safeFilename)}`;
          } else {
            proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(safeFilename)}`;
          }

          const resp = await fetch(proxyUrl);
          if (!resp.ok) throw new Error(`${resp.status}`);
          const blob = await resp.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = safeFilename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
          btn.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px;"></i> Downloaded`;
          btn.style.backgroundColor = '#22c55e';
          btn.style.color = '#FFF';
        } catch (err) {
          console.warn('[FontVault] Detail page download failed:', err);
          btn.textContent = 'Failed';
          btn.disabled = false;
        }
      });
    }
  });

  // --- 9. KEYBOARD SHORTCUTS ---
  document.addEventListener("keydown", (e) => {
    const isEditing = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) || document.activeElement.contentEditable === "true";
    if (isEditing) return;

    const key = e.key.toLowerCase();
    
    // Focus search input on "/"
    if (e.key === "/") {
      e.preventDefault();
      const sInput = document.getElementById("search-input");
      if (sInput) sInput.focus();
    }
    
    // Favorite font on "f"
    if (key === "f" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const favBtn = document.getElementById("btn-hero-favorite");
      if (favBtn) toggleFavoriteState(font.id, favBtn);
    }

    // Download font on "d"
    if (key === "d" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const dlBtn = document.getElementById("btn-hero-download");
      if (dlBtn) dlBtn.click();
    }

    // Copy CSS rules on "c"
    if (key === "c" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const cssBtn = document.getElementById("btn-hero-copy-css");
      if (cssBtn) cssBtn.click();
    }
  });

  // Hero custom specimen live editing updates playground specimen in real-time
  const heroSpecimenInput = document.getElementById("hero-editable-specimen");
  if (heroSpecimenInput) {
    heroSpecimenInput.addEventListener("input", () => {
      if (pEditableText) pEditableText.textContent = heroSpecimenInput.textContent;
    });
  }

  // --- 10. COMPATIBILITY COMPARE MODAL ---
  const compareOverlay = document.getElementById("compare-modal-overlay");
  const compareCloseBtn = document.getElementById("compare-modal-close-btn");
  const compareTargetSelect = document.getElementById("compare-target-select");
  
  const activeSpecimen = document.getElementById("compare-active-specimen");
  const targetSpecimen = document.getElementById("compare-target-specimen");
  const activeSpecimenName = document.getElementById("compare-active-font-name");

  // Bind compare open buttons (Hero actions + floating bar action)
  const compareTriggers = [
    document.getElementById("floating-btn-compare"),
    document.getElementById("btn-hero-compare") // if exists
  ];

  function openCompareModal() {
    if (!compareOverlay) return;

    if (activeSpecimenName) activeSpecimenName.textContent = font.name;
    if (activeSpecimen) {
      activeSpecimen.textContent = pEditableText ? pEditableText.textContent : "Type here to compare.";
      activeSpecimen.style.fontFamily = fam;
    }

    // Populate Right select options
    if (compareTargetSelect) {
      compareTargetSelect.innerHTML = fontsData.map(f => `
        <option value="${f.id}" ${f.id === font.id ? 'disabled' : ''}>${f.name} (${f.style})</option>
      `).join('');
      
      // Select first alternate option
      const alternateOption = fontsData.find(f => f.id !== font.id);
      if (alternateOption) {
        compareTargetSelect.value = alternateOption.id;
        loadCompareTargetFont(alternateOption.id);
      }
    }

    compareOverlay.classList.add("active");
  }

  compareTriggers.forEach(btn => {
    if (btn) btn.addEventListener("click", openCompareModal);
  });

  if (compareCloseBtn && compareOverlay) {
    compareCloseBtn.addEventListener("click", () => {
      compareOverlay.classList.remove("active");
    });
  }

  if (compareTargetSelect) {
    compareTargetSelect.addEventListener("change", (e) => {
      loadCompareTargetFont(e.target.value);
    });
  }

  function loadCompareTargetFont(id) {
    const targetFont = fontsData.find(f => f.id === id);
    if (!targetFont || !targetSpecimen) return;

    loadExternalFont(targetFont);
    targetSpecimen.style.fontFamily = targetFont.cssFamily || `'${targetFont.name}'`;
    targetSpecimen.textContent = activeSpecimen ? activeSpecimen.textContent : "Type here to compare.";
  }

  // Cross-typing sync inside modal columns
  if (activeSpecimen && targetSpecimen) {
    activeSpecimen.addEventListener("input", () => {
      targetSpecimen.textContent = activeSpecimen.textContent;
    });
    targetSpecimen.addEventListener("input", () => {
      activeSpecimen.textContent = targetSpecimen.textContent;
    });
  }

  // --- 11. GENERAL INTERACTIONS BINDINGS ---
  // Copy CSS Action buttons
  const copyCssButtons = [
    document.getElementById("btn-hero-copy-css"),
    document.getElementById("floating-btn-copy-css")
  ];
  copyCssButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener("click", () => {
        const cssCode = `/* CSS rules for ${font.name} */\n.heading-text {\n  font-family: ${fam}, serif;\n  font-weight: 500;\n}`;
        navigator.clipboard.writeText(cssCode).then(() => {
          alert("CSS rules copied to clipboard successfully!");
        });
      });
    }
  });

  // Favorite floating button binding sync
  const floatingFavBtn = document.getElementById("floating-btn-favorite");
  if (floatingFavBtn) {
    if (window.favoritesSet && window.favoritesSet.has(font.id)) {
      floatingFavBtn.classList.add("active");
    }
    floatingFavBtn.addEventListener("click", () => {
      toggleFavoriteState(font.id, floatingFavBtn);
      
      // Keep hero favorite button state in sync
      const heroFavBtn = document.getElementById("btn-hero-favorite");
      if (heroFavBtn) {
        if (window.favoritesSet.has(font.id)) {
          heroFavBtn.classList.add("active");
        } else {
          heroFavBtn.classList.remove("active");
        }
      }
    });
  }

  // Share Actions buttons
  const shareButtons = [
    document.getElementById("btn-hero-share"),
    document.getElementById("floating-btn-share")
  ];
  shareButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert("Link to specimen copied to clipboard!");
        });
      });
    }
  });
}

// Favorite state toggler
window.toggleFavoriteState = function(fontId, btn) {
  if (typeof toggleFavorite === "function") {
    toggleFavorite(fontId, btn);
  }
};

// CSS Rules copy helper for pairings
window.copyCSSPairing = function(headingFont, bodyFont) {
  const cssCode = `/* Typographic Pairing Rules */\nh1, h2, h3 {\n  font-family: "${headingFont}", serif;\n}\np, body {\n  font-family: "${bodyFont}", sans-serif;\n}`;
  navigator.clipboard.writeText(cssCode).then(() => {
    alert(`CSS rules for ${headingFont} + ${bodyFont} copied to clipboard!`);
  });
};

// --- GLYPHS HELPERS ---
function getGlyphMetadata(char) {
  const code = char.charCodeAt(0);
  const hex = code.toString(16).toUpperCase().padStart(4, '0');
  const unicodeStr = `U+${hex}`;
  
  let name = "";
  if (char >= 'A' && char <= 'Z') {
    name = `Capital Letter ${char}`;
  } else if (char >= 'a' && char <= 'z') {
    name = `Lowercase Letter ${char.toUpperCase()}`;
  } else if (char >= '0' && char <= '9') {
    name = `Digit ${char}`;
  } else {
    const symbolNames = {
      '!': 'Exclamation Mark',
      '@': 'At Sign',
      '#': 'Number Sign / Hash',
      '$': 'Dollar Sign',
      '%': 'Percent Sign',
      '^': 'Caret / Circumflex',
      '&': 'Ampersand',
      '*': 'Asterisk',
      '(': 'Left Parenthesis',
      ')': 'Right Parenthesis',
      '-': 'Hyphen-Minus',
      '_': 'Low Line / Underscore',
      '=': 'Equals Sign',
      '+': 'Plus Sign',
      '{': 'Left Curly Bracket',
      '}': 'Right Curly Bracket',
      '[': 'Left Square Bracket',
      ']': 'Right Square Bracket',
      '|': 'Vertical Line / Pipe',
      ':': 'Colon',
      ';': 'Semicolon',
      '"': 'Quotation Mark',
      "'": 'Apostrophe',
      '<': 'Less-Than Sign',
      '>': 'Greater-Than Sign',
      ',': 'Comma',
      '.': 'Full Stop / Period',
      '?': 'Question Mark',
      '/': 'Solidus / Slash',
      '~': 'Tilde',
      '`': 'Grave Accent'
    };
    name = symbolNames[char] || `Character '${char}'`;
  }
  return { name, unicode: unicodeStr };
}

function getFontMetrics(fontName) {
  let hash = 0;
  for (let i = 0; i < fontName.length; i++) {
    hash = fontName.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const baseline = 0;
  const capHeight = 670 + (hash % 81); // 670 to 750
  const xHeight = 440 + ((hash >> 3) % 71); // 440 to 510
  const descender = -190 - ((hash >> 6) % 81); // -190 to -270

  return {
    capHeight,
    xHeight,
    baseline,
    descender
  };
}

function updateGlyphGuidelines(fontName) {
  const metrics = getFontMetrics(fontName);
  
  const capHeightLabel = document.getElementById("label-cap");
  const xHeightLabel = document.getElementById("label-x");
  const descenderLabel = document.getElementById("label-desc");

  if (capHeightLabel) capHeightLabel.textContent = metrics.capHeight;
  if (xHeightLabel) xHeightLabel.textContent = metrics.xHeight;
  if (descenderLabel) descenderLabel.textContent = metrics.descender;

  const capHeightLine = document.getElementById("guide-cap");
  const xHeightLine = document.getElementById("guide-x");
  const baselineLine = document.getElementById("guide-base");
  const descenderLine = document.getElementById("guide-desc");

  const baselineTop = 76; 
  const scale = 0.077;    

  if (capHeightLine) capHeightLine.style.top = `${baselineTop - (metrics.capHeight * scale)}%`;
  if (xHeightLine) xHeightLine.style.top = `${baselineTop - (metrics.xHeight * scale)}%`;
  if (baselineLine) baselineLine.style.top = `${baselineTop}%`;
  if (descenderLine) descenderLine.style.top = `${baselineTop - (metrics.descender * scale)}%`;
}

function getFontWeights(font) {
  if (font.variants && Array.isArray(font.variants)) {
    const weights = new Set();
    font.variants.forEach(v => {
      const match = v.match(/\d+/);
      if (match) {
        weights.add(parseInt(match[0], 10));
      } else if (v === 'regular' || v === 'italic') {
        weights.add(400);
      }
    });
    if (weights.size > 0) {
      return Array.from(weights).sort((a, b) => a - b);
    }
  }
  if (font.provider === 'google' || font.provider === 'fontshare') {
    if (font.stylesCount === 1) return [400];
    return [300, 400, 500, 700];
  }
  return [400];
}

function getWeightLabel(weight) {
  const labels = {
    100: "Thin",
    200: "Extra Light",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "Semi Bold",
    700: "Bold",
    800: "Extra Bold",
    900: "Black"
  };
  return labels[weight] || "Regular";
}