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
const APP_VERSION = '4.4';

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APP_VERSION };
}
