import React from "react";
import "../css/App.css";

// import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import CreateAlbum from './CreateAlbum';
import Root from './Root';
import ErrorPage from './ErrorPage';
import SignIn from './Signin';
import Home from './Home2';
import AboutPage from './AboutPage';
import Album from './Album';
import EditAlbum from './EditAlbum';
import AllAlbums from './AllAlbums';
import ManageAccount from './ManageAccount';

import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';
import projectConfig from "../helpers/Config";
import userObject from "../helpers/CurrentUser";

Amplify.configure(amplifyconfig);

// Dev
await projectConfig.updateConfig();
export const IMAGEDELIVERYHOST = projectConfig.getValue('imageDeliveryHost');

// STAGING
// export const IMAGEDELIVERYHOST = 'd2brh14yl9j2nl.cloudfront.net';



const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    {
                        index: true,
                        element: <Home />
                    },
                    {
                        path: "signin",
                        element: <SignIn />
                    },
                    {
                        path: "new",
                        element: <CreateAlbum />
                    },
                    {
                        path: "home",
                        element: <Home />,
                    },
                    {
                        path: "about",
                        element: <AboutPage />,
                    },
                    {
                        path: "albums",
                        element: <AllAlbums />,
                    },
                    {
                        path: "albums/:album_url/:album_id?",
                        element: <Album />,
                        children: [
                            {
                                path: "edit",
                                element: <EditAlbum />
                            }]
                    },
                    {
                        path: "account",
                        element: <ManageAccount />
                    }
                ]
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Authenticator.Provider>
            <RouterProvider router={router} />
        </Authenticator.Provider>
    </React.StrictMode>
);
