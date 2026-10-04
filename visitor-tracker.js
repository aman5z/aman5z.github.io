/*
 * visitor-tracker.js
 * ------------------
 * Lightweight, non-blocking visitor logger that reports basic visit
 * details (timestamp, approximate IP-based location, page, referrer,
 * user agent) to a Google Apps Script Web App, which appends/updates
 * rows in a Google Sheet. See visitor-logging/README.md for setup.
 *
 * Privacy: no exact IP address is stored — only the city/region/country
 * resolved from it, plus a random anonymous visitor ID (stored locally
 * in this browser) used solely to tally repeat visits.
 */
(function () {
  'use strict';

  // Replace with your deployed Google Apps Script Web App URL.
  var ENDPOINT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

  if (!ENDPOINT_URL || ENDPOINT_URL.indexOf('YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') !== -1) {
    // Tracker not configured yet — do nothing.
    return;
  }

  function getVisitorId() {
    try {
      var key = 'portfolio-visitor-id';
      var id = localStorage.getItem(key);
      if (!id) {
        id = (window.crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2);
        localStorage.setItem(key, id);
      }
      return id;
    } catch (err) {
      return 'anon';
    }
  }

  function sendBeacon(params) {
    var url = ENDPOINT_URL + '?' + Object.keys(params)
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k] == null ? '' : params[k]); })
      .join('&');

    // Use an image beacon so no CORS preflight/response handling is needed.
    var img = new Image();
    img.src = url;
  }

  function logVisit(geo) {
    sendBeacon({
      visitorId: getVisitorId(),
      city: (geo && geo.city) || '',
      region: (geo && geo.region) || '',
      country: (geo && geo.country_name) || '',
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent
    });
  }

  function init() {
    // Best-effort IP geolocation lookup; falls back gracefully on failure.
    fetch('https://ipapi.co/json/')
      .then(function (res) { return res.json(); })
      .then(function (geo) { logVisit(geo); })
      .catch(function () { logVisit(null); });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
