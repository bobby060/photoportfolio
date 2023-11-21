import React, { useState, useEffect, useContext } from 'react';
import {
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBContainer
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import { imagesByAlbumsID } from '../graphql/queries';
import {deleteImages as deleteImageMutation, updateAlbums} from '../graphql/mutations';
import { useAuthenticator } from '@aws-amplify/ui-react';
import PhotoGrid from './PhotoGrid';
import { useParams } from "react-router-dom";
import {AlbumsContext} from '../helpers/AlbumsContext';
import {urlhelperDecode} from '../helpers/urlhelper';

import fetchAlbums from '../helpers/fetchAlbums';
import EditAlbum from './EditAlbum';


export default function Album(){
  const {albums, setAlbums} = useContext(AlbumsContext);
  // const[albums, setAlbums] = useState([]);
  const [albumIndex, setAlbumIndex] = useState(-1);
  const [canEdit, setCanEdit] = useState(false);
  let {album_id} = useParams();


  // for storing images in current album
  const [images, setImages] = useState([]);
  const debug = false;

  const authStatus = useAuthenticator((context) => [context.authStatus]);

  // Initializes images after component render
  useEffect(() => {
    pullAlbum();
  }, [album_id]);

  // Helper that determines which album in the albums list the url album_id is triggering the component to pull
  async function findIndex(albums){
    for(let i = 0; i < albums.length; i++){
      if (urlhelperDecode(albums[i], album_id)) {
        return i;
      }
    }
    return -1;
  }

  // Loads images associated with album being rendered
 async function pullAlbum(){
    setCanEdit(false);
    setAlbumIndex(-1);
    // If albums wasn't already set, fetch them. This should be removed by better data handling in future versions.
    const newA = (albums.length < 1) ? await fetchAlbums(): albums;
      
    const index = await findIndex(newA);
    if (index < 0) {
      throw new Error(`404. Album at url, ${album_id}, was not found!`);
    }// setSelectedAlbum(newA.at(index));

  // Pulls the image objects associated with the selected album
    const imgs_wrapper = await API.graphql({
      query: imagesByAlbumsID,
       variables: { albumsID: newA[index].id},
       authMode: 'API_KEY',
      });
    console.log('loading images');
    const imgs = imgs_wrapper.data.imagesByAlbumsID.items;

    if (debug){console.log(`retrieved imgs: ${imgs}`)};
    // Updates images to the new image objects that have urls
    for (let i = 0 ; i < imgs.length; i++){
      imgs[i].index = i;
    }
    setImages(imgs);
    if(albums.length < 1) setAlbums(newA);
    setAlbumIndex(index);
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
      id: albums[albumIndex].id,
      albumsFeaturedImageId: image.image.id
    }
    const response = await API.graphql({
      query: updateAlbums,
      variables: { input: data
    },
    })
    const new_album = response.data.updateAlbums;
    pullAlbum();
    const newAlbums = albums.map((album) => {
      if (album.id === new_album.id) return new_album;
      return album;
    });
    setAlbums(newAlbums);
   }


 // Image handler functions

  if(albumIndex<0){
    return(
      <p>loading</p>);
  }

  const date = new Date(albums[albumIndex].date);

  function ShowEditButton(){
    if (authStatus.authStatus === 'authenticated'){
      return (<MDBBtn onClick={()=>setCanEdit(true)} color='dark' className='m-2'>Edit Album</MDBBtn>);
    }
  }

  function EditWrapper(){
    if (canEdit){
      return (
        <EditAlbum
          selectedAlbum={albums[albumIndex]}
          pullAlbum={pullAlbum}
          />
        );

    }

    return(
      <div>
        <MDBRow className=''>
          <MDBCol className='d-flex m-3 align-items-baseline '>
              <h2 className="me-2">{albums[albumIndex].title}</h2>
              <div className="vr" style={{ height: '50px' }}></div>
              <h5 className="ms-2 float-bottom">{date.getMonth()+1}/{date.getDate()}/{date.getFullYear()}</h5>
          </MDBCol>
         </MDBRow>
            <p className='text-start ms-3 me-3'>{albums[albumIndex].desc} </p> 
        <ShowEditButton/>
       </div>
      );
  }

  return(
    <MDBContainer>
    <EditWrapper/>
    <PhotoGrid
      items = {images}
      deleteImage = {deleteImage}
      setFeaturedImg = {setFeaturedImg}
      selectedAlbum = {albums[albumIndex]}
      editMode = {canEdit}
      />
    </MDBContainer>
    );

}



