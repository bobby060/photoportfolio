import { listAlbums } from '../graphql/queries';
import { generateClient } from 'aws-amplify/api';


const client = generateClient({
    authMode: 'apiKey'
});
// Gets list of current albums from the server
export default async function fetchAlbums() {
    const apiData = await client.graphql({
        query: listAlbums,
    });

    const albumsFromAPI = apiData.data.listAlbums.items;
    const sortedAlbums = albumsFromAPI.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return bDate - aDate;
    });

    return sortedAlbums;
} 
