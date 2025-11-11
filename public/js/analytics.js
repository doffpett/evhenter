/**
 * Vercel Analytics Integration
 * Tracks page views and Web Vitals automatically
 *
 * This script injects the Vercel Analytics library and provides
 * helper functions for tracking custom events.
 */

(function() {
  'use strict';

  // Inject Vercel Analytics script
  const script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.defer = true;
  document.head.appendChild(script);

  // Wait for analytics to load
  script.onload = function() {
    console.log('📊 Vercel Analytics loaded');

    // Make analytics available globally
    window.evHenterAnalytics = {
      /**
       * Track custom event
       * @param {string} eventName - Name of the event
       * @param {object} properties - Event properties
       */
      trackEvent: function(eventName, properties = {}) {
        if (window.va) {
          window.va('event', eventName, properties);
          console.log('📊 Event tracked:', eventName, properties);
        }
      },

      /**
       * Track page view (for SPA navigation)
       * @param {string} path - Page path
       */
      trackPageView: function(path) {
        if (window.va) {
          window.va('pageview', { path });
          console.log('📊 Page view tracked:', path);
        }
      }
    };
  };

  // Track initial page load
  window.addEventListener('load', function() {
    console.log('📊 Vercel Analytics: Page loaded');
  });
})();
