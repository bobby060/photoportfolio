// Helper that allows you to update all existing items in the database 

import { generateClient } from 'aws-amplify/api';

import { listImages, listAlbums } from '../graphql/queries';
import { updateImages, createAlbumTags, createUrl, updateAlbums } from '../graphql/mutations';
import { urlhelperEncode } from './urlhelper';
const client = generateClient({
    authMode: 'apiKey'
});

const userGroupClient = generateClient({
    authMode: 'userPool'
});


const getMeta = async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    return [img.naturalHeight, img.naturalWidth];
};

async function upgradeImage(img) {
    const url = `${img.id}-${img.filename}`
    console.log(`upgrading image ${img.filename}`)

    // Get the image and update height/width
    const dims = await getMeta(`https://d2brh14yl9j2nl.cloudfront.net/public/${url}`);

    const data = {
        id: img.id,
        url: url,
        height: dims[0],
        width: dims[1]
    };
    const response = await client.graphql({
        query: updateImages,
        variables: { input: data },
    });

    if (response) {
        console.log(response);
        console.log(`upgraded ${img.filename}`)
    }

}

// Loops through all images in groups of ten and applies upgrade function
export async function upgradeDB() {

    var next = null;

    // Get initial 1-
    const res = await client.graphql({
        query: listImages,
        variables: {
            limit: 10,
        },
        authMode: 'API_KEY',
    });

    next = res.data.listImages.nextToken;

    await Promise.all(res.data.listImages.items.map((image) => upgradeImage(image)));

    while (next) {
        const res = await client.graphql({
            query: listImages,
            variables: {
                limit: 10,
                nextToken: next
            },
            authMode: 'API_KEY',
        });

        next = res.data.listImages.nextToken;

        await Promise.all(res.data.listImages.items.map((image) => upgradeImage(image)));
    };

    console.log('all images upgraded')

}

async function upgradeAlbum(album) {
    const updatedAlbum = { id: album.id, type: 'Album' };
    console.log(album);

    const response = await userGroupClient.graphql({
        query: updateAlbums,
        variables: { input: updatedAlbum },
    });

    if (response) {
        console.log(response);
        console.log(`upgraded ${album.id}`)
    }
}


export async function upgradeAlbums() {
    var next = null;

    const res = await client.graphql({
        query: listAlbums,
        variables: {
            limit: 10,
        },
    })

    next = res.data.listAlbums.nextToken;

    await Promise.all(res.data.listAlbums.items.map((album) => upgradeAlbum(album)));

    while (next) {
        const res = await client.graphql({
            query: listAlbums,
            variables: {
                limit: 10,
                nextToken: next
            },
        })

        next = res.data.listAlbums.nextToken;

        await Promise.all(res.data.listAlbums.items.map((album) => upgradeAlbum(album)));

    }

    console.log('all albums upgraded');


}



export async function createDefaultTags() {
    const data = {
        title: 'featured',
        privacy: 'protected',
    };
    const response = await client.graphql({
        query: createAlbumTags,
        variables: { input: data },
    });
    console.log('created featured tag')
    const data2 = {
        title: 'latest',
        privacy: 'protected',
    };
    const response2 = await client.graphql({
        query: createAlbumTags,
        variables: { input: data2 },
    });

    console.log('created latest tag');
}


async function newUrl(album) {
    const url = urlhelperEncode(album);

    const data = {
        id: url,
        urlAlbumId: album.id
    }
    try {
        const res = await userGroupClient.graphql({
            query: createUrl,
            variables: { input: data }
        });

        console.log('created url for album ', url);

    } catch (error) {
        console.log('failed to create url for album', url, error);
    }
}

export async function createUrls() {
    const apiData = await client.graphql({
        query: listAlbums,
    });

    const albumsFromAPI = apiData.data.listAlbums.items;
    await Promise.all(albumsFromAPI.map((album) => newUrl(album)));
}