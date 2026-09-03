// =============================================================
//  FONTVAULT — pairing-engine.js
//  Typography Rules-Based Font Pairing Engine
//  Zero-cost, client-side scoring based on classic typography principles.
// =============================================================

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./curated-pairings'], factory);
  } else if (typeof module === 'object' && module.exports) {
    let curatedList = [];
    try {
      const curated = require('./curated-pairings');
      curatedList = curated.curatedFontPairings || [];
    } catch (e) {
      curatedList = (root && root.curatedFontPairings) || [];
    }
    const engine = factory(curatedList);
    module.exports = engine;
    if (root) root.FontVaultPairing = engine;
  } else {
    root.FontVaultPairing = factory(root.curatedFontPairings || []);
  }
}(typeof self !== 'undefined' ? self : this, function (curatedList) {

  // --- 1. KNOWN TYPOGRAPHIC ATTRIBUTES & CLASSIFICATION ---
  
  // High-contrast serif families (strong thick-thin stroke contrast)
  const HIGH_CONTRAST_FONTS = new Set([
    "playfair display", "dm serif display", "instrument serif", "cormorant garamond",
    "cinzel", "sentient", "boska", "melodrama", "abril fatface", "prata",
    "bodoni moda", "bespoke serif", "gambetta", "zodiak", "recia"
  ]);

  // Low-contrast even-stroke workhorses (grotesque sans, monolinear sans, monospace, slabs)
  const LOW_CONTRAST_FONTS = new Set([
    "inter", "satoshi", "switzer", "general sans", "plus jakarta sans",
    "lato", "poppins", "work sans", "archivo", "barlow", "montserrat",
    "jetbrains mono", "fira code", "public sans", "manrope", "be vietnam pro",
    "supreme", "ranade", "tabular", "technor", "bespoke slab", "aleo"
  ]);

  // Trusted body-text reading workhorses
  const WORKHORSE_BODY_FONTS = new Set([
    "inter", "switzer", "satoshi", "general sans", "lato",
    "plus jakarta sans", "merriweather", "lora", "libre baskerville",
    "work sans", "public sans", "manrope", "alegreya", "outfit"
  ]);

  /**
   * Classify a font object with standardized typography attributes.
   */
  function classifyFont(font) {
    if (!font) return null;

    const nameLower = (font.name || "").toLowerCase();
    const rawStyle = (font.style || "").toLowerCase();
    const rawMood = (font.mood || "").toLowerCase();
    const tags = Array.isArray(font.tags) ? font.tags.map(t => t.toLowerCase()) : [];

    // 1. Category
    let category = "sans-serif";
    if (rawStyle.includes("serif") && !rawStyle.includes("sans")) {
      category = (nameLower.includes("slab") || tags.includes("slab")) ? "slab-serif" : "serif";
    } else if (rawStyle.includes("display") || tags.includes("display")) {
      category = "display";
    } else if (rawStyle.includes("script") || tags.includes("script") || tags.includes("handwriting")) {
      category = "script";
    } else if (rawStyle.includes("monospace") || tags.includes("monospace") || tags.includes("code")) {
      category = "monospace";
    } else {
      category = "sans-serif";
    }

    // 2. Stroke Contrast (high-contrast vs low-contrast)
    let contrast = "low-contrast";
    if (HIGH_CONTRAST_FONTS.has(nameLower)) {
      contrast = "high-contrast";
    } else if (LOW_CONTRAST_FONTS.has(nameLower)) {
      contrast = "low-contrast";
    } else if (category === "serif") {
      contrast = (rawMood === "elegant" || rawMood === "luxury" || rawMood === "editorial") ? "high-contrast" : "low-contrast";
    } else if (category === "display") {
      contrast = (tags.includes("contrast") || rawMood === "bold" || rawMood === "luxury") ? "high-contrast" : "low-contrast";
    } else if (category === "script") {
      contrast = "high-contrast";
    }

    // 3. Normalized Mood
    const mood = font.mood || "Modern";

    // 4. Weight Range
    const stylesCount = font.stylesCount || 1;
    const isVariable = !!font.variants || stylesCount >= 8;
    const canDoHeadline = category === "display" || category === "serif" || stylesCount >= 2 || isVariable;
    const canDoBody = WORKHORSE_BODY_FONTS.has(nameLower) || (category === "sans-serif" && stylesCount >= 2) || (category === "serif" && stylesCount >= 4);

    return {
      name: font.name,
      id: font.id || font.slug || nameLower.replace(/\s+/g, "-"),
      category,
      contrast,
      mood,
      stylesCount,
      isVariable,
      canDoHeadline,
      canDoBody,
      cssFamily: font.cssFamily || `'${font.name}', sans-serif`,
      raw: font
    };
  }

  // --- 2. TYPOGRAPHY RULES ENGINE SCORING ---

  /**
   * Score a pairing of headingFont and bodyFont.
   * Applies foundational typography design principles:
   * - Prefer serif + sans-serif combinations over same-category pairings
   * - Prefer differing contrast levels (one high-contrast, one low-contrast)
   * - Never recommend two display/script fonts together
   * - Boost score if mood tags match or complement each other
   * - Boost score heavily if the pair exists in the curated pairing dataset
   */
  function scorePairing(headingFontRaw, bodyFontRaw, context = {}) {
    const heading = classifyFont(headingFontRaw);
    const body = classifyFont(bodyFontRaw);

    if (!heading || !body) {
      return { score: 0, matchPercentage: 0, matchedRules: [] };
    }

    // Hard Rule 1: Cannot pair a font with itself
    if (heading.name.toLowerCase() === body.name.toLowerCase()) {
      return { score: -1000, matchPercentage: 0, matchedRules: ["same_font_disqualified"] };
    }

    // Hard Rule 2: NEVER recommend two display or two script fonts together
    const isHeadingDecorative = heading.category === "display" || heading.category === "script";
    const isBodyDecorative = body.category === "display" || body.category === "script";
    if (isHeadingDecorative && isBodyDecorative) {
      return { score: -999, matchPercentage: 0, matchedRules: ["clashing_display_disqualified"] };
    }

    // Hard Rule 3: Body font must be readable (not script or ornamental dingbat)
    if (body.category === "script" || body.raw.mood === "Loud") {
      return { score: -800, matchPercentage: 0, matchedRules: ["unreadable_body_disqualified"] };
    }

    let score = 50; // Neutral baseline
    const matchedRules = [];

    // ── Rule A: Category Complementarity ─────────────────────
    const isSerifHeading = heading.category === "serif" || heading.category === "slab-serif";
    const isSansHeading = heading.category === "sans-serif";
    const isSerifBody = body.category === "serif" || body.category === "slab-serif";
    const isSansBody = body.category === "sans-serif";

    if (isSerifHeading && isSansBody) {
      // Classic: Serif Heading + Sans Body
      score += 42;
      matchedRules.push("serif_sans_harmony");
    } else if (isSansHeading && isSerifBody) {
      // Modern Inversion: Sans Heading + Serif Body
      score += 38;
      matchedRules.push("sans_serif_harmony");
    } else if (heading.category === "display" && (isSansBody || isSerifBody)) {
      // Bold Display Heading + Clean Body
      score += 35;
      matchedRules.push("display_readable_harmony");
    } else if (heading.category === "monospace" && isSansBody) {
      // Tech Monospace Heading + Clean Sans Body
      score += 30;
      matchedRules.push("mono_sans_harmony");
    } else if (heading.category === body.category) {
      // Same category penalty (Serif+Serif or Sans+Sans easily clash)
      score -= 15;
    }

    // ── Rule B: Stroke Contrast Complementarity ───────────────
    if (heading.contrast !== body.contrast) {
      // One high-contrast + one low-contrast provides visual balance
      score += 26;
      matchedRules.push("stroke_contrast_balance");
    } else if (heading.contrast === "high-contrast" && body.contrast === "high-contrast") {
      // Two high-contrast typefaces fight for visual dominance
      score -= 20;
    }

    // ── Rule C: Curated Seed Dataset Heavy Boost ──────────────
    const hLower = heading.name.toLowerCase();
    const bLower = body.name.toLowerCase();

    const exactCurated = (curatedList || []).find(c => 
      c.heading.toLowerCase() === hLower && c.body.toLowerCase() === bLower
    );
    const reverseCurated = (curatedList || []).find(c => 
      c.heading.toLowerCase() === bLower && c.body.toLowerCase() === hLower
    );

    if (exactCurated) {
      score += 65;
      matchedRules.push("curated_classic");
    } else if (reverseCurated) {
      score += 40;
      matchedRules.push("curated_variant");
    }

    // ── Rule D: Mood & Vibe Alignment ────────────────────────
    const hMood = (heading.mood || "").toLowerCase();
    const bMood = (body.mood || "").toLowerCase();

    if (hMood && bMood && hMood === bMood) {
      score += 20;
      matchedRules.push("mood_alignment");
    } else if (
      (hMood === "editorial" && bMood === "minimal") ||
      (hMood === "luxury" && bMood === "minimal") ||
      (hMood === "vintage" && bMood === "artisan") ||
      (hMood === "bold" && bMood === "modern") ||
      (hMood === "playful" && bMood === "modern")
    ) {
      score += 18;
      matchedRules.push("mood_complementary");
    }

    // ── Rule E: Body Reading Workhorse Bonus ─────────────────
    if (WORKHORSE_BODY_FONTS.has(bLower)) {
      score += 16;
      matchedRules.push("body_legibility");
    }

    // ── Rule F: Contextual Query Match ───────────────────────
    if (context.prompt) {
      const q = context.prompt.toLowerCase();
      const hMatchesPrompt = q.includes(hMood) || heading.raw.tags?.some(t => q.includes(t.toLowerCase()));
      const bMatchesPrompt = q.includes(bMood) || body.raw.tags?.some(t => q.includes(t.toLowerCase()));
      if (hMatchesPrompt) score += 12;
      if (bMatchesPrompt) score += 10;
    }
    if (context.tone && (hMood === context.tone.toLowerCase() || bMood === context.tone.toLowerCase())) {
      score += 15;
    }

    // Calculate match percentage scaled between 78% and 99%
    const matchPercentage = Math.min(99, Math.max(76, Math.round(72 + (score / 170) * 27)));

    return {
      score,
      matchPercentage,
      matchedRules,
      heading,
      body,
      isCurated: !!exactCurated
    };
  }

  // --- 3. DYNAMIC EXPLANATION GENERATOR ---
  
  /**
   * Generates natural human-like typography rationale from matched design rules.
   * Structured cleanly so a future free-tier LLM API call can be swapped in as a drop-in replacement.
   */
  function generateExplanation(matchedRules, heading, body) {
    const hName = heading.name || "The heading";
    const bName = body.name || "the body font";
    const moodName = (heading.mood || body.mood || "modern").toLowerCase();

    // Template sets keyed to typographic rules
    const templates = {
      curated_classic: [
        `A time-honored typography standard celebrated for seamless editorial hierarchy and refined balance.`,
        `A classic pairing proven across premier publications, combining high visual authority with effortless reading.`,
        `One of typography's most dependable combinations, delivering natural structural contrast without visual noise.`
      ],
      curated_variant: [
        `An inverted take on a classic typography pairing, pairing ${hName} with ${bName} for a fresh yet disciplined layout.`
      ],
      serif_sans_harmony: [
        `The architectural serif structure of ${hName} creates an immediate visual anchor, balanced by the clean modern geometry of ${bName}.`,
        `Pairing ${hName}'s expressive serif detailing with ${bName}'s neutral sans-serif body provides textbook typographic hierarchy.`,
        `${hName}'s high-character serifs command headlines while ${bName} provides crisp, fatigue-free reading across paragraphs.`
      ],
      sans_serif_harmony: [
        `${hName}'s confident, modern sans-serif headline pairs seamlessly with ${bName}'s warm, comfortable book-reading serifs.`,
        `A modern typographic inversion: clean geometric headlines above ${bName}'s literary serif reading flow.`
      ],
      display_readable_harmony: [
        `${hName}'s high-impact display character commands the layout, while ${bName} guarantees effortless reading comfort.`,
        `A dramatic display headline grounded by ${bName}'s disciplined text rendering creates maximum impact without sacrificing legibility.`
      ],
      mono_sans_harmony: [
        `Technical monospace personality in ${hName} meets the versatile readability of ${bName} for modern digital documentation.`
      ],
      stroke_contrast_balance: [
        `The expressive stroke variation in ${hName} is grounded by the uniform, low-contrast letterforms of ${bName}.`,
        `Dynamic thick-to-thin contrast in the headline balances cleanly against the even mono-weight rhythm of the body text.`
      ],
      mood_alignment: [
        `Both typefaces share an authentic ${moodName} sensibility, projecting a cohesive and confident brand voice.`,
        `A shared ${moodName} tone unifies headline and paragraph into a harmonious visual identity.`
      ],
      mood_complementary: [
        `The expressive mood of ${hName} complements ${bName}'s understated structure, striking a balance between personality and utility.`
      ],
      body_legibility: [
        `${bName} acts as a rock-solid structural anchor, ensuring crisp text rendering across all screen sizes.`
      ]
    };

    // Helper to pick a deterministic or varied item
    const pick = (arr, seed = 0) => arr[Math.abs(seed) % arr.length];
    const hash = (hName.length * 13 + bName.length * 7);

    // Build rationale parts based on matched rules
    const parts = [];

    if (matchedRules.includes("curated_classic")) {
      parts.push(pick(templates.curated_classic, hash));
    } else if (matchedRules.includes("serif_sans_harmony")) {
      parts.push(pick(templates.serif_sans_harmony, hash));
    } else if (matchedRules.includes("sans_serif_harmony")) {
      parts.push(pick(templates.sans_serif_harmony, hash));
    } else if (matchedRules.includes("display_readable_harmony")) {
      parts.push(pick(templates.display_readable_harmony, hash));
    } else if (matchedRules.includes("mono_sans_harmony")) {
      parts.push(pick(templates.mono_sans_harmony, hash));
    }

    if (matchedRules.includes("stroke_contrast_balance") && parts.length < 2) {
      parts.push(pick(templates.stroke_contrast_balance, hash + 1));
    } else if (matchedRules.includes("mood_alignment") && parts.length < 2) {
      parts.push(pick(templates.mood_alignment, hash + 2));
    } else if (matchedRules.includes("body_legibility") && parts.length === 0) {
      parts.push(pick(templates.body_legibility, hash + 3));
    }

    if (parts.length === 0) {
      return `${hName} and ${bName} provide a balanced typographic hierarchy with clear distinction between titles and text.`;
    }

    return parts.join(" ");
  }

  // --- 4. PUBLIC RECOMMENDATION API ---

  /**
   * Recommend the top 3-5 pairings for a specific base font.
   * @param {string|object} baseFontInput - Name, ID, or Font object
   * @param {Array} catalog - Full fonts catalog array (fontsData)
   * @param {string} role - "heading" (find complementary body) or "body" (find complementary heading)
   * @param {number} limit - Maximum number of candidates to return (default: 4)
   */
  function recommendPairingsForFont(baseFontInput, catalog, role = "heading", limit = 4) {
    if (!catalog || catalog.length === 0) return [];

    let baseFont = null;
    if (typeof baseFontInput === "string") {
      const q = baseFontInput.toLowerCase().trim();
      baseFont = catalog.find(f => f.name.toLowerCase() === q || f.id === q);
    } else if (typeof baseFontInput === "object") {
      baseFont = baseFontInput;
    }

    if (!baseFont) return [];

    const candidates = catalog.filter(f => f.name.toLowerCase() !== baseFont.name.toLowerCase());
    const scored = [];

    candidates.forEach(candidate => {
      const heading = role === "heading" ? baseFont : candidate;
      const body = role === "heading" ? candidate : baseFont;

      const res = scorePairing(heading, body);
      if (res.score > 20) { // filter out completely disqualified pairings
        const explanation = generateExplanation(res.matchedRules, res.heading, res.body);
        scored.push({
          header: heading.name,
          body: body.name,
          pairName: `${heading.name} + ${body.name}`,
          matchScore: res.matchPercentage,
          reason: explanation,
          matchedRules: res.matchedRules,
          headingFont: heading,
          bodyFont: body,
          rawScore: res.score,
          strengthMetrics: {
            elegance: Math.min(98, Math.max(70, res.matchPercentage - 2 + (heading.category === 'serif' ? 6 : 0))),
            readability: Math.min(99, Math.max(75, res.matchPercentage + (WORKHORSE_BODY_FONTS.has(body.name.toLowerCase()) ? 6 : -4))),
            contrast: Math.min(98, Math.max(65, res.matchedRules.includes('stroke_contrast_balance') ? 92 : 78)),
            uniqueness: Math.min(96, Math.max(60, heading.category === 'display' ? 94 : 76)),
            versatility: Math.min(98, Math.max(70, res.matchedRules.includes('serif_sans_harmony') ? 94 : 80))
          }
        });
      }
    });

    scored.sort((a, b) => b.rawScore - a.rawScore);
    return scored.slice(0, limit);
  }

  /**
   * Recommend font pairings based on project type, mood, or prompt.
   */
  function recommendPairingsForProject(catalog, context = {}, limit = 4) {
    if (!catalog || catalog.length === 0) return [];

    // Check curated pairings that match context first
    const results = [];
    const promptLower = (context.prompt || "").toLowerCase();
    const toneLower = (context.tone || "").toLowerCase();

    // 1. Evaluate all curated combinations against catalog
    (curatedList || []).forEach(curated => {
      const hObj = catalog.find(f => f.name.toLowerCase() === curated.heading.toLowerCase());
      const bObj = catalog.find(f => f.name.toLowerCase() === curated.body.toLowerCase());
      if (hObj && bObj) {
        const res = scorePairing(hObj, bObj, context);
        let boost = 0;
        if (promptLower) {
          curated.tags.forEach(t => {
            if (promptLower.includes(t)) boost += 25;
          });
        }
        if (toneLower && curated.tags.includes(toneLower)) {
          boost += 20;
        }
        results.push({
          header: hObj.name,
          body: bObj.name,
          pairName: `${hObj.name} + ${bObj.name}`,
          matchScore: Math.min(99, res.matchPercentage + (boost > 0 ? 3 : 0)),
          reason: curated.reason || generateExplanation(res.matchedRules, res.heading, res.body),
          matchedRules: res.matchedRules,
          headingFont: res.heading,
          bodyFont: res.body,
          rawScore: res.score + boost,
          tags: curated.tags,
          strengthMetrics: {
            elegance: 92,
            readability: 94,
            contrast: 90,
            uniqueness: 82,
            versatility: 88
          }
        });
      }
    });

    // 2. Also test popular base fonts with rules engine
    const anchorHeadings = ["Playfair Display", "Space Grotesk", "DM Serif Display", "Syne", "Clash Display", "Cinzel", "Sentient", "Bespoke Serif"];
    anchorHeadings.forEach(hName => {
      const hObj = catalog.find(f => f.name.toLowerCase() === hName.toLowerCase());
      if (hObj) {
        const topBodies = recommendPairingsForFont(hObj, catalog, "heading", 2);
        topBodies.forEach(p => {
          if (!results.some(r => r.header === p.header && r.body === p.body)) {
            results.push(p);
          }
        });
      }
    });

    results.sort((a, b) => (b.rawScore || b.matchScore) - (a.rawScore || a.matchScore));
    return results.slice(0, limit);
  }

  return {
    classifyFont,
    scorePairing,
    generateExplanation,
    recommendPairingsForFont,
    recommendPairingsForProject,
    HIGH_CONTRAST_FONTS,
    LOW_CONTRAST_FONTS,
    WORKHORSE_BODY_FONTS
  };
}));
