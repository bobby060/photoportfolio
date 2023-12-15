import {listAlbums, getImages} from '../graphql/queries';
import { API, Storage, Auth } from 'aws-amplify';

// Gets list of current albums from the server
export default async function fetchAlbums() {
    const apiData = await API.graphql({ 
    query: listAlbums,
    authMode: 'API_KEY',
    });

    const albumsFromAPI = apiData.data.listAlbums.items;
    const sortedAlbums = albumsFromAPI.sort((a, b) =>{
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return bDate - aDate;
    });

    return sortedAlbums;
  } 
