import React, { useState, useEffect } from "react";
import "../css/App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage, Auth } from 'aws-amplify';
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
  Authenticator,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import {
  Outlet
} from "react-router-dom";

import ReactDOM from 'react-dom/client';
import {
  MDBBtn,
  MDBContainer,
} from 'mdb-react-ui-kit';

import Headroom from 'react-headroom';
import NavigationBar from './NavigationBar';
import EditAlbum from './EditAlbum';
import addURL from '../helpers/addURL';
import fetchAlbums from '../helpers/fetchAlbums';
import Footer from './Footer';

import {AlbumsContext} from '../helpers/AlbumsContext';

import {listAlbums, getImages} from '../graphql/queries';

export default function Root() {

  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [albums, setAlbums] = useState([]);


  // Loads albums on render
  useEffect(() => {
      fetchWrapper();
    }, []);

  async function fetchWrapper(){
      const new_albums = await fetchAlbums();
      console.log(new_albums);
      setAlbums(new_albums);
  }



  // async function fetchAlbums() {
  //   console.log('fetching albums')
  //   const apiData = await API.graphql({ 
  //   query: listAlbums,
  //   authMode: 'API_KEY',
  //   });

  //   const albumsFromAPI = apiData.data.listAlbums.items;
  //   const a = await Promise.all(albumsFromAPI.map(async (album) => {
  //     const data = {
  //       id: album.albumsFeaturedImageId
  //     }
  //     const image = await API.graphql({
  //       query: getImages,
  //       variables: data,
  //       authMode: 'API_KEY'
  //     });
  //     const featuredImage =  await addURL(image.data.getImages);
  //     return { ...album, featuredImage: featuredImage};
  //     }));
  //   setAlbums(a);
  // } 


  return (

    <View className="App">
      <AlbumsContext.Provider value={{
        albums,
        setAlbums
      }}>
        <Headroom className="m-0">
            <NavigationBar 
              selectedAlbum={selectedAlbum}
              setSelectedAlbum={setSelectedAlbum}/>
        </Headroom >

        <Outlet
          context={[selectedAlbum, setSelectedAlbum]}/>
        <Footer/>
      </AlbumsContext.Provider>
    </View>
  );
}