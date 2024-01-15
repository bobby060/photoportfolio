import React, { useState, useEffect } from "react";
import "../css/App.css";
// import "@aws-amplify/ui-react/styles.css";
import {
    View,
} from '@aws-amplify/ui-react';
import {
    Outlet,
    ScrollRestoration
} from "react-router-dom";


// Components
import Headroom from 'react-headroom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

// Helpers
import fetchAlbums from '../helpers/fetchAlbums';
import { AlbumsContext } from '../helpers/AlbumsContext';



export default function Root() {

    const [selectedAlbum, setSelectedAlbum] = useState([]);
    const [albums, setAlbums] = useState([]);


    // Loads albums on render
    useEffect(() => {
        fetchWrapper();
    }, []);

    async function fetchWrapper() {
        const new_albums = await fetchAlbums();
        console.log('fetching albums');
        setAlbums(new_albums);
    }


    return (
        <AlbumsContext.Provider value={{
            albums,
            setAlbums
        }}>
            <View className="App" style={{ display: 'flex', 'flexDirection': 'column', 'minHeight': '100vh', margin: 'none' }}>
                <Headroom className="m-0" style={{ zIndex: 1000 }}>
                    <NavigationBar />
                </Headroom >

                <Outlet
                    context={[selectedAlbum, setSelectedAlbum]} />
                <Footer />
                {/*Brings scroll back to top on new route*/}
                <ScrollRestoration />
            </View>
        </AlbumsContext.Provider>
    );
}