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

    // Load custom admin-uploaded fonts if available
    try {
      await Promise.race([
        loadCustomFontsFromSupabase(),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
    } catch (e) {
      // Non-blocking fallback
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
// ============================================================
// EDITORIAL HELPERS (Personality, Suitability, Story, Contextual CTAs)
// ============================================================

function getEditorialDescription(font) {
  const desc = font.description || '';
  const isGeneric = desc.toLowerCase().includes('high-grade professional typeface from the adobe fonts library') ||
                    desc.toLowerCase().includes('highly crafted typographic specimen optimized for digital interfaces') ||
                    !desc.trim();

  if (!isGeneric) {
    return desc;
  }

  const style = (font.style || font.category || 'Serif').toLowerCase();
  const mood = (font.mood || 'Modern').toLowerCase();

  if (style.includes('mono')) {
    return 'A rigorously constructed monospaced typeface balancing mechanical consistency with visual rhythm. Features widened tabular spacing, open counters, and deliberate glyph distinctions tailored for code syntax, data-dense terminals, and technical interfaces.';
  }
  if (style.includes('script')) {
    return 'A fluid calligraphic script capturing authentic hand motion, expressive entry strokes, and organic baseline cadence. Adds a refined human gesture to boutique packaging, invitations, and identity marks.';
  }
  if (style.includes('display') || mood.includes('bold') || mood.includes('loud')) {
    return 'A high-impact display face characterized by authoritative weight, dramatic verticality, and tight kerning dynamics. Commands visual hierarchy across editorial mastheads, posters, and prominent campaign headlines.';
  }
  if (style.includes('serif')) {
    if (mood.includes('elegant') || mood.includes('vintage') || mood.includes('formal')) {
      return 'A distinguished serif typeface defined by graceful stroke modulation, balanced proportion, and bookish composure. Engineered for sustained reading comfort across editorial periodicals, literary publications, and fine branding.';
    }
    return 'A versatile contemporary serif combining classical proportion with crisp digital execution. Offers reliable legibility across long-form reading, sub-headings, and curated web publishing.';
  }

  // Sans-Serif
  if (mood.includes('playful')) {
    return 'A warm, approachable sans-serif crafted with inviting contours and friendly letter proportions. Softens digital interfaces while maintaining clarity across varied device resolutions.';
  }
  return 'A clean, rational sans-serif built with disciplined geometry and clear apertures. Designed to deliver uncompromised legibility and neutral structural clarity across responsive interfaces and complex design systems.';
}

function getTypographicPersonality(font) {
  const style = (font.style || font.category || '').toLowerCase();
  const mood = (font.mood || '').toLowerCase();
  
  if (style.includes('mono')) {
    return {
      voiceKicker: 'Visual Voice',
      voiceTitle: 'Technical Precision & Structural Honesty',
      voiceBody: 'Grounded in fixed-pitch metrics and disciplined tabular cadence. Operates with mechanical candor, eschewing decorative flair in favor of visual consistency and structured information hierarchy.',
      strokeKicker: 'Stroke Dynamics',
      strokeTitle: 'Standardized Rhythm & Tabular Apertures',
      strokeBody: 'Each character occupies an identical horizontal bounding box. Widened glyphs for traditionally narrow letters and compact capitals maintain consistent optical weight across code lines.',
      microKicker: 'Micro-Typography',
      microTitle: 'Differentiated Glyphs & Technical Operators',
      microBody: 'Features pronounced punctuation marks, distinct zeros with internal dots or slashes, and generously scaled mathematical operators to eliminate ambiguity during extended reading sessions.'
    };
  }
  
  if (style.includes('script')) {
    return {
      voiceKicker: 'Visual Voice',
      voiceTitle: 'Calligraphic Gesture & Organic Fluidity',
      voiceBody: 'Celebrates the cadence of the human hand in motion. Flowing terminal curves and dynamic angle variations infuse headlines and packaging with artisanal warmth and personal presence.',
      strokeKicker: 'Stroke Dynamics',
      strokeTitle: 'Dynamic Pressure & Modulated Modulation',
      strokeBody: 'Emulates varying tool pressure, transitioning effortlessly from bold downstrokes into delicate, hairline connecting entry strokes that maintain rhythm across phrases.',
      microKicker: 'Micro-Typography',
      microTitle: 'Contextual Baseline Rhythm & Ligatures',
      microBody: 'Carefully engineered entry swashes and baseline variations prevent visual stiffness, ensuring that successive character connections feel spontaneous rather than mechanical.'
    };
  }

  if (style.includes('display') || mood.includes('loud') || mood.includes('bold')) {
    return {
      voiceKicker: 'Visual Voice',
      voiceTitle: 'Monumental Presence & Architectural Drama',
      voiceBody: 'Formulated to seize optical hierarchy at scale. Confident silhouettes and assertive proportions give words immediate physical authority in mastheads, billboards, and hero treatments.',
      strokeKicker: 'Stroke Dynamics',
      strokeTitle: 'Extreme Contrast & Controlled Tension',
      strokeBody: 'Exaggerated weight distribution creates high-energy optical tension. Solid vertical stems dominate negative space, while compact counter-forms retain punchy legibility at grand display sizes.',
      microKicker: 'Micro-Typography',
      microTitle: 'Sculptural Terminals & Compact Kerning',
      microBody: 'Tightly drawn letter-spacing allows glyphs to lock together seamlessly into rhythmic typographic blocks, generating exceptional headline impact per square centimeter of canvas.'
    };
  }

  if (style.includes('serif')) {
    if (mood.includes('elegant') || mood.includes('vintage') || mood.includes('formal')) {
      return {
        voiceKicker: 'Visual Voice',
        voiceTitle: 'Literary Gravitas & Historical Equilibrium',
        voiceBody: 'Reflects centuries of publishing tradition through intellectual calm and measured poise. Its proportioned letterforms evoke editorial prestige, literary depth, and quiet authority.',
        strokeKicker: 'Stroke Dynamics',
        strokeTitle: 'Refined Modulation & Axial Bias',
        strokeBody: 'Features pronounced stroke modulation with vertical or subtly angled stress. Counter-forms are optically tuned to retain internal illumination, softening digital screen glare.',
        microKicker: 'Micro-Typography',
        microTitle: 'Bracketed Serifs & Proportional Numerals',
        microBody: 'Delicately bracketed serifs anchor the eye along reading baselines, reducing fatigue during long-form immersion. Nuanced punctuation marks add rhythmic polish to continuous prose.'
      };
    } else {
      return {
        voiceKicker: 'Visual Voice',
        voiceTitle: 'Transitional Balance & Modern Structure',
        voiceBody: 'Bridges classical book typography with modern editorial clarity. Strikes a refined balance between functional legibility and distinctive letterform personality.',
        strokeKicker: 'Stroke Dynamics',
        strokeTitle: 'Even Optical Density & Open Apertures',
        strokeBody: 'Moderate stroke contrast provides crisp definition without overwhelming digital displays. Generous counters ensure interior letter shapes remain distinct across resolutions.',
        microKicker: 'Micro-Typography',
        microTitle: 'Balanced X-Height & Robust Terminals',
        microBody: 'A calibrated x-height supports effortless reading at intermediate point sizes, while finely sculpted terminals lend a touch of contemporary craft to every headline.'
      };
    }
  }

  // Default: Sans-Serif
  if (mood.includes('playful')) {
    return {
      voiceKicker: 'Visual Voice',
      voiceTitle: 'Humanist Warmth & Welcoming Rhythm',
      voiceBody: 'Softens digital interactions through rounded contours, generous proportions, and an approachable character voice designed to make applications feel friendly and intuitive.',
      strokeKicker: 'Stroke Dynamics',
      strokeTitle: 'Low Contrast & Fluid Connections',
      strokeBody: 'Near-monolinear strokes keep visual weight consistent, while subtle smoothing at junction intersections eliminates distracting dark spots in body paragraphs.',
      microKicker: 'Micro-Typography',
      microTitle: 'Open Counters & High Legibility',
      microBody: 'Wide open counters and unconstrained apertures ensure instant letter recognition even at small sizes on mobile devices and high-density screens.'
    };
  }

  return {
    voiceKicker: 'Visual Voice',
    voiceTitle: 'Rational Geometry & Neutral Clarism',
    voiceBody: 'Operates as an invisible, transparent vessel for visual communication. Clean, objective letter geometry projects modernism and systemic clarity across interfaces.',
    strokeKicker: 'Stroke Dynamics',
    strokeTitle: 'Disciplined Monolinear Uniformity',
    strokeBody: 'Maintains uniform stroke weight with subtle optical thinning at stem intersections to eliminate visual bloat, keeping paragraph texture clean and evenly distributed.',
    microKicker: 'Micro-Typography',
    microTitle: 'Elevated X-Height & Clear Disambiguation',
    microBody: 'A tall x-height maximizes legibility across responsive screens, while tailored differences between characters like lowercase "l" and uppercase "I" prevent reading errors.'
  };
}

function getWhereItBelongs(font) {
  const style = (font.style || font.category || '').toLowerCase();
  const mood = (font.mood || '').toLowerCase();

  if (style.includes('mono')) {
    return {
      environments: [
        { domain: 'Code Editors & Developer Tools', desc: 'Syntax highlighting, terminal interfaces, and developer dashboard utilities requiring exact vertical glyph alignment.' },
        { domain: 'Tabular Financial Interfaces', desc: 'Accounting ledgers, cryptocurrency tickers, and metrics tables where numerical digits must line up across rows.' },
        { domain: 'Technical Publications & Specs', desc: 'Engineering documentation, architecture diagrams, and system manuals communicating technical precision.' }
      ],
      scales: [
        { label: 'Code & Tabular Data', val: '12px — 15px (Calibrated line spacing for effortless multi-line scanning)' },
        { label: 'Terminal & Command Heads', val: '16px — 24px (Distinct monospaced presence for technical lead text)' },
        { label: 'Branding & Monospace Display', val: '28px — 64px (High-contrast tech identity and brutalist poster titles)' }
      ],
      readability: [
        { label: 'Tracking Parameter', val: 'Keep tracking at 0.00em. Expanding or contracting fixed-pitch metrics disrupts tabular harmony.' },
        { label: 'Leading Recommendation', val: '1.5x to 1.7x for continuous source code blocks; 1.25x for compact table cells.' },
        { label: 'Pairing Strategy', val: 'Pairs seamlessly with neutral grotesque sans-serifs (Inter, Satoshi) for surrounding UI chrome.' }
      ]
    };
  }

  if (style.includes('script')) {
    return {
      environments: [
        { domain: 'Artisanal & Luxury Packaging', desc: 'Wine labels, organic cosmetic packaging, and heritage goods seeking tactile bespoke craftsmanship.' },
        { domain: 'Invitations & Brand Signatures', desc: 'Ceremonial invitations, signature logotypes, and hospitality identity touchpoints.' },
        { domain: 'Editorial Accent Elements', desc: 'Pull quotes, chapter headers, and decorative accents contrasting against austere body columns.' }
      ],
      scales: [
        { label: 'Display Titles & Marks', val: '36px — 80px (Preserves delicate hairline swashes and character loops)' },
        { label: 'Sub-Headings & Names', val: '22px — 32px (Ensure ample line spacing to avoid ascender-descender collision)' },
        { label: 'Body Text Boundary', val: 'Not recommended for multi-sentence body text; reserve exclusively for display accents.' }
      ],
      readability: [
        { label: 'Tracking Parameter', val: 'Strictly 0.00em tracking. Manual kerning changes can detach cursive stroke connections.' },
        { label: 'Leading Recommendation', val: '1.4x to 1.8x to accommodate sweeping swashes and exuberant ascenders.' },
        { label: 'Pairing Strategy', val: 'Pair with quiet, restrained serif or sans-serif companions that yield center stage to the script.' }
      ]
    };
  }

  if (style.includes('display') || mood.includes('bold') || mood.includes('loud')) {
    return {
      environments: [
        { domain: 'Editorial Mastheads & Covers', desc: 'Magazine front covers, cultural posters, and bold publication mastheads demanding instant visual gravity.' },
        { domain: 'High-Impact Brand Campaigns', desc: 'Billboard hero statements, streetwear identity systems, and assertive exhibition signage.' },
        { domain: 'Digital Hero Titles', desc: 'Above-the-fold website landing page headlines establishing immediate brand character.' }
      ],
      scales: [
        { label: 'Headline & Hero Scales', val: '48px — 160px (Optimal structural density and stroke clarity)' },
        { label: 'Section Decks', val: '24px — 36px (Maintain tight line leading for compact graphic presence)' },
        { label: 'Continuous Text Boundary', val: 'Avoid using for body copy; high contrast and heavy weight hinder continuous reading.' }
      ],
      readability: [
        { label: 'Tracking Parameter', val: '-0.01em to -0.02em at large display sizes; loosen to +0.03em if set in all-caps.' },
        { label: 'Leading Recommendation', val: '0.95x to 1.1x for tight, punchy headlines without awkward gaps.' },
        { label: 'Pairing Strategy', val: 'Pair with transparent, highly readable sans-serif body fonts like Inter, Work Sans, or Lato.' }
      ]
    };
  }

  if (style.includes('serif')) {
    return {
      environments: [
        { domain: 'Literary Journals & Publishing', desc: 'In-depth essays, cultural criticism, and book typography where reader immersion is paramount.' },
        { domain: 'Luxury & Cultural Identity', desc: 'Museum identity systems, haute couture branding, and prestige editorial publications.' },
        { domain: 'Corporate Annuals & Whitepapers', desc: 'Executive briefings, legal publications, and institutional reports conveying sober credibility.' }
      ],
      scales: [
        { label: 'Display & Editorial Titles', val: '38px — 96px (Reveals nuanced stroke modulation and elegant serifs)' },
        { label: 'Section Decks & Decks', val: '20px — 28px (Clear hierarchy with dignified typographic cadence)' },
        { label: 'Long-Form Body Copy', val: '15px — 18px (Gentle baseline anchoring for relaxed, prolonged reading sessions)' }
      ],
      readability: [
        { label: 'Tracking Parameter', val: '0.00em for body text; apply subtle negative tracking (-0.01em) on large display headlines.' },
        { label: 'Leading Recommendation', val: '1.5x to 1.65x for editorial body paragraphs to let line rhythm breathe.' },
        { label: 'Pairing Strategy', val: 'Pairs harmoniously with neutral grotesque sans-serifs or geometric companions for metadata and UI.' }
      ]
    };
  }

  // Default: Sans-Serif
  return {
    environments: [
      { domain: 'Complex Application Interfaces', desc: 'SaaS dashboards, responsive mobile apps, and multi-platform design systems with high data density.' },
      { domain: 'Modern Brand Identity Programs', desc: 'Omnichannel brand collateral, technology marketing, and crisp consumer packaging.' },
      { domain: 'Wayfinding & Ambient Signage', desc: 'High-legibility directional signage, kiosks, and responsive heads-up displays.' }
    ],
    scales: [
      { label: 'Interface Headlines', val: '28px — 64px (Clean modern impact without gratuitous ornamentation)' },
      { label: 'Sub-Headings & Card Titles', val: '18px — 24px (Crisp definition across varied contrast ratios)' },
      { label: 'Continuous UI Body & Labels', val: '13px — 16px (Uncompromised legibility across micro-screens and desktop viewports)' }
    ],
    readability: [
      { label: 'Tracking Parameter', val: '0.00em for body; subtle positive tracking (+0.01em to +0.02em) for small caps and micro-labels.' },
      { label: 'Leading Recommendation', val: '1.4x to 1.55x for multi-line UI text; 1.2x for concise multi-line titles.' },
      { label: 'Pairing Strategy', val: 'Pairs with expressive display serifs (Playfair, Instrument Serif) or characterful editorial typefaces.' }
    ]
  };
}

function getVerifiedStory(font) {
  const desc = (font.description || '').toLowerCase();
  const name = (font.name || '').toLowerCase();
  const id = (font.id || '').toLowerCase();

  const verifiedHistories = {
    'fraunces': {
      title: 'Wonky Roots in Early 20th-Century Type',
      attribution: 'Type History · Phaedra Charles, Flavia Zimbardi & Undercase Type',
      text: 'Fraunces is a variable oldstyle serif created by Phaedra Charles and Flavia Zimbardi at Undercase Type. Inspired by early 20th-century typefaces such as Windsor, Souvenir, and Cooper Black, Fraunces celebrates the tactile quirks and warmth of historic bookprinting while harnessing modern variable axes for optical size, weight, and softness.'
    },
    'dm-sans': {
      title: 'Geometric Clarity Commissioned by Google',
      attribution: 'Geometric Sans · Colophon Foundry',
      text: 'DM Sans is a low-contrast geometric sans-serif family designed by British studio Colophon Foundry. Commissioned by Google alongside DM Serif Display, it features wide apertures, clean circular counter-forms, and neutral stroke terminals engineered for effortless scanning on screen interfaces.'
    },
    'libre-baskerville': {
      title: 'Rooted in 1941 Metal Type Heritage',
      attribution: 'Historical Heritage · Impallari Type & American Type Founders',
      text: 'Libre Baskerville is an open-source revival optimized specifically for reading at small body sizes on modern screens. Its structural anatomy traces directly to the American Type Founders Baskerville cut of 1941, featuring a taller x-height, wider counter-forms, and slightly reduced stroke contrast to maintain legibility in digital reading environments.'
    },
    'impact-local': {
      title: 'Born in 1965 Industrial Britain',
      attribution: 'Design History · Geoffrey Lee & Stephenson Blake',
      text: 'Designed by Geoffrey Lee in 1965 and cut by the Sheffield foundry Stephenson Blake, Impact was engineered with an ultra-thick stroke weight and razor-thin apertures to command instant attention on posters and billboards. Its extreme x-height and narrow set width make it an enduring icon of 20th-century display typography.'
    },
    'coolvetica': {
      title: 'A Homage to 1970s Custom Logo Culture',
      attribution: 'Design History · Ray Larabie & Typodermic',
      text: 'Designed by Ray Larabie in 1999, Coolvetica recreates the custom-modified Helvetica letterforms that dominated North American retail logos and corporate signage throughout the 1970s. It features unusually tight tracking, rounded curls, and distinct geometric curls that evoke the playful warmth of vintage American commerce.'
    },
    'coolvetica-local': {
      title: 'A Homage to 1970s Custom Logo Culture',
      attribution: 'Design History · Ray Larabie & Typodermic',
      text: 'Designed by Ray Larabie in 1999, Coolvetica recreates the custom-modified Helvetica letterforms that dominated North American retail logos and corporate signage throughout the 1970s. It features unusually tight tracking, rounded curls, and distinct geometric curls that evoke the playful warmth of vintage American commerce.'
    },
    'inter': {
      title: 'Crafted from the Ground Up for Computer Displays',
      attribution: 'Digital Typography · Rasmus Andersson',
      text: 'Inter began as an ambitious research project by Swedish designer Rasmus Andersson to create a typeface specifically optimized for high-density computer screens. With its tall x-height, wide counter-forms, and specialized micro-spacing, Inter excels at clarifying complex digital user interfaces across screen sizes from micro-watches to massive monitors.'
    },
    'cinzel': {
      title: 'Echoes of Classical First-Century Epigraphy',
      attribution: 'Classical Origins · Natanael Gama',
      text: 'Cinzel is drawn from classical Roman epigraphy of the first century CE, observing the monumental proportions recorded on the Trajan Column in Rome. Natanael Gama re-envisioned these ancient chiseled forms with modern digital precision, giving the letterforms timeless ceremonial dignity for luxury packaging and editorial headlines.'
    },
    'jetbrains-mono': {
      title: 'Engineered for Cognitive Endurance',
      attribution: 'Developer Typography · Philipp Nurullin & JetBrains',
      text: 'JetBrains Mono was created through deep analysis of developer eye fatigue during extended programming sessions. With widened character widths, asymmetric oval counters, and carefully balanced code ligatures, it minimizes cognitive friction when scanning complex, nested codebases.'
    },
    'montserrat': {
      title: 'Rescuing Buenos Aires Urban Heritage',
      attribution: 'Urban Documentation · Julieta Ulanovsky',
      text: 'Designer Julieta Ulanovsky launched the Montserrat project to document and preserve the vernacular typography found on historic signboards, storefronts, and cafe windows in the central Montserrat neighborhood of Buenos Aires before urban redevelopment wiped them away.'
    },
    'space-grotesk': {
      title: 'From Fixed-Pitch to Proportional Space',
      attribution: 'Typographic Evolution · Florian Karsten',
      text: 'Space Grotesk evolved directly from Colophon’s Space Mono. Florian Karsten adapted the monospaced letterforms into a proportional grotesque, preserving idiosyncratic technical quirks while enabling smooth horizontal flow for headlines and editorial paragraphs.'
    },
    'syne': {
      title: 'Bespoke Identity for the French Avant-Garde',
      attribution: 'Art Direction · Bonjour Monde',
      text: 'Originally commissioned in 2017 for the Synesthésie art and contemporary culture association in Saint-Denis, France, Syne was designed to shift smoothly between quiet, structural light weights and radical, hyper-expressive bold weights that redefine display proportions.'
    },
    'playfair-display': {
      title: 'Influenced by the Enlightenment Press',
      attribution: 'Type History · Claus Eggers Sørensen',
      text: 'Playfair Display draws inspiration from the transitional typefaces developed during the European Enlightenment, particularly John Baskerville’s work in Birmingham and the emergence of modern punch-cutting techniques. Its dramatic contrast and delicate ball terminals evoke the prestige of early printed periodicals.'
    },
    'oswald': {
      title: 'Re-imagining the Alternate Gothic Aesthetic',
      attribution: 'Revival Design · Vernon Adams',
      text: 'Oswald is a reworking of the classic style historically represented by the Alternate Gothic typefaces designed by Morris Fuller Benton in the early 1900s. Vernon Adams redesigned the characters for digital screens, tightening letterspacing and optimizing apertures for crisp rendering.'
    },
    'barlow': {
      title: 'Drawn from California Highway Signage',
      attribution: 'Signage & Public Design · Jeremy Tribby',
      text: 'Barlow is inspired by the visual style of the California public highway system and municipal signboards. Its slightly rounded low-contrast contours and clean grotesque proportions reflect the utilitarian clarity of West Coast transportation infrastructure.'
    },
    'righteous': {
      title: 'Inspired by Mid-Century Art Deco Signage',
      attribution: 'Retro Display Design · Astigmatic',
      text: 'Righteous draws from mid-20th century American chrome signage and neon theatre marquees. By infusing grid-based Art Deco geometry with modern digital curve smoothing, it captures the optimism of mid-century commercial lettering.'
    },
    'pacifico': {
      title: 'Echoes of 1950s American Surf Culture',
      attribution: 'Vernacular Script · Vernon Adams',
      text: 'Pacifico was inspired by the casual sign-painting and surfboard decal lettering popular along the American coastline during the 1950s and 1960s. Its fluid, continuous brush strokes create a cheerful, relaxed aesthetic.'
    },
    'cormorant-garamond': {
      title: 'A High-Resolution Display Tribute to Claude Garamont',
      attribution: 'Historical Tribute · Christian Thalmann',
      text: 'Cormorant Garamond is Christian Thalmann’s ambitious open-source tribute to the 16th-century French punchcutter Claude Garamont. Rather than scaling a text face up, Cormorant was designed specifically for large display scales, preserving razor-sharp serifs and expressive calligraphic tension.'
    }
  };

  for (const [key, val] of Object.entries(verifiedHistories)) {
    if (id === key || id.startsWith(key) || name.includes(key.replace(/-/g, ' '))) {
      return { hasStory: true, ...val };
    }
  }

  const isGenericTemplate = desc.includes('high-grade professional typeface from the adobe fonts library') ||
                            desc.includes('highly crafted typographic specimen optimized for digital interfaces');

  if (!isGenericTemplate) {
    if (desc.includes('1941') || desc.includes('1965') || desc.includes('1970s') || desc.includes('buenos aires') || desc.includes('art center in france') || desc.includes('programming ligatures')) {
      return {
        hasStory: true,
        title: `Design Origins of ${font.name}`,
        attribution: `${font.foundry || font.designer || 'Design Archives'} · Historical Notes`,
        text: font.description
      };
    }
  }

  return { hasStory: false, title: '', attribution: '', text: '' };
}

function getContextualCTA(font) {
  const provider = (font.provider || '').toLowerCase();
  const url = font.downloadUrl || '';

  if (provider === 'google' || url.includes('fonts.google.com')) {
    return {
      label: 'Get on Google Fonts',
      floatingLabel: 'Get Font',
      subtext: 'Open Font License (OFL) · Available for 100% free commercial and personal use.',
      badge: 'Open Font License',
      url: url && url !== '#' ? url : `https://fonts.google.com/specimen/${encodeURIComponent(font.name)}`,
      icon: 'external-link',
      isExternal: true
    };
  }
  if (provider === 'fontshare' || url.includes('fontshare.com')) {
    return {
      label: 'Download on Fontshare',
      floatingLabel: 'Get Font',
      subtext: 'Indian Type Foundry (ITF) Free License · 100% free for commercial use.',
      badge: 'ITF Free License',
      url: url && url !== '#' ? url : `https://www.fontshare.com/fonts/${font.id || font.slug || font.name.toLowerCase().replace(/\s+/g, '-')}`,
      icon: 'download',
      isExternal: true
    };
  }
  if (provider === 'adobe' || url.includes('fonts.adobe.com') || font.adobeKitId) {
    return {
      label: 'Explore on Adobe Fonts',
      floatingLabel: 'Explore License',
      subtext: 'Included with Adobe Creative Cloud subscription · Web & desktop publishing rights.',
      badge: 'Creative Cloud License',
      url: url && url !== '#' ? url : `https://fonts.adobe.com/fonts/${font.id || font.slug || font.name.toLowerCase().replace(/\s+/g, '-')}`,
      icon: 'external-link',
      isExternal: true
    };
  }
  if (provider === 'dafont' || url.includes('dafont.com')) {
    return {
      label: 'Visit DaFont Source',
      floatingLabel: 'Visit Source',
      subtext: 'Author-distributed typeface · Check individual license terms for commercial usage.',
      badge: 'Author License',
      url: url && url !== '#' ? url : 'https://www.dafont.com/',
      icon: 'external-link',
      isExternal: true
    };
  }
  return {
    label: 'Download Font Files',
    floatingLabel: 'Download',
    subtext: 'Direct font package download with webfont and desktop distribution formats.',
    badge: 'Direct Download',
    url: url || '#',
    icon: 'download',
    isExternal: false
  };
}

function renderFontDetails(font) {
  const root = document.getElementById('font-detail-root');
  const fam = font.cssFamily || `'${font.name}'`;
  
  const weights = getFontWeights(font);
  const defaultWeight = weights.includes(400) ? 400 : weights[0];
  
  const cta = getContextualCTA(font);
  const personality = getTypographicPersonality(font);
  const where = getWhereItBelongs(font);
  const story = getVerifiedStory(font);
  const editorialDesc = getEditorialDescription(font);

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

  // Story HTML conditional block
  const storyHtml = story.hasStory ? `
    <!-- 4.5. STORY BEHIND THE TYPE (Conditional on verified history) -->
    <section class="story-section" id="story">
      <div class="container">
        <div class="story-container-card cascade-item">
          <div class="story-header-row">
            <div class="story-kicker-wrap">
              <span class="story-kicker">Story Behind the Type</span>
              <h3 class="story-title">${story.title}</h3>
            </div>
            <span class="story-attribution">${story.attribution}</span>
          </div>
          <p class="story-lead-paragraph">${story.text}</p>
        </div>
      </div>
    </section>
  ` : '';

  // Main UI skeleton
  root.innerHTML = `
    <!-- Ambient mesh background & noise filter -->
    <div class="mesh-glow"></div>
    <div class="noise-overlay"></div>

    <!-- 1. EDITORIAL SPECIMEN HERO -->
    <section class="hero-section" id="hero" style="padding-top: 4rem;">
      <div class="container hero-wrapper">
        <div class="hero-foundry-wrapper" style="display: flex; justify-content: center; margin-bottom: 0.75rem;">
          <span class="hero-foundry-badge">Curated Typography Index &middot; ${font.style || font.category || 'Serif'}</span>
        </div>

        <div class="hero-font-title-wrapper" style="margin-top: 1.5rem;">
          <h1 class="hero-font-title" style="font-family: ${fam}, serif;">${font.name}</h1>
        </div>

        <div class="hero-attribution-row">
          Designed by <strong>${font.designer || 'Independent Designer'}</strong>${font.foundry ? ` &middot; Published by <strong>${font.foundry}</strong>` : ''}${font.year && font.year !== 'N/A' ? ` &middot; ${font.year}` : ''}
        </div>

        <div class="hero-tags-pill-row">
          <span class="hero-tag-pill">${font.style || font.category || 'Serif'}</span>
          <span class="hero-tag-pill">${font.mood || 'Refined'}</span>
          <span class="hero-tag-pill">${font.price || 'Free Font'}</span>
          <span class="hero-tag-pill">${weights.length} Weights</span>
          ${font.isVariable || font.name.toLowerCase().includes('variable') ? '<span class="hero-tag-pill accent-tag">Variable</span>' : ''}
        </div>

        <p class="hero-font-description">
          ${editorialDesc}
        </p>

        <!-- Direct Editorial CTAs -->
        <div class="hero-actions-row">
          <button class="cta-btn cta-secondary" onclick="document.getElementById('playground').scrollIntoView({ behavior: 'smooth' })">
            <i data-lucide="compass" style="width: 15px; height: 15px;"></i> Explore Specimen
          </button>
          <button class="cta-btn cta-primary" id="btn-hero-download">
            <i data-lucide="${cta.icon}" style="width: 15px; height: 15px;"></i> ${cta.label}
          </button>
          <button class="hero-fav-btn" id="btn-hero-favorite" onclick="toggleFavoriteState('${font.id}', this)" title="Save to Vault">
            <i data-lucide="heart" style="width: 16px; height: 16px;"></i>
          </button>
        </div>

        <!-- Scroll down indicator -->
        <div class="hero-scroll-indicator" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-top: 4.5rem; cursor: pointer; animation: fade-in-indicator 1.5s ease-out;" onclick="document.getElementById('playground').scrollIntoView({ behavior: 'smooth' })">
          <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.15em;">Scroll Down</span>
          <i data-lucide="arrow-down" style="width: 16px; height: 16px; color: var(--accent-color); animation: arrow-bounce 2s infinite;"></i>
        </div>
      </div>
    </section>

    <!-- 2. THE SPECIMEN (Interactive Playground) -->
    <section class="playground-section" id="playground">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">The Specimen</h2>
        <p style="color: var(--text-secondary); margin: 0 0 2.5rem 0; font-size: 1.1rem; max-width: 650px;">An interactive testing canvas. Tune scale, weight distribution, letter spacing, and surface contrast.</p>

        <div class="playground-grid">
          <!-- Left: Big Specimen Preview -->
          <div class="playground-canvas" id="p-canvas" style="background-color: var(--card-bg-subtle);">
            <div class="playground-canvas-header">
              <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;" id="p-canvas-label">Active specs</span>
              <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;" id="p-canvas-font-name">${font.name}</span>
            </div>
            <div class="playground-editable-text" id="p-editable-text" contenteditable="true" spellcheck="false" data-placeholder="Type something worth reading..." style="font-family: ${fam}, serif; font-weight: ${defaultWeight};">Type something worth reading...</div>
          </div>

          <!-- Pangram & Quotes Quick Selector Bar -->
          <div class="pangram-selector-bar">
            <span class="pangram-bar-label">Pangrams &amp; Quotes:</span>
            <div class="pangram-pills-list" id="pangram-pills-container">
              <button type="button" class="pangram-pill active" data-text="Type something worth reading...">Worth reading</button>
              <button type="button" class="pangram-pill" data-text="A quick movement of the hands, and the letters took flight across the page.">The quick movement</button>
              <button type="button" class="pangram-pill" data-text="Typography is the craft of endowing human language with durable visual form.">Craft of language</button>
              <button type="button" class="pangram-pill" data-text="Sphinx of black quartz, judge my vow.">Sphinx of quartz</button>
              <button type="button" class="pangram-pill" data-text="Handgloves &amp; Hamburgevons 123">Hamburgevons</button>
            </div>
          </div>

          <!-- Mobile Quick Specimen Toolbar (<= 768px) -->
          <div class="mobile-quick-toolbar" id="mobile-quick-toolbar">
            <div class="quick-size-control">
              <span class="quick-size-label">Size</span>
              <button type="button" class="quick-step-btn" id="btn-quick-size-dec" aria-label="Decrease size">&minus;</button>
              <span class="quick-size-val" id="mobile-val-size">64px</span>
              <button type="button" class="quick-step-btn" id="btn-quick-size-inc" aria-label="Increase size">&plus;</button>
            </div>
            <div class="quick-align-toggles" id="mobile-quick-align">
              <button type="button" class="quick-align-btn active" data-align="left" title="Align Left">
                <i data-lucide="align-left" style="width:15px;height:15px;"></i>
              </button>
              <button type="button" class="quick-align-btn" data-align="center" title="Align Center">
                <i data-lucide="align-center" style="width:15px;height:15px;"></i>
              </button>
              <button type="button" class="quick-align-btn" data-align="right" title="Align Right">
                <i data-lucide="align-right" style="width:15px;height:15px;"></i>
              </button>
            </div>
            <button type="button" class="mobile-drawer-trigger-btn" id="btn-open-mobile-drawer" aria-label="Open font controls">
              <i data-lucide="sliders" style="width:14px;height:14px;"></i>
              <span>Controls</span>
            </button>
          </div>

          <!-- Right: Controls -->
          <div class="playground-controls" id="playground-controls">
            <div class="playground-controls-header">
              <div class="controls-header-badge">
                <i data-lucide="sliders" style="width:14px;height:14px;"></i>
                <span>Typography Controls</span>
              </div>
              <span class="controls-header-sub">Live Specimen Tuning</span>
            </div>
            <!-- Font Size -->
            <div class="control-group">
              <div class="control-header">
                <span class="control-label">Scale (Size)</span>
                <span class="control-value" id="val-size">64px</span>
              </div>
              <input type="range" class="custom-range" id="slider-size" min="16" max="180" value="64">
            </div>

            <!-- Font Weight -->
            <div class="control-group">
              <div class="control-header">
                <span class="control-label">Optical Weight</span>
                <span class="control-value" id="val-weight">${defaultWeight}</span>
              </div>
              <input type="range" class="custom-range" id="slider-weight" min="100" max="900" step="100" value="${defaultWeight}">
            </div>

            <!-- Letter Spacing -->
            <div class="control-group">
              <div class="control-header">
                <span class="control-label">Tracking (Letter Spacing)</span>
                <span class="control-value" id="val-tracking">0.00em</span>
              </div>
              <input type="range" class="custom-range" id="slider-tracking" min="-0.1" max="0.3" step="0.01" value="0">
            </div>

            <!-- Line Height -->
            <div class="control-group">
              <div class="control-header">
                <span class="control-label">Leading (Line Height)</span>
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
              <span class="control-label">Casing</span>
              <div class="segmented-control" id="seg-transform">
                <button class="segment-btn active" data-transform="none">None</button>
                <button class="segment-btn" data-transform="uppercase">Caps</button>
                <button class="segment-btn" data-transform="lowercase">Lower</button>
              </div>
            </div>

            <!-- Canvas Theme Picker -->
            <div class="control-group">
              <span class="control-label">Canvas Contrast</span>
              <div class="color-theme-picker" id="color-theme-picker" style="display: flex; gap: 0.5rem;">
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

      <!-- Mobile Typography Drawer Backdrop -->
      <div class="mobile-drawer-backdrop" id="mobile-drawer-backdrop"></div>

      <!-- Mobile Typography Bottom Sheet Drawer -->
      <div class="mobile-typography-drawer" id="mobile-typography-drawer" role="dialog" aria-modal="true" aria-label="Typography Controls">
        <div class="drawer-header-drag" id="drawer-drag-handle">
          <div class="drawer-handle-bar"></div>
        </div>
        <div class="drawer-title-row">
          <div class="drawer-title-text">
            <h3 class="drawer-title">Typography Controls</h3>
            <p class="drawer-subtitle">Adjust type specimen parameters in real-time</p>
          </div>
          <button type="button" class="drawer-close-btn" id="btn-close-mobile-drawer" aria-label="Close controls">&times;</button>
        </div>
        <div class="drawer-content-scroll">
          <!-- Size Slider -->
          <div class="drawer-control-group">
            <div class="control-header">
              <span class="control-label">Size</span>
              <span class="control-value" id="drawer-val-size">64px</span>
            </div>
            <input type="range" class="custom-range drawer-slider" id="drawer-slider-size" min="16" max="180" value="64">
          </div>
          <!-- Weight Slider -->
          <div class="drawer-control-group">
            <div class="control-header">
              <span class="control-label">Weight</span>
              <span class="control-value" id="drawer-val-weight">${defaultWeight}</span>
            </div>
            <input type="range" class="custom-range drawer-slider" id="drawer-slider-weight" min="100" max="900" step="100" value="${defaultWeight}">
          </div>
          <!-- Letter Spacing Slider -->
          <div class="drawer-control-group">
            <div class="control-header">
              <span class="control-label">Letter Spacing</span>
              <span class="control-value" id="drawer-val-tracking">0.00em</span>
            </div>
            <input type="range" class="custom-range drawer-slider" id="drawer-slider-tracking" min="-0.1" max="0.3" step="0.01" value="0">
          </div>
          <!-- Line Height Slider -->
          <div class="drawer-control-group">
            <div class="control-header">
              <span class="control-label">Line Height</span>
              <span class="control-value" id="drawer-val-leading">1.2</span>
            </div>
            <input type="range" class="custom-range drawer-slider" id="drawer-slider-leading" min="0.8" max="2.5" step="0.1" value="1.2">
          </div>
          <!-- Variable Font Sliders (if variable) -->
          ${font.isVariable || font.name.toLowerCase().includes('variable') ? `
            <div class="drawer-control-group">
              <div class="control-header">
                <span class="control-label" style="color: var(--accent-color);">Variable Width</span>
                <span class="control-value" id="drawer-val-var-width">100</span>
              </div>
              <input type="range" class="custom-range drawer-slider" id="drawer-slider-var-width" min="50" max="150" value="100">
            </div>
            <div class="drawer-control-group">
              <div class="control-header">
                <span class="control-label" style="color: var(--accent-color);">Optical Size</span>
                <span class="control-value" id="drawer-val-var-opsz">14</span>
              </div>
              <input type="range" class="custom-range drawer-slider" id="drawer-slider-var-opsz" min="6" max="72" value="14">
            </div>
          ` : ''}
          <!-- Alignment Segmented Control -->
          <div class="drawer-control-group">
            <span class="control-label">Alignment</span>
            <div class="segmented-control" id="drawer-seg-alignment">
              <button type="button" class="segment-btn active" data-align="left">Left</button>
              <button type="button" class="segment-btn" data-align="center">Center</button>
              <button type="button" class="segment-btn" data-align="right">Right</button>
              <button type="button" class="segment-btn" data-align="justify">Justify</button>
            </div>
          </div>
          <!-- Text Transform -->
          <div class="drawer-control-group">
            <span class="control-label">Text Transform</span>
            <div class="segmented-control" id="drawer-seg-transform">
              <button type="button" class="segment-btn active" data-transform="none">None</button>
              <button type="button" class="segment-btn" data-transform="uppercase">Caps</button>
              <button type="button" class="segment-btn" data-transform="lowercase">Lower</button>
            </div>
          </div>
          <!-- Style / Italic -->
          <div class="drawer-control-group switch-control">
            <span class="control-label">Italic Style</span>
            <div>
              <input type="checkbox" id="drawer-switch-italic" class="switch-input">
              <label for="drawer-switch-italic" class="switch-label"></label>
            </div>
          </div>
          <!-- Canvas Theme Picker -->
          <div class="drawer-control-group">
            <span class="control-label">Canvas Theme</span>
            <div class="color-theme-picker" id="drawer-theme-picker" style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
              <div class="color-circle active" data-bg="#F9F9F9" data-text="#111" style="background-color: #F9F9F9; border: 1px solid #ddd; width: 32px; height: 32px; cursor: pointer;"></div>
              <div class="color-circle" data-bg="#111" data-text="#FFF" style="background-color: #111; width: 32px; height: 32px; cursor: pointer;"></div>
              <div class="color-circle" data-bg="rgba(var(--accent-rgb), 0.05)" data-text="var(--accent-color)" style="background-color: rgba(255, 59, 0, 0.2); width: 32px; height: 32px; cursor: pointer;"></div>
              <div class="color-circle" data-bg="#090909" data-text="#34D399" style="background-color: #090909; color: #34D399; font-family: monospace; font-size: 8px; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center;">&lt;&gt;</div>
            </div>
          </div>
          <!-- Reset Button -->
          <button type="button" class="cta-btn cta-secondary" id="btn-drawer-reset" style="margin-top: 1.5rem; width: 100%; justify-content: center; min-height: 44px;">
            <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i> Reset Controls
          </button>
        </div>
      </div>
    </section>

    <!-- 3. WHAT DOES IT FEEL LIKE? (Typographic Personality) -->
    <section class="editorial-feel-section" id="feel">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">What does it feel like?</h2>
        <p style="color: var(--text-secondary); margin: 0 0 3.5rem 0; font-size: 1.1rem; max-width: 650px;">Typographic character, stroke rhythm, and emotional resonance.</p>

        <div class="editorial-cards-grid">
          <!-- Card 1: Visual Voice -->
          <div class="editorial-feature-card cascade-item">
            <div class="editorial-card-header">
              <span class="editorial-kicker">${personality.voiceKicker}</span>
              <i data-lucide="sparkles" class="editorial-icon"></i>
            </div>
            <h3 class="editorial-card-title">${personality.voiceTitle}</h3>
            <p class="editorial-card-body">${personality.voiceBody}</p>
          </div>

          <!-- Card 2: Stroke Dynamics -->
          <div class="editorial-feature-card cascade-item">
            <div class="editorial-card-header">
              <span class="editorial-kicker">${personality.strokeKicker}</span>
              <i data-lucide="activity" class="editorial-icon"></i>
            </div>
            <h3 class="editorial-card-title">${personality.strokeTitle}</h3>
            <p class="editorial-card-body">${personality.strokeBody}</p>
          </div>

          <!-- Card 3: Micro-Typography -->
          <div class="editorial-feature-card cascade-item">
            <div class="editorial-card-header">
              <span class="editorial-kicker">${personality.microKicker}</span>
              <i data-lucide="eye" class="editorial-icon"></i>
            </div>
            <h3 class="editorial-card-title">${personality.microTitle}</h3>
            <p class="editorial-card-body">${personality.microBody}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. WHERE IT BELONGS (Suitability & Scale) -->
    <section class="where-it-belongs-section" id="where">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Where it belongs</h2>
        <p style="color: var(--text-secondary); margin: 0 0 3.5rem 0; font-size: 1.1rem; max-width: 650px;">Recommended environments, scale boundaries, and layout pairing rationale.</p>

        <div class="where-cards-grid">
          <!-- Card 1: Recommended Environments -->
          <div class="where-card cascade-item">
            <div class="where-card-header">
              <span class="where-card-kicker">Ideal Applications</span>
              <i data-lucide="layout" class="where-card-icon"></i>
            </div>
            <div class="where-apps-list">
              ${where.environments.map(env => `
                <div class="where-app-item">
                  <span class="where-app-domain">${env.domain}</span>
                  <span class="where-app-desc">${env.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Card 2: Scale Boundaries -->
          <div class="where-card cascade-item">
            <div class="where-card-header">
              <span class="where-card-kicker">Scale Boundaries</span>
              <i data-lucide="sliders-horizontal" class="where-card-icon"></i>
            </div>
            <div class="where-specs-list">
              ${where.scales.map(s => `
                <div class="where-spec-row">
                  <span class="where-spec-label">${s.label}</span>
                  <span class="where-spec-val">${s.val}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Card 3: Readability & Pairing -->
          <div class="where-card cascade-item">
            <div class="where-card-header">
              <span class="where-card-kicker">Readability &amp; Pairing</span>
              <i data-lucide="book-open" class="where-card-icon"></i>
            </div>
            <div class="where-specs-list">
              ${where.readability.map(r => `
                <div class="where-spec-row">
                  <span class="where-spec-label">${r.label}</span>
                  <span class="where-spec-val">${r.val}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4.5. STORY BEHIND THE TYPE (Conditional on verified history) -->
    ${storyHtml}

    <!-- 5. STYLES & WEIGHTS -->
    <section class="styles-section" id="styles">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Styles &amp; Weights</h2>
        <p style="color: var(--text-secondary); margin: 0 0 4rem 0; font-size: 1.1rem; max-width: 600px;">Review weights from thin hairline formats to heavy black profiles. Hover cards to test previews, click to load weight directly to playground.</p>
        <div class="styles-grid" id="weights-grid-container">
          ${stylesHtml}
        </div>
      </div>
    </section>

    <!-- 6. THE COMPLETE SET (Character & Layout Showcase) -->
    <section class="specimen-showcase-section" id="specimen-showcase">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">The Complete Set</h2>
        <p style="color: var(--text-secondary); margin: 0 0 2.5rem 0; font-size: 1.1rem; max-width: 600px;">Glyph inventory, numeral figures, punctuation marks, and editorial body rhythm rendered in ${font.name}.</p>

        <!-- Specimen Navigation Tabs for Mobile and Desktop -->
        <div class="specimen-nav-tabs" id="specimen-nav-tabs">
          <button type="button" class="specimen-nav-tab active" data-target="specimen-large">Display</button>
          <button type="button" class="specimen-nav-tab" data-target="specimen-upper">Uppercase</button>
          <button type="button" class="specimen-nav-tab" data-target="specimen-lower">Lowercase</button>
          <button type="button" class="specimen-nav-tab" data-target="specimen-nums">Numbers</button>
          <button type="button" class="specimen-nav-tab" data-target="specimen-symbols">Symbols</button>
          <button type="button" class="specimen-nav-tab" data-target="specimen-body">Paragraph</button>
        </div>

        <div class="specimen-cards-stack">
          <!-- Card 1: Large Display Preview -->
          <div class="specimen-showcase-card specimen-pane active" id="specimen-large">
            <div class="specimen-card-top">
              <span class="specimen-card-kicker">Large Display Preview</span>
              <span class="specimen-card-badge">Display Scale</span>
            </div>
            <div class="specimen-card-inner">
              <div class="specimen-display-headline" contenteditable="true" spellcheck="false" style="font-family: ${fam}, serif;">
                Sphinx of black quartz, judge my vow.
              </div>
            </div>
          </div>

          <!-- Card 2: Uppercase Alphabet -->
          <div class="specimen-showcase-card specimen-pane" id="specimen-upper">
            <div class="specimen-card-top">
              <span class="specimen-card-kicker">Uppercase Alphabet</span>
              <span class="specimen-card-badge">A &mdash; Z (26 Characters)</span>
            </div>
            <div class="specimen-card-inner">
              <div class="specimen-alphabet-line" style="font-family: ${fam}, serif;">
                A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </div>
            </div>
          </div>

          <!-- Card 3: Lowercase Alphabet -->
          <div class="specimen-showcase-card specimen-pane" id="specimen-lower">
            <div class="specimen-card-top">
              <span class="specimen-card-kicker">Lowercase Alphabet</span>
              <span class="specimen-card-badge">a &mdash; z (26 Characters)</span>
            </div>
            <div class="specimen-card-inner">
              <div class="specimen-alphabet-line" style="font-family: ${fam}, serif;">
                a b c d e f g h i j k l m n o p q r s t u v w x y z
              </div>
            </div>
          </div>

          <!-- Card 4: Numbers & Figures -->
          <div class="specimen-showcase-card specimen-pane" id="specimen-nums">
            <div class="specimen-card-top">
              <span class="specimen-card-kicker">Numbers &amp; Figures</span>
              <span class="specimen-card-badge">0 &mdash; 9 &middot; Currency &amp; Fractions</span>
            </div>
            <div class="specimen-card-inner">
              <div class="specimen-numbers-line" style="font-family: ${fam}, serif;">
                0 1 2 3 4 5 6 7 8 9
              </div>
              <div class="specimen-extra-symbols-line" style="font-family: ${fam}, serif;">
                $ &euro; &pound; &yen; &cent; &middot; 1/2 1/4 3/4 &middot; 99.9%
              </div>
            </div>
          </div>

          <!-- Card 5: Symbols & Punctuation -->
          <div class="specimen-showcase-card specimen-pane" id="specimen-symbols">
            <div class="specimen-card-top">
              <span class="specimen-card-kicker">Symbols &amp; Punctuation</span>
              <span class="specimen-card-badge">Glyphs &amp; Special Characters</span>
            </div>
            <div class="specimen-card-inner">
              <div class="specimen-symbols-line" style="font-family: ${fam}, serif;">
                &amp; @ # $ % * ! ? &ldquo; &rdquo; &lsquo; &rsquo; : ; , . ( ) [ ] { } / \ &lt; &gt; + = - _ &mdash; &ndash;
              </div>
            </div>
          </div>

          <!-- Card 6: Editorial Paragraph -->
          <div class="specimen-showcase-card specimen-pane" id="specimen-body">
            <div class="specimen-card-top">
              <span class="specimen-card-kicker">Editorial Body Paragraph</span>
              <span class="specimen-card-badge">Reading Rhythm &middot; 18px</span>
            </div>
            <div class="specimen-card-inner">
              <p class="specimen-body-paragraph" contenteditable="true" spellcheck="false" style="font-family: ${fam}, serif;">
                Typography is the craft of endowing human language with a durable visual form. Good typography communicates subtly: it invites reading, guides comprehension, and establishes an authentic atmosphere without drawing gratuitous attention to itself. When characters balance proportion, rhythm, and terminal shapes, complex ideas unfold effortlessly across the page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. GLYPHS EXPLORER -->
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

    <!-- 8. FONT IN USE SHOWCASE (Parallax Mockups) -->
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
                  <div style="display: flex; gap: 4px; align-items: flex-end; height: 35px; margin-top: 0.8rem; width: 100%;">
                    <div class="metric-bar" style="flex: 1; height: 10px; background: #22c55e; opacity: 0.4;"></div>
                    <div class="metric-bar" style="flex: 1; height: 14px; background: #22c55e; opacity: 0.5;"></div>
                    <div class="metric-bar" style="flex: 1; height: 12px; background: #22c55e; opacity: 0.6;"></div>
                    <div class="metric-bar" style="flex: 1; height: 20px; background: #22c55e; opacity: 0.7;"></div>
                    <div class="metric-bar" style="flex: 1; height: 16px; background: #22c55e; opacity: 0.8;"></div>
                    <div class="metric-bar" style="flex: 1; height: 24px; background: #22c55e; opacity: 0.9;"></div>
                    <div class="metric-bar" style="flex: 1; height: 18px; background: #22c55e;"></div>
                    <div class="metric-bar" style="flex: 1; height: 26px; background: #22c55e;"></div>
                    <div class="metric-bar" style="flex: 1; height: 32px; background: #22c55e;"></div>
                  </div>
                </div>
                
                <div style="border-right: 1px solid var(--border-color); padding-right: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                  <div>
                    <span style="font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.05em;">ACTIVE USERS</span>
                    <h4 style="font-family: ${fam}, serif; font-size: clamp(2rem, 3vw, 2.8rem); margin: 0.2rem 0 0; font-weight: 500; color: var(--text-primary);">18.5k</h4>
                    <p style="font-size: 0.7rem; color: var(--text-muted); margin: 0.1rem 0 0; font-family: var(--font-mono);">Peak: 2.4k/min</p>
                  </div>
                  <div style="display: flex; gap: 4px; align-items: flex-end; height: 35px; margin-top: 0.8rem; width: 100%;">
                    <div class="metric-bar" style="flex: 1; height: 22px; background: var(--text-primary); opacity: 0.15;"></div>
                    <div class="metric-bar" style="flex: 1; height: 18px; background: var(--text-primary); opacity: 0.25;"></div>
                    <div class="metric-bar" style="flex: 1; height: 26px; background: var(--text-primary); opacity: 0.35;"></div>
                    <div class="metric-bar" style="flex: 1; height: 14px; background: var(--text-primary); opacity: 0.45;"></div>
                    <div class="metric-bar" style="flex: 1; height: 24px; background: var(--text-primary); opacity: 0.6;"></div>
                    <div class="metric-bar" style="flex: 1; height: 30px; background: var(--text-primary); opacity: 0.75;"></div>
                    <div class="metric-bar" style="flex: 1; height: 20px; background: var(--text-primary); opacity: 0.85;"></div>
                    <div class="metric-bar" style="flex: 1; height: 28px; background: var(--accent-color);"></div>
                    <div class="metric-bar" style="flex: 1; height: 35px; background: var(--accent-color);"></div>
                  </div>
                </div>
                
                <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                  <div>
                    <span style="font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.05em;">TOTAL DISK USED</span>
                    <h4 style="font-family: ${fam}, serif; font-size: clamp(2rem, 3vw, 2.8rem); margin: 0.2rem 0 0; font-weight: 500; color: var(--text-primary);">8.42<span style="font-size: 1.1rem;">TB</span></h4>
                    <p style="font-size: 0.7rem; color: #EF4444; margin: 0.1rem 0 0; font-family: var(--font-mono); font-weight: 500;">82% Capacity</p>
                  </div>
                  <div style="display: flex; gap: 3px; margin-top: 1rem; width: 100%;">
                    <div class="metric-segment" style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div class="metric-segment" style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div class="metric-segment" style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div class="metric-segment" style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div class="metric-segment" style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div class="metric-segment" style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div class="metric-segment" style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div class="metric-segment" style="flex: 1; height: 6px; background: #EF4444;"></div>
                    <div class="metric-segment" style="flex: 1; height: 6px; background: var(--border-color);"></div>
                    <div class="metric-segment" style="flex: 1; height: 6px; background: var(--border-color);"></div>
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

    <!-- 9. RECOMMENDED PAIRINGS -->
    <section class="pairings-section" id="pairings">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">Recommended Pairings</h2>
        <p style="color: var(--text-secondary); margin: 0 0 4rem 0; font-size: 1.1rem; max-width: 600px;">Combine header weights with body typefaces selected dynamically using typographic balance rules.</p>
        <div class="pairings-row">
          ${pairingsHtml}
        </div>
      </div>
    </section>

    <!-- 10. AT A GLANCE (Specifications) -->
    <section class="specs-section" id="specs">
      <div class="container">
        <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">At a glance</h2>
        <p style="color: var(--text-secondary); margin: 0 0 4rem 0; font-size: 1.1rem; max-width: 600px;">Technical attributes, foundry credits, and licensing parameters.</p>

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

        <!-- Mobile Expandable Metadata Accordion (<= 768px) -->
        <div class="mobile-specs-accordion" id="mobile-specs-accordion">
          <!-- Item 1: License & Usage Rights -->
          <div class="specs-accordion-item" data-section="license">
            <button type="button" class="specs-accordion-header" aria-expanded="false">
              <div class="specs-acc-title-wrap">
                <i data-lucide="award" class="specs-acc-icon"></i>
                <div class="specs-acc-texts">
                  <span class="specs-acc-label">License &amp; Usage Rights</span>
                  <span class="specs-acc-val-preview">${cta.badge} &middot; ${font.price || 'Free'}</span>
                </div>
              </div>
              <i data-lucide="chevron-down" class="specs-acc-chevron"></i>
            </button>
            <div class="specs-accordion-body">
              <div class="specs-acc-content">
                <p class="specs-detail-lead"><strong>License Model:</strong> ${cta.badge} (${font.price || 'Free'})</p>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${cta.subtext}</p>
                <ul class="specs-detail-list">
                  <li><i data-lucide="check" style="width:14px;height:14px;color:#22c55e;"></i> Commercial projects (Web, Apps, Print)</li>
                  <li><i data-lucide="check" style="width:14px;height:14px;color:#22c55e;"></i> Personal &amp; portfolio projects</li>
                  <li><i data-lucide="check" style="width:14px;height:14px;color:#22c55e;"></i> Webfont embedding via @font-face</li>
                  <li><i data-lucide="check" style="width:14px;height:14px;color:#22c55e;"></i> Modification &amp; self-hosting allowed</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Item 2: Styles & Available Weights -->
          <div class="specs-accordion-item" data-section="weights">
            <button type="button" class="specs-accordion-header" aria-expanded="false">
              <div class="specs-acc-title-wrap">
                <i data-lucide="layers" class="specs-acc-icon"></i>
                <div class="specs-acc-texts">
                  <span class="specs-acc-label">Available Weights &amp; Styles</span>
                  <span class="specs-acc-val-preview">${weights.length} Weights &middot; ${font.stylesCount || weights.length} Styles</span>
                </div>
              </div>
              <i data-lucide="chevron-down" class="specs-acc-chevron"></i>
            </button>
            <div class="specs-accordion-body">
              <div class="specs-acc-content">
                <div class="specs-weights-pill-grid">
                  ${weights.map(w => `<span class="specs-weight-pill"><strong>${w}</strong> ${getWeightLabel(w)}</span>`).join('')}
                </div>
                ${font.isVariable || font.name.toLowerCase().includes('variable') ? `
                  <p class="specs-variable-badge"><i data-lucide="sliders" style="width:13px;height:13px;"></i> Continuous Variable Weight Interpolation (100–900)</p>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Item 3: Language Support -->
          <div class="specs-accordion-item" data-section="languages">
            <button type="button" class="specs-accordion-header" aria-expanded="false">
              <div class="specs-acc-title-wrap">
                <i data-lucide="languages" class="specs-acc-icon"></i>
                <div class="specs-acc-texts">
                  <span class="specs-acc-label">Language Support &amp; Encodings</span>
                  <span class="specs-acc-val-preview">${(font.languages && font.languages.length) ? font.languages.join(', ') : 'Latin, Latin Extended'}</span>
                </div>
              </div>
              <i data-lucide="chevron-down" class="specs-acc-chevron"></i>
            </button>
            <div class="specs-accordion-body">
              <div class="specs-acc-content">
                <p class="specs-detail-lead">Extensive character set supporting global typography:</p>
                <div class="specs-languages-tag-cloud">
                  <span class="lang-tag">Western European</span>
                  <span class="lang-tag">Central European</span>
                  <span class="lang-tag">South Eastern European</span>
                  <span class="lang-tag">Latin Extended-A</span>
                  <span class="lang-tag">English</span>
                  <span class="lang-tag">Spanish</span>
                  <span class="lang-tag">French</span>
                  <span class="lang-tag">German</span>
                  <span class="lang-tag">Italian</span>
                  <span class="lang-tag">Portuguese</span>
                  <span class="lang-tag">Danish</span>
                  <span class="lang-tag">Dutch</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Item 4: Technical & File Specifications -->
          <div class="specs-accordion-item" data-section="files">
            <button type="button" class="specs-accordion-header" aria-expanded="false">
              <div class="specs-acc-title-wrap">
                <i data-lucide="file-type" class="specs-acc-icon"></i>
                <div class="specs-acc-texts">
                  <span class="specs-acc-label">Technical &amp; File Specifications</span>
                  <span class="specs-acc-val-preview">${font.format ? font.format.toUpperCase() : 'WOFF2'} &middot; ${font.fileSize || 'Standard Webfont'}</span>
                </div>
              </div>
              <i data-lucide="chevron-down" class="specs-acc-chevron"></i>
            </button>
            <div class="specs-accordion-body">
              <div class="specs-acc-content">
                <div class="specs-meta-keyvals">
                  <div class="specs-meta-kv"><span class="k">Format</span><span class="v">${font.format ? font.format.toUpperCase() : 'WOFF2, TTF'}</span></div>
                  <div class="specs-meta-kv"><span class="k">File Size</span><span class="v">${font.fileSize || 'Standard Webfont'}</span></div>
                  <div class="specs-meta-kv"><span class="k">Designer</span><span class="v">${font.designer || 'Independent'}</span></div>
                  <div class="specs-meta-kv"><span class="k">Foundry</span><span class="v">${font.foundry || 'Independent'}</span></div>
                  <div class="specs-meta-kv"><span class="k">Glyph Count</span><span class="v">240+ Vector Glyphs</span></div>
                  <div class="specs-meta-kv"><span class="k">Hinting</span><span class="v">Screen &amp; Print Optimized</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 11. CURATED SOURCE & LICENSING ACTION BANNER -->
    <section class="download-cta-section" id="download-banner">
      <div class="container">
        <div class="download-cta-banner cascade-item">
          <div class="mesh-glow" style="opacity: 0.1;"></div>
          <span class="cta-banner-kicker">Curated Distribution Source</span>
          <h2 class="download-banner-title">Ready to build with ${font.name}?</h2>
          <p class="cta-banner-licensing-sub">${cta.subtext}</p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; z-index: 2; margin-top: 2rem;">
            <button class="cta-btn cta-primary" id="btn-banner-download" style="padding: 1.2rem 3.5rem; font-size: 1.05rem;">
              <i data-lucide="${cta.icon}" style="width: 18px; height: 18px;"></i> ${cta.label}
            </button>
            <button class="cta-btn cta-secondary" id="btn-banner-fav" style="padding: 1.2rem 2.2rem;" onclick="toggleFavoriteState('${font.id}', this)" title="Save to Vault">
              <i data-lucide="heart" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 12. MORE IN THIS MOOD (Related Fonts Carousel) -->
    <section class="related-section" id="related-fonts">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 4rem;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; margin: 0 0 1rem 0; letter-spacing: -0.02em;">More in this mood</h2>
            <p style="color: var(--text-secondary); margin: 0; font-size: 1.1rem; max-width: 600px;">Carefully curated typefaces sharing ${font.name}’s ${font.mood ? font.mood.toLowerCase() : 'refined'} aesthetic and structural sensibilities.</p>
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

    // Sections fade-in cascade staggered scrub animations (scrubs both directions!)
    const cascadeSections = ["#playground", "#feel", "#where", "#story", "#styles", "#specimen-showcase", "#glyphs", "#showcase", "#pairings", "#specs", "#download-banner", "#related-fonts"];
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
  const floatingBarMeta = document.getElementById("floating-bar-font-meta");
  const cta = getContextualCTA(font);
  if (floatingBarMeta) floatingBarMeta.textContent = `${font.style || font.category || 'Specimen'} · ${cta.badge || font.price || 'Free'}`;
  const floatingBtnDownload = document.getElementById("floating-btn-download");
  if (floatingBtnDownload) {
    floatingBtnDownload.innerHTML = `<i data-lucide="${cta.icon}" style="width: 14px; height: 14px;"></i> ${cta.floatingLabel}`;
  }

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

    // Floating Sticky Action Bar visibility (early activation on mobile)
    if (floatingBar) {
      const triggerTop = window.innerWidth <= 768 ? 200 : 600;
      if (sTop > triggerTop) {
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
  function checkPlaygroundChanges() {
    if (!sliderSize || !sliderWeight || !sliderTracking || !sliderLeading) return;
    const isSizeChanged = Number(sliderSize.value) !== 64;
    const isWeightChanged = Number(sliderWeight.value) !== Number(defaultWeight);
    const isTrackingChanged = Number(sliderTracking.value) !== 0;
    const isLeadingChanged = Number(sliderLeading.value) !== 1.2;
    
    const sliderWidth = document.getElementById("slider-var-width");
    const sliderOpsz = document.getElementById("slider-var-opsz");
    const isWidthChanged = sliderWidth ? Number(sliderWidth.value) !== 100 : false;
    const isOpszChanged = sliderOpsz ? Number(sliderOpsz.value) !== 14 : false;
    
    const switchItalic = document.getElementById("switch-italic");
    const isItalicChanged = switchItalic ? switchItalic.checked : false;

    // Check active alignment button (default is left, which is index 0)
    const alignBtns = document.querySelectorAll("#seg-alignment .segment-btn");
    const isAlignChanged = alignBtns.length > 0 ? !alignBtns[0].classList.contains("active") : false;

    // Check active text transform button (default is none, which is index 0)
    const transBtns = document.querySelectorAll("#seg-transform .segment-btn");
    const isTransChanged = transBtns.length > 0 ? !transBtns[0].classList.contains("active") : false;

    // Check active theme circle (default is index 0)
    const themeCircles = document.querySelectorAll("#color-theme-picker .color-circle");
    const isThemeChanged = themeCircles.length > 0 ? !themeCircles[0].classList.contains("active") : false;

    const hasChanges = isSizeChanged || isWeightChanged || isTrackingChanged || isLeadingChanged || isWidthChanged || isOpszChanged || isItalicChanged || isAlignChanged || isTransChanged || isThemeChanged;

    const resetBtn = document.getElementById("btn-reset-playground");
    if (resetBtn) {
      if (hasChanges) {
        resetBtn.classList.remove("cta-secondary");
        resetBtn.classList.add("cta-primary");
        resetBtn.style.backgroundColor = "var(--accent-color)";
        resetBtn.style.borderColor = "var(--accent-color)";
        resetBtn.style.color = "#FFFFFF";
      } else {
        resetBtn.classList.remove("cta-primary");
        resetBtn.classList.add("cta-secondary");
        resetBtn.style.backgroundColor = "";
        resetBtn.style.borderColor = "";
        resetBtn.style.color = "";
      }
    }
  }

  function updatePlaygroundValues() {
    if (!pEditableText) return;
    const size = sliderSize.value;
    const weight = sliderWeight.value;
    const tracking = sliderTracking.value;
    const leading = sliderLeading.value;

    valSize.textContent = `${size}px`;
    const mValSize = document.getElementById("mobile-val-size");
    if (mValSize) mValSize.textContent = `${size}px`;
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

    checkPlaygroundChanges();
  }

  // --- PANGRAM QUICK SELECTION PILLS ---
  const pangramPills = document.querySelectorAll(".pangram-pill");
  pangramPills.forEach(pill => {
    pill.addEventListener("click", () => {
      pangramPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      if (pEditableText) {
        pEditableText.textContent = pill.dataset.text;
        checkPlaygroundChanges();
      }
    });
  });

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
      const drawerSwitch = document.getElementById("drawer-switch-italic");
      if (drawerSwitch && drawerSwitch.checked !== switchItalic.checked) {
        drawerSwitch.checked = switchItalic.checked;
      }
    });
  }

  // --- MOBILE QUICK TOOLBAR & BOTTOM SHEET DRAWER BINDINGS ---
  const mobileDrawer = document.getElementById("mobile-typography-drawer");
  const mobileBackdrop = document.getElementById("mobile-drawer-backdrop");
  const openDrawerBtn = document.getElementById("btn-open-mobile-drawer");
  const closeDrawerBtn = document.getElementById("btn-close-mobile-drawer");
  const drawerDragHandle = document.getElementById("drawer-drag-handle");
  const mobileValSize = document.getElementById("mobile-val-size");

  function openMobileDrawer() {
    const pgControls = document.getElementById("playground-controls");
    if (pgControls) {
      pgControls.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      pgControls.classList.add("highlight-pulse");
      setTimeout(() => pgControls.classList.remove("highlight-pulse"), 1200);
      return;
    }
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.add("open");
      mobileBackdrop.classList.add("open");
      document.body.classList.add("drawer-modal-open");
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawer && mobileBackdrop) {
      mobileDrawer.classList.remove("open");
      mobileBackdrop.classList.remove("open");
      document.body.classList.remove("drawer-modal-open");
    }
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener("click", openMobileDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeMobileDrawer);
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileDrawer);
  if (drawerDragHandle) drawerDragHandle.addEventListener("click", closeMobileDrawer);

  // Mobile quick size buttons (+/- 4px)
  const quickSizeDec = document.getElementById("btn-quick-size-dec");
  const quickSizeInc = document.getElementById("btn-quick-size-inc");
  if (quickSizeDec && sliderSize) {
    quickSizeDec.addEventListener("click", () => {
      sliderSize.value = Math.max(16, Number(sliderSize.value) - 4);
      updatePlaygroundValues();
    });
  }
  if (quickSizeInc && sliderSize) {
    quickSizeInc.addEventListener("click", () => {
      sliderSize.value = Math.min(180, Number(sliderSize.value) + 4);
      updatePlaygroundValues();
    });
  }

  // Mobile quick align buttons
  const quickAlignBtns = document.querySelectorAll("#mobile-quick-align .quick-align-btn");
  quickAlignBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      quickAlignBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const align = btn.dataset.align;
      if (pEditableText) pEditableText.style.textAlign = align;

      // Sync desktop segmented align
      const deskAlignBtns = document.querySelectorAll("#seg-alignment .segment-btn");
      deskAlignBtns.forEach(b => b.classList.toggle("active", b.dataset.align === align));

      // Sync drawer align
      const drawerAlignBtns = document.querySelectorAll("#drawer-seg-alignment .segment-btn");
      drawerAlignBtns.forEach(b => b.classList.toggle("active", b.dataset.align === align));
    });
  });

  // Drawer Slider elements
  const drawerSliderSize = document.getElementById("drawer-slider-size");
  const drawerSliderWeight = document.getElementById("drawer-slider-weight");
  const drawerSliderTracking = document.getElementById("drawer-slider-tracking");
  const drawerSliderLeading = document.getElementById("drawer-slider-leading");
  const drawerValSize = document.getElementById("drawer-val-size");
  const drawerValWeight = document.getElementById("drawer-val-weight");
  const drawerValTracking = document.getElementById("drawer-val-tracking");
  const drawerValLeading = document.getElementById("drawer-val-leading");

  function syncDrawerControls() {
    if (!sliderSize) return;
    if (drawerSliderSize && drawerValSize) {
      drawerSliderSize.value = sliderSize.value;
      drawerValSize.textContent = `${sliderSize.value}px`;
    }
    if (mobileValSize) {
      mobileValSize.textContent = `${sliderSize.value}px`;
    }
    if (drawerSliderWeight && drawerValWeight && sliderWeight) {
      drawerSliderWeight.value = sliderWeight.value;
      drawerValWeight.textContent = sliderWeight.value;
    }
    if (drawerSliderTracking && drawerValTracking && sliderTracking) {
      drawerSliderTracking.value = sliderTracking.value;
      drawerValTracking.textContent = `${Number(sliderTracking.value).toFixed(2)}em`;
    }
    if (drawerSliderLeading && drawerValLeading && sliderLeading) {
      drawerSliderLeading.value = sliderLeading.value;
      drawerValLeading.textContent = Number(sliderLeading.value).toFixed(1);
    }
  }

  // Forward drawer slider inputs to main sliders & update
  if (drawerSliderSize) {
    drawerSliderSize.addEventListener("input", (e) => {
      if (sliderSize) {
        sliderSize.value = e.target.value;
        updatePlaygroundValues();
      }
    });
  }
  if (drawerSliderWeight) {
    drawerSliderWeight.addEventListener("input", (e) => {
      if (sliderWeight) {
        sliderWeight.value = e.target.value;
        updatePlaygroundValues();
      }
    });
  }
  if (drawerSliderTracking) {
    drawerSliderTracking.addEventListener("input", (e) => {
      if (sliderTracking) {
        sliderTracking.value = e.target.value;
        updatePlaygroundValues();
      }
    });
  }
  if (drawerSliderLeading) {
    drawerSliderLeading.addEventListener("input", (e) => {
      if (sliderLeading) {
        sliderLeading.value = e.target.value;
        updatePlaygroundValues();
      }
    });
  }

  // Drawer Variable Sliders
  const drawerSliderWidth = document.getElementById("drawer-slider-var-width");
  const drawerValWidth = document.getElementById("drawer-val-var-width");
  if (drawerSliderWidth && sliderWidth) {
    drawerSliderWidth.addEventListener("input", (e) => {
      sliderWidth.value = e.target.value;
      updatePlaygroundValues();
      if (drawerValWidth) drawerValWidth.textContent = e.target.value;
    });
  }
  const drawerSliderOpsz = document.getElementById("drawer-slider-var-opsz");
  const drawerValOpsz = document.getElementById("drawer-val-var-opsz");
  if (drawerSliderOpsz && sliderOpsz) {
    drawerSliderOpsz.addEventListener("input", (e) => {
      sliderOpsz.value = e.target.value;
      updatePlaygroundValues();
      if (drawerValOpsz) drawerValOpsz.textContent = e.target.value;
    });
  }

  // Drawer alignment buttons
  const drawerAlignBtns = document.querySelectorAll("#drawer-seg-alignment .segment-btn");
  drawerAlignBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      drawerAlignBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const align = btn.dataset.align;
      if (pEditableText) pEditableText.style.textAlign = align;

      // Sync desktop
      const deskAlignBtns = document.querySelectorAll("#seg-alignment .segment-btn");
      deskAlignBtns.forEach(b => b.classList.toggle("active", b.dataset.align === align));
      // Sync quick toolbar
      quickAlignBtns.forEach(b => b.classList.toggle("active", b.dataset.align === align));
    });
  });

  // Drawer transform buttons
  const drawerTransBtns = document.querySelectorAll("#drawer-seg-transform .segment-btn");
  drawerTransBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      drawerTransBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tr = btn.dataset.transform;
      if (pEditableText) pEditableText.style.textTransform = tr;

      // Sync desktop
      const deskTransBtns = document.querySelectorAll("#seg-transform .segment-btn");
      deskTransBtns.forEach(b => b.classList.toggle("active", b.dataset.transform === tr));
    });
  });

  // Drawer italic toggle
  const drawerSwitchItalic = document.getElementById("drawer-switch-italic");
  if (drawerSwitchItalic) {
    drawerSwitchItalic.addEventListener("change", () => {
      if (pEditableText) {
        pEditableText.style.fontStyle = drawerSwitchItalic.checked ? "italic" : "normal";
      }
      if (switchItalic && switchItalic.checked !== drawerSwitchItalic.checked) {
        switchItalic.checked = drawerSwitchItalic.checked;
      }
    });
  }

  // Drawer theme picker
  const drawerThemeCircles = document.querySelectorAll("#drawer-theme-picker .color-circle");
  drawerThemeCircles.forEach(circle => {
    circle.addEventListener("click", () => {
      drawerThemeCircles.forEach(c => c.classList.remove("active"));
      circle.classList.add("active");
      const canvas = document.getElementById("p-canvas");
      if (canvas) {
        canvas.style.backgroundColor = circle.dataset.bg;
        if (pEditableText) pEditableText.style.color = circle.dataset.text;
      }
      // Sync desktop circles
      const deskCircles = document.querySelectorAll("#color-theme-picker .color-circle");
      deskCircles.forEach((dc, idx) => {
        if (dc.dataset.bg === circle.dataset.bg) {
          deskCircles.forEach(c => c.classList.remove("active"));
          dc.classList.add("active");
        }
      });
    });
  });

  // Drawer reset button
  const drawerResetBtn = document.getElementById("btn-drawer-reset");
  if (drawerResetBtn) {
    drawerResetBtn.addEventListener("click", () => {
      const mainReset = document.getElementById("btn-reset-playground");
      if (mainReset) mainReset.click();
      if (drawerSwitchItalic) drawerSwitchItalic.checked = false;
      drawerAlignBtns.forEach(b => b.classList.toggle("active", b.dataset.align === "left"));
      drawerTransBtns.forEach(b => b.classList.toggle("active", b.dataset.transform === "none"));
      drawerThemeCircles.forEach((c, i) => c.classList.toggle("active", i === 0));
      syncDrawerControls();
    });
  }

  // --- SPECIMEN SHOWCASE TABS BINDINGS ---
  const specimenTabs = document.querySelectorAll("#specimen-nav-tabs .specimen-nav-tab");
  const specimenPanes = document.querySelectorAll(".specimen-cards-stack .specimen-pane");
  specimenTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      specimenTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const targetId = tab.dataset.target;
      specimenPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add("active");
          pane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          pane.classList.remove("active");
        }
      });
    });
  });

  // --- METADATA ACCORDION BINDINGS ---
  const accordionHeaders = document.querySelectorAll(".mobile-specs-accordion .specs-accordion-header");
  accordionHeaders.forEach(hdr => {
    hdr.addEventListener("click", () => {
      const item = hdr.closest(".specs-accordion-item");
      const isOpen = item.classList.contains("open");
      // Optional: close other items or allow multi-expand
      item.classList.toggle("open", !isOpen);
      hdr.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // --- MOBILE HEADER SAVE / VAULT BUTTON BINDING ---
  const mobileVaultNavBtn = document.getElementById("mobile-vault-nav-btn");
  if (mobileVaultNavBtn) {
    if (window.favoritesSet && window.favoritesSet.has(font.id)) {
      mobileVaultNavBtn.classList.add("active");
    }
    mobileVaultNavBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleFavoriteState(font.id, mobileVaultNavBtn);
      const isFav = window.favoritesSet && window.favoritesSet.has(font.id);
      if (floatingFavBtn) floatingFavBtn.classList.toggle("active", isFav);
      const heroFavBtn = document.getElementById("btn-hero-favorite");
      if (heroFavBtn) heroFavBtn.classList.toggle("active", isFav);
      if (window.showToast) {
        window.showToast(isFav ? `${font.name} saved to My Vault!` : `${font.name} removed from My Vault`, isFav ? "success" : "info");
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
    const moodMatches = fontsData.filter(f => f.id !== font.id && f.mood === font.mood);
    const otherMatches = fontsData.filter(f => f.id !== font.id && f.mood !== font.mood);
    const relatedFonts = [...moodMatches, ...otherMatches].slice(0, 8);
    
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
          if (window.showToast) {
            window.showToast("This font is external or does not have a direct file download path.", "error");
          } else {
            alert("This font is external or does not have a direct file download path.");
          }
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

        const isAdobeFont = font.provider === 'adobe' || url.includes('fonts.adobe.com');
        const isFontshare = font.provider === 'fontshare' || url.includes('fontshare.com');

        btn.textContent = '↓ Fetching...';
        btn.disabled = true;

        if (window.showToast) {
          window.showToast(`Preparing ${font.name} (${ext.toUpperCase()})...`, "info", 2000);
        }

        try {
          let proxyUrl;
          if (isGoogleFont || isAdobeFont || isFontshare) {
            proxyUrl = `/api/download?family=${encodeURIComponent(font.name)}&filename=${encodeURIComponent(safeFilename)}`;
          } else {
            proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(safeFilename)}`;
          }

          const resp = await fetch(proxyUrl);
          if (resp.ok) {
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

            if (window.showToast) {
              window.showToast(`Successfully downloaded ${font.name}!`, "success");
            }
          } else {
            if (isAdobeFont) {
              window.open(url, '_blank');
              btn.textContent = 'Activate via CC';
              btn.disabled = false;
              if (window.showToast) {
                window.showToast(`Opening Adobe Fonts activation page for ${font.name}...`, "info", 4000);
              }
            } else if (isFontshare) {
              window.open(url, '_blank');
              btn.textContent = 'Download at Fontshare';
              btn.disabled = false;
              if (window.showToast) {
                window.showToast(`Opening Fontshare download page for ${font.name}...`, "info", 4000);
              }
            } else {
              throw new Error(`${resp.status}`);
            }
          }
        } catch (err) {
          console.warn('[FontVault] Detail page download failed:', err);
          btn.textContent = 'Failed';
          btn.disabled = false;
          if (window.showToast) {
            window.showToast(`Download failed for ${font.name}. Please try again.`, "error");
          }
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
      const favBtn = document.getElementById("btn-hero-favorite") || document.getElementById("floating-btn-favorite");
      if (favBtn) {
        if (favBtn.id === "floating-btn-favorite") {
          // Trigger click if it's the floating button
          favBtn.click();
        } else {
          toggleFavoriteState(font.id, favBtn);
        }
      }
    }

    // Download font on "d"
    if (key === "d" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const dlBtn = document.getElementById("btn-hero-download") || document.getElementById("floating-btn-download");
      if (dlBtn) dlBtn.click();
    }

    // Copy CSS rules on "c"
    if (key === "c" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const cssBtn = document.getElementById("btn-hero-copy-css") || document.getElementById("floating-btn-copy-css");
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
  if (font.provider === 'google' || font.provider === 'fontshare' || font.provider === 'adobe') {
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