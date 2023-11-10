import { API } from 'aws-amplify';
import {listAlbums, imagesByAlbumsID} from '../graphql/queries';
import addURL from '../helpers/addURL';


export async function fetchAlbums() {
    const apiData = await API.graphql({ 
    query: listAlbums,
    authMode: 'API_KEY',
    });

    const albumsFromAPI = apiData.data.listAlbums.items;
    console.log(albumsFromAPI);
    return albumsFromAPI;
  } 

 export async function fetchImages(id){
  // Pulls the image objects associated with the selected album
    const imgs_wrapper = await API.graphql({
      query: imagesByAlbumsID,
       variables: { albumsID: id},
       authMode: 'API_KEY',
      });

    const imgs = imgs_wrapper.data.imagesByAlbumsID.items;
    // Waits until all images have been requested from storage
    const new_imgs = await Promise.all(
      imgs.map((img) => (addURL(img)))
    );
    // Updates images to the new image objects that have urls
    for (let i = 0 ; i < new_imgs.length; i++){
      new_imgs[i].index = i;
    }
    console.log(new_imgs);
	return new_imgs;
   }