import {React, useState} from 'react';
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
  // MDBDropdown,
  // MDBDropdownMenu,
  // MDBDropdownToggle,
  // MDBDropdownItem,
  // MDBTooltip,
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '../css/index.css'
import logo from '../logo192.png';

// import { useLocation } from "react-router-dom";
// import { AlbumsContext } from '../helpers/AlbumsContext';
// import {urlhelperDecode} from '../helpers/urlhelper';


export default function NavigationBar(){

  const [showNav, setShowNav] = useState(false);
  const user_item = useAuthenticator((context) => [context.user]);
  const authStatus = useAuthenticator(context => [context.authStatus]);
  // const groups = useAuthenticator(context => [context.user.user.signInUserSession.accessToken.payload]);
  const { signOut } = useAuthenticator((context) => [context.user]);
  // const {albums} = useContext(AlbumsContext);
  // const[currentAlbum,setCurrentAlbum] = useState("");

  // let location = useLocation();

    // Updates current album each time location changes
    // useEffect(() => {
    //   setCurrentAlbumState();
    // }, [location]);

    // Decodes the current album from the current path
    // function setCurrentAlbumState(){
    //   if(location.pathname.startsWith('/albums/')){
    //     for(let i = 0; i < albums.length; i++){
    //       if (urlhelperDecode(albums[i], location.pathname.slice(7,))) {
    //         setCurrentAlbum(albums[i].title);
    //         return;
    //     }
    //   }
    // }

    //   setCurrentAlbum("");
    // }

    function isAdminGroup(){
      if (authStatus.authStatus==='configuring' 
        || !user_item.user 
        || !user_item.user.signInUserSession.accessToken.payload['cognito:groups']){
        return false;
      }
      if (user_item.user.signInUserSession.accessToken.payload['cognito:groups'][0] === "portfolio_admin")
        {
          return true;
        }
      return false;
    }

    // Component that displays either a sign in or sign out button based on current user
    function SignInWrapper() {
      if (authStatus.authStatus !== 'authenticated') {
        return (
        <Link to={`/signin`}>
          <MDBNavbarLink   tabIndex={-1} aria-disabled='true'>
            Sign In
          </MDBNavbarLink>
        </Link>
        );
      }
      return (
        <MDBNavbarLink onClick={signOut} tabIndex={-1} aria-disabled='true'>
            {user_item.user.username} | Sign Out
        </MDBNavbarLink> 
        );
    }

    // Component that displays new album link if user is authorized to create albums
    function NewAlbumWrapper(){
      if (!isAdminGroup()) {
        return;
      }
      return (
        <MDBNavbarItem>
          <MDBNavbarLink aria-disabled='true' onClick={()=>setShowNav(false)}>
            <NavLink to={`/new`} className={({isActive}) => [ isActive ? "text-dark": "text-muted"]}>
              New Album
            </NavLink>
          </MDBNavbarLink>
        </MDBNavbarItem>
        );
    }

    // function DropdownWrapper(){
    //   if(albums.length < 1) return;
    //   return (
    //       <MDBDropdown>
    //       {/*Dropdown toggle shows current album if at one*/}
    //         <MDBDropdownToggle tag='a' className={currentAlbum==="" ? " btn-secondary text-muted": "btn-secondary text-dark"}>
    //           {currentAlbum==="" ? 'Select Album': currentAlbum } 
    //         </MDBDropdownToggle>
    //         <MDBDropdownMenu >
    //           {albums.map((album) => (
    //             <MDBDropdownItem link onClick={()=>setShowNav(false)}>
    //               <Link className='text-dark' to={`/albums/${urlhelperEncode(album)}`}>{album.title}</Link>
    //             </MDBDropdownItem>
    //             ))}
    //         </MDBDropdownMenu>
    //       </MDBDropdown>
    //     );
    // }
    return (
        <MDBNavbar expand='lg' light bgColor='light' >
          <MDBContainer fluid >
            <img src={logo} className = 'pe-2' style={{height:'40px'}} alt='RNorwood logo'/>
            <Link to="/home">
              <MDBNavbarBrand href='#'>
                Robert Norwood              
              </MDBNavbarBrand>
            </Link>
            <MDBNavbarToggler
              type='button'
              aria-expanded='false'
              aria-label='Toggle navigation'
              onClick={() => setShowNav(!showNav)}
            >
                <i className="fas fa-bars text-dark m-2 "></i>
            </MDBNavbarToggler>
            <MDBCollapse navbar show={showNav}>
              <MDBNavbarNav className='w-100'>
                <MDBNavbarItem>
                    <MDBNavbarLink onClick={()=>setShowNav(false)}>
                    <NavLink to={`/home`} className={({isActive}) => [ isActive ? "text-dark": "text-muted"]}>
                      Home
                      </NavLink>
                    </MDBNavbarLink>
                </MDBNavbarItem>
                  <MDBNavbarItem>
                    <MDBNavbarLink onClick={()=>setShowNav(false)}>
                    <NavLink to={`/home#albums`} className={({isActive}) => [ isActive ? "text-dark": "text-muted"]}>
                      Albums
                      </NavLink>
                    </MDBNavbarLink>
                </MDBNavbarItem>
                <NewAlbumWrapper/>
{/*                <MDBNavbarItem>
                  <MDBNavbarLink aria-disabled='true' onClick={()=>setShowNav(false)}>
                    <NavLink to={`/about`} className={({isActive}) => [ isActive ? "text-dark": "text-muted"]}>About Me
                    </NavLink>
                  </MDBNavbarLink>            
                </MDBNavbarItem>*/}

{/*                <MDBNavbarItem >
                  <MDBNavbarLink>
                  <DropdownWrapper/>
                  </MDBNavbarLink>
                </MDBNavbarItem>*/}
                <MDBNavbarItem className = "ms-lg-auto" onClick={()=>setShowNav(false)}>
                  <SignInWrapper/>
                </MDBNavbarItem>
                </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
    )
}
