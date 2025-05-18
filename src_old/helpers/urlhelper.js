/** urlhelper.js
 * 
 * Handles the conversion of useful human readable album URLs to album IDs and back
 * 
 */

// Takes an album and generates it's url based the id and the title
import { generateClient } from 'aws-amplify/api';
import { getUrl } from '../graphql/customQueries';


const client = generateClient({
    authMode: 'apiKey'
});

/**
 * @brief Given an album, returns it's url
 * 
 * Format for url is the Album name, split with '-', followed
 * by the last two digits of the album id
 * 
 * Example: title "Killer Whales" with an id of "e4ef3321"
 * would have a url of "killer-whales-21" 
 * 
 * @param {Object} album Album object 
 * @returns {String} url
 */
export function urlhelperEncode(album) {
    const ending = album.id.slice(-2);
    const new_name = album.title.toLowerCase().replace(' ', '-');
    const url = new_name.concat("-", ending);
    return url
}


/**
 * @brief given a url, fetch the album
 * 
 * a Url document is created in the database when the album is created.
 * The url is the key, and the album id is the data field.
 * 
 * getUrl query is designed to return the whole album object as part of a nested query,
 * preventing need to then query again with the album id
 * 
 * @param {*} url 
 * @returns 
 */
export async function getAlbumFromAlbumUrl(url) {

    // Use graphql query to fetch the album associated with url
    const data = {
        id: url
    }
    try {
        const res = await client.graphql({
            query: getUrl,
            variables: data
        })
        // Return album object
        return res.data.getUrl.album;
    } catch (error) {
        Error.throw('Album not found, ', error);
    }
}

/**
 * @brief takes an album and a url and returns true or false
 * 
 * Use: validating if a specific path is the right one for a given album
 * 
 * @deprecated No longer needed with introductino of Url table
 * 
 * @param {Object} album 
 * @param {String} url
 *  
 * @returns True if valid, False if not
 */
export function urlhelperDecode(album, url) {
    const ending = url.slice(-2);
    const name = url.slice(0, -3).replace('-', ' ').replace('%20', ' ');
    if (album.id.slice(-2) === ending && name === album.title.toLowerCase()) return true;
    return false;
}