import {React, useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Link} from 'react-router-dom';
import {listAlbums} from '../graphql/queries';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBIcon,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem
} from 'mdb-react-ui-kit';

import { API } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '../css/index.css'

import { useOutletContext } from "react-router-dom";
// import AnchorLink from 'react-anchor-link-smooth-scroll'
// **** ROUTES *****//
// Add routes here


export default function NavigationBar({selectedAlbum, setSelectedAlbum, albums, setAlbums}){

  const [showNav, setShowNav] = useState(false);
  const user_item = useAuthenticator((context) => [context.user]);
  const authStatus = useAuthenticator(context => [context.authStatus]);

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
    setAlbums(albumsFromAPI);
  } 

    function SignInWrapper() {
      if (authStatus.authStatus != 'authenticated') {
        return (
        <Link to={`/signin`}>
        <MDBNavbarLink   tabIndex={-1} aria-disabled='true'>
          Sign In</MDBNavbarLink>
        </Link>
        );
      }
      return (
        <MDBNavbarLink disabled href='/' tabIndex={-1} aria-disabled='true'>
          {user_item.user.username}
        </MDBNavbarLink>
        );
    }

    function EditLinkWrapper(){
      if (authStatus.authStatus != 'authenticated') {
        return;
      }
      return (
        <MDBNavbarItem>
          <Link to={`/editalbum`}>
            <MDBNavbarLink>Edit Album</MDBNavbarLink>
          </Link>
        </MDBNavbarItem>
        );
    }

    function DropdownWrapper(){
      if(albums.length < 1) return;
      return (
          <MDBDropdown>
            <MDBDropdownToggle tag='a' className='btn-tertiary text-dark'>
              Albums
            </MDBDropdownToggle>
            <MDBDropdownMenu >
              {albums.map((album) => (
                <MDBDropdownItem link onClick={() => {setSelectedAlbum(album)}}>{album.title}</MDBDropdownItem>
                ))}
            </MDBDropdownMenu>
          </MDBDropdown>
        );
    }
    return (
        <MDBNavbar expand='lg' light bgColor='light'>
          <MDBContainer fluid>
            <MDBNavbarBrand href='#'>Robert Norwood</MDBNavbarBrand>
            <MDBNavbarToggler
              type='button'
              aria-expanded='false'
              aria-label='Toggle navigation'
              onClick={() => setShowNav(!showNav)}
            >
                <i class="fas fa-bars text-dark m-2 "></i>
            </MDBNavbarToggler>
            <MDBCollapse navbar show={showNav}>
              <MDBNavbarNav>
                <MDBNavbarItem>
                  <Link to={`/home`}>
                    <MDBNavbarLink active>
                      Home
                    </MDBNavbarLink>
                  </Link>
                </MDBNavbarItem>
                <EditLinkWrapper/>
                <MDBNavbarItem>
                  <Link to={`/about`}>
                    <MDBNavbarLink aria-disabled='true'>About Me</MDBNavbarLink>
                  </Link>                  
                </MDBNavbarItem>
                <MDBNavbarItem className="d-flex align-items-center">
                  <DropdownWrapper/>
                </MDBNavbarItem>
                <MDBNavbarItem className = "ms-auto">
                  <SignInWrapper/>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
    )
}
