'use client';
import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Tag from './Tag';

// Database
import {
    updateAlbums, deleteAlbums, deleteImages,
    createAlbumTags,
    createAlbumTagsAlbums, deleteAlbumTagsAlbums,
    createUrl, deleteUrl
} from '../graphql/mutations';
import { getAlbums, imagesByAlbumsID } from '../graphql/queries';

// Helpers
import { fetchAllAlbumTags } from '../helpers/loaders';
import { urlhelperEncode, getAlbumFromAlbumUrl } from '../helpers/urlhelper';
import uploadImages from '../helpers/uploadImages';
import currentUser from '../helpers/CurrentUser';

const client = generateClient({
    authMode: 'userPool'
});

const publicClient = generateClient({
    authMode: 'apiKey'
});

export default function EditAlbum({ album_url }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentTags, setCurrentTags] = useState([]);
    const [totalUploaded, setTotalUploaded] = useState(0);
    const router = useRouter();
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const adminObject = new currentUser();

    useEffect(() => {
        adminObject.isAdmin(setIsAdmin);
    }, [adminObject]);

    useEffect(() => {
        getAlbum();
        fetchTags();
        if (!isAdmin) {
            return;
        }
    }, [album_url]);

    // tracks files uploaded by clicker, sets state object
    async function setFiles(event) {
        const files = event.target.files;
        setSelectedFiles(files);
    }

    async function getAlbum() {
        // Get album tags connections by album ID here
        const curAl = await getAlbumFromAlbumUrl(album_url);
        setCurrentAlbum(curAl);

        const t = Object.fromEntries(curAl.albumtagss.items.map((item, i) => [item.albumTagsId, i]));
        setCurrentTags(t);
    }

    // Updates title, description, and date fields
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

        try {
            await client.graphql({
                query: deleteUrl,
                variables: {
                    input: {
                        id: urlhelperEncode(currentAlbum)
                    }
                }
            })
        } catch (error) {
            console.log('failed to delete old url object', error)
        }

        try {
            await client.graphql({
                query: createUrl,
                variables: {
                    input: {
                        id: urlhelperEncode(response.data.updateAlbums),
                        urlAlbumId: currentAlbum.id
                    }
                }
            })
        } catch (error) {
            console.log('new url object not created', error);
        }

        if (selectedFiles.length > 0) {
            await uploadImages(currentAlbum, selectedFiles, setTotalUploaded);
        }
        console.log(`Updated album: ${form.get("title")}`);
        // After save, navigates to album
        router.push(`/albums/${urlhelperEncode(response.data.updateAlbums)}`);
    }

    async function deleteAlbum(id) {
        setDeleting(true);
        // Make sure you really want to delete...
        if (!window.confirm("Are you sure you want to delete this album?")) return;

        // Gets all the images associated with the old album ID
        const imgs = await publicClient.graphql({
            query: imagesByAlbumsID,
            variables: { albumsID: id }
        });

        const albumToDelete = await publicClient.graphql({
            query: getAlbums,
            variables: {
                id: id
            }
        })

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

        const urlToDelete = urlhelperEncode(albumToDelete.data.getAlbums);

        await client.graphql({
            query: deleteUrl,
            variables: {
                input: { id: urlToDelete }
            }
        })
        console.log('album successfully deleted')
        // Go to root after deleting album
        router.push('/');
    }

    // TAGS
    async function fetchTags() {
        const tags = await fetchAllAlbumTags();
        setAllTags(tags);
    }

    const handleCreateTagEnter = event => {
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

    function Loading() {
        return (<>
            <MDBSpinner className="mt-3"></MDBSpinner>
            {(selectedFiles.length > 0) ? <p className='fw-light'>Saving album and uploading image {totalUploaded} of {selectedFiles.length}</p> : <p className='fw-light'>Saving album</p>}
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
                {/* Title, date, and description fields fields */}
                <MDBRow className='p-2 d-flex justify-content-center'>
                    <MDBCol xl='3' lg='5' md='6'>
                        <MDBInput className='mb-3' label='Title' name='title' type='text' defaultValue={currentAlbum.title} />
                        <MDBInput className='mb-3' label='Date' name='date' type='date' defaultValue={dateString} />
                    </MDBCol>
                    <MDBCol xl='3' lg='5' md='6'>
                        <MDBTextArea className='mb-3' label='Description' name='desc' type='text' rows={3} defaultValue={currentAlbum.desc} />
                        <MDBFile
                            id='file_upload'
                            multiple
                            onChange={setFiles}
                            className='flex-grow-1'
                        />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='d-flex justify-content-center align-items-center' >
                    <MDBCol className='d-flex justify-content-center' lg='5'>
                        <MDBBtn className='m-1' title='Delete Album' onClick={() => deleteAlbum(currentAlbum.id)} color='dark' data-mdb-toggle="tooltip" >
                            Delete Album
                        </MDBBtn>
                        <MDBBtn type='submit' className="bg-dark m-1">Save</MDBBtn>
                        <Link href={`/albums/${urlhelperEncode(currentAlbum)}`} className="text-decoration-none">
                            <MDBBtn className="bg-dark m-1">Cancel</MDBBtn>
                        </Link>
                    </MDBCol>
                </MDBRow>
                {(isLoading) ? <Loading /> : <></>}
            </form>
            {/* UI for adding/removing tags */}
            <MDBRow className='pt-2 d-flex justify-content-center align-items-center' >
                <MDBCol className='d-flex justify-content-center flex-wrap' lg='5'>
                    {allTags.map((tag, i) => (
                        <Tag
                            key={i}
                            selected={(tag.id in currentTags) ? true : false}
                            name={tag.title}
                            onSelect={() => addTagToAlbum(allTags[i])}
                            onDeselect={() => removeTagFromAlbum(allTags[i])}
                        />))}
                    <div className='m-1' style={{ 'minWidth': '60px' }}>
                        <MDBInput label='New Tag (press enter to create)' id='newTag' type='text' className='rounded' size='sm' onKeyDown={handleCreateTagEnter} />
                    </div>
                </MDBCol>
            </MDBRow>
        </>
    )
}

