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
    console.log(albumsFromAPI);
    const sortedAlbums = albumsFromAPI.sort((a, b) =>{
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return bDate - aDate;
    });
    console.log('sorted ', sortedAlbums);

    return sortedAlbums;
  } 
