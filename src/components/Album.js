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
import { getImages } from '../graphql/queries';
import { updateAlbums } from '../graphql/mutations';

// Helper functions
import { urlhelperDecode } from '../helpers/urlhelper';
import { getAlbumFromAlbumUrl } from '../helpers/urlhelper';
import fetchAlbums from '../helpers/fetchAlbums';
import { AlbumsContext } from '../helpers/AlbumsContext';
import projectConfig from '../helpers/Config';
import currentUser from '../helpers/CurrentUser';

// Components
import PhotoGrid from './PhotoGrid';

const client = generateClient({
    authMode: 'apiKey'
});
export default function Album() {
    const { albums, setAlbums } = useContext(AlbumsContext);
    // const[album, setAlbum] = useState(null);
    const [albumIndex, setAlbumIndex] = useState(-1);
    const [album, setAlbum] = useState([]);
    const [canEdit, setCanEdit] = useState(false);
    let { album_url, album_id } = useParams();
    const [featuredImg, setFeaturedImg] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    const debug = false;

    const authStatus = useAuthenticator((context) => [context.authStatus.authStatus]);
    let location = useLocation();

    // Initializes images after component render
    useEffect(() => {
        pullAlbum();
        adminObject.isAdmin(setIsAdmin);
    }, [album_url, location]);

    const adminObject = new currentUser();



    // Helper that determines which album in the albums list the url album_id is triggering the component to pull
    async function findIndex(albums) {
        for (let i = 0; i < albums.length; i++) {
            if (urlhelperDecode(albums[i], album_url)) {
                return i;
            }
        }
        return -1;
    }

    // Loads images associated with album being rendered
    async function pullAlbum() {
        if (location.pathname.endsWith('edit')) {
            setCanEdit(true);
        } else {
            setCanEdit(false);
        }
        setAlbumIndex(-1);
        const curAlbum = await getAlbumFromAlbumUrl(album_url);
        console.log(curAlbum);
        setAlbum(curAlbum);
        // If albums wasn't already set, fetch them. This should be removed by better data handling in future versions.
        const newA = (albums.length < 1) ? await fetchAlbums() : albums;

        const index = await findIndex(newA);
        if (index < 0) {
            throw new Error(`404. Album at url, ${album_url}, was not found!`);
        }// setSelectedAlbum(newA.at(index));


        if (albums.length < 1) setAlbums(newA);
        const data = {
            id: newA[index].albumsFeaturedImageId
        }
        if (newA[index].albumsFeaturedImageId) {
            const image = await client.graphql({
                query: getImages,
                variables: data,
            });
            setFeaturedImg(image.data.getImages);
        }

        setAlbumIndex(index);
        if (debug) { console.log(`images set`) }
    }

    // Sets a selected image as the album featured image
    async function updateFeaturedImg(image) {
        const data = {
            id: albums[albumIndex].id,
            albumsFeaturedImageId: image.image.id
        }
        const response = await client.graphql({
            query: updateAlbums,
            variables: {
                input: data
            },
        })
        const new_album = response.data.updateAlbums;
        pullAlbum();
        const newAlbums = albums.map((album) => {
            if (album.id === new_album.id) return new_album;
            return album;
        });
        setAlbums(newAlbums);
    }

    // Image handler functions

    if (albumIndex < 0) {
        return (
            <div className='d-flex align-items-end' style={{ height: '500px' }}>
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

    const date = new Date(albums[albumIndex].date);



    function ShowEditButton() {
        if (isAdmin) {
            return (<MDBBtn floating onClick={() => setCanEdit(true)} color='light' className='m-2'><Link to="edit" className='text-dark'><MDBIcon far icon="edit" /></Link></MDBBtn>);
        }

        return;
    }

    function AlbumHeader() {

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
        const imgWidth = getBreakpoint();
        const imgRatio = (featuredImg) ? featuredImg.height / featuredImg.width : 1;
        const featuredImageUrl = (featuredImg) ? `https://${projectConfig.getValue('imageDeliveryHost')}/public/${featuredImg.id}-${featuredImg.filename}?width=${imgWidth}` : "";
        const imgHeight = Math.min(windowSize.width * imgRatio, 400);

        const parallaxStyle = {
            backgroundImage: `url(${featuredImageUrl})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            minHeight: imgHeight,
            backgroundSize: '',
        }

        return (
            <div className='d-flex align-items-end' style={parallaxStyle}>
                <div
                    style={{ background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 20%, hsla(0, 0%, 0%, 0.5))', width: '100%' }}
                    className="d-flex align-items-end">
                    <ShowEditButton />
                    <MDBContainer >
                        <div className='text-justify-start text-light'>
                            <div className='ms-3 d-flex justify-items-start align-items-end'>
                                <h2 className="p-0 d-inline-block text-start ">{albums[albumIndex].title}</h2>
                                <div className="vr ms-2 me-2 " style={{ height: '40px' }}></div>
                                <h5 className="p-1 d-inline-block text-start">{date.getMonth() + 1}/{date.getDate()}/{date.getFullYear()}</h5>
                            </div>

                            <p className='text-start ms-3 me-3'>{albums[albumIndex].desc} </p>
                        </div>
                    </MDBContainer>

                </div>
            </div>
        );
    }

    return (
        <>
            <AlbumHeader />
            <Outlet />
            <MDBContainer breakpoint='xl'>
                <PhotoGrid
                    setFeaturedImg={updateFeaturedImg}
                    selectedAlbum={albums[albumIndex]}
                    editMode={canEdit}
                    signedIn={authStatus.authStatus === "authenticated"}

                />
            </MDBContainer>
        </>
    );

}



