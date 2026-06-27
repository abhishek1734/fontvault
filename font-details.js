// font-details.js

document.addEventListener("DOMContentLoaded", async () => {
  // Apply dark mode preference immediately to prevent flashing
  const savedDark = localStorage.getItem("fontvault-dark");
  if (savedDark === "0") {
    applyTheme(false);
  } else {
    applyTheme(true);
  }

  setupSharedEventListeners();
  const urlParams = new URLSearchParams(window.location.search);
  const fontId = urlParams.get('id');
  
  if (!fontId) {
    document.getElementById('font-detail-root').innerHTML = `
      <div style="text-align:center; padding:10rem 2rem;">
        <h2>Font not found.</h2>
        <a href="index.html" class="btn btn-primary" style="margin-top:2rem;">Return to Home</a>
      </div>
    `;
    return;
  }

  // Show loading state while fetching API
  const root = document.getElementById('font-detail-root');
  root.innerHTML = `
    <div style="text-align:center; padding:10rem 2rem; color:var(--signal-red);">
      <p style="font-size:var(--ts-xl);font-family:var(--font-mono);animation:pulse 1.5s infinite;">CONNECTING TO GOOGLE FONTS API...</p>
    </div>
  `;

  // Wait for fonts to populate
  await initGoogleFonts('AIzaSyBEmEMaIu15j6c1zxo2OlPnzfHTcfZYasY');

  const font = fontsData.find(f => f.id === fontId);
  if (!font) {
    root.innerHTML = `
      <div style="text-align:center; padding:10rem 2rem;">
        <h2>Font not found in the database.</h2>
        <a href="index.html" class="btn btn-primary" style="margin-top:2rem;">Return to Home</a>
      </div>
    `;
    return;
  }

  // Load the external font
  loadExternalFont(font);

  renderFontDetails(font);
});

