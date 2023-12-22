import { API } from 'aws-amplify';
import {listAlbums, imagesByAlbumsID, listAlbumTags, getAlbums} from '../graphql/queries';



export async function fetchAlbums() {
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


export async function fetchAlbum(id){
  const data = {
    id: id
  }
  const result = await API.graphql({
    query: getAlbums,
    variables: data,
    authMode:'API_KEY',
  })

  // console.log(result);

  return result.data.getAlbums;
}

export async function fetchAllAlbumTags() {
    const tagsData = await API.graphql({
      query: listAlbumTags,
      authMode:'API_KEY',
    })
    console.log(tagsData.data.listAlbumTags.items);
    return tagsData.data.listAlbumTags.items;
}

export async function fetchPublicAlbumTags() {

}