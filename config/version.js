/**
 * Multilingual Mandi - Application Version
 * 
 * Instructions:
 * - Increment X (Major) for major features or breaking changes.
 * - Increment Y (Minor) for bug fixes and small improvements.
 * 
 * This constant is used as the single source of truth for versioning
 * and is also used for CSS/JS cache busting.
 */
const APP_VERSION = '4.7';

// ES6 export for frontend
export { APP_VERSION };

// CommonJS export for backend (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APP_VERSION };
}
