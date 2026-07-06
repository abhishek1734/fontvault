// seo.js
// Production-Ready SEO System for FontVault (Vanilla Static implementation)

(function() {
  const CANONICAL_HOST = "https://fontvault.vercel.app";

  // Helper to parse page types
  function detectPageContext() {
    const urlParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    let pageType = "home";
    let identifier = null;

    // Detect path-based routing (rewritten by vercel.json) or query parameters
    if (path.startsWith("/fonts/") || path.includes("font.html")) {
      pageType = "font";
      identifier = urlParams.get("id") || path.split("/fonts/")[1];
    } else if (path.startsWith("/category/") || (path.includes("index.html") && urlParams.get("category"))) {
      pageType = "category";
      identifier = urlParams.get("category") || path.split("/category/")[1];
    } else if (path.startsWith("/collections/") || path.includes("collections.html")) {
      pageType = "collection";
      identifier = urlParams.get("collection") || path.split("/collections/")[1];
    } else if (path.startsWith("/blog/") || path.includes("blog-post.html")) {
      pageType = "blog-post";
      identifier = urlParams.get("post") || path.split("/blog/")[1];
    } else if (path === "/blog" || path.includes("blog.html")) {
      pageType = "blog";
    } else if (path === "/ai/font-pair-generator" || path.includes("font-pairing.html")) {
      pageType = "ai-pair";
    } else if (path === "/ai/font-finder") {
      pageType = "ai-finder";
    }

    return { pageType, identifier };
  }

  // Inject JSON-LD Schema
  function injectSchema(schemaObj, id) {
    let scriptEl = document.getElementById(id || 'seo-schema');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = id || 'seo-schema';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaObj, null, 2);
  }

  // Preconnect links for performance optimization
  function addPreconnectHeaders() {
    const domains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://alvarlzjtdmkvbxehppt.supabase.co"
    ];
    domains.forEach(d => {
      if (!document.querySelector(`link[href="${d}"][rel="preconnect"]`)) {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = d;
        if (d.includes("gstatic")) link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }
    });
  }

  // Generate dynamic breadcrumb HTML
  function renderBreadcrumbs(crumbs) {
    if (!crumbs || crumbs.length === 0) return '';
    let html = `<nav aria-label="Breadcrumb" class="seo-breadcrumbs animate-fade-in">`;
    html += `<ol itemscope itemtype="https://schema.org/BreadcrumbList">`;
    
    crumbs.forEach((c, idx) => {
      const isLast = idx === crumbs.length - 1;
      html += `
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" class="${isLast ? 'active' : ''}">
          <a itemprop="item" href="${c.url}" ${isLast ? 'aria-current="page" onclick="return false;"' : ''}>
            <span itemprop="name">${c.name}</span>
          </a>
          <meta itemprop="position" content="${idx + 1}" />
          ${!isLast ? '<span class="sep">/</span>' : ''}
        </li>`;
    });

    html += `</ol></nav>`;
    return html;
  }

  // Update Dynamic SEO Elements
  function updateMetadata(title, description, canonicalUrl, pageType, image) {
    document.title = title;

    // Set Theme Color
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      document.head.appendChild(themeColor);
    }
    // Match FontVault dark/light design token colors
    const isDark = localStorage.getItem("fontvault-dark") === "1";
    themeColor.setAttribute('content', isDark ? '#0B0B0B' : '#F5F2E8');

    // Robots meta tag
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    if (pageType === "admin") {
      robots.setAttribute('content', 'noindex, nofollow');
    } else {
      robots.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Open Graph
    const ogTags = {
      "og:type": pageType === "blog-post" ? "article" : "website",
      "og:url": canonicalUrl,
      "og:title": title,
      "og:description": description,
      "og:image": image || `${CANONICAL_HOST}/assets/branding.png`,
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:site_name": "FontVault"
    };

    for (let property in ogTags) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', ogTags[property]);
    }

    // Twitter Card
    const twitterTags = {
      "twitter:card": "summary_large_image",
      "twitter:url": canonicalUrl,
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": image || `${CANONICAL_HOST}/assets/branding.png`
    };

    for (let name in twitterTags) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', twitterTags[name]);
    }
  }

  // Load and apply SEO configuration
  function initSEO() {
    addPreconnectHeaders();

    const { pageType, identifier } = detectPageContext();

    if (pageType === "home") {
      const title = "FontVault — Discover, Preview & Pair Fonts with AI";
      const desc = "Explore thousands of premium and free fonts, AI-powered font pairing studio, typography collections, and designer resources.";
      const canonical = CANONICAL_HOST + "/";
      
      updateMetadata(title, desc, canonical, pageType);

      // Homepage schemas
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": CANONICAL_HOST,
        "name": "FontVault",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${CANONICAL_HOST}/index.html?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };

      const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "url": CANONICAL_HOST,
        "logo": `${CANONICAL_HOST}/favicon.png`,
        "name": "FontVault",
        "sameAs": [
          "https://twitter.com/fontvault",
          "https://github.com/abhishek1734/fontvault"
        ]
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is FontVault?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "FontVault is a curated typography platform that allows designers to explore, test, and pair premium and free typefaces inside real-world design mockups."
            }
          },
          {
            "@type": "Question",
            "name": "How does the AI Font Pairing Studio work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The AI Font Pairing Studio analyzes the design parameters, tone, and style tags of your project description using Gemini AI to recommend harmonious pairing combinations."
            }
          },
          {
            "@type": "Question",
            "name": "Are the fonts on FontVault free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We feature a mix of open-source, free for personal use, and commercial typefaces. Each font detail page lists the designer, foundry, and license type."
            }
          }
        ]
      };

      injectSchema(websiteSchema, "website-schema");
      injectSchema(orgSchema, "org-schema");
      injectSchema(faqSchema, "faq-schema");

    } else if (pageType === "ai-pair") {
      const title = "AI Font Pair Generator | FontVault";
      const desc = "Intelligent AI typography assistant that recommends and visualizes premium font pairings for your branding and design projects.";
      const canonical = `${CANONICAL_HOST}/ai/font-pair-generator`;

      updateMetadata(title, desc, canonical, pageType);

      // AI Tool Schema
      const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AI Font Pairing Studio",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "description": "An intelligent AI typography system recommending premium designer font pairings."
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does the AI Font Pair Generator work?",
            "value": "It uses Gemini AI models to analyze the visual traits and personality parameters of your brand prompt and returns harmonious combinations."
          },
          {
            "@type": "Question",
            "name": "Can I test my custom content in the pairings?",
            "value": "Yes, every suggested pair can be edited live inside the pairing studio mockups."
          }
        ]
      };

      injectSchema(softwareSchema, "software-schema");
      injectSchema(faqSchema, "faq-schema");

      // Inject Breadcrumbs
      const crumbs = [
        { name: "Home", url: "/" },
        { name: "AI Tools", url: "/ai/font-finder" },
        { name: "AI Font Pairing", url: "/ai/font-pair-generator" }
      ];
      const crumbsHtml = renderBreadcrumbs(crumbs);
      const main = document.querySelector('main');
      if (main && !document.querySelector('.seo-breadcrumbs')) {
        main.insertAdjacentHTML('afterbegin', crumbsHtml);
      }
    } else if (pageType === "blog") {
      const title = "Typography & Design Blog | FontVault";
      const desc = "Read tutorials, expert guides, and research articles on modern typography, font pairings, and UI/UX design.";
      const canonical = `${CANONICAL_HOST}/blog`;
      updateMetadata(title, desc, canonical, pageType);
    }
  }

  // Expose function globally
  window.FontVaultSEO = {
    initSEO,
    renderBreadcrumbs,
    injectSchema,
    updateMetadata,
    detectPageContext,
    CANONICAL_HOST
  };

  document.addEventListener("DOMContentLoaded", initSEO);
})();
