import React, { useState, useEffect } from "react";
import "../css/App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage, Auth } from 'aws-amplify';
import { Authenticator} from '@aws-amplify/ui-react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import { listNotes } from "../graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "../graphql/mutations";
import Headroom from 'react-headroom';
import NavigationBar from './NavigationBar';
import EditAlbum from './EditAlbum';
import Root from './Root';
import ErrorPage from './ErrorPage';
import SignIn from './Signin';
import Home from './Home';
import AboutPage from './AboutPage';
import Album from './Album';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
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
      path: "editalbum",
      element: <EditAlbum/>
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
      path:":album_id",
      element: <Album/>
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
