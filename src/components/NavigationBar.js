"use client"

/**NavigationBar.js
 * @brief React Component for the photo portfolio navigation bar
 * 
 * @author Robert Norwood
 * @date October, 2023 
 */

import { React, useState, useEffect } from 'react';
import Link from 'next/link';
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
    }, []);

    // Component that displays either a sign in or sign out button based on current user
    function SignInWrapper() {
        if (authStatus.authStatus !== 'authenticated') {
            return (
                <MDBNavbarNav className='ms-auto'>
                    <MDBNavbarItem className="ms-lg-auto" onClick={() => setShowNav(false)}>
                        <Link href="/signin">
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
                    <Link href="/account" passHref legacyBehavior>
                        <MDBNavbarLink aria-disabled='true' onClick={() => setShowNav(false)}>
                            {userInfo.username || ''}
                        </MDBNavbarLink>
                    </Link>
                </MDBNavbarItem>
            </MDBNavbarNav>
        );
    }

    // Component that displays new album link if user is authorized to create albums
    function NewAlbumWrapper() {
        if (authStatus.authStatus === 'authenticated') {
            return (
                <MDBNavbarItem>
                    <MDBNavbarLink aria-disabled='true' onClick={() => setShowNav(false)}>
                        <Link href="/new" className="text-decoration-none">
                            <span className="text-muted">New Album</span>
                        </Link>
                    </MDBNavbarLink>
                </MDBNavbarItem>
            );
        }
        return null;
    }

    return (
        <MDBNavbar expand='lg' light bgColor='light' >
            <MDBContainer fluid >
                <img src="/logo192.png" className='pe-2' style={{ height: '40px' }} alt='RNorwood logo' />
                <Link href="/" >
                    <MDBNavbarBrand>
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
                                <Link href="/" className="text-decoration-none">
                                    <span className="text-muted">Home</span>
                                </Link>
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink onClick={() => setShowNav(false)}>
                                <Link href="/albums" className="text-decoration-none">
                                    <span className="text-muted">Albums</span>
                                </Link>
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <NewAlbumWrapper />
                    </MDBNavbarNav>
                    <SignInWrapper />
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    )
}