function renderFontDetails(font) {
  const root = document.getElementById('font-detail-root');
  const fam = font.cssFamily || `'${font.name}'`;
  
  const weights = getFontWeights(font);
  const defaultWeight = weights.includes(400) ? 400 : weights[0];
  
  // Render structure
  root.innerHTML = `
    <div class="fd-hero" style="padding: 6rem 4rem 4rem; text-align: center; border-bottom: 1px solid var(--border-grey);">
      <p style="font-family: var(--font-mono); color: #888; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em; margin-bottom: 1rem;">
        ${font.provider || 'custom'} / ${font.style || 'Display'}
      </p>
      <div style="position: relative; display: inline-block; max-width: 100%;">
        <h1 class="fd-title" contenteditable="true" spellcheck="false" style="font-family: ${fam}, serif; font-size: clamp(3rem, 10vw, 12rem); line-height: 1; margin: 0; outline: none; cursor: text;">
          ${font.name}
        </h1>
        <div style="position: absolute; top: -1rem; right: -1rem; background: var(--signal-red); color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.7rem; font-family: var(--font-sans); font-weight: 500; transform: rotate(5deg); pointer-events: none; opacity: 0.9; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Edit this!</div>
      </div>
      <p style="margin-top: 2rem; font-size: 1.1rem; color: #666; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
        ${font.description || 'A beautiful custom typeface hosted locally.'}
      </p>
      <style>
        .fd-download-btn {
          padding: 1rem 3rem; 
          font-size: 1.1rem; 
          background: transparent; 
          color: var(--near-black); 
          border: 2px solid var(--near-black); 
          border-radius: 4px;
          cursor: pointer;
          font-family: var(--font-sans);
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .fd-download-btn:hover {
          background: var(--near-black);
          color: #fff;
        }
        [data-theme="dark"] .fd-download-btn {
          color: #fff;
          border-color: #fff;
        }
        [data-theme="dark"] .fd-download-btn:hover {
          background: #fff;
          color: #000;
        }
        .fd-unit-btn {
          background: none;
          border: 1px solid var(--border-grey);
          border-radius: 4px;
          color: #888;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          cursor: pointer;
          text-transform: uppercase;
        }
        .fd-unit-btn:hover {
          color: var(--near-black);
          border-color: var(--near-black);
        }
        [data-theme="dark"] .fd-unit-btn:hover {
          color: #fff;
          border-color: #fff;
        }
      </style>
      <div style="margin-top: 3rem; display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; align-items: center;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <button class="fd-download-btn" id="btn-fd-download">Download Family (${font.stylesCount || 1} styles)</button>
          <button class="fd-download-btn ${window.favoritesSet && window.favoritesSet.has(font.id) ? 'active' : ''}" style="padding: 1rem; font-size: 1.2rem; color: ${window.favoritesSet && window.favoritesSet.has(font.id) ? 'var(--signal-red)' : 'inherit'}; border-color: ${window.favoritesSet && window.favoritesSet.has(font.id) ? 'var(--signal-red)' : 'var(--near-black)'}; display: flex; align-items: center; justify-content: center;" onclick="if(typeof toggleFavorite === 'function') toggleFavorite('${font.id}', this)">
            <svg class="heart-icon" width="18" height="18" viewBox="0 0 24 24" fill="${window.favoritesSet && window.favoritesSet.has(font.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #999;">${font.price || 'Free'} / ${font.fileSize || 'N/A'}</span>
      </div>
    </div>

    <!-- Interactive Specimen + Weights Side by Side (Full Width) -->
    <div class="fd-specimen-section">
      <div class="fd-specimen-inner">
        <!-- Left: Interactive Specimen -->
        <div class="fd-specimen-left">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin: 0;">Interactive Specimen</h3>
            <button class="fd-unit-btn" id="fd-unit-toggle">Switch to REM</button>
          </div>
          <div class="fd-tester" style="border: 1px solid var(--border-grey); border-radius: 8px; overflow: hidden;">
            <div style="padding: 1.5rem 2rem; border-bottom: 1px solid var(--border-grey); background: rgba(0,0,0,0.02); display: flex; flex-wrap: wrap; column-gap: 3.5rem; row-gap: 1.5rem; align-items: flex-end;">
              <div style="display:flex; flex-direction:column; min-width: 140px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                  <label style="font-size:0.75rem; text-transform:uppercase; color:#888; font-family:var(--font-mono);">Size</label>
                  <span id="fd-size-val" style="font-size:0.75rem; color:var(--near-black); font-family:var(--font-mono);">64px</span>
                </div>
                <input type="range" id="fd-size" min="16" max="150" value="64">
              </div>
              <div style="display:flex; flex-direction:column; min-width: 140px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                  <label style="font-size:0.75rem; text-transform:uppercase; color:#888; font-family:var(--font-mono);">Leading</label>
                  <span id="fd-leading-val" style="font-size:0.75rem; color:var(--near-black); font-family:var(--font-mono);">1.2</span>
                </div>
                <input type="range" id="fd-leading" min="0.8" max="2.5" step="0.1" value="1.2">
              </div>
              <div style="display:flex; flex-direction:column; min-width: 140px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                  <label style="font-size:0.75rem; text-transform:uppercase; color:#888; font-family:var(--font-mono);">Tracking</label>
                  <span id="fd-tracking-val" style="font-size:0.75rem; color:var(--near-black); font-family:var(--font-mono);">0em</span>
                </div>
                <input type="range" id="fd-tracking" min="-0.1" max="0.5" step="0.01" value="0">
              </div>
              <div style="display:flex; flex-direction:column; min-width: 140px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                  <label style="font-size:0.75rem; text-transform:uppercase; color:#888; font-family:var(--font-mono);">Weight</label>
                  <span id="fd-weight-val" style="font-size:0.75rem; color:var(--near-black); font-family:var(--font-mono);">${defaultWeight}</span>
                </div>
                <select id="fd-weight" style="padding: 0.25rem 0.5rem; background: var(--pure-white); border: 1px solid var(--border-grey); border-radius: 4px; color: var(--near-black); font-family: var(--font-mono); font-size: 0.85rem; outline: none; cursor: pointer; height: 1.8rem;" ${weights.length <= 1 ? 'disabled' : ''}>
                  ${weights.map(w => `<option value="${w}" ${w === defaultWeight ? 'selected' : ''}>${w} — ${getWeightLabel(w)}</option>`).join('')}
                </select>
              </div>
            </div>
            <div id="fd-specimen" contenteditable="true" spellcheck="false" style="padding: 3rem 2rem; font-family: ${fam}, serif; font-size: 64px; line-height: 1.2; font-weight: ${defaultWeight}; outline: none; min-height: 280px;">
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>
        </div>

        <!-- Right: Available Weights & Styles -->
        <div class="fd-weights-right">
          <h3 style="margin-bottom: 1.5rem; font-family: var(--font-display); font-size: 1.5rem; margin-top: 0;">Available Weights &amp; Styles</h3>
          <div class="fd-weights-grid" id="fd-weights-grid" style="display: flex; flex-direction: column; gap: 1rem;">
            ${weights.slice(0, 6).map((w, i) => `
              <div class="fd-weight-card" style="padding: 1.25rem 1.5rem; border: 1px solid var(--border-grey); border-radius: 8px; display: flex; flex-direction: column; gap: 0.75rem; cursor: pointer; transition: border-color 0.2s ease;" onmouseenter="this.style.borderColor='var(--signal-red)'" onmouseleave="this.style.borderColor='var(--border-grey)'">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-grey); padding-bottom: 0.5rem;">
                  <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 600; color: var(--near-black); text-transform: uppercase;">${getWeightLabel(w)}</span>
                  <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #888;">${w}</span>
                </div>
                <div class="fd-weight-preview" contenteditable="true" spellcheck="false" style="font-family: ${fam}, serif; font-size: 1.5rem; font-weight: ${w}; line-height: 1.2; color: var(--near-black); outline: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  The quick brown fox
                </div>
              </div>
            `).join('')}
            ${weights.length > 6 ? `
              <div id="fd-hidden-weights-wrapper" style="display: flex; flex-direction: column; gap: 1rem; max-height: 0px; opacity: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;">
                ${weights.slice(6).map((w, i) => `
                  <div class="fd-weight-card" style="padding: 1.25rem 1.5rem; border: 1px solid var(--border-grey); border-radius: 8px; display: flex; flex-direction: column; gap: 0.75rem; cursor: pointer; transition: border-color 0.2s ease;" onmouseenter="this.style.borderColor='var(--signal-red)'" onmouseleave="this.style.borderColor='var(--border-grey)'">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-grey); padding-bottom: 0.5rem;">
                      <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 600; color: var(--near-black); text-transform: uppercase;">${getWeightLabel(w)}</span>
                      <span style="font-family: var(--font-mono); font-size: 0.7rem; color: #888;">${w}</span>
                    </div>
                    <div class="fd-weight-preview" contenteditable="true" spellcheck="false" style="font-family: ${fam}, serif; font-size: 1.5rem; font-weight: ${w}; line-height: 1.2; color: var(--near-black); outline: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      The quick brown fox
                    </div>
                  </div>
                `).join('')}
              </div>
              <button class="fd-weights-see-more" id="fd-weights-see-more" onclick="toggleRemainingWeights(this, ${weights.length - 6})">
                See <span class="see-more-count">${weights.length - 6}</span> More Style${weights.length - 6 !== 1 ? 's' : ''}
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>

    <!-- Glyphs Editor/Inspection Section -->
    <div class="fd-glyphs-section">
      <div class="fd-glyphs-layout">
        <!-- Left Panel: Large Glyph Preview -->
        <div class="fd-glyphs-left">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom: 1px solid var(--border-grey); padding-bottom:1rem;">
            <h2 style="font-family:var(--font-display); font-size:2.2rem; font-weight:600; margin:0; color:var(--near-black);">Glyphs</h2>
            <div style="text-align:right; font-family:var(--font-mono); font-size:0.75rem; color:#888;">
              <span id="fd-glyph-meta-name" style="display:block; font-weight:600; text-transform:uppercase; color:var(--near-black);">Capital Letter A</span>
              <span id="fd-glyph-meta-unicode">U+0041</span>
            </div>
          </div>
          <div class="fd-glyph-preview-card">
            <!-- Guidelines Overlay -->
            <div class="fd-guidelines-container">
              <div class="fd-guideline cap-height"><span>Cap Height</span><span>700</span></div>
              <div class="fd-guideline x-height"><span>X-Height</span><span>500</span></div>
              <div class="fd-guideline baseline"><span>Baseline</span><span>0</span></div>
              <div class="fd-guideline descender"><span>Descender</span><span>-200</span></div>
            </div>
            <!-- Large Glyph Character -->
            <div id="fd-large-glyph" class="fd-glyph-display" style="font-family:${fam};">A</div>
          </div>
        </div>

        <!-- Right Panel: Glyph Browser -->
        <div class="fd-glyphs-right">
          <!-- Top Controls -->
          <div class="fd-glyph-controls">
            <select id="fd-glyph-weight-select" class="fd-control-select">
              <option value="normal" selected>Regular</option>
              <option value="bold">Bold</option>
              <option value="italic">Italic</option>
            </select>
            
            <div class="fd-btn-group">
              <button id="fd-glyph-fill-solid" class="fd-btn-group-btn active" onclick="setGlyphFillMode('solid')">Solid</button>
              <button id="fd-glyph-fill-outline" class="fd-btn-group-btn" onclick="setGlyphFillMode('outline')">Outline</button>
            </div>
            
            <div class="fd-btn-group">
              <button id="fd-glyph-set-basic" class="fd-btn-group-btn active" onclick="setGlyphSet('basic')">Basic Set</button>
              <button id="fd-glyph-set-full" class="fd-btn-group-btn" onclick="setGlyphSet('full')">Full Set</button>
            </div>

            <input type="text" id="fd-glyph-custom-input" class="fd-control-input" placeholder="Type your letters">
          </div>

          <!-- Glyph Grid Content -->
          <div id="fd-glyph-browser-content" style="display:flex; flex-direction:column; gap:2rem;">
            <!-- Rendered sections injected here -->
          </div>
        </div>
      </div>
    </div>

    <!-- Layout Section -->
    <div class="fd-layout-section">
      <div class="fd-layout-header">
        <h2 style="font-family:var(--font-display); font-size:2.2rem; font-weight:600; margin:0; color:var(--near-black);">Layout</h2>
        <div class="fd-layout-controls">
          <button class="fd-layout-preset-btn active" onclick="setLayoutPreset('default', this)">Default Layout</button>
          <button class="fd-layout-preset-btn" onclick="setLayoutPreset('editorial', this)">Editorial</button>
          <button class="fd-layout-preset-btn" onclick="setLayoutPreset('minimal', this)">Minimal</button>
          <button class="fd-layout-btn" onclick="resetLayoutText()">Reset</button>
        </div>
      </div>

      <div id="fd-layout-body">
        <!-- Title Row -->
        <div class="fd-layout-row fd-layout-title-row">
          <div class="fd-layout-row-label">
            <span class="fd-layout-font-tag">${font.name}</span>
            <span class="fd-layout-role-tag">Title</span>
          </div>
          <div
            id="fd-layout-title"
            class="fd-layout-title"
            style="font-family:${fam}, serif;"
            contenteditable="true"
            spellcheck="false"
          >Ask powerful questions</div>
          <div class="fd-layout-row-add">+ Add Style</div>
        </div>

        <!-- Subheading Row -->
        <div class="fd-layout-row fd-layout-sub-row">
          <div class="fd-layout-row-label">
            <span class="fd-layout-font-tag">${font.name}</span>
            <span class="fd-layout-role-tag">Subheading</span>
          </div>
          <div
            id="fd-layout-sub"
            class="fd-layout-sub"
            style="font-family:${fam}, serif;"
            contenteditable="true"
            spellcheck="false"
          >All the world's a stage and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts.</div>
          <div class="fd-layout-row-add">+ Add Style</div>
        </div>

        <!-- Body Row -->
        <div class="fd-layout-row fd-layout-body-row">
          <div class="fd-layout-row-label">
            <span class="fd-layout-font-tag">${font.name}</span>
            <span class="fd-layout-role-tag">Body</span>
          </div>
          <div id="fd-layout-body-text" class="fd-layout-body-text" style="font-family:${fam}, serif;">
            <div contenteditable="true" spellcheck="false">In this fast-paced world, it is important to take a moment and reflect on our journey. We often get caught up in the rat race and forget what is truly important in life. We strive for success, wealth and fame, but these things are fleeting and can never truly fulfil us.</div>
            <div contenteditable="true" spellcheck="false">An opportunity for growth and learning. We must embrace challenges and obstacles as opportunities for growth and transformation. It's easy to get caught up in comparing ourselves to others and measuring our worth by external standards.</div>
            <div contenteditable="true" spellcheck="false">Qualities, strengths, and weaknesses and allow them to guide you on your journey. The world needs more individuals who are true to themselves, who live with purpose and passion, and who inspire others to do the same.</div>
          </div>
          <div class="fd-layout-row-add">+ Add Style</div>
        </div>
      </div>
    </div>

    <!-- Font Details & Pairings (moved below Layout) -->
    <div class="fd-details-section">
      <div class="fd-details-inner">
        <div class="fd-details-col">
          <h3 style="margin-bottom: 1.5rem; font-family: var(--font-display); font-size: 1.5rem;">Font Details</h3>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.4rem; font-family:var(--font-mono);">Designer</span><span style="font-size:1rem; font-weight:500;">${font.designer || 'Independent'}</span></div>
            <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.4rem; font-family:var(--font-mono);">Foundry</span><span style="font-size:1rem; font-weight:500;">${font.foundry || 'Independent'}</span></div>
            <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.4rem; font-family:var(--font-mono);">Year Released</span><span style="font-size:1rem; font-weight:500;">${font.year || 'N/A'}</span></div>
            <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.4rem; font-family:var(--font-mono);">Category</span><span style="font-size:1rem; font-weight:500;">${font.style || 'Display'}</span></div>
            <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.4rem; font-family:var(--font-mono);">License</span><span style="font-size:1rem; font-weight:500;">${font.price || 'Free'}</span></div>
            <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.4rem; font-family:var(--font-mono);">Languages</span><span style="font-size:1rem; font-weight:500;">${font.languages ? font.languages.join(', ') : 'Latin'}</span></div>
          </div>
        </div>
        <div class="fd-pairings-col">
          <h3 style="margin-bottom: 1.5rem; font-family: var(--font-display); font-size: 1.5rem;">Pairs Well With</h3>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${font.pairsWith && font.pairsWith.length > 0 ? font.pairsWith.map(pair => {
              const pairFont = fontsData.find(f => f.id === pair.id);
              if (!pairFont) return '';
              return `<div style="padding: 1rem; border: 1px solid var(--border-grey); border-radius: 6px; display:flex; justify-content:space-between; align-items:center; transition: border-color 0.2s ease;" onmouseenter="this.style.borderColor='var(--signal-red)'" onmouseleave="this.style.borderColor='var(--border-grey)'">
                <div>
                  <span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.25rem;">${pair.role}</span>
                  <span style="font-size:1rem; font-weight:500;">${pairFont.name}</span>
                </div>
                <a href="font.html?id=${pairFont.id}" style="color:var(--signal-red); text-decoration:none; font-size:0.8rem; font-weight:500;">View →</a>
              </div>`;
            }).join('') : '<p style="color:#888; font-size:0.9rem;">No specific pairings suggested.</p>'}
          </div>
        </div>
      </div>
    </div>
  `;

  // Download Button Logic
  const downloadBtn = document.getElementById("btn-fd-download");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      window.open(font.downloadUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Attach tester event listeners
  const sizeSlider = document.getElementById("fd-size");
  const leadingSlider = document.getElementById("fd-leading");
  const trackingSlider = document.getElementById("fd-tracking");
  const specimen = document.getElementById("fd-specimen");
  const sizeVal = document.getElementById("fd-size-val");
  const leadingVal = document.getElementById("fd-leading-val");
  const trackingVal = document.getElementById("fd-tracking-val");
  const unitToggle = document.getElementById("fd-unit-toggle");

  let useRem = false;

  function updateSpecimen() {
    const s = sizeSlider.value;
    const l = leadingSlider.value;
    const t = trackingSlider ? trackingSlider.value : "0";
    
    if (useRem) {
      const remSize = (s / 16).toFixed(2);
      sizeVal.textContent = remSize + "rem";
      specimen.style.fontSize = remSize + "rem";
    } else {
      sizeVal.textContent = s + "px";
      specimen.style.fontSize = s + "px";
    }
    
    leadingVal.textContent = l;
    specimen.style.lineHeight = l;
    
    if (trackingVal) {
      trackingVal.textContent = t + "em";
      specimen.style.letterSpacing = t + "em";
    }
  }

  if (unitToggle) {
    unitToggle.addEventListener("click", () => {
      useRem = !useRem;
      unitToggle.textContent = useRem ? "Switch to PX" : "Switch to REM";
      updateSpecimen();
    });
  }

  if(sizeSlider && specimen) {
    sizeSlider.addEventListener("input", updateSpecimen);
  }

  if(leadingSlider && specimen) {
    leadingSlider.addEventListener("input", updateSpecimen);
  }

  if(trackingSlider && specimen) {
    trackingSlider.addEventListener("input", updateSpecimen);
  }

  const weightSelect = document.getElementById("fd-weight");
  const weightVal = document.getElementById("fd-weight-val");
  if (weightSelect && specimen) {
    weightSelect.addEventListener("change", (e) => {
      const w = e.target.value;
      if (weightVal) weightVal.textContent = w;
      specimen.style.fontWeight = w;
    });
  }

  // Initialize Glyphs Grid
  if (typeof renderGlyphGrid === "function") {
    renderGlyphGrid();
  }

  // Attach Glyphs weight selector event listener
  const glyphWeightSelect = document.getElementById("fd-glyph-weight-select");
  if (glyphWeightSelect) {
    glyphWeightSelect.addEventListener("change", () => {
      if (typeof applyStyleOverridesToGrid === "function") {
        applyStyleOverridesToGrid();
      }
    });
  }

  // Attach Glyphs custom text input listener
  const glyphCustomInput = document.getElementById("fd-glyph-custom-input");
  if (glyphCustomInput) {
    glyphCustomInput.addEventListener("input", () => {
      if (typeof renderGlyphGrid === "function") {
        renderGlyphGrid();
      }
    });
  }
}

// -------------------------------------------------
// HELPERS FOR FONT WEIGHTS
// -------------------------------------------------

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
  
  if (font.provider === 'fontshare') {
    const fontshareWeights = {
      'satoshi': [300, 400, 500, 700, 900],
      'clash-display': [200, 300, 400, 500, 600, 700],
      'cabinet-grotesk-free': [100, 200, 300, 400, 500, 700, 800, 900],
      'general-sans': [200, 300, 400, 500, 600, 700],
      'zodiak': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'switzer': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'boska': [300, 400, 500, 700, 900],
      'chillax': [200, 300, 400, 500, 600, 700],
      'tanker': [400],
      'ranade': [100, 200, 300, 400, 500, 700]
    };
    if (fontshareWeights[font.id]) {
      return fontshareWeights[font.id];
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

// -------------------------------------------------
// GLYPHS INTERACTIVE VIEW SYSTEM
// -------------------------------------------------
let currentGlyphSet = "basic";
let currentGlyphFill = "solid";

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

window.renderGlyphGrid = function() {
  const container = document.getElementById("fd-glyph-browser-content");
  if (!container) return;

  const customInput = document.getElementById("fd-glyph-custom-input");
  const customVal = customInput ? customInput.value : "";
  
  let html = "";
  
  if (customVal) {
    // Unique characters from custom input
    const uniqueChars = Array.from(new Set(customVal.split('')));
    html += renderGlyphSection("Custom Letters", uniqueChars);
  } else {
    // Normal categorized layout
    if (currentGlyphSet === "basic") {
      html += renderGlyphSection("Uppercase", "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''));
      html += renderGlyphSection("Lowercase", "abcdefghijklmnopqrstuvwxyz".split(''));
      html += renderGlyphSection("Numerals", "0123456789".split(''));
    } else {
      html += renderGlyphSection("Uppercase", "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''));
      html += renderGlyphSection("Lowercase", "abcdefghijklmnopqrstuvwxyz".split(''));
      html += renderGlyphSection("Numerals", "0123456789".split(''));
      html += renderGlyphSection("Symbols & Punctuation", "!@#$%^&*()_+-=[]{}|;':\",./<>?~`".split(''));
    }
  }

  container.innerHTML = html;

  // Re-apply style and weight overrides to cells
  applyStyleOverridesToGrid();
};

