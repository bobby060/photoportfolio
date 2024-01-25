import { React, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
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
import currentUser from '../helpers/CurrentUser';

// import { useLocation } from "react-router-dom";
// import { AlbumsContext } from '../helpers/AlbumsContext';
// import {urlhelperDecode} from '../helpers/urlhelper';


export default function NavigationBar() {

    const [showNav, setShowNav] = useState(false);
    const [idTokenState, setIdToken] = useState(null);
    const authStatus = useAuthenticator(context => [context.authStatus]);
    const userItem = useAuthenticator(context => [context.user]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUserName] = useState(null);
    const adminObject = new currentUser();
    // const groups = useAuthenticator(context => [context.user.user.signInUserSession.accessToken.payload]);
    // const {albums} = useContext(AlbumsContext);

    useEffect(() => {
        adminObject.userName(setUserName);

        adminObject.isAdmin(setIsAdmin);
    }, [])

    useEffect(() => {
        adminObject.userName(setUserName);

        adminObject.isAdmin(setIsAdmin);
    }, [authStatus]);


    // Component that displays either a sign in or sign out button based on current user
    function SignInWrapper() {
        if (authStatus.authStatus !== 'authenticated') {
            return (
                <MDBNavbarNav className='ms-auto'>
                    <MDBNavbarItem className="ms-lg-auto" onClick={() => setShowNav(false)}>
                        <Link to={`/signin`}>
                            <MDBNavbarLink tabIndex={-1} aria-disabled='true'>
                                Sign In
                            </MDBNavbarLink>
                        </Link>
                    </MDBNavbarItem>
                </MDBNavbarNav>

            );
        }
        return (
            <MDBNavbarNav className='ms-auto w-auto'>
                <MDBNavbarItem>
                    <Link to={`/account`}>
                        <MDBNavbarLink aria-disabled='true' onClick={() => setShowNav(false)}>
                            {(username) ? username : ''}
                        </MDBNavbarLink>
                    </Link>
                </MDBNavbarItem>
                {/* <MDBNavbarItem>
                    <MDBNavbarLink onClick={signOut} tabIndex={-1} aria-disabled='true'>
                        Sign Out
                    </MDBNavbarLink>
                </MDBNavbarItem> */}
            </MDBNavbarNav>
        );
    }

    // Component that displays new album link if user is authorized to create albums
    function NewAlbumWrapper() {
        if (isAdmin) {
            return (<MDBNavbarItem>
                <MDBNavbarLink aria-disabled='true' onClick={() => setShowNav(false)}>
                    <NavLink to={`/new`} className={({ isActive }) => [isActive ? "text-dark" : "text-muted"]}>
                        New Album
                    </NavLink>
                </MDBNavbarLink>
            </MDBNavbarItem>);
        }
        return;
    }

    return (
        <MDBNavbar expand='lg' light bgColor='light' >
            <MDBContainer fluid >
                <img src={logo} className='pe-2' style={{ height: '40px' }} alt='RNorwood logo' />
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
                    <MDBNavbarNav className='w-auto'>
                        <MDBNavbarItem>
                            <MDBNavbarLink onClick={() => setShowNav(false)}>
                                <NavLink to={`/home`} className={({ isActive }) => [isActive ? "text-dark" : "text-muted"]}>
                                    Home
                                </NavLink>
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink onClick={() => setShowNav(false)}>
                                <NavLink to={`/home#albums`} className={({ isActive }) => [isActive ? "text-dark" : "text-muted"]}>
                                    Albums
                                </NavLink>
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <NewAlbumWrapper />
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
                    </MDBNavbarNav>
                    <SignInWrapper />
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    )
}
