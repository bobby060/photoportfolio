import React, { useState, useEffect, useContext } from 'react';
import {
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBIcon,
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
import {Outlet, useLocation} from "react-router-dom";
import {Link} from 'react-router-dom';


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
  let location = useLocation();

  // Initializes images after component render
  useEffect(() => {
    pullAlbum();
  }, [album_id, location]);

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
    if(location.pathname.endsWith('edit')){
      setCanEdit(true);
    }
    else{
      setCanEdit(false);
    }
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
    if (authStatus.authStatus === 'authenticated' && !canEdit){
      return (<MDBBtn floating onClick={()=>setCanEdit(true)} color='light' className='m-2'><Link to="edit" className='text-dark'><MDBIcon far icon="edit" /></Link></MDBBtn>);
    }
  }

  function AlbumHeader(){

    const featuredImage = images.find((image)=>image.id===albums[albumIndex].albumsFeaturedImageId);
    const featuredImageUrl = (featuredImage)?`https://d2brh14yl9j2nl.cloudfront.net/public/${featuredImage.id}-${featuredImage.filename}?width=1920`:"";

    const parallaxStyle = {
      'background-image':`url(${featuredImageUrl})`,
      'background-attachment':'fixed',
      'background-position':' bottom',
      'background-repeat': 'no-repeat',
      'min-height': '500px', 
      'background-size':'cover',
    }

    return(
      <div className='d-flex align-items-end' style={parallaxStyle}>
        <div 
        style={{background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 20%, hsla(0, 0%, 0%, 0.5))', width:'100%'}}
        className="d-flex align-items-end">
          <ShowEditButton/>
          <MDBContainer >
            <div className='text-justify-start text-light'>
              <div className='ms-3 d-flex justify-items-start align-items-end'>
                <h2 className="p-0 d-inline-block text-start ">{albums[albumIndex].title}</h2>
                <div className="vr ms-2 me-2 " style={{ height: '40px' }}></div>
                <h5 className="p-1 d-inline-block text-start">{date.getMonth()+1}/{date.getDate()}/{date.getFullYear()}</h5>
              </div>

              <p className='text-start ms-3 me-3'>{albums[albumIndex].desc} </p> 
              </div>
          </MDBContainer>

        </div>
       </div>
      );
  }

  return(
    <>
    <AlbumHeader/>
    <Outlet/>
    <MDBContainer>
    <PhotoGrid
      items = {images}
      deleteImage = {deleteImage}
      setFeaturedImg = {setFeaturedImg}
      selectedAlbum = {albums[albumIndex]}
      editMode = {canEdit}
      />
    </MDBContainer>
    </>
    );

}



