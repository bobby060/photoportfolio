import React, { useEffect, useContext, useState } from "react";
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBInput,
    MDBTextArea,
    MDBContainer,
    MDBFile,
    MDBSpinner
} from 'mdb-react-ui-kit';

import { useNavigate } from "react-router-dom";

// Database
import { createAlbums, updateAlbums, createUrl, deleteAlbums } from '../graphql/mutations';
import { imagesByAlbumsID, listImages } from '../graphql/queries';


// Helpers
import { urlhelperEncode } from '../helpers/urlhelper';
import fetchAlbums from '../helpers/fetchAlbums';
import uploadImages from '../helpers/uploadImages';
import currentUser from "../helpers/CurrentUser";

const client = generateClient({
    authMode: 'userPool'
});


export default function CreateAlbum() {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isAdmin, setIsAdmin] = useState('loading');
    const [isLoading, setIsLoading] = useState(false);
    const [totalUploaded, setTotalUploaded] = useState(0);
    const [warningText, setWarningText] = useState('');
    const userObject = new currentUser();



    useEffect(() => {
        userObject.isAdmin(setIsAdmin);
    }, []);


    useEffect(() => {
        redirectIfNotAdmin();
    }, [isAdmin]);

    function redirectIfNotAdmin() {
        console.log(isAdmin);
        if (!isAdmin) {
            navigate('/');
        }
    }

    // function handleNew(){
    // 	document.getElementById("createAlbumForm").submit();
    // }


    // tracks files uploaded by clicker, sets state object
    async function setFiles(event) {
        const files = event.target.files;
        setSelectedFiles(files);
    }

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
        // Get a random image to ENSURE there is a featured Image, even tho this should be handled later
        const placeHolderImageRes = await client.graphql({
            query: listImages,
            limit: 1
        })

        const placeHolderImageId = placeHolderImageRes.data.listImages.items[0].id;


        const data = {
            title: cleaned_title,
            desc: form.get("desc"),
            date: cleaned_date,
            albumsFeaturedImageId: placeHolderImageId,
            type: 'Album'
        };

        const response = await client.graphql({
            query: createAlbums,
            variables: { input: data },
        });
        const newAlbum = response.data.createAlbums;

        const urlData = {
            id: urlhelperEncode(newAlbum),
            urlAlbumId: newAlbum.id
        }
        try {
            await client.graphql({
                query: createUrl,
                variables: { input: urlData }
            });

        } catch (error) {
            console.log('failed to create url for new album', error);
            await client.graphql({
                query: deleteAlbums,
                variables: { albumId: newAlbum.id }
            })
            setWarningText('failed to create url for new album. Album deleted');
        }

        await uploadImages(newAlbum, selectedFiles, setTotalUploaded);

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
            setWarningText(`Created new album named: ${form.get("title")}`)
            console.log(`Created new album named: ${form.get("title")}`);
            navigate(`../albums/${urlhelperEncode(new_album)}/edit`);
            event.target.reset();
        } catch (error) {
            console.warn('failed to update featured img for new album. Album still created');
            setWarningText('failed to update featured img for new album. Album still created')
            event.target.reset();
        }
    }



    return (
        <MDBContainer className=''>
            <h2 className="mt-2"> Create new album </h2>
            <form id="createAlbumForm" onSubmit={newAlbum}>
                <MDBRow className=' justify-content-center'>
                    <MDBCol xl='3' lg='5' md='6'>
                        <MDBInput className='mb-3' label='Title' name='title' type='text' />
                        <MDBInput className='mb-3' label='Date' name='date' type='date' />
                    </MDBCol>
                    <MDBCol xl='3' lg='5' md='6'>
                        <MDBTextArea className='mb-3' label='Description' name='desc' type='text' rows={3} />
                    </MDBCol>
                </MDBRow>
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
    )



    function SubmitButtonWrapper() {
        if (selectedFiles.length < 1) return (
            <>
                <MDBBtn type='submit' className='bg-dark m-1' disabled>Create</MDBBtn>
                <p>Select photos to enable create button</p>
            </>
        );
        return (<MDBBtn className='bg-dark m-1' >Create</MDBBtn>);
    }

    function Loading() {

        return (<>
            <MDBSpinner className="mt-3"></MDBSpinner>
            <p className='fw-light'>Creating album and uploading photo {totalUploaded} of {selectedFiles.length}</p>
        </>);
    }


}