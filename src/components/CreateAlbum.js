"use client"
import React, { useEffect, useState, useRef } from "react";
import { generateClient } from 'aws-amplify/api';
import {
    MDBClientOnly,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBInput,
    MDBTextArea,
    MDBContainer,
    MDBFile,
    MDBSpinner

} from 'mdb-react-ui-kit';

import { useRouter } from 'next/navigation';

// Database
import { createAlbums, updateAlbums, createUrl, deleteAlbums } from '../graphql/mutations';
import { imagesByAlbumsID, listImages } from '../graphql/queries';



// Helpers
import { urlhelperEncode } from '../helpers/urlhelper';
import uploadImages from '../helpers/uploadImages';
import currentUser from "../helpers/CurrentUser";

const client = generateClient({
    authMode: 'userPool'
});

/**
 * @brief React Component for creating an album
 * 
 * 
 * @returns 
 */
export default function CreateAlbum() {
    const router = useRouter();

    // Files in file picker selected for update
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Whether or not current user is admin
    const [isAdmin, setIsAdmin] = useState('loading');

    const [isLoading, setIsLoading] = useState(false);

    // Total pics uploaded sucessfully
    const [totalUploaded, setTotalUploaded] = useState(0);

    // Error message text
    const [warningText, setWarningText] = useState('');


    const clientRef = useRef(false);






    // Updates isAdmin state
    useEffect(() => {
        const userObject = new currentUser();

        userObject.isAdmin((isAdmin) => {
            setIsAdmin(isAdmin);
            if (!isAdmin) {
                router.push('/');
            }
        });

    }, [router]);

    useEffect(() => {
        if (typeof IntersectionObserver !== 'undefined') {
            clientRef.current = true;
        }
    }, []);


    // tracks files uploaded by clicker, sets state object
    async function setFiles(event) {
        const files = event.target.files;
        setSelectedFiles(files);
    }

    // Creates a new Album object along with the associated URL object. Also uploads all images currently in file picker
    // 
    /**
     * @brief creates a new album
     * 
     * Uses the current component state to create a new album
     * 
     * @param {*} event form event
     */
    async function newAlbum(event) {
        event.preventDefault();
        setIsLoading(true);
        const form = new FormData(event.target);

        // Date in format 2023-11-11T00:00:00.000Z
        const date = form.get("date") + 'T00:00:00.000Z';
        const cur_date = new Date();

        // Sets default date to current time if not set by user
        const cleaned_date = (date === 'T00:00:00.000Z') ? cur_date.toISOString() : date;
        const title = form.get("title");

        // Ensures album has a name...
        const cleaned_title = (title.length === 0) ?
            `Album created at ${cur_date.getMonth() + 1}-${cur_date.getDate()}-${cur_date.getFullYear()} at ${cur_date.getHours()}:${cur_date.getMinutes()}` : title;

        // Get a random image to ENSURE there is a featured Image, even tho this SHOULD be handled later
        const placeHolderImageRes = await client.graphql({
            query: listImages,
            limit: 1
        })

        const placeHolderImageId = placeHolderImageRes.data.listImages.items[0].id;

        // Data for image document
        const imageObjectData = {
            title: cleaned_title,
            desc: form.get("desc"),
            date: cleaned_date,
            albumsFeaturedImageId: placeHolderImageId,
            type: 'Album'
        };

        // Try to create album
        const response = await client.graphql({
            query: createAlbums,
            variables: { input: imageObjectData },
        });
        const newAlbum = response.data.createAlbums;

        // TODO: Need error handling

        // Data for url
        const urlData = {
            id: urlhelperEncode(newAlbum),
            urlAlbumId: newAlbum.id
        }
        // Tries to create url object
        try {
            await client.graphql({
                query: createUrl,
                variables: { input: urlData }
            });

        } catch (error) {
            // Deletes album if fails to create url
            console.log('failed to create url for new album', error);
            await client.graphql({
                query: deleteAlbums,
                variables: { albumId: newAlbum.id }
            })
            setWarningText('failed to create url for new album. Album deleted');
        }

        // Uploads images while updating totaluploaded
        await uploadImages(newAlbum, selectedFiles, setTotalUploaded);

        // Update featured image to the first image uploaded to the album
        try {
            const res = await client.graphql({
                query: imagesByAlbumsID,
                variables: {
                    albumsID: newAlbum.id,
                    limit: 1
                },
            });

            const img = res.data.imagesByAlbumsID.items[0]

            const featured_img_query_data = {
                id: newAlbum.id,
                albumsFeaturedImageId: img.id
            }
            const updateAlbumResponse = await client.graphql({
                query: updateAlbums,
                variables: {
                    input: featured_img_query_data
                },
            })
            const new_album = updateAlbumResponse.data.updateAlbums;
            // setWarningText(`Created new album named: ${form.get("title")}`)
            console.log(`Created new album named: ${form.get("title")}`);
            // Navigate after creating image
            // TODO(bobby): Go to newly created album. Requires updating the targets in route
            // router.push(`../albums/${urlhelperEncode(new_album)}/edit`);
            router.push(`../`);
            event.target.reset();
        } catch (error) {
            console.warn('failed to update featured img for new album. Album still created');
            setWarningText('failed to update featured img for new album. Album still created')
            event.target.reset();
        }
    }
    if (!clientRef.current) {
        return <></>
    }

    return (


        <div>
            <MDBContainer className=''>
                <h2 className="mt-2"> Create new album </h2>
                <form id="createAlbumForm" onSubmit={newAlbum}>
                    {/* Form containing title, date, and description */}
                    <MDBRow className=' justify-content-center'>
                        <MDBCol xl='3' lg='5' md='6'>
                            <MDBInput className='mb-3' label='Title' name='title' type='text' />
                            <MDBInput className='mb-3' label='Date' name='date' type='date' />
                        </MDBCol>
                        <MDBCol xl='3' lg='5' md='6'>
                            <MDBTextArea className='mb-3' label='Description' name='desc' type='text' rows={3} />
                        </MDBCol>
                    </MDBRow>
                    {/* File selector */}
                    <MDBRow className=' justify-content-center'>
                        <MDBCol xl='3' lg='5' md='6'>
                            <MDBFile
                                multiple
                                onChange={setFiles}
                                className='m-1 mb-3'
                            />
                        </MDBCol>
                    </MDBRow>
                    <SubmitButtonWrapper />
                </form>
                {isLoading ? <Loading /> : <></>}
                <p>{warningText}</p>
            </MDBContainer>
        </div>

    )


    // Submit button that only enables once files are selected
    function SubmitButtonWrapper() {
        if (selectedFiles.length < 1) return (
            <>
                <MDBBtn type='submit' className='bg-dark m-1' disabled>Create</MDBBtn>
                <p>Select photos to enable create button</p>
            </>
        );
        return (<MDBBtn className='bg-dark m-1' >Create</MDBBtn>);
    }

    // Loading indicator that displays upload progress in format x of y
    function Loading() {
        return (<>
            <MDBSpinner className="mt-3"></MDBSpinner>
            <p className='fw-light'>Creating album and uploading photo {totalUploaded} of {selectedFiles.length}</p>
        </>);
    }


}