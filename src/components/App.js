import React from "react";
import "../css/App.css";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator} from '@aws-amplify/ui-react';
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
import AllAlbums from './AllAlbums.js';


// Dev
 export const IMAGEDELIVERYHOST = 'd3fxm8v2c5j7cl.cloudfront.net';

// STAGING
// export const IMAGEDELIVERYHOST = 'd2brh14yl9j2nl.cloudfront.net';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage/>,
    children: [
      {
        errorElement: <ErrorPage/>,
        children: [
          {
            index: true,
            element: <Home/>
          },
          {
            path: "signin",
            element: <SignIn/>
          },
          {
            path: "new",
            element: <CreateAlbum/>
          },
          {
            path: "home",
            element: <Home/>,
          },
          {
            path: "about",
            element: <AboutPage/>,
          },
          {
            path: "albums",
            element: <AllAlbums/>,
          },
          {
            path:"albums/:album_id",
            element: <Album/>,
            children: [
            {
              path: "edit",
              element: <EditAlbum/>
            }]
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
