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
} from '@aws-amplify/ui-react';
import {
  Outlet
} from "react-router-dom";

import ReactDOM from 'react-dom/client';
import {
  MDBBtn
} from 'mdb-react-ui-kit';

import Headroom from 'react-headroom'
import NavigationBar from './NavigationBar'
import EditAlbum from './EditAlbum'

export default function Root() {


  return (

    <View className="App">
      <Authenticator.Provider>
        <Headroom >
            <NavigationBar />
            <div>
              <br />
              <h1 style={{ color: "transparent" }}>_</h1>
            </div>
        </Headroom>
        <Outlet/>
        <EditAlbum />
        
        <MDBBtn className='mt-3 bg-dark'>Sign Out</MDBBtn>
      </Authenticator.Provider>
    </View>
  );
}