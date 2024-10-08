/* 
Album.js
Contains component for Album wrapper

Contains extra options that can only be executed by an admin user group user

Basically is just a PhotoGrid wrapped in an album header


Author: Robert Norwood, OCT 2023
*/


import React, { useState, useEffect, useContext } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBIcon,
} from 'mdb-react-ui-kit';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Outlet, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";

// Database
import { updateAlbums } from '../graphql/mutations';

// Helper functions
import { getAlbumFromAlbumUrl } from '../helpers/urlhelper';
import projectConfig from '../helpers/Config';
import currentUser from '../helpers/CurrentUser';

// Components
import PhotoGrid from './PhotoGrid';

const client = generateClient({
    authMode: 'apiKey'
});


const userGroupClient = generateClient({
    authMode: 'userPool'
});

export default function Album() {
    // State variables
    const [album, setAlbum] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    let { album_url, album_id } = useParams();
    // const [featuredImg, setFeaturedImg] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const authStatus = useAuthenticator((context) => [context.authStatus.authStatus]);
    let location = useLocation();

    // Initializes images after component render
    useEffect(() => {
        pullAlbum();
        adminObject.isAdmin(setIsAdmin);
    }, [album_url, location]);

    const adminObject = new currentUser();

    // Loads images associated with album being rendered
    async function pullAlbum() {
        if (location.pathname.endsWith('edit')) {
            setCanEdit(true);
        } else {
            setCanEdit(false);
        }
        const curAlbum = await getAlbumFromAlbumUrl(album_url);
        await setAlbum(curAlbum);
    }

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
        pullAlbum();
    }

    // Image handler functions

    // Placeholder while loading
    if (!album) {
        return (
            <div className='d-flex align-items-end' style={{ height: '400px' }}>
                <div
                    style={{ background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 20%, hsla(0, 0%, 0%, 0.5))', width: '100%' }}
                    className="d-flex align-items-end">
                    {/*            <MDBSpinner role='status'>
              <span className='visually-hidden'>Loading...</span>
            </MDBSpinner>*/}
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


    // React Component for edit button. Only shows if user is admin.
    function ShowEditButton() {
        if (isAdmin) {
            return (<MDBBtn floating onClick={() => setCanEdit(true)} color='light' className='m-2'><Link to="edit" className='text-dark'><MDBIcon far icon="edit" /></Link></MDBBtn>);
        }

        return;
    }

    // React Component that shows the top portion of album, including title, description, and featured image
    function AlbumHeader() {

        // Makes AlbumHeader responsive
        const [windowSize, setWindowSize] = useState({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        useEffect(() => {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }, []);


        const breakpoints = [0, 750, 1200, 1920];

        function getBreakpoint() {
            const cur_width = windowSize.width;
            for (let i = breakpoints.length - 2; i >= 0; i--) {
                if (breakpoints[i] < cur_width) return breakpoints[i + 1];
            }
        }

        // Math to make sure image height is appropriate based on width. Min height is 400px
        const imgWidth = getBreakpoint();
        const imgRatio = (album.featuredImage) ? album.featuredImage.height / album.featuredImage.width : 1;
        const featuredImageUrl = (album.featuredImage) ? `https://${projectConfig.getValue('imageDeliveryHost')}/public/${album.featuredImage.id}-${album.featuredImage.filename}?width=${imgWidth}` : "";
        const imgHeight = Math.min(windowSize.width * imgRatio, 400);

        // Style for header image
        const parallaxStyle = {
            backgroundImage: `url(${featuredImageUrl})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            minHeight: imgHeight,
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

    // Returns header followed by photogrid of photos. Passes key traits as props. Outlet is where Edit component is rendered
    return (
        <>
            <AlbumHeader />
            <Outlet />
            <MDBContainer breakpoint='xl'>
                <PhotoGrid
                    setFeaturedImg={updateFeaturedImg}
                    selectedAlbum={album}
                    editMode={canEdit}
                    signedIn={authStatus.authStatus === "authenticated"}

                />
            </MDBContainer>
        </>
    );

}



