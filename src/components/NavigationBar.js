"use client"

/**NavigationBar.js
 * @brief React Component for the photo portfolio navigation bar
 * 
 * @author Robert Norwood
 * @date October, 2023 
 */

import { React, useState } from 'react';
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
import '../css/index.css'
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

import Image from 'next/image';

export default function NavigationBar() {
    const { user, isAuthenticated } = useAuth();
    const [showNav, setShowNav] = useState(false);
    const router = useRouter();

    // Component that displays either a sign in or sign out button based on current user
    function SignInWrapper() {
        if (!isAuthenticated) {
            return (
                <MDBNavbarNav className='ms-auto'>
                    <MDBNavbarItem className="ms-lg-auto" onClick={() => setShowNav(false)}>
                        <MDBNavbarLink href="/signin" tabIndex={-1} aria-disabled='true'>
                            Sign In
                        </MDBNavbarLink>
                    </MDBNavbarItem>
                </MDBNavbarNav>
            );
        }
        return (
            <MDBNavbarNav className='ms-auto w-auto'>
                <MDBNavbarItem>
                    <MDBNavbarLink href="/account" aria-disabled='true' onClick={() => setShowNav(false)}>
                        {user?.username || ''}
                    </MDBNavbarLink>
                </MDBNavbarItem>
            </MDBNavbarNav>
        );
    }

    // Component that displays new album link if user is authorized to create albums
    function NewAlbumWrapper() {
        if (isAuthenticated) {
            return (
                <MDBNavbarItem>
                    <MDBNavbarLink href="/new" aria-disabled='true' onClick={() => setShowNav(false)}>
                        <span className="text-muted">New Album</span>
                    </MDBNavbarLink>
                </MDBNavbarItem>
            );
        }
        return null;
    }

    // TODO(bobby): Add active class to navbar links
    // className={({ isActive }) => [isActive ? "text-dark" : "text-muted"]}

    return (
        <MDBNavbar expand='lg' light bgColor='light' >
            <MDBContainer fluid >
                <Image
                    src={require('../../public/logo192.png')}
                    className='pe-2'
                    width={46}
                    height={40}
                    alt='RNorwood logo'
                />
                <MDBNavbarBrand href="/" >
                    Robert Norwood
                </MDBNavbarBrand>
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
                            <MDBNavbarLink href="/" onClick={() => setShowNav(false)} >
                                <span className="text-muted">Home</span>

                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href="/#albums" onClick={() => setShowNav(false)}>
                                <span className="text-muted">Albums</span>
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