function renderGlyphSection(title, chars) {
  if (chars.length === 0) return "";
  const currentLargeChar = document.getElementById("fd-large-glyph")?.textContent || "A";

  const cellsHTML = chars.map(char => {
    const isActive = char === currentLargeChar;
    const outlineStyle = currentGlyphFill === "outline" ? "-webkit-text-stroke:1px currentColor; color:transparent !important;" : "";
    return `<div class="fd-glyph-cell ${isActive ? 'active' : ''}" style="${outlineStyle}" onclick="selectGlyph('${char}', this)">${char}</div>`;
  }).join('');

  return `
    <div class="fd-glyph-section">
      <div class="fd-glyph-section-header">
        <span>${title}</span>
        <span style="opacity: 0.5;">${chars.length} glyphs</span>
      </div>
      <div class="fd-glyph-grid">
        ${cellsHTML}
      </div>
    </div>
  `;
}

window.selectGlyph = function(char, cellElement) {
  const largeGlyph = document.getElementById("fd-large-glyph");
  const nameEl = document.getElementById("fd-glyph-meta-name");
  const unicodeEl = document.getElementById("fd-glyph-meta-unicode");

  if (!largeGlyph) return;

  // Scale pop transition animation
  largeGlyph.classList.add("scale-pop");
  
  setTimeout(() => {
    largeGlyph.textContent = char;
    
    // Update metadata
    const meta = getGlyphMetadata(char);
    if (nameEl) nameEl.textContent = meta.name;
    if (unicodeEl) unicodeEl.textContent = meta.unicode;
    
    largeGlyph.classList.remove("scale-pop");
  }, 150);

  // Update active cell class
  const grid = cellElement.closest("#fd-glyph-browser-content");
  if (grid) {
    grid.querySelectorAll(".fd-glyph-cell").forEach(cell => {
      cell.classList.remove("active");
    });
  }
  cellElement.classList.add("active");
};

