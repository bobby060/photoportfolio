import {listAlbums, getImages} from '../graphql/queries';
import { API, Storage, Auth } from 'aws-amplify';
import addURL from './addURL';

export default async function fetchAlbums() {
    console.log('fetching albums')
    const apiData = await API.graphql({ 
    query: listAlbums,
    authMode: 'API_KEY',
    });

    const albumsFromAPI = apiData.data.listAlbums.items;
    // const a = await Promise.all(albumsFromAPI.map(async (album) => {
    //   const data = {
    //     id: album.albumsFeaturedImageId
    //   }
    //   const image = await API.graphql({
    //     query: getImages,
    //     variables: data,
    //     authMode: 'API_KEY'
    //   });
    //   const featuredImage =  await addURL(image.data.getImages);
    //   return { ...album, featuredImage: featuredImage};
    //   }));
    return albumsFromAPI;
  } 
