import React, { useState, useEffect, useContext } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBIcon,
} from 'mdb-react-ui-kit';
import { API } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';
import {Outlet, useLocation} from "react-router-dom";
import {Link} from 'react-router-dom';
import { useParams } from "react-router-dom";

// Database
import {  getImages } from '../graphql/queries';
import {updateAlbums} from '../graphql/mutations';

// Helper functions
import {urlhelperDecode} from '../helpers/urlhelper';
import fetchAlbums from '../helpers/fetchAlbums';
import {AlbumsContext} from '../helpers/AlbumsContext';
import {IMAGEDELIVERYHOST} from './App';

// Components
import PhotoGrid from './PhotoGrid';


export default function Album(){
  const {albums, setAlbums} = useContext(AlbumsContext);
  // const[album, setAlbum] = useState(null);
  const [albumIndex, setAlbumIndex] = useState(-1);
  const [canEdit, setCanEdit] = useState(false);
  let {album_id} = useParams();
  const [featuredImg, setFeaturedImg] = useState([]);





  // for storing images in current album

  const debug = false;

  const user_item = useAuthenticator((context) => [context.user]);
  const authStatus = useAuthenticator((context) => [context.authStatus.authStatus]);
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
    } else{
      setCanEdit(false);
    }
    setAlbumIndex(-1);
    // If albums wasn't already set, fetch them. This should be removed by better data handling in future versions.
    const newA = (albums.length < 1) ? await fetchAlbums(): albums;
      
    const index = await findIndex(newA);
    if (index < 0) {
      throw new Error(`404. Album at url, ${album_id}, was not found!`);
    }// setSelectedAlbum(newA.at(index));

  
    if(albums.length < 1) setAlbums(newA);
    const data = {
          id: newA[index].albumsFeaturedImageId
          // id: 'af40de1c-8a91-42a9-96cd-8f89917a96c4'
        }
    if (newA[index].albumsFeaturedImageId){
      const image = await API.graphql({
        query: getImages,
        variables: data,
        authMode: 'API_KEY'
      });
      setFeaturedImg(image.data.getImages);
    }
    
    setAlbumIndex(index);
    if (debug) {console.log(`images set`)};
   }

   // Sets a selected image as the album featured image
  async function updateFeaturedImg(image){ 
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
      <div className='d-flex align-items-end' style={{height: '500px'}}>
        <div 
        style={{background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 20%, hsla(0, 0%, 0%, 0.5))', width:'100%'}}
        className="d-flex align-items-end">
{/*            <MDBSpinner role='status'>
              <span className='visually-hidden'>Loading...</span>
            </MDBSpinner>*/}
          <MDBContainer >
            <div className='text-justify-start text-light placeholder-glow'>
              <div className='ms-3 d-flex justify-items-start align-items-end'>
                <h2 className="p-0 d-inline-block text-start placeholder col-7">Placeholder</h2>
                <div className="vr ms-2 me-2 " style={{ height: '40px' }}></div>
                <h5 className="p-1 d-inline-block text-start placeholder col-3">Placeholder</h5>
              </div>

              <p className='text-start ms-3 me-3 placeholder col-9'></p> 
              </div>
          </MDBContainer>

        </div>
       </div>);
  }

  const date = new Date(albums[albumIndex].date);

  function isAdminGroup(){
    if (!user_item.user 
       || !user_item.user.signInUserSession.accessToken.payload['cognito:groups']
       || user_item.user.signInUserSession.accessToken.payload['cognito:groups'][0] !== 'portfolio_admin'){
      return false;
    }
    return true;
  }

  function ShowEditButton(){
    if (isAdminGroup() && !canEdit){
      return (<MDBBtn floating onClick={()=>setCanEdit(true)} color='light' className='m-2'><Link to="edit" className='text-dark'><MDBIcon far icon="edit" /></Link></MDBBtn>);
    }
  }

  function AlbumHeader(){

    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }; 

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

    const breakpoints = [0, 750, 1200, 1920];
    
    function getBreakpoint() {
      const cur_width = windowSize.width;
      for (let i = breakpoints.length-2; i >= 0; i--){
          if (breakpoints[i] < cur_width ) return breakpoints[i+1];
      }
    }
    const imgWidth = getBreakpoint();
    const imgRatio = featuredImg.height/featuredImg.width;
    const featuredImageUrl = (featuredImg)?`https://${IMAGEDELIVERYHOST}/public/${featuredImg.id}-${featuredImg.filename}?width=${imgWidth}`:"";
    const imgHeight = Math.min(windowSize.width*imgRatio, 400);

    const parallaxStyle = {
      backgroundImage:`url(${featuredImageUrl})`,
      backgroundAttachment:'fixed',
      backgroundPosition:'top',
      backgroundRepeat: 'no-repeat',
      minHeight: imgHeight, 
      backgroundSize:'',
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
    <MDBContainer breakpoint='xl'>
    <PhotoGrid
      setFeaturedImg ={updateFeaturedImg}
      selectedAlbum = {albums[albumIndex]}
      editMode = {canEdit}
      signedIn = {authStatus.authStatus==="authenticated"}

      />
    </MDBContainer>
    </>
    );

}