window.setGlyphFillMode = function(mode) {
  currentGlyphFill = mode;
  
  const solidBtn = document.getElementById("fd-glyph-fill-solid");
  const outlineBtn = document.getElementById("fd-glyph-fill-outline");
  if (solidBtn && outlineBtn) {
    if (mode === "solid") {
      solidBtn.classList.add("active");
      outlineBtn.classList.remove("active");
    } else {
      solidBtn.classList.remove("active");
      outlineBtn.classList.add("active");
    }
  }

  const largeGlyph = document.getElementById("fd-large-glyph");
  if (largeGlyph) {
    if (mode === "outline") {
      largeGlyph.style.webkitTextStroke = "2px var(--near-black)";
      largeGlyph.style.color = "transparent";
    } else {
      largeGlyph.style.webkitTextStroke = "none";
      largeGlyph.style.color = "var(--near-black)";
    }
  }

  renderGlyphGrid();
};

window.setGlyphSet = function(set) {
  currentGlyphSet = set;
  
  const basicBtn = document.getElementById("fd-glyph-set-basic");
  const fullBtn = document.getElementById("fd-glyph-set-full");
  if (basicBtn && fullBtn) {
    if (set === "basic") {
      basicBtn.classList.add("active");
      fullBtn.classList.remove("active");
    } else {
      basicBtn.classList.remove("active");
      fullBtn.classList.add("active");
    }
  }

  renderGlyphGrid();
};

