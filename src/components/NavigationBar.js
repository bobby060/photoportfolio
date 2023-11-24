import {React, useState, useContext, useEffect} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBTooltip,
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '../css/index.css'
import logo from '../logo192.png';

import { useOutletContext, useLocation } from "react-router-dom";
import { AlbumsContext } from '../helpers/AlbumsContext';
import {urlhelperEncode, urlhelperDecode} from '../helpers/urlhelper';


export default function NavigationBar(){

  const [showNav, setShowNav] = useState(false);
  const user_item = useAuthenticator((context) => [context.user]);
  const authStatus = useAuthenticator(context => [context.authStatus]);
  const { signOut } = useAuthenticator((context) => [context.user]);
  const {albums, setAlbums} = useContext(AlbumsContext);
  const[currentAlbum,setCurrentAlbum] = useState("");

  let location = useLocation();

    useEffect(() => {
      setCurrentAlbumState();

    }, [location]);

    function setCurrentAlbumState(){
      if(location.pathname.startsWith('/album/')){
        for(let i = 0; i < albums.length; i++){
          console.log(location.pathname);
          if (urlhelperDecode(albums[i], location.pathname.slice(7,))) {
            setCurrentAlbum(albums[i].title);
            return;
        }
      }
    }

      setCurrentAlbum("");
    }

    function activeStyle(isActive){
      if (isActive){
        return ({
          'font-weight':'bold'
        });
      };
      return ({});
    }


    function SignInWrapper() {
      if (authStatus.authStatus !== 'authenticated') {
        return (
        <Link to={`/signin`}>
        <MDBNavbarLink   tabIndex={-1} aria-disabled='true'>
          Sign In</MDBNavbarLink>
        </Link>
        );
      }
      return (
        <MDBNavbarLink onClick={signOut} tabIndex={-1} aria-disabled='true'>
            {user_item.user.username} | Sign Out
        </MDBNavbarLink> 
        );
    }

    function EditLinkWrapper(){
      if (authStatus.authStatus !== 'authenticated') {
        return;
      }
      return (
        <MDBNavbarItem>
        
            <MDBNavbarLink aria-disabled='true'>
            <NavLink to={`/new`} className={({isActive}) => [ isActive ? "text-dark": "text-muted"]}>
              New Album
            </NavLink>
            </MDBNavbarLink>

        </MDBNavbarItem>
        );
    }

    function DropdownWrapper(){
      if(albums.length < 1) return;
      return (
          <MDBDropdown>
            <MDBDropdownToggle tag='a' className={currentAlbum==="" ? " btn-secondary text-muted": "btn-secondary text-dark"}>
              {currentAlbum==="" ? 'Select Album': currentAlbum } 
            </MDBDropdownToggle>
            <MDBDropdownMenu >
              {albums.map((album) => (
                <MDBDropdownItem link ><Link className='text-dark' to={`/album/${urlhelperEncode(album)}`}>{album.title}</Link></MDBDropdownItem>
                ))}
            </MDBDropdownMenu>
          </MDBDropdown>
        );
    }
    return (
        <MDBNavbar expand='lg' light bgColor='light' >
          <MDBContainer fluid >
            <img src={logo} className = 'pe-2' style={{height:'40px'}}/>
            <MDBNavbarBrand href='#'>
            
              Robert Norwood</MDBNavbarBrand>
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
                    <MDBNavbarLink>
                    <NavLink to={`/home`} className={({isActive}) => [ isActive ? "text-dark": "text-muted"]}>
                      Home
                      </NavLink>
                    </MDBNavbarLink>
                </MDBNavbarItem>
                <EditLinkWrapper/>
                <MDBNavbarItem>
                  <MDBNavbarLink aria-disabled='true'>
                    <NavLink to={`/about`} className={({isActive}) => [ isActive ? "text-dark": "text-muted"]}>About Me
                    </NavLink>
                  </MDBNavbarLink>            
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
