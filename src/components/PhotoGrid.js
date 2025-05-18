/**PhotoGrid.js
 * @brief base React Component that  really displays album
 * 
 * @todo combine with Album component
 * 
 * @author Robert Norwood
 * @date October, 2023 
 * @last_modified May 16, 2025
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    MDBBtn,
    MDBIcon,
} from 'mdb-react-ui-kit';

import { } from '@aws-amplify/ui-react';
import { remove } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { IMAGEDELIVERYHOST } from '../helpers/Config';
// Database
import { imagesByAlbumsID } from '../graphql/queries';
import { deleteImages as deleteImageMutation } from '../graphql/mutations';
import ResponsiveGrid from "./ResponsiveGrid";

// Components
import { Lightbox } from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import ImageWrapper from "./Image";

import { breakpoints } from "./Home";

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


// Number of images to load per fetch
const numImagesToLoad = 10;




/** 
 * @param {
 *  setFeaturedImg - callback for setting the feature image
 *  selectedAlbum - album object to display
 *  editMode - should user be able to set featured img or delete etc. 
 *  signedIn - is there a user signed in
 * } 
 * @returns React Component
 */
export default function PhotoGrid({ setFeaturedImg, selectedAlbum, editMode = false, signedIn = false }) {



    // Ref for loading state, avoids race condition
    const isLoadingFetching = useRef(false);


    // State for lightbox
    const [open, setOpen] = useState(false);

    // Tracks index for Lightbox    
    const [index, setIndex] = useState(0);

    // Stores items to display in grid/lightbox
    const [items, setItems] = useState([]);

    // Holds next token for data
    const [nextToken, setNextToken] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);

    // Fetches next set of items when bottom of scroll is reached
    const fetchData = useCallback(async () => {

        // Don't fetch more data if already loading or no more data to fetch
        if (isLoadingFetching.current || nextToken === null) return;


        setIsLoading(true);
        isLoadingFetching.current = true;

        try {
            const queryData = {
                albumsID: selectedAlbum.id,
                limit: numImagesToLoad
            }
            if (nextToken !== -1) {
                queryData.nextToken = nextToken;
            }

            let res = await client.graphql({
                query: imagesByAlbumsID,
                variables: queryData
            });

            if (!res || !res.data) {
                console.error("Error fetching data", res);
                setIsLoading(false);
                return;
            }

            const newItems = res.data.imagesByAlbumsID.items;
            setItems(items => [...items, ...newItems].map((img, i) => {
                img.index = i;
                return img
            }));

            setNextToken(res.data.imagesByAlbumsID.nextToken);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setIsLoading(false);
            isLoadingFetching.current = false;
            return;

        }

    }, [nextToken, selectedAlbum.id]);


    // Effect to trigger initial data fetch for an album
    useEffect(() => {
        if (nextToken === -1 && selectedAlbum.id && items.length === 0 && !isLoadingFetching.current) {
            fetchData();
        }
    }, [nextToken, selectedAlbum.id, items.length, fetchData]);






    // Deletes image object and source image on AWS
    // TODO(bobby): extract to a Model function
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
    if (items.length === 0 && nextToken !== null) {
        return;
    } else if (items.length === 0 && nextToken === null) {
        return (<div className='text-center'>No images found for this album</div>)
    }

    // Slides object for lightbox doesn't hold full image object, just the url
    const slides = items.map((image) => {
        const urlNoSpaces = `${image.id}-${image.filename}`.replaceAll(' ', '%20');
        return ({
            src: `https://${IMAGEDELIVERYHOST}/public/${image.id}-${image.filename}`,
            alt: image.filename,

            downloadUrl: `https://${IMAGEDELIVERYHOST}/public/${urlNoSpaces}`,
            width: image.width,
            height: image.height,
        });
    }
    );


    function confirmDeleteImage(image) {
        if (typeof window !== 'undefined' && window.confirm("Are you sure you want to delete this image?")) {
            deleteImage(image);
        }
    }

    // Delete image button that renders when edit mode is on
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
                <ImageWrapper
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



    return (
        <div className="d-flex photo-album">
            <ResponsiveGrid
                items={responsiveProps}
                breakpoints={breakpoints}
                loadNextItems={fetchData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
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