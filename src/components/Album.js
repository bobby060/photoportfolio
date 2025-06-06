/** 
 * @brief Album.js
 * 
 * Contains component for Album wrapper
 * 
 * Contains extra options that can only be executed by an admin user group user
 * 
 * Basically is just a PhotoGrid wrapped in an album header
 * 
 * @author Robert Norwood, OCT 2023
 * @date October 2023
 * @modified May 2025
*/

"use client"

import React, { useState, useEffect } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBIcon,
} from 'mdb-react-ui-kit';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Link from 'next/link';

// Database
import { updateAlbums } from '../graphql/mutations';

// Helper functions
import { getAlbumFromAlbumUrl } from '../helpers/urlhelper';
import { IMAGEDELIVERYHOST } from '../helpers/Config';
import currentUser from '../helpers/CurrentUser';

// Components
import PhotoGrid from './PhotoGrid';
import EditAlbum from './EditAlbum';

const userGroupClient = generateClient({
    authMode: 'userPool'
});

export default function Album({ album_url }) {


    const [album, setAlbum] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const authStatus = useAuthenticator((context) => [context.authStatus.authStatus]);


    // Initializes images after component render
    useEffect(() => {
        const adminObject = new currentUser();
        adminObject.isAdmin((isAdmin) => {
            setIsAdmin(isAdmin);
            setCanEdit(isAdmin);
        });

    }, [authStatus.authStatus, album_url]);
    useEffect(() => {
        getAlbumFromAlbumUrl(album_url)
            .then(albumData => {
                setAlbum(albumData);
            });
    }, [album_url]);


    // Sets a selected image as the album featured image
    async function updateFeaturedImg(image) {
        const data = {
            id: album.id,
            albumsFeaturedImageId: image.image.id
        }
        const response = await userGroupClient.graphql({
            query: updateAlbums,
            variables: {
                input: data
            },
        })
        const new_album = response.data.updateAlbums;
        setAlbum(new_album);
    }


    // Placeholder while loading
    if (!album) {
        // setState(state => ({ ...state, album: getAlbumFromAlbumUrl(album_url) }));
        return (
            <div className='d-flex align-items-end' style={{ height: '400px' }}>
                <div
                    style={{ background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 20%, hsla(0, 0%, 0%, 0.5))', width: '100%' }}
                    className="d-flex align-items-end">
                    <MDBContainer >
                        <div className='text-justify-start text-light placeholder-glow'>
                            <div className='ms-3 d-flex justify-items-start align-items-end'>
                                <h2 className="p-0 d-inline-block text-start placeholder col-7">Placeholder</h2>
                                <div className="vr ms-2 me-2 " style={{ height: '40px' }}></div>
                                <h5 className="p-1 d-inline-block text-start placeholder col-3">Placeholder</h5>
                            </div>

                            <p className='text-start ms-3 me-3 placeholder col-9'></p>
                        </div>
                    </MDBContainer>
                </div>
            </div>);
    }

    const date = new Date(album.date);

    function setEditModeAndPullAlbum(editMode) {
        setEditMode(editMode);
        getAlbumFromAlbumUrl(album_url)
            .then(albumData => {
                setAlbum(albumData);
            });
    }



    // React Component for edit button. Only shows if user is admin.
    function ShowEditButton() {
        if (isAdmin) {
            return (<MDBBtn floating onClick={() => setEditMode(true)}
                color='light' className='m-2'><MDBIcon far icon="edit" />
            </MDBBtn>);
        }
        return null;
    }

    // React Component that shows the top portion of album, including title, description, and featured image
    function AlbumHeader() {
        // Makes AlbumHeader responsive
        const [windowSize, setWindowSize] = useState({
            width: undefined,
            height: undefined,
        });

        useEffect(() => {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };

            if (typeof window !== 'undefined') {
                handleResize();
            }

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }, []);

        const breakpoints = [0, 750, 1200, 1920];

        function getBreakpoint() {
            if (typeof window === 'undefined') {
                return breakpoints[breakpoints.length - 1];
            }
            const cur_width = windowSize.width;
            for (let i = breakpoints.length - 2; i >= 0; i--) {
                if (breakpoints[i] < cur_width) return breakpoints[i + 1];
            }
        }

        // Math to make sure image height is appropriate based on width. Min height is 400px
        const imgWidth = getBreakpoint();
        const imgRatio = (album.featuredImage) ? album.featuredImage.height / album.featuredImage.width : 1;
        // Ensure imgWidth is a valid number for the URL
        const numericImgWidth = (typeof imgWidth === 'number' && !isNaN(imgWidth)) ? imgWidth : breakpoints[breakpoints.length - 1]; // Default to a sensible width
        const featuredImageUrl = (album.featuredImage) ? `https://${IMAGEDELIVERYHOST}/public/${album.featuredImage.id}-${album.featuredImage.filename}?width=${numericImgWidth}` : "";
        let imgHeight;
        if (typeof windowSize.width === 'number' && !isNaN(windowSize.width)) {
            imgHeight = Math.min(windowSize.width * imgRatio, 400);
        } else {
            imgHeight = 300; // Default height when windowSize.width is not yet available
        }
        // Style for header image
        const parallaxStyle = {
            backgroundImage: `url(${featuredImageUrl})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            minHeight: Math.max(200, isNaN(imgHeight) ? 200 : imgHeight),
            backgroundSize: '',
        }

        return (
            <>
                <div className='d-flex align-items-end' style={parallaxStyle}>
                    <div
                        style={{ background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 20%, hsla(0, 0%, 0%, 0.5))', width: '100%' }}
                        className="d-flex align-items-end">
                        <ShowEditButton />
                        <MDBContainer >
                            <div className='text-justify-start text-light'>
                                <div className='ms-3 d-flex justify-items-start align-items-end'>
                                    <h2 className="p-0 d-inline-block text-start ">{album.title}</h2>
                                    <div className="vr ms-2 me-2 " style={{ height: '40px' }}></div>
                                    <h5 className="p-1 d-inline-block text-start">{date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</h5>
                                </div>
                            </div>
                        </MDBContainer>
                    </div>
                </div>
                <MDBContainer breakpoint='xl'>
                    <p className='text-start ms-1 me-1 mt-2 p-1'>{album.desc}</p >
                </MDBContainer>
            </>
        );
    }

    // Returns header followed by photogrid of photos. Passes key traits as props. 
    return (
        <>
            <AlbumHeader />
            {
                (editMode) ? <EditAlbum album_url={album_url} setEditMode={setEditModeAndPullAlbum} /> : <></>}
            <MDBContainer breakpoint='xl'>
                <PhotoGrid
                    setFeaturedImg={updateFeaturedImg}
                    selectedAlbum={album}
                    editMode={editMode}
                    signedIn={authStatus.authStatus === "authenticated"}
                />
            </MDBContainer>
        </>
    );
}



