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
import Link from 'next/link';

// Hooks
import { useAlbum } from '../hooks/useAlbums';
import { useAuth } from '../hooks/useAuth';
import { useRepositories } from '../hooks/useRepositories';

// Helper functions
import { IMAGEDELIVERYHOST } from '../helpers/Config';

// Components
import PhotoGrid from './PhotoGrid';
import EditAlbum from './EditAlbum';

export default function Album({ album_url }) {
    const { albums: albumRepo } = useRepositories();
    const { isAuthenticated, isAdmin } = useAuth();
    const { album, loading, refetch } = useAlbum(album_url);

    const [editMode, setEditMode] = useState(false);
    const [localAlbum, setLocalAlbum] = useState(null);

    // Update local album when hook data changes
    useEffect(() => {
        if (album) {
            setLocalAlbum(album);
        }
    }, [album]);


    // Sets a selected image as the album featured image
    async function updateFeaturedImg(image) {
        try {
            const updatedAlbum = await albumRepo.updateAlbum(localAlbum.id, {
                albumsFeaturedImageId: image.image.id
            });
            setLocalAlbum(updatedAlbum);
        } catch (error) {
            console.error('Failed to update featured image:', error);
        }
    }


    // Placeholder while loading
    if (loading || !localAlbum) {
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

    const date = new Date(localAlbum.date);

    function setEditModeAndPullAlbum(editMode) {
        setEditMode(editMode);
        // Refetch album data after editing
        refetch().then(albumData => {
            if (albumData) {
                setLocalAlbum(albumData);
            }
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
        const imgRatio = (localAlbum.featuredImage) ? localAlbum.featuredImage.height / localAlbum.featuredImage.width : 1;
        // Ensure imgWidth is a valid number for the URL
        const numericImgWidth = (typeof imgWidth === 'number' && !isNaN(imgWidth)) ? imgWidth : breakpoints[breakpoints.length - 1]; // Default to a sensible width
        const featuredImageUrl = (localAlbum.featuredImage) ? `https://${IMAGEDELIVERYHOST}/public/${localAlbum.featuredImage.id}-${localAlbum.featuredImage.filename}?width=${numericImgWidth}` : "";
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
                                    <h2 className="p-0 d-inline-block text-start ">{localAlbum.title}</h2>
                                    <div className="vr ms-2 me-2 " style={{ height: '40px' }}></div>
                                    <h5 className="p-1 d-inline-block text-start">{date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</h5>
                                </div>
                            </div>
                        </MDBContainer>
                    </div>
                </div>
                <MDBContainer breakpoint='xl'>
                    <p className='text-start ms-1 me-1 mt-2 p-1'>{localAlbum.desc}</p >
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
                    selectedAlbum={localAlbum}
                    editMode={editMode}
                    signedIn={isAuthenticated}
                />
            </MDBContainer>
        </>
    );
}



