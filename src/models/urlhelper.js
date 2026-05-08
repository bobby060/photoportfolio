/** urlhelper.js
 *
 * Pure utility functions for converting albums to URL-safe identifiers.
 * Album lookup by URL is handled by AlbumRepository.getAlbumByUrl().
 */

/**
 * @brief Given an album, returns its URL slug
 *
 * Format: album title (lowercased, spaces → hyphens) + last 2 chars of album ID.
 * Example: title "Killer Blue Whales" with id ending "21" → "killer-blue-whales-21"
 *
 * @param {Object} album - Album object with id and title
 * @returns {string} URL slug
 */
export function urlhelperEncode(album) {
    const ending = album.id.slice(-2);
    const new_name = album.title.toLowerCase().replace(/\s+/g, '-');
    return new_name.concat("-", ending);
}

/**
 * @brief Same as urlhelperEncode but percent-encoded for use in URLs
 *
 * @param {Object} album - Album object with id and title
 * @returns {string} URL-encoded slug
 */
export function urlhelperEncodeUrlSafe(album) {
    return encodeURIComponent(urlhelperEncode(album));
}

/**
 * @brief Returns true if the given URL slug matches the album
 * @deprecated No longer needed with introduction of Url table
 *
 * @param {Object} album
 * @param {string} url
 * @returns {boolean}
 */
export function urlhelperDecode(album, url) {
    const ending = url.slice(-2);
    const name = url.slice(0, -3).replace('-', ' ').replace('%20', ' ');
    if (album.id.slice(-2) === ending && name === album.title.toLowerCase()) return true;
    return false;
}
