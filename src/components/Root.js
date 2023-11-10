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

import Headroom from 'react-headroom'
import NavigationBar from './NavigationBar'
import EditAlbum from './EditAlbum'

import {listAlbums} from '../graphql/queries';

export default function Root() {
  const { signOut } = useAuthenticator((context) => [context.user]);
  const authStatus = useAuthenticator((context) => [context.authStatus]);
  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [albums, setAlbums] = useState([]);


  // Loads albums on render
  useEffect(() => {
      fetchAlbums();
    }, []);

  async function fetchAlbums() {
    const apiData = await API.graphql({ 
    query: listAlbums,
    authMode: 'API_KEY',
    });

    const albumsFromAPI = apiData.data.listAlbums.items;
    console.log(albumsFromAPI);
    setAlbums(albumsFromAPI);
  } 

  function ShowLogOut() {
      if (authStatus.authStatus != 'authenticated') {
        return;
      }
      return (<MDBBtn className=' float-center mt-3 bg-dark' onClick={signOut}>Sign Out</MDBBtn> );
  }
  return (

    <View className="App">
        <Headroom >
            <NavigationBar 
              selectedAlbum={selectedAlbum}
              setSelectedAlbum={setSelectedAlbum}
              albums={albums}
              setAlbums={setAlbums}/>
{/*            <div>
              <br />
              <h1 style={{ color: "transparent" }}>_</h1>
            </div>*/}
        </Headroom>

        <Outlet
          context={[selectedAlbum, setSelectedAlbum, albums, setAlbums]}/>
        <ShowLogOut/>
    </View>
  );
}