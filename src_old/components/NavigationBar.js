/**NavigationBar.js
 * @brief React Component for the photo portfolio navigation bar
 * 
 * @author Robert Norwood
 * @date October, 2023 
 */

import { React, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBCollapse,
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '../css/index.css'
import logo from '../logo192.png';
import currentUser from '../helpers/CurrentUser';



export default function NavigationBar() {
    const authStatus = useAuthenticator(context => [context.authStatus]);
    const [showNav, setShowNav] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: null,
        isAdmin: false
    });

    useEffect(() => {
        const adminObject = new currentUser();

        const fetchUserInfo = async () => {
            let userName = null;
            let isAdmin = false;

            await adminObject.userName((username) => userName = username);
            await adminObject.isAdmin((adminStatus) => isAdmin = adminStatus);

            setUserInfo({ username: userName, isAdmin });
        };

        fetchUserInfo();
    }, []); // Empty dependency array since we only want this to run once on mount

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
                            {userInfo.username || ''}
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
        if (authStatus.authStatus === 'authenticated') {
            return (
                <MDBNavbarItem>
                    <MDBNavbarLink aria-disabled='true' onClick={() => setShowNav(false)}>
                        <NavLink to={`/new`} className={({ isActive }) => [isActive ? "text-dark" : "text-muted"]}>
                            New Album
                        </NavLink>
                    </MDBNavbarLink>
                </MDBNavbarItem>
            );
        }
        return null;
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
                        {/* <MDBNavbarItem>
                            <MDBNavbarLink onClick={() => setState({ ...state, showNav: false })}>
                                <NavLink to={`/projects`} className={({ isActive }) => [isActive ? "text-dark" : "text-muted"]}>
                                    Projects
                                </NavLink>
                            </MDBNavbarLink>
                        </MDBNavbarItem> */}
                        <NewAlbumWrapper />
                    </MDBNavbarNav>
                    <SignInWrapper />
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    )
}
