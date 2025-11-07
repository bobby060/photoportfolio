"use client"
import React, { useEffect, useState, useRef } from "react";
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

// Hooks
import { useAuth } from '../hooks/useAuth';
import { useRepositories } from '../hooks/useRepositories';

/**
 * @brief React Component for creating an album
 * 
 * 
 * @returns 
 */
export default function CreateAlbum() {
    const router = useRouter();
    const { isAdmin, requireAdmin } = useAuth();
    const { albums: albumRepo, images: imageRepo } = useRepositories();

    // Files in file picker selected for update
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // Total pics uploaded sucessfully
    const [totalUploaded, setTotalUploaded] = useState(0);

    // Error message text
    const [warningText, setWarningText] = useState('');

    const clientRef = useRef(false);

    // Redirect non-admin users
    useEffect(() => {
        if (!isAdmin) {
            router.push('/');
        }
    }, [isAdmin, router]);

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
        setWarningText('');

        try {
            // Require admin privileges
            await requireAdmin();

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

            // Data for new album
            const albumData = {
                title: cleaned_title,
                desc: form.get("desc"),
                date: cleaned_date,
                type: 'Album',
                privacy: 'public' // Default to public
            };

            // Create album
            const newAlbum = await albumRepo.createAlbum(albumData);
            console.log('Created album:', newAlbum.id);

            // Upload images with progress tracking
            const uploadResults = await imageRepo.uploadMultipleImages(
                newAlbum.id,
                Array.from(selectedFiles),
                (completed, total) => {
                    setTotalUploaded(completed);
                }
            );

            // Check if any uploads succeeded
            const successfulUploads = uploadResults.filter(r => r.success);

            if (successfulUploads.length > 0) {
                // Set first uploaded image as featured image
                const firstImage = successfulUploads[0].data;
                await albumRepo.updateAlbum(newAlbum.id, {
                    albumsFeaturedImageId: firstImage.id
                });
            }

            console.log(`Successfully created album: ${cleaned_title}`);
            console.log(`Uploaded ${successfulUploads.length} of ${selectedFiles.length} images`);

            // Navigate to home
            router.push('../');
            event.target.reset();
            setIsLoading(false);

        } catch (error) {
            console.error('Failed to create album:', error);
            setWarningText(`Failed to create album: ${error.message}`);
            setIsLoading(false);
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