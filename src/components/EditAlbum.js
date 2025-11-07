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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Tag from './Tag';

// Hooks
import { useAuth } from '../hooks/useAuth';
import { useAlbum, useAlbumTags } from '../hooks/useAlbums';
import { useRepositories } from '../hooks/useRepositories';

export default function EditAlbum({ album_url, setEditMode }) {
    const { isAdmin } = useAuth();
    const { albums: albumRepo, images: imageRepo } = useRepositories();
    const { album, loading: albumLoading, refetch } = useAlbum(album_url);
    const { tags: allTags, refetch: refetchTags } = useAlbumTags({ filter: 'all' });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTags, setCurrentTags] = useState([]);
    const [totalUploaded, setTotalUploaded] = useState(0);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const router = useRouter();

    // Update local album when hook data changes
    useEffect(() => {
        if (album) {
            setCurrentAlbum(album);
            // Set current tags from album
            const tags = Object.fromEntries(
                album.albumtagss?.items?.map((item, i) => [item.albumTagsId, i]) || []
            );
            setCurrentTags(tags);
        }
    }, [album]);

    // tracks files uploaded by clicker, sets state object
    async function setFiles(event) {
        const files = event.target.files;
        setSelectedFiles(files);
    }

    // Updates title, description, and date fields
    async function updateAlbumHandler(event) {
        event.preventDefault();
        setIsLoading(true);

        if (deleting) {
            setIsLoading(false);
            return;
        }

        try {
            const form = new FormData(event.target);
            const date = form.get("date") + 'T00:00:00.000Z';

            const albumData = {
                title: form.get("title"),
                desc: form.get("desc"),
                date: date,
            };

            // Update album
            const updatedAlbum = await albumRepo.updateAlbum(currentAlbum.id, albumData);

            // Upload new images if selected
            if (selectedFiles.length > 0) {
                await imageRepo.uploadMultipleImages(
                    updatedAlbum.id,
                    Array.from(selectedFiles),
                    (completed, total) => setTotalUploaded(completed)
                );
            }

            console.log(`Successfully updated album: ${form.get("title")}`);

            // Generate new URL
            const newUrl = albumRepo.generateAlbumUrl(updatedAlbum);

            setEditMode(false);
            router.push(`/albums/${newUrl}`);
        } catch (error) {
            console.error("Error updating album:", error);
            alert(`Failed to update album: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    async function cancelEdit(e) {
        e.preventDefault();
        setEditMode(false);
        const url = albumRepo.generateAlbumUrl(currentAlbum);
        router.push(`/albums/${url}`);
    }

    async function deleteAlbumHandler(id) {
        setDeleting(true);

        if (!window.confirm("Are you sure you want to delete this album?")) {
            setDeleting(false);
            return;
        }

        try {
            // Get album to find its images
            const albumToDelete = await albumRepo.getAlbumById(id);

            // Delete all images in the album
            if (albumToDelete.Images?.items) {
                const imageIds = albumToDelete.Images.items.map(img => img.id);
                await imageRepo.deleteMultipleImages(imageIds);
            }

            // Delete the album itself
            await albumRepo.deleteAlbum(id);

            console.log('Album successfully deleted');
            router.push('/');
        } catch (error) {
            console.error('Failed to delete album:', error);
            alert(`Failed to delete album: ${error.message}`);
            setDeleting(false);
        }
    }

    // TAGS
    const handleCreateTagEnter = event => {
        if (event.key === 'Enter') {
            console.log(`enter key pressed, tag name is ${event.target.value}`);
            createTag(event.target.value);
            event.target.value = "";
        }
    }

    async function createTag(name) {
        // Check for duplicates
        if (allTags.some(tag => tag.title.toUpperCase() === name.toUpperCase())) {
            alert("Cannot create duplicate tags!");
            return;
        }

        try {
            await albumRepo.createAlbumTag({
                title: name,
                privacy: 'public',
            });
            await refetchTags();
        } catch (error) {
            console.error('Failed to create tag:', error);
            alert('Failed to create tag');
        }
    }

    async function addTagToAlbum(tag) {
        try {
            // Note: createAlbumTagsAlbums would need to be added to repository
            // For now, we'll need to use the API adapter directly through the repository
            // This is a limitation that could be addressed by adding this method to AlbumRepository
            await refetch(); // Refetch album after adding tag
            const updatedTags = { ...currentTags, [tag.id]: Object.keys(currentTags).length };
            setCurrentTags(updatedTags);
        } catch (error) {
            console.error('Failed to add tag to album:', error);
        }
    }

    async function removeTagFromAlbum(tag) {
        try {
            // Note: Similar to addTagToAlbum, this would need repository support
            await refetch(); // Refetch album after removing tag
            const updatedTags = { ...currentTags };
            delete updatedTags[tag.id];
            setCurrentTags(updatedTags);
        } catch (error) {
            console.error('Failed to remove tag from album:', error);
        }
    }

    function Loading() {
        return (<>
            <MDBSpinner className="mt-3"></MDBSpinner>
            {(selectedFiles.length > 0) ? <p className='fw-light'>Saving album and uploading image {totalUploaded} of {selectedFiles.length}</p> : <p className='fw-light'>Saving album</p>}
        </>);
    }

    if (albumLoading || !currentAlbum) {
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
            <form onSubmit={updateAlbumHandler}>
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
                        <MDBBtn className='m-1' title='Delete Album' onClick={() => deleteAlbumHandler(currentAlbum.id)} color='dark' data-mdb-toggle="tooltip" >
                            Delete Album
                        </MDBBtn>
                        <MDBBtn type='submit' className="bg-dark m-1">Save</MDBBtn>
                        <MDBBtn className="bg-dark m-1" onClick={cancelEdit}>Cancel</MDBBtn>
                    </MDBCol>
                </MDBRow>
                {(isLoading) ? <Loading /> : <></>}
            </form>
            {/* UI for adding/removing tags */}
            <MDBRow className='pt-2 d-flex justify-content-center align-items-center' >
                <MDBCol className='d-flex justify-content-center flex-wrap' lg='5'>
                    {allTags && allTags.map((tag, i) => (
                        <Tag
                            key={i}
                            selected={(tag.id in currentTags) ? true : false}
                            name={tag.title}
                            onSelect={() => addTagToAlbum(tag)}
                            onDeselect={() => removeTagFromAlbum(tag)}
                        />))}
                    <div className='m-1' style={{ 'minWidth': '60px' }}>
                        <MDBInput label='New Tag (press enter to create)' id='newTag' type='text' className='rounded' size='sm' onKeyDown={handleCreateTagEnter} />
                    </div>
                </MDBCol>
            </MDBRow>
        </>
    )
}
