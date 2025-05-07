/**Root.js
* @brief Root component for Photo Portfolio project
 * 
 * Houses all other components
 *  * 
 * @author Robert Norwood
 * @date October, 2023 
 */
import React, { useState, useEffect } from "react";
import "../css/App.css";
import {
    View,
} from '@aws-amplify/ui-react';
import {
    Outlet,
    ScrollRestoration
} from "react-router-dom";


// Components
// Headroom lets navbar disappear on down scroll, but reappear whenever scroll up
import Headroom from 'react-headroom';

// Nav bar and footer components always avalabile
import NavigationBar from './NavigationBar';
import Footer from './Footer';


export default function Root() {

    // Selected album gets passed a context to the outlet.
    const [selectedAlbum, setSelectedAlbum] = useState([]);
    const [albums, setAlbums] = useState([]);



    return (

        <View className="App" style={{ display: 'flex', 'flexDirection': 'column', 'minHeight': '100vh', margin: 'none' }}>
            <Headroom className="m-0" style={{ zIndex: 1000 }}>
                <NavigationBar />
            </Headroom >

            {/* Outlet where child routes are housed */}
            <Outlet
                context={[selectedAlbum, setSelectedAlbum]} />
            <Footer />
            {/*Brings scroll back to top on new route*/}
            <ScrollRestoration />
        </View>
    );
}