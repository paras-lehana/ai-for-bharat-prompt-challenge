import { APP_VERSION } from '../version';

/**
 * Appends the application version to a URL as a query parameter
 * to force the browser to fetch the latest version and bypass cache.
 * @param {string} url - The URL or path to bust cache for
 * @returns {string} The versioned URL
 */
export const bustCache = (url) => {
    if (!url) return url;
    
    // Only apply to local assets or relative paths
    if (url.startsWith('http') && !url.includes(window.location.hostname)) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${APP_VERSION}`;
};
