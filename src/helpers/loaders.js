/** loaders.js
 * 
 * Common loaders that are used multiple times
 */
import { generateClient } from 'aws-amplify/api';

import { listAlbums, listAlbumTags, getAlbums } from '../graphql/queries';


const client = generateClient({
    authMode: 'apiKey'
});

/**
 * @brief lists all albums from newest to oldest
 * 
 * @returns List of albums objects
 */
export async function fetchAlbums() {
    const apiData = await client.graphql({
        query: listAlbums,
    });

    const albumsFromAPI = apiData.data.listAlbums.items;
    const sortedAlbums = albumsFromAPI.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return bDate - aDate;
    });
    // console.log(albumsFromAPI);

    return sortedAlbums;
}

// export async function fetchImages(id){
//  // Pulls the image objects associated with the selected album
//    const imgs_wrapper = await API.graphql({
//      query: imagesByAlbumsID,
//       variables: { albumsID: id},
//       authMode: 'API_KEY',
//      });

//    const imgs = imgs_wrapper.data.imagesByAlbumsID.items;
//    // Waits until all images have been requested from storage

//    // Updates images to the new image objects that have urls
//    for (let i = 0 ; i < new_imgs.length; i++){
//      new_imgs[i].index = i;
//    }
//    console.log(new_imgs);
// 	return new_imgs;
//   }


/**
 * @brief fetch an album by its id
 * 
 * 
 * @param {String} id 
 * @returns {Object} Album
 */
export async function fetchAlbum(id) {
    const data = {
        id: id
    }
    const result = await client.graphql({
        query: getAlbums,
        variables: data,
    })

    // console.log(result);

    return result.data.getAlbums;
}

/**
 * @brief fetch all Tags
 * 
 * Including public and private tags
 * 
 * @returns list of album tags
 */
export async function fetchAllAlbumTags() {
    const tagsData = await client.graphql({
        query: listAlbumTags,
    });
    return tagsData.data.listAlbumTags.items;
}

/**
 * @brief fetches public album tags
 * 
 * Excludes tags that aren't public facing (like 'featured' and 'latest')
 * 
 * @returns list of album tags
 */
export async function fetchPublicAlbumTags() {
    const variables = {
        filter: {
            privacy: {
                eq: 'public'
            }
        }
    }
    const tagsData = await client.graphql({
        query: listAlbumTags,
        variables: variables,
    });
    return tagsData.data.listAlbumTags.items;
}