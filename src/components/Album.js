import React, { useState, useEffect } from 'react';
import {
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBBtn
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import {imagesByAlbumsID, getAlbums} from '../graphql/queries';
import {deleteImages as deleteImageMutation, updateAlbums} from '../graphql/mutations';
import { useAuthenticator } from '@aws-amplify/ui-react';
import PhotoGrid from './PhotoGrid';
import { useOutletContext } from "react-router-dom";
import addURL from '../helpers/addURL';

export default function Album(){
  const [selectedAlbum, setSelectedAlbum, albums, setAlbums] = useOutletContext();

  // for storing images in current album
  const [images, setImages] = useState([]);
  const debug = false;

  const user_item = useAuthenticator((context) => [context.user]);
  const authStatus = useAuthenticator((context) => [context.authStatus]);

  // Initializes images after component render
  useEffect(() => {
    updateAlbum();
  }, []);

  // Loads images associated with album being rendered
 async function updateAlbum(){
  // Pulls the image objects associated with the selected album
    const imgs_wrapper = await API.graphql({
      query: imagesByAlbumsID,
       variables: { albumsID: selectedAlbum.id},
       authMode: 'API_KEY',
      });

    const imgs = imgs_wrapper.data.imagesByAlbumsID.items;
    // Waits until all images have been requested from storage
    const new_imgs = await Promise.all(
      imgs.map( (img) => (addURL(img)))
    );
    console.log(new_imgs);

    if (debug){console.log(`retrieved imgs: ${new_imgs}`)};
    // Updates images to the new image objects that have urls
    for (let i = 0 ; i < new_imgs.length; i++){
      new_imgs[i].index = i;
    }
    setImages(new_imgs);
    if (debug) {console.log(`images set`)};
   }

   // Deletes image object and source image on AWS
  async function deleteImage(image){
    const newImages = images.filter((img) => img.id !== image.id);
    await Storage.remove(`${image.id}-${image.name}`)
    await API.graphql({
      query: deleteImageMutation,
      variables: { input: {id: image.id}},
    });
    console.log(`image with ID ${image.id} is deleted from album`);
    setImages(newImages);
  }

  async function setFeaturedImg(image){ 
    const data = {
      id: selectedAlbum.id,
      albumsFeaturedImageId: image.image.id
    }
    const response = await API.graphql({
      query: updateAlbums,
      variables: { input: data
    },
    })
    const new_album = response.data.updateAlbums

    setSelectedAlbum(new_album);
    const newAlbums = albums.filter((album) => album.id !== new_album.id).push(new_album);
    console.log(newAlbums);
    setAlbums(newAlbums);
   }

  const date = new Date(selectedAlbum.date);
 // Image handler functions

  return(
    <div>
      <MDBRow className='d-flex justify-content-center align-items-center'>
        <MDBCol className='d-flex justify-content-center align-items-center'>
            <h2 className="p-2">{selectedAlbum.title}</h2>
            <div className="vr" style={{ height: '50px' }}></div>
            <h5 className="p-2">{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</h5>
        </MDBCol>
       </MDBRow>
       <MDBRow className='d-flex align-items-center ps-4 pe-4'>
          <p className=''>{selectedAlbum.desc} </p> 
       </MDBRow>        
    <PhotoGrid
      items = {images}
      deleteImage = {deleteImage}
      setFeaturedImg = {setFeaturedImg}
      featuredImage = {selectedAlbum.featuredImage}
      />
    </div>
    );

}