window.applyStyleOverridesToGrid = function() {
  const weightSelect = document.getElementById("fd-glyph-weight-select");
  if (!weightSelect) return;
  
  const mode = weightSelect.value;
  let weight = "400";
  let style = "normal";
  
  if (mode === "bold") {
    weight = "700";
  } else if (mode === "italic") {
    style = "italic";
  }

  const largeGlyph = document.getElementById("fd-large-glyph");
  if (largeGlyph) {
    largeGlyph.style.fontWeight = weight;
    largeGlyph.style.fontStyle = style;
  }

  const cells = document.querySelectorAll(".fd-glyph-cell");
  cells.forEach(cell => {
    cell.style.fontWeight = weight;
    cell.style.fontStyle = style;
  });
}

// -------------------------------------------------
// LAYOUT SECTION PRESETS
// -------------------------------------------------

const LAYOUT_PRESETS = {
  default: {
    title: "Ask powerful questions",
    sub: "All the world's a stage and all the men and women merely players. They have their exits and their entrances; And one man in his time plays many parts.",
    body: [
      "In this fast-paced world, it is important to take a moment and reflect on our journey. We often get caught up in the rat race and forget what is truly important in life. We strive for success, wealth and fame, but these things are fleeting and can never truly fulfil us.",
      "An opportunity for growth and learning. We must embrace challenges and obstacles as opportunities for growth and transformation. It's easy to get caught up in comparing ourselves to others and measuring our worth by external standards.",
      "Qualities, strengths, and weaknesses and allow them to guide you on your journey. The world needs more individuals who are true to themselves, who live with purpose and passion, and who inspire others to do the same."
    ]
  },
  editorial: {
    title: "The art of seeing beauty in everything",
    sub: "Design is not just what it looks like and feels like. Design is how it works. True elegance is not about complexity, but clarity.",
    body: [
      "Typography is the voice of design. Every letterform carries history, intention, and emotion. A well-set headline can stop a reader mid-scroll, pull them in, and hold them there for a moment longer than expected.",
      "The best typefaces disappear into the work. When type is perfect, you stop noticing the letters and start feeling what they say. That invisible quality is what every typographer strives for.",
      "Whitespace, rhythm, hierarchy — these are the instruments of a typographer's orchestra. And when they come together in perfect balance, even the simplest word becomes unforgettable."
    ]
  },
  minimal: {
    title: "Less, but better",
    sub: "Good design is as little design as possible. The aim is to do justice to the natural qualities of the form.",
    body: [
      "Simplicity is not the absence of clutter. It is the presence of purpose. Every element must earn its place.",
      "Restraint takes more discipline than abundance. Choosing what to leave out defines a design as much as what is left in.",
      "The best interface is the one that gets out of the way and lets the content breathe. Clarity always wins."
    ]
  }
};

