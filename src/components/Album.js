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

export default function Album(){
  const [selectedAlbum, setSelectedAlbum] = useOutletContext();

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
      imgs.map(async (img) => {
        const real_name = `${img.id}-${img.filename}`
        if (debug) {console.log(real_name)};
        const url = await Storage.get(real_name, { level: 'public' });
        img.filename = url;
        return img;
      })
    );

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
      albumsFeaturedImageId: image.id
    }
    await API.graphql({
      query: updateAlbums,
      variables: { input: data
    },
    })
    console.log('album updated')
    const updatedAlbum = await API.graphql({
      query: getAlbums, 
      variables:{ input: {id: selectedAlbum.id}}
    });
    // setSelectedAlbum(updatedAlbum);
    // const new_imgs = images.filter((album) => album.id !== image.id).append(updatedAlbum);
   }

  // Component wrapper for deleting a photo


  function MakeFeaturedWrapper(image){

      if (authStatus.authStatus != 'authenticated') {
        return;
      }
      if (image.id==selectedAlbum.featuredImage) {
            console.log('found featured img')
              return (<MDBBtn  title='Make Featured Photo' disabled MDBColor='text-dark' data-mdb-toggle="tooltip" title="Delete photo"  >
              <MDBIcon fas icon="times text-dark" size='2x' />
            </MDBBtn>);
      }
      return (<MDBBtn  title='Make Featured Photo' onClick={()=> setFeaturedImg(image)} MDBColor='text-dark' data-mdb-toggle="tooltip" title="Set Featured"  >
              <MDBIcon fas icon="square text-dark" size='2x' />
            </MDBBtn>);
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
      />
    </div>
    );

}



