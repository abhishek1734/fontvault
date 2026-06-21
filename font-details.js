// font-details.js

document.addEventListener("DOMContentLoaded", async () => {
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

  // Apply dark mode preference if stored
  const savedDark = localStorage.getItem("fontvault-dark");
  if (savedDark === "1") applyTheme(true);

  renderFontDetails(font);
});

function renderFontDetails(font) {
  const root = document.getElementById('font-detail-root');
  const fam = font.cssFamily || `'${font.name}'`;
  
  // Render structure
  root.innerHTML = `
    <div class="fd-hero" style="padding: 6rem 2rem 4rem; text-align: center; border-bottom: 1px solid var(--border-grey);">
      <p style="font-family: var(--font-mono); color: #888; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em; margin-bottom: 1rem;">
        ${font.provider} / ${font.style}
      </p>
      <div style="position: relative; display: inline-block; max-width: 100%;">
        <h1 class="fd-title" contenteditable="true" spellcheck="false" style="font-family: ${fam}, serif; font-size: clamp(3rem, 10vw, 12rem); line-height: 1; margin: 0; outline: none; cursor: text;">
          ${font.name}
        </h1>
        <div style="position: absolute; top: -1rem; right: -1rem; background: var(--signal-red); color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.7rem; font-family: var(--font-sans); font-weight: 500; transform: rotate(5deg); pointer-events: none; opacity: 0.9; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Edit this!</div>
      </div>
      <p style="margin-top: 2rem; font-size: 1.1rem; color: #666; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
        ${font.description}
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
        <button class="fd-download-btn" id="btn-fd-download">Download Family (${font.stylesCount} styles)</button>
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #999;">${font.price} / ${font.fileSize}</span>
      </div>
    </div>

    <div class="fd-content" style="max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 3fr 1fr; gap: 4rem;">
      <div class="fd-main">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin: 0;">Interactive Specimen</h3>
          <button class="fd-unit-btn" id="fd-unit-toggle">Switch to REM</button>
        </div>
        <div class="fd-tester" style="border: 1px solid var(--border-grey); border-radius: 8px; overflow: hidden; margin-bottom: 3rem;">
          <div style="padding: 1rem; border-bottom: 1px solid var(--border-grey); background: rgba(0,0,0,0.02); display: flex; flex-wrap: wrap; gap: 2rem;">
            <div style="display:flex; flex-direction:column; width: 100%; max-width: 200px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <label style="font-size:0.75rem; text-transform:uppercase; color:#888; font-family:var(--font-mono);">Size</label>
                <span id="fd-size-val" style="font-size:0.75rem; color:var(--near-black); font-family:var(--font-mono);">64px</span>
              </div>
              <input type="range" id="fd-size" min="16" max="150" value="64">
            </div>
            <div style="display:flex; flex-direction:column; width: 100%; max-width: 200px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <label style="font-size:0.75rem; text-transform:uppercase; color:#888; font-family:var(--font-mono);">Leading</label>
                <span id="fd-leading-val" style="font-size:0.75rem; color:var(--near-black); font-family:var(--font-mono);">1.2</span>
              </div>
              <input type="range" id="fd-leading" min="0.8" max="2.5" step="0.1" value="1.2">
            </div>
            <div style="display:flex; flex-direction:column; width: 100%; max-width: 200px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <label style="font-size:0.75rem; text-transform:uppercase; color:#888; font-family:var(--font-mono);">Tracking</label>
                <span id="fd-tracking-val" style="font-size:0.75rem; color:var(--near-black); font-family:var(--font-mono);">0em</span>
              </div>
              <input type="range" id="fd-tracking" min="-0.1" max="0.5" step="0.01" value="0">
            </div>
          </div>
          <div id="fd-specimen" contenteditable="true" spellcheck="false" style="padding: 3rem 2rem; font-family: ${fam}, serif; font-size: 64px; line-height: 1.2; outline: none;">
            The quick brown fox jumps over the lazy dog. A journey of a thousand miles begins with a single step.
          </div>
        </div>

        <h3 style="margin-bottom: 1.5rem; font-family: var(--font-display); font-size: 1.5rem;">Glyphs</h3>
        <div class="fd-glyphs" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 1rem; font-family: ${fam}, serif; font-size: 2rem; text-align: center; color: var(--near-black);">
          ${"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&@$#%!?".split('').map(char => 
            `<div style="padding: 1rem 0; border: 1px solid var(--border-grey); border-radius: 6px;">${char}</div>`
          ).join('')}
        </div>
      </div>
      
      <aside class="fd-sidebar">
        <h3 style="margin-bottom: 1.5rem; font-family: var(--font-display); font-size: 1.2rem;">Details</h3>
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.25rem;">Designer</span><span style="font-size:1rem; font-weight:500;">${font.designer}</span></div>
          <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.25rem;">Foundry</span><span style="font-size:1rem; font-weight:500;">${font.foundry}</span></div>
          <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.25rem;">Year Released</span><span style="font-size:1rem; font-weight:500;">${font.year}</span></div>
          <div><span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.25rem;">Languages</span><span style="font-size:1rem; font-weight:500;">${font.languages.join(', ')}</span></div>
        </div>

        <h3 style="margin-top: 3rem; margin-bottom: 1.5rem; font-family: var(--font-display); font-size: 1.2rem;">Pairs Well With</h3>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${font.pairsWith && font.pairsWith.length > 0 ? font.pairsWith.map(pair => {
            const pairFont = fontsData.find(f => f.id === pair.id);
            if (!pairFont) return '';
            return `<div style="padding: 1rem; border: 1px solid var(--border-grey); border-radius: 6px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="display:block; font-size:0.75rem; color:#888; text-transform:uppercase; margin-bottom:0.25rem;">${pair.role}</span>
                <span style="font-size:1rem; font-weight:500;">${pairFont.name}</span>
              </div>
              <a href="font.html?id=${pairFont.id}" style="color:var(--signal-red); text-decoration:none; font-size:0.8rem; font-weight:500;">View</a>
            </div>`;
          }).join('') : '<p style="color:#888; font-size:0.9rem;">No specific pairings suggested.</p>'}
        </div>
      </aside>
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
}