window.setLayoutPreset = function(preset, btn) {
  const data = LAYOUT_PRESETS[preset];
  if (!data) return;

  const titleEl = document.getElementById("fd-layout-title");
  const subEl = document.getElementById("fd-layout-sub");
  const bodyEl = document.getElementById("fd-layout-body-text");

  if (titleEl) titleEl.textContent = data.title;
  if (subEl) subEl.textContent = data.sub;
  if (bodyEl) {
    bodyEl.innerHTML = data.body.map(p =>
      `<div contenteditable="true" spellcheck="false">${p}</div>`
    ).join('');
  }

  // Update active button state
  document.querySelectorAll(".fd-layout-preset-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
};

window.resetLayoutText = function() {
  setLayoutPreset("default", document.querySelector(".fd-layout-preset-btn"));
};

// -------------------------------------------------
// WEIGHTS SHOW / HIDE TOGGLE
// -------------------------------------------------
window.toggleRemainingWeights = function(btn, remaining) {
  const wrapper = document.getElementById("fd-hidden-weights-wrapper");
  if (!wrapper) return;

  const isCollapsed = wrapper.style.maxHeight === "0px" || wrapper.style.maxHeight === "";

  if (isCollapsed) {
    // Expand
    wrapper.style.maxHeight = wrapper.scrollHeight + "px";
    wrapper.style.opacity = "1";
    
    // Update button to collapse mode
    btn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="opacity:0.7; transform: rotate(180deg); margin-right: 0.25rem;">
        <path d="M19 9l-7 7-7-7"/>
      </svg>
      Show Less
    `;
  } else {
    // Collapse
    wrapper.style.maxHeight = "0px";
    wrapper.style.opacity = "0";

    // Restore See More button text
    btn.innerHTML = `See <span class="see-more-count">${remaining}</span> More Style${remaining !== 1 ? 's' : ''}`;
    
    // Smooth scroll the button back into view
    btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
};

