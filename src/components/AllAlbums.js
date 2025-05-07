/* 
AllAlbums.js
React Component
Responsive grid of all albums. Only fetches a certain amount of options at a time. 

Essentially a wrapper for ResponsiveGrid

Relies on two pieces of external data that must be fetched after load:
- AlbumTags: available tags to filter by, from the server
- Albums: First n albums, load on scroll



Author: Robert Norwood, OCT 2023
*/

"use client"

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import {
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardTitle,
    MDBCardText,
    MDBCardOverlay,
    MDBCardImage,
} from 'mdb-react-ui-kit';

import Link from 'next/link';
import Tag from './Tag';
import ResponsiveGrid from './ResponsiveGrid';

import { albumTagsAlbumsByAlbumTagsId, albumByDate } from '../graphql/customQueries';

// Helpers
import { urlhelperEncode } from '../helpers/urlhelper';
import { fetchPublicAlbumTags } from '../helpers/loaders';
import projectConfig from '../helpers/Config';

// import {createDefaultTags} from '../helpers/upgrade_database';
const client = generateClient({
    authMode: 'apiKey'
});

export default function AllAlbums() {

    // const { albums } = useContext(AlbumsContext);
    const [allTags, setAllTags] = useState([]);

    // All albums fetched from server
    const [currentVisibleAlbums, setCurrentVisibleAlbums] = useState([]);

    // API token for next set of albums to fetch from server
    const [nextToken, setNextToken] = useState([]);

    // Stores indexes for which tags are selected in the current album
    const [selectedTagsIndexes, setSelectedTagsIndexes] = useState({});

    // Displays visual indicators when waiting on fetches
    const [isLoading, setIsLoading] = useState(false);

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    /**
     * @brief Formats date input
     * 
     * @param {string} date 
     * @returns formatted date
     */
    function dateFormat(date) {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }

    // Fetches list of tags and first 10 albums on load
    useEffect(() => {
        fetchTags();
        fetchInitialAlbums();
    }, []);

    // Updates the windowsize state object on resize
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


    /*  Breakpoints. Breakpoint will be set to the last value before window width. Index will be the number of columns
        Example  breakpoints = [0 ,  350, 750, 900, 1300]
        number columns = [0 ,   1 ,  2 , 3  ,   4 ]
        Window with of 850 will have 2 columns. 2000 will have 4
     */
    const breakPoints = [0, 350, 750, 1200];
    // const breakPoints = [0,0];

    /** 
     * @brief How many columns to have, based on width
     * 
     * @returns number of columns
     */
    function getBreakpoint() {
        const cur_width = windowSize.width;
        for (let i = breakPoints.length - 1; i >= 0; i--) {
            if (breakPoints[i] < cur_width) return i;
        }
    }


    // Responsiveness functions
    // TODO: make an actual function
    const num_columns = getBreakpoint();
    function getImgHeight() {
        if (windowSize.width < 750) {
            return -1
        } if (windowSize.width <= 992) {
            return (windowSize.width * 2 / 6);
        } else {
            return (windowSize.width * 0.833 * 0.6667 / num_columns)
        }
    }
    const imgHeight = getImgHeight();

    // Ensures cover image always fills its container width-wise
    const height_style = imgHeight < 0 ? {} : { 'height': imgHeight, 'objectFit': 'cover' }

    /**
     * @brief fetches the first 8 albums from API
     */
    async function fetchInitialAlbums() {
        setIsLoading(true);
        const res = await client.graphql({
            query: albumByDate,
            variables: {
                limit: 8,
            }
        });

        setNextToken(res.data.albumByDate.nextToken);
        setCurrentVisibleAlbums(res.data.albumByDate.items);
        setIsLoading(false);

    }

    // Fetches next 4 albums
    const fetchNextAlbums = useCallback(async () => {
        if (isLoading || !nextToken) return;

        setIsLoading(true);

        // Case: no tags are selected. Load all albums in date order
        if (Object.keys(selectedTagsIndexes).length < 1) {
            const res = await client.graphql({
                query: albumByDate,
                variables: {
                    limit: 4,
                    nextToken: nextToken
                }
            })
            const newAlbums = [...currentVisibleAlbums, ...res.data.albumByDate.items];

            setCurrentVisibleAlbums(newAlbums);
        }
        // Case: tags selected. Only pull albums by the currently selected tag (right now tags act more like folders)
        else {
            const result = await client.graphql({
                query: albumTagsAlbumsByAlbumTagsId,
                variables: {
                    albumTagsId: selectedTagsIndexes[0],
                    limit: 2,
                    nextToken: nextToken
                },
            });

            const taggedConnections = result.data.albumTagsAlbumsByAlbumTagsId.items;
            setNextToken(result.data.albumTagsAlbumsByAlbumTagsId.nextToken);
            const a = [...currentVisibleAlbums, ...taggedConnections.map((connection) => connection.albums)];
            setCurrentVisibleAlbums(a);
        }

        setIsLoading(false);
    }, [nextToken]);


    // ///////////////////
    // TAGS
    // //////////////////

    /**
     * @brief fetches all tags except featured albums and latest
     * 
     * Sets the AllTags with which are selected
     */
    async function fetchTags() {
        const tags = await fetchPublicAlbumTags();
        const tagsSelected = tags.map((tag, i) => ({ ...tag, selected: false, visible: true, index: i }))

        setAllTags(tagsSelected);
    }

    /**
     * @brief gets albums associated with selected tags
     * 
     * @param {object} tagIndexes Tag indexes
     */
    async function getFilteredAlbums(tagIndexes) {
        setIsLoading(true);
        const currentTagKeys = Object.keys(tagIndexes);
        // Case no tags selected
        if (currentTagKeys.length < 1) {
            // Resets initial album pull
            fetchInitialAlbums();
            // Resets tags to unselected state
            const allTagsVisible = allTags.map((tag) => ({ ...tag, visible: true, selected: false }));
            setAllTags(allTagsVisible);
        } else {
            // Gets list of all the albums associated with tag

            const result = await client.graphql({
                query: albumTagsAlbumsByAlbumTagsId,
                variables: {
                    limit: 8,
                    albumTagsId: tagIndexes[currentTagKeys[0]],
                },
            });
            const taggedConnections = result.data.albumTagsAlbumsByAlbumTagsId.items;
            setNextToken(result.data.albumTagsAlbumsByAlbumTagsId.nextToken);

            // Hides all tags except the currently selected one. TODO, update this to intersection instead
            // of exclusion
            const updatedTags = allTags.map((tag) => {
                if (tag.index in tagIndexes) {
                    return { ...tag, visible: true, selected: true };
                } else {
                    return { ...tag, visible: false }
                }
            });
            setAllTags(updatedTags);
            // Loop through to ensure intersection of all tags
            // Set visible tags to only display tags possible to select/deselect within current set
            // Update albums to reflect
            setSelectedTagsIndexes(tagIndexes);
            const newVisAlbums = taggedConnections.map((connection) => connection.albums);
            // filter here

            const sortedAlbums = newVisAlbums.sort((a, b) => {
                const aDate = new Date(a.date);
                const bDate = new Date(b.date);
                return bDate - aDate;
            });

            setCurrentVisibleAlbums(sortedAlbums);
        }
        setIsLoading(false);
        // gets filtered albums based on the current tag
    }

    /**
     * @brief when new tag selected, get the new albums based on that tag
     * 
     * Used as callback for onselect
     * 
     * @param {*} tag - tag to select
     */
    async function onSelectTag(tag) {
        const newSelectedTags = { ...selectedTagsIndexes, [tag.index]: tag.id };
        getFilteredAlbums(newSelectedTags);
    }


    /**
     * @brief actions when unselecting tag
     * 
     * Reverse of onSelectTag. Used as callback for onDeselect
     * 
     * @param {*} tag - tag to deselect
     */
    async function onDeselectTag(tag) {
        const newSelectedTags = selectedTagsIndexes;
        delete newSelectedTags[tag.index];
        getFilteredAlbums(newSelectedTags);
    }

    // async function deselectAllTags(){
    // 	getFilteredAlbums({});
    // }
    /**
     *  @brief React Component holding album tags 
     * @param {*} tag objects 
     * @returns 
     */
    function Tags({ tags }) {
        // Placeholder for while tags are loading
        if (tags.length < 1) {
            return (
                <>
                    <Tag name='____' />
                </>)
        }
        // console.log(tags);
        return (
            <div className='p-1 pb-0'>
                {/* Add items specific to this album to the fetched tag objects */}
                {tags.map((tag) => (
                    (tag.visible) ? <Tag
                        key={tag.id}
                        selected={tag.selected}
                        name={tag.title}
                        onSelect={() => onSelectTag(tag)}
                        onDeselect={() => onDeselectTag(tag)}
                    /> : <></>
                ))}
                {/* TODO: Maybe implement this later */}
                {/*<MDBBtn rounded className='text-light m-1' size='sm' color='dark' onClick={()=>deselectAllTags()}>Clear</MDBBtn>*/}
            </div>
        );
    }

    //////////////////
    // END TAGS. Following is basic construction of core component
    /////////////////


    // Placeholder albums
    const placeHolderItems = [1, 2, 3, 4, 5, 6].map((a, i) => (
        <MDBCard key={i} background='dark' className='text-white m-1 mb-2 bg-image hover-overlay' alignment='end'>
            <MDBCardImage overlay
                src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                alt='...'
                style={height_style}
                className='' />
            <MDBCardOverlay style={{ background: 'linear-gradient(to top, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))' }}>
                <MDBCardTitle><span className='placeholder col-7'></span></MDBCardTitle>
                <MDBCardText><span className='placeholder col-3'></span></MDBCardText>
            </MDBCardOverlay>
            <div className='mask overlay'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
        </MDBCard>
    ));

    // If albums have not yet been fetched from server, display responsive grid of placeholder albums
    if (!currentVisibleAlbums) {
        return (
            <>
                <MDBRow className='me-0 mt-0'>
                    <MDBCol className='d-flex justify-items-start'>
                        <Tags
                            tags={allTags}
                        />
                    </MDBCol>
                </MDBRow>
                <ResponsiveGrid
                    items={placeHolderItems}
                    breakpoints={breakPoints}
                />
            </>
        );
    }

    // Map each album object into a wrapped react element
    const responsiveItems =
        currentVisibleAlbums.map((album, i) => (
            <Link href={`/albums/${urlhelperEncode(album)}`} className="text-light text-decoration-none" key={i}>
                <MDBCard background='dark' className='text-white m-1 mb-2 bg-image hover-overlay' alignment='end'>
                    <MDBCardImage overlay
                        src={`https://${projectConfig.getValue('imageDeliveryHost')}/public/${(album.featuredImage) ? album.featuredImage.id : ''}-${(album.featuredImage) ? album.featuredImage.filename : ''}?width=1920`}
                        alt='...'
                        style={height_style}
                        className='' />
                    <MDBCardOverlay style={{ background: 'linear-gradient(to top, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))' }}>
                        <MDBCardTitle>{album.title}</MDBCardTitle>
                        {(album.desc.length > 0) ? <MDBCardText className='text-truncate'>{album.desc}</MDBCardText> : <></>}
                        <MDBCardText>{dateFormat(album.date)}</MDBCardText>
                    </MDBCardOverlay>
                    <div className='mask overlay'
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
                </MDBCard>
            </Link>
        ));

    // Return component under normal conditions (data sucessfully fetched from server)
    return (
        <>
            <MDBRow className='me-0'>
                <MDBCol className='d-flex justify-items-start'>
                    <Tags
                        tags={allTags}
                    />
                </MDBCol>
            </MDBRow>

            <div className="d-flex">
                <ResponsiveGrid
                    items={responsiveItems}
                    breakpoints={breakPoints}
                    loadNextItems={fetchNextAlbums}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            </div>
        </>
    );



}