/**PhotoGrid.js
 * @brief base React Component that  really displays album
 * 
 * @todo combine with Album component
 * 
 * @author Robert Norwood
 * @date October, 2023 
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    MDBBtn,
    MDBIcon,
} from 'mdb-react-ui-kit';
import {
    MDBCol, MDBRow,
} from 'mdb-react-ui-kit';
import { } from '@aws-amplify/ui-react';
import { remove } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import projectConfig from '../helpers/Config';
// Database
import { imagesByAlbumsID } from '../graphql/queries';
import { deleteImages as deleteImageMutation } from '../graphql/mutations';

// Components
import { Lightbox } from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import ResponsiveGrid from "./ResponsiveGrid";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import Image from "./Image";
// import "animate.css/animate.min.css";
// import { AnimationOnScroll } from 'react-animation-on-scroll';

// Inputs:
// setFeaturedImg - callback to set an image as the albums featured image
// editMode - lets photogrid know if it is in edit mode
// selectedAlbum - where photogrid is pulling photos from
const client = generateClient({
    authMode: 'apiKey'
});

const userGroupClient = generateClient({
    authMode: 'userPool'
});

const numImagesToLoad = 4;

const breakpoints = [0, 350, 750, 1200];

/** 
 * @param {
 *  setFeaturedImg - callback for setting the feature image
 *  selectedAlbum - album object to display
 *  editMode - should user be able to set featured img or delete etc
 *  signedIn - is there a user signed in
 * } 
 * @returns React Component
 */
