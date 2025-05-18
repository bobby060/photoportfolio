
"use client"
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';
import '../css/index.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css"

import "../css/App.css";
import {
    View,
} from '@aws-amplify/ui-react';

import React from "react";


// Initialize Amplify
Amplify.configure(amplifyconfig, { ssr: true });

// Components
// Headroom lets navbar disappear on down scroll, but reappear whenever scroll up
import Headroom from 'react-headroom';

// Nav bar and footer components always avalabile
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';


// Selected album gets passed a context to the outlet.



export default function RootLayout({ children }) {


    return (
        <html lang="en">

            <head>
                <title>R Norwood</title>

            </head>

            <body>
                <Authenticator.Provider>
                    <noscript>You need to enable JavaScript to run this app.</noscript>
                    <div id="root">
                        <View className="App" style={{ display: 'flex', 'flexDirection': 'column', 'minHeight': '100vh', margin: 'none' }}>
                            <Headroom className="m-0" style={{ zIndex: 1000 }}>
                                <NavigationBar />
                            </Headroom >

                            {children}
                            <Footer />
                            {/*Brings scroll back to top on new route*/}
                        </View></div>
                </Authenticator.Provider>
            </body>
        </html>)
}

// export const metadata = {
//     title: 'R Norwood',
//     description: 'Web site created using create-react-app',
// }