import {React, useState, useEffect, useContext} from 'react';
import ReactDOM from 'react-dom/client';
import {Link} from 'react-router-dom';
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
import { AlbumsContext } from '../helpers/AlbumsContext';
import {urlhelperEncode} from '../helpers/urlhelper'
// import AnchorLink from 'react-anchor-link-smooth-scroll'
// **** ROUTES *****//
// Add routes here


export default function NavigationBar({selectedAlbum, setSelectedAlbum}){

  const [showNav, setShowNav] = useState(false);
  const user_item = useAuthenticator((context) => [context.user]);
  const authStatus = useAuthenticator(context => [context.authStatus]);
  const {albums, setAlbums} = useContext(AlbumsContext);


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
          <Link to={`/new`}>
            <MDBNavbarLink>New Album</MDBNavbarLink>
          </Link>
        </MDBNavbarItem>
        );
    }

    function DropdownWrapper(){
      if(albums.length < 1) return;
      return (
          <MDBDropdown>
            <MDBDropdownToggle tag='a' className='btn-tertiary text-dark'>
              {selectedAlbum.length < 1 ? 'Select Album': selectedAlbum.title } 
            </MDBDropdownToggle>
            <MDBDropdownMenu >
              {albums.map((album) => (
                <MDBDropdownItem link ><Link className='text-dark' to={`/${urlhelperEncode(album)}`}>{album.title}</Link></MDBDropdownItem>
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
              <MDBNavbarNav className='w-100'>
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
                <MDBNavbarItem >
                  <MDBNavbarLink>
                  <DropdownWrapper/>
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem className = "ms-lg-auto">
                  <SignInWrapper/>
                </MDBNavbarItem>
                </MDBNavbarNav>


            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
    )
}
