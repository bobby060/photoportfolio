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
  withAuthenticator,
} from '@aws-amplify/ui-react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import {
  MDBBtn
} from 'mdb-react-ui-kit';

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage/>,
    children: [
    {
      path: "signin",
      element: <SignIn/>
    }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
