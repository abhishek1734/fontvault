// font-details.js

document.addEventListener("DOMContentLoaded", () => {
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

  const font = fontsData.find(f => f.id === fontId);
  if (!font) {
    document.getElementById('font-detail-root').innerHTML = `
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
      <h1 class="fd-title" contenteditable="true" spellcheck="false" style="font-family: ${fam}, serif; font-size: clamp(4rem, 10vw, 12rem); line-height: 1; margin: 0; outline: none; cursor: text;">
        ${font.name}
      </h1>
      <p style="margin-top: 2rem; font-size: 1.1rem; color: #666; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
        ${font.description}
      </p>
      <div style="margin-top: 3rem; display: flex; justify-content: center; gap: 1rem; align-items: center;">
        <button class="btn btn-primary" style="padding: 1rem 3rem; font-size: 1.1rem;">Download Family (${font.stylesCount} styles)</button>
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #999;">${font.price} / ${font.fileSize}</span>
      </div>
    </div>

    <div class="fd-content" style="max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; display: grid; grid-template-columns: 3fr 1fr; gap: 4rem;">
      <div class="fd-main">
        <h3 style="margin-bottom: 1.5rem; font-family: var(--font-display); font-size: 1.5rem;">Interactive Specimen</h3>
        <div class="fd-tester" style="border: 1px solid var(--border-grey); border-radius: 8px; overflow: hidden; margin-bottom: 3rem;">
          <div style="padding: 1rem; border-bottom: 1px solid var(--border-grey); background: rgba(0,0,0,0.02); display: flex; gap: 2rem;">
            <div style="display:flex; flex-direction:column; width: 100%; max-width: 200px;">
              <label style="font-size:0.75rem; text-transform:uppercase; color:#888; margin-bottom:0.5rem; font-family:var(--font-mono);">Size</label>
              <input type="range" id="fd-size" min="16" max="150" value="64">
            </div>
            <div style="display:flex; flex-direction:column; width: 100%; max-width: 200px;">
              <label style="font-size:0.75rem; text-transform:uppercase; color:#888; margin-bottom:0.5rem; font-family:var(--font-mono);">Leading</label>
              <input type="range" id="fd-leading" min="0.8" max="2.5" step="0.1" value="1.2">
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

  // Attach tester event listeners
  const sizeSlider = document.getElementById("fd-size");
  const leadingSlider = document.getElementById("fd-leading");
  const specimen = document.getElementById("fd-specimen");

  if(sizeSlider && specimen) {
    sizeSlider.addEventListener("input", e => {
      specimen.style.fontSize = `${e.target.value}px`;
    });
  }

  if(leadingSlider && specimen) {
    leadingSlider.addEventListener("input", e => {
      specimen.style.lineHeight = e.target.value;
    });
  }
}