export default function PhotoGrid({ setFeaturedImg, selectedAlbum, editMode = false, signedIn = false }) {

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [yOffset, setYOffset] = useState(0);

    const observerTarget = useRef(null);


    // Observer for infinite scroll
    const sizeRef = useRef();
    // Observer for infinite scroll



    const [open, setOpen] = React.useState(false);

    // Tracks index for Lightbox
    const [index, setIndex] = React.useState(0);

    // Stores items to display in grid/lightbox
    const [items, setItems] = useState([]);




    // Holds next token for data
    const [nextToken, setNextToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (sizeRef.current) {
            const y = sizeRef.current.offsetTop;
            setYOffset(y);
        }
    }, []);


    // Fetches next set of items when bottom of scroll is reached
    const fetchData = useCallback(async () => {


        if (isLoading || !nextToken) return;


        // Don't fetch more data if already loading
        setIsLoading(true);

        let res = null;

        if (nextToken === -1) {
            res = await client.graphql({
                query: imagesByAlbumsID,
                variables: {
                    albumsID: selectedAlbum.id,
                    limit: numImagesToLoad
                },
            });
        } else {

            res = await client.graphql({
                query: imagesByAlbumsID,
                variables: {
                    albumsID: selectedAlbum.id,
                    limit: numImagesToLoad,
                    nextToken: nextToken
                },
            });
        }

        if (!res) {
            setIsLoading(false);
            return;
        }


        setItems(items => [...items, ...res.data.imagesByAlbumsID.items].map((img, i) => {
            img.index = i;
            return img
        }));
        setIsLoading(false);

        console.log(nextToken);

        setNextToken(res.data.imagesByAlbumsID.nextToken);


        // }
    }, [nextToken, selectedAlbum.id]);


    // Fetches initial data
    useEffect(() => {
        getImages();
        // fetchData();
    }, []);



    // Requests the first n images
    async function getImages() {

        // Only lets this be called when no images are loaded. Kinda a hacky solution.
        if (items.length > 0) return;
        setIsLoading(true);
        // Pulls the image objects associated with the selected album
        const res = await client.graphql({
            query: imagesByAlbumsID,
            variables: {
                albumsID: selectedAlbum.id,
                limit: numImagesToLoad
            },
        });
        const imgs = res.data.imagesByAlbumsID.items.map((img, i) => {
            img.index = i;
            return img
        });
        const nextT = res.data.imagesByAlbumsID.nextToken;
        setNextToken(nextT);

        setItems(imgs);
        setIsLoading(false);
    }

    // Initalizes intersection observer to call each time observer enters view
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    fetchData();
                }
            },
            // { threshold: 1 }
        );

        const obsCurrent = observerTarget.current;

        if (obsCurrent && !isLoading) {
            observer.observe(obsCurrent);
        }

        return () => {
            if (obsCurrent) {
                observer.unobserve(obsCurrent);
            }
        };
    }, [isLoading, fetchData]);

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

    // Gets breakpoint for current width
    function getBreakpoint() {
        const cur_width = windowSize.width;
        for (let i = breakpoints.length - 1; i >= 0; i--) {
            if (breakpoints[i] < cur_width) return i;
        }
    }



    // Deletes image object and source image on AWS
    async function deleteImage(image) {
        const newImages = items.filter((img) => img.id !== image.id);
        await remove({
            key: `${image.id}-${image.filename}`
        });
        await userGroupClient.graphql({
            query: deleteImageMutation,
            variables: { input: { id: image.id } },
        });
        console.log(`image with ID ${image.id} is deleted from album`);
        setItems(newImages);
    }

    // Ensures grid does not render if no items are in props
    if (items.length === 0) return;

    // Slides object for lightbox doesn't hold full image object, just the url
    const slides = items.map((image) => {
        const urlNoSpaces = `${image.id}-${image.filename}`.replaceAll(' ', '%20');
        return ({
            src: `https://${projectConfig.getValue('imageDeliveryHost')}/public/${image.id}-${image.filename}`,
            alt: image.filename,

            downloadUrl: `https://${projectConfig.getValue('imageDeliveryHost')}/public/${urlNoSpaces}`,
            width: image.width,
            height: image.height,
        });
    }
    );

    // srcSet:[ 
    //   { src: `https://${IMAGEDELIVERYHOST}/public/${urlNoSpaces}?width=1920`, width: 1920},
    //   ],




    function confirmDeleteImage(image) {
        if (window.confirm("Are you sure you want to delete this image?")) {
            deleteImage(image);
        }
    }

    function DeleteImageWrapper(image) {
        if (!deleteImage || !editMode) {
            return;
        }
        return (<MDBBtn floating className="position-absolute top-0 end-0 btn-light m-1" onClick={() => confirmDeleteImage(image.image)} color='text-dark' data-mdb-toggle="tooltip" title="Delete photo"  >
            <MDBIcon fas icon="times text-dark" size='2x' />
        </MDBBtn>);
    }

    // Wrapper for setting an image as the featured image
    function MakeFeaturedWrapper(image) {
        if (!setFeaturedImg || !editMode) {
            return;
        }

        if (selectedAlbum.albumsFeaturedImageId && image.image.id === selectedAlbum.albumsFeaturedImageId) {
            return (<MDBBtn floating className="position-absolute bottom-0 end-0 btn-light m-1" title='Set Featured' disabled MDBColor='text-dark' data-mdb-toggle="tooltip" >
                <MDBIcon fas icon="star text-dark" size='2x' />
            </MDBBtn>);
        }
        return (<MDBBtn floating className="position-absolute bottom-0 end-0 btn-light m-1"
            onClick={() => (setFeaturedImg(image))}
            MDBColor='text-dark'
            data-mdb-toggle="tooltip"
            title="Set Featured"  >
            <MDBIcon far icon="star text-dark" size='2x' />
        </MDBBtn>);
    }
    const responsiveProps = items.map((image, i) => (
        <div className='m-0 p-1' key={i}>
            <div className='bg-image hover-overlay position-relative'>
                <Image
                    img_obj={image}
                    className='img-fluid shadow-4'
                    alt={image.filename}
                />
                <a type="button" >
                    <div className='mask overlay' onClick={() => (setOpen(true), setIndex(image.index))}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                </a>
                <DeleteImageWrapper
                    image={image} />
                <MakeFeaturedWrapper
                    image={image} />
            </div>
        </div>
    ))

    console.log(items);

    const num_columns = getBreakpoint();

    // Holds the columns for the photo grid 
    const columns = new Array(num_columns);
    // Splits the images into the right number of columns
    for (let i = 0; i < responsiveProps.length; i++) {
        const item = responsiveProps[i];
        const columnIndex = i % num_columns;

        if (!columns[columnIndex]) {
            columns[columnIndex] = [];
        }
        columns[columnIndex].push(item);
    }




    return (
        <div className="d-flex photo-album">
            <div ref={sizeRef}>
                <MDBRow className='m-1' style={{ minHeight: `calc(100vh-${yOffset}` }}>
                    {columns.map((column, i) => (
                        <MDBCol className="column p-0" key={i}>
                            {column.map((item) => (
                                item
                            ))}
                        </MDBCol>
                    ))}

                </MDBRow>
                <p className='display-block' ref={observerTarget}></p>
            </div>
            {/* <div ref={observerTarget}></div> */}
            <Lightbox
                index={index}
                slides={slides}
                close={() => setOpen(false)}
                open={open}
                controller={{ closeonBackDropClick: true }}
                styles={{ container: { backgroundColor: "rgba(0, 0, 0, .5)" } }}
                plugins={signedIn ? [Download, Zoom] : [Zoom]}
                on={{ view: ({ index: currentIndex }) => setIndex(currentIndex) }}
                zoom={{
                    maxZoomPixelRatio: 1
                }}
                render={{
                    iconZoomIn: () => { },
                    iconZoomOut: () => { },
                }}
            />

        </div>
    );
}