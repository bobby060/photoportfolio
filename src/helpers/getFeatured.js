import { generateClient } from 'aws-amplify/api';


import { getImages } from '../graphql/queries';

import fetchAlbums from '../helpers/fetchAlbums';
const client = generateClient({
    authMode: 'apiKey'
});


// puts image objects in albums and returns them
export default async function getFeaturedImgs(albums) {

    const newA = (albums.length < 1) ? await fetchAlbums() : albums;

    const a = await Promise.all(newA.map(async (album) => {
        if (!album.albumsFeaturedImageId) return null;
        const data = {
            id: album.albumsFeaturedImageId
        }
        const image = await client.graphql({
            query: getImages,
            variables: data,
        });
        // const featuredImage =  await addURL(image.data.getImages);
        return { ...album, featuredImage: image.data.getImages };
    }));
    return (a.filter(value => value !== null));
}