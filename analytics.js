// analytics.js
// Production-Ready Analytics Event Tracking & Monitoring Setup for FontVault

(function() {
  // Google Analytics 4 ID Placeholder
  const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; 

  // Load GA4 script tag dynamically
  function loadGoogleAnalytics() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log("[Analytics] Dev Mode: Skipping Google Analytics loading.");
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      cookie_flags: 'max-age=7200;secure;samesite=none'
    });
    console.log("[Analytics] Google Analytics loaded successfully.");
  }

  // Load Microsoft Clarity dynamically
  function loadClarity() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log("[Analytics] Dev Mode: Skipping Microsoft Clarity loading.");
      return;
    }
    const CLARITY_PROJECT_ID = "clarity_placeholder_id";
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script",CLARITY_PROJECT_ID);
    console.log("[Analytics] Microsoft Clarity loaded successfully.");
  }

  // General tracking wrapper
  function trackEvent(eventName, params = {}) {
    console.log(`[Analytics] Track Event: ${eventName}`, params);
    
    // GA4 Tracking
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
    
    // Microsoft Clarity custom event
    if (typeof window.clarity === 'function') {
      window.clarity("event", eventName, params);
    }

    // Vercel Analytics custom events (injected at runtime on Vercel deployments)
    if (window.va && typeof window.va === 'function') {
      window.va('event', { name: eventName, data: params });
    }
  }

  // Exposed Event Trackers
  window.FontVaultAnalytics = {
    trackSearch: function(query, resultsCount) {
      trackEvent("search", { search_term: query, results_count: resultsCount });
    },
    trackFontPreview: function(fontName, source) {
      trackEvent("font_preview", { font_name: fontName, preview_source: source });
    },
    trackDownload: function(fontName, format) {
      trackEvent("font_download", { font_name: fontName, file_format: format });
    },
    trackFavorite: function(fontName, isAdded) {
      trackEvent("font_favorite", { font_name: fontName, action: isAdded ? "add" : "remove" });
    },
    trackAISearch: function(prompt, category) {
      trackEvent("ai_search", { ai_prompt: prompt, ai_category: category });
    },
    trackCollectionView: function(collectionName) {
      trackEvent("collection_view", { collection_name: collectionName });
    },
    trackBlogRead: function(postSlug) {
      trackEvent("blog_read", { post_slug: postSlug });
    },
    trackThemeChange: function(isDark) {
      trackEvent("theme_change", { theme: isDark ? "dark" : "light" });
    }
  };

  // Load trackers on startup
  document.addEventListener("DOMContentLoaded", () => {
    loadGoogleAnalytics();
    loadClarity();
  });
})();
