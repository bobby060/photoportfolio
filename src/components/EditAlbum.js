import React, { useContext, useState, useEffect } from 'react';
// import {EXIF} from 'exif-js';
import {
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBInput,
    MDBTextArea,
    MDBSpinner,
    MDBFile,
} from 'mdb-react-ui-kit';
import { remove } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import Tag from './Tag';

// Database
import {
    updateAlbums, deleteAlbums, deleteImages,
    createAlbumTags,
    createAlbumTagsAlbums, deleteAlbumTagsAlbums
} from '../graphql/mutations';
import { imagesByAlbumsID } from '../graphql/queries';

// Helpers
import { fetchAlbums, fetchAllAlbumTags, fetchAlbum } from '../helpers/loaders';
import { urlhelperEncode, urlhelperDecode } from '../helpers/urlhelper';
import { AlbumsContext } from '../helpers/AlbumsContext';
import uploadImages from '../helpers/uploadImages';

import { fetchAuthSession } from 'aws-amplify/auth';

const client = generateClient({
    authMode: 'userPools'
});

const publicClient = generateClient({
    authMode: 'apiKey'
});



export default function EditAlbum() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { albums, setAlbums } = useContext(AlbumsContext);
    const [deleting, setDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [currentTags, setCurrentTags] = useState([]);
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(null);

    const [currentAlbum, setCurrentAlbum] = useState(null);
    let { album_id } = useParams();

    const { user } = useAuthenticator((context) => [context]);

    useEffect(() => {
        getAlbum();
        fetchTags();
        currentSession();
    }, [album_id]);

    async function currentSession() {
        try {
            const { at, idToken } = (await fetchAuthSession()).tokens ?? {};
            await setAccessToken(at);
            if (!accessToken
                || !accessToken.payload['cognito:groups']
                || accessToken.payload['cognito:groups'][0] !== 'portfolio_admin') {
                throw new Error('401, Not authorized');
            }
        } catch (err) {
            console.log(err);
        }
    }


    // Helper that determines which album in the albums list the url album_id is triggering the component to pull
    async function findIndex(albums) {
        for (let i = 0; i < albums.length; i++) {
            if (urlhelperDecode(albums[i], album_id)) {
                return i;
            }
        }
        throw new Error(`404. Album at url, ${album_id}, was not found!`);
    }


    // tracks files uploaded by clicker, sets state object
    async function setFiles(event) {
        const files = event.target.files;
        setSelectedFiles(files);
    }

    async function getAlbum() {
        // setAlbumIndex(-1);
        // If albums wasn't already set, fetch them. This should be removed by better data handling in future versions.
        const newA = (albums.length < 1) ? await fetchAlbums() : albums;
        const index = await findIndex(newA);
        if (index < 0) {
            throw new Error(`404. Album at url, ${album_id}, was not found!`);
        }
        // Get album tags connections by album ID here
        const curAl = await fetchAlbum(albums[index].id);
        setCurrentAlbum(curAl);

        const t = Object.fromEntries(curAl.albumtagss.items.map((item, i) => [item.albumTagsId, i]));
        setCurrentTags(t);


        // const data = {
        // 	albumsID: currentAlbum.id,
        // }
        // const tags = await API.graphql({
        // 	query: allTagsAlbumsByAlbumsId
        // })

    }

    // Updates title, description, and date fields
    // Doesn't error handle if user deletes date and title, need to fix
    async function updateAlbum(event) {
        event.preventDefault();
        setIsLoading(true);
        if (deleting) return;
        const form = new FormData(event.target);
        const date = form.get("date") + 'T00:00:00.000Z';
        const data = {
            id: currentAlbum.id,
            title: form.get("title"),
            desc: form.get("desc"),
            date: date,
        };
        const response = await client.graphql({
            query: updateAlbums,
            variables: { input: data },
        });
        if (selectedFiles.length > 0) {
            await uploadImages(currentAlbum, selectedFiles);
        }
        const updatedAlbums = await fetchAlbums();
        setAlbums(updatedAlbums);
        console.log(`Updated album: ${form.get("title")}`);
        // After save, navigates to album
        navigate('../../albums/'.concat(urlhelperEncode(response.data.updateAlbums)));
    }

    async function deleteAlbum(id) {
        setDeleting(true);
        // Make sure you really want to delete...
        if (!window.confirm("Are you sure you want to delete this album?")) return;
        // setAlbumIndex(-1);
        // Remove album being deleted from the current list of albums
        const newAlbums = albums.filter((album) => album.id !== id);
        setAlbums(newAlbums);

        // Gets all the images associated with the old album ID
        const imgs = await publicClient.graphql({
            query: imagesByAlbumsID,
            variables: { albumsID: id }
        });

        // Deletes albums associated with old album
        imgs.data.imagesByAlbumsID.items.map(async (img) => {
            await remove({
                key: `${img.id}-${img.filename}`
            });
            await client.graphql({
                query: deleteImages,
                variables: { input: { id: img.id } },
            });
        });
        await client.graphql({
            query: deleteAlbums,
            variables: { input: { id } },
        });
        console.log('album successfully deleted')
        // Go to root after deleting album
        navigate('../../');
    }



    // //////////////////////////////////////
    // TAGS
    // /////////////////////////////////////

    async function fetchTags() {
        const tags = await fetchAllAlbumTags();
        setAllTags(tags);
    }

    const handleCreateTagEnter = event => {
        // event.preventDefault();
        if (event.key === 'Enter') {
            console.log(`enter key pressed, tag name is ${event.target.value}`);
            createTag(event.target.value);
            event.target.value = "";
        }

    }

    async function createTag(name) {
        for (let i = 0; i < allTags.length; i++) {
            if (allTags[i].title.toUpperCase() === name.toUpperCase()) {
                alert("Cannot create duplicate tags!")
                return;
            }
        }
        const data = {
            title: name,
            privacy: 'public',
        };
        await client.graphql({
            query: createAlbumTags,
            variables: { input: data },
        });
        fetchTags();
    }

    async function addTagToAlbum(tag) {
        const data = {
            albumsId: currentAlbum.id,
            albumTagsId: tag.id,
        }
        await client.graphql({
            query: createAlbumTagsAlbums,
            variables: { input: data },
        })

    }

    async function removeTagFromAlbum(tag) {
        const relationIdToRemove = currentAlbum.albumtagss.items[currentTags[tag.id]];
        const data = {
            id: relationIdToRemove.id
        }
        await client.graphql({
            query: deleteAlbumTagsAlbums,
            variables: { input: data },
        })
    }

    //  async function deleteTag(id){
    //  		// Need to also delete all related connections
    //  			await API.graphql({
    // 	      query: deleteAlbumTags,
    // 	      variables: { input: { id } },
    // 	    });
    // 	    fetchTags();
    //  		}






    function Loading() {
        return (<>
            <MDBSpinner className="mt-3"></MDBSpinner>
            {(selectedFiles.length > 0) ? <p className='fw-light'>Saving album and uploading photos</p> : <p className='fw-light'>Saving album</p>}
        </>);
    }

    if (!currentAlbum) {
        return (
            <MDBSpinner className='m-3'>

            </MDBSpinner>);
    }


    // Ensures the date is formatted correctly
    const date = new Date(currentAlbum.date);
    const d = date.getDate();
    const d2 = (d < 10) ? '0'.concat(d) : String(d);
    const month = date.getMonth() + 1;
    const month2 = (month < 10) ? '0'.concat(month) : String(month);
    const year = date.getFullYear();
    const dateString = String(year).concat('-', month2, '-', d2);

    return (
        <>
            <form onSubmit={updateAlbum}>
                <MDBRow className='mt-3 d-flex justify-content-center'>
                    <MDBCol xl='3' lg='5' md='6'>
                        <MDBInput className='mb-3' label='Title' name='title' type='text' defaultValue={currentAlbum.title} />
                        <MDBInput className='mb-3' label='Date' name='date' type='date' defaultValue={dateString} />
                    </MDBCol>
                    <MDBCol xl='3' lg='5' md='6'>
                        <MDBTextArea className='mb-3' label='Description' name='desc' type='text' rows={3} defaultValue={currentAlbum.desc} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='d-flex justify-content-center'>
                    <MDBCol sm='12'>
                        <label for='file_upload'> Upload more images </label>
                    </MDBCol>
                    <MDBCol lg='6' className='d-flex' >
                        <MDBFile
                            id='file_upload'
                            multiple
                            onChange={setFiles}
                            className='m-1 mb-1 flex-grow-1'
                        // label='Add more photos to album'
                        />
                        {/* Need to update so that UI makes more sense */}
                        <MDBBtn disabled className="bg-dark m-1">Upload</MDBBtn>
                    </MDBCol>
                </MDBRow>
                <MDBRow className='d-flex justify-content-center align-items-center' >
                    <MDBCol className='d-flex justify-content-center' lg='5'>
                        <MDBBtn className='m-1' title='Delete Album' onClick={() => deleteAlbum(currentAlbum.id)} color='dark' data-mdb-toggle="tooltip" >
                            Delete Album
                        </MDBBtn>
                        <MDBBtn type='submit' className="bg-dark m-1">Save</MDBBtn>
                        <MDBBtn className="bg-dark m-1"><Link className='text-light' to={`/albums/${urlhelperEncode(currentAlbum)}`}>Cancel</Link></MDBBtn>
                    </MDBCol>
                </MDBRow>

                {(isLoading) ? <Loading /> : <></>}
            </form>
            <MDBRow className='d-flex justify-content-center align-items-center' >
                <MDBCol className='d-flex justify-content-center flex-wrap' lg='5'>
                    {allTags.map((tag, i) => (
                        <Tag
                            key={i}
                            selected={(tag.id in currentTags) ? true : false}
                            // selected={false}
                            name={tag.title}
                            onSelect={() => addTagToAlbum(allTags[i])}
                            onDeselect={() => removeTagFromAlbum(allTags[i])}
                        />))}
                    <div className='m-1' style={{ 'min-width': '60px' }}>
                        <MDBInput label='New Tag (press enter to create)' id='newTag' type='text' className='rounded' size='sm' onKeyDown={handleCreateTagEnter} />
                    </div>
                </MDBCol>
            </MDBRow>
        </>

    )
}

