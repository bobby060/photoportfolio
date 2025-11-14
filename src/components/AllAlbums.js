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


import React, { useContext, useState, useEffect, useCallback } from 'react';
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

// Hooks
import { useAlbums, useAlbumTags } from '../hooks/useAlbums';
import { useRepositories } from '../hooks/useRepositories';

// Helpers
import { IMAGEDELIVERYHOST } from '../helpers/Config';
import { breakpoints } from './Home';

export default function AllAlbums() {
    const { albums: albumRepo } = useRepositories();

    // Fetch all public albums (no caching needed for filtered views)
    const { albums: allPublicAlbums, loading: albumsLoading } = useAlbums({
        filter: 'public',
        useCache: false
    });

    // Fetch tags
    const { tags: fetchedTags, loading: tagsLoading } = useAlbumTags({
        filter: 'public'
    });

    const [allTags, setAllTags] = useState([]);

    // All albums fetched from server
    const [currentVisibleAlbums, setCurrentVisibleAlbums] = useState([]);

    // Number of albums to display initially and increment
    const [displayCount, setDisplayCount] = useState(8);

    // Stores indexes for which tags are selected in the current album
    const [selectedTagsIndexes, setSelectedTagsIndexes] = useState({});

    // Displays visual indicators when waiting on fetches
    const [isLoading, setIsLoading] = useState(false);

    // Filtered albums when tag is selected
    const [filteredAlbums, setFilteredAlbums] = useState([]);

    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
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

    // Initialize tags when fetched
    useEffect(() => {
        if (fetchedTags && fetchedTags.length > 0) {
            const tagsSelected = fetchedTags.map((tag, i) => ({
                ...tag,
                selected: false,
                visible: true,
                index: i
            }));
            setAllTags(tagsSelected);
        }
    }, [fetchedTags]);

    // Update visible albums when allPublicAlbums or filters change
    useEffect(() => {
        if (Object.keys(selectedTagsIndexes).length < 1) {
            // No tags selected - show all albums
            setCurrentVisibleAlbums(allPublicAlbums.slice(0, displayCount));
        } else {
            // Tags selected - show filtered albums
            setCurrentVisibleAlbums(filteredAlbums.slice(0, displayCount));
        }
    }, [allPublicAlbums, filteredAlbums, displayCount, selectedTagsIndexes]);

    // Updates the windowsize state object on resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        if (typeof window !== 'undefined') {
            handleResize();
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    /** 
     * @brief How many columns to have, based on width
     * 
     * @returns number of columns
     */
    function getBreakpoint() {
        const cur_width = windowSize.width;
        for (let i = breakpoints.length - 1; i >= 0; i--) {
            if (breakpoints[i] < cur_width) return i;
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

    // Load more albums (infinite scroll)
    const fetchNextAlbums = useCallback(async () => {
        if (isLoading) return;

        const sourceAlbums = Object.keys(selectedTagsIndexes).length < 1
            ? allPublicAlbums
            : filteredAlbums;

        // Check if there are more albums to load
        if (displayCount >= sourceAlbums.length) return;

        setIsLoading(true);

        // Simply increase the display count to show more albums
        setTimeout(() => {
            setDisplayCount(prev => prev + 4);
            setIsLoading(false);
        }, 100);
    }, [isLoading, displayCount, allPublicAlbums, filteredAlbums, selectedTagsIndexes]);


    // ///////////////////
    // TAGS
    // //////////////////

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
            // Reset to show all albums
            setFilteredAlbums([]);
            setDisplayCount(8);

            // Resets tags to unselected state
            const allTagsVisible = allTags.map((tag) => ({
                ...tag,
                visible: true,
                selected: false
            }));
            setAllTags(allTagsVisible);
        } else {
            try {
                // Gets list of all the albums associated with tag
                const tagId = tagIndexes[currentTagKeys[0]];
                const taggedAlbums = await albumRepo.getAlbumsByTag(tagId);

                // Hides all tags except the currently selected one
                const updatedTags = allTags.map((tag) => {
                    if (tag.index in tagIndexes) {
                        return { ...tag, visible: true, selected: true };
                    } else {
                        return { ...tag, visible: false }
                    }
                });
                setAllTags(updatedTags);
                setSelectedTagsIndexes(tagIndexes);

                // Sort albums by date
                const sortedAlbums = taggedAlbums.sort((a, b) => {
                    const aDate = new Date(a.date);
                    const bDate = new Date(b.date);
                    return bDate - aDate;
                });

                setFilteredAlbums(sortedAlbums);
                setDisplayCount(8);
            } catch (error) {
                console.error('Failed to fetch filtered albums:', error);
            }
        }
        setIsLoading(false);
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

    // If albums are still loading, display responsive grid of placeholder albums
    const isInitialLoading = albumsLoading && allPublicAlbums.length === 0 && Object.keys(selectedTagsIndexes).length === 0;

    if (isInitialLoading) {
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
                    breakpoints={breakpoints}
                />
            </>
        );
    }

    // Generate album URL from album object
    function generateAlbumUrl(album) {
        const ending = album.id.slice(-2);
        const name = album.title.toLowerCase().replace(/\s+/g, '-');
        return `${name}-${ending}`;
    }

    // Map each album object into a wrapped react element
    const responsiveItems =
        currentVisibleAlbums.map((album, i) => (
            <Link href={`/albums/${generateAlbumUrl(album)}`} className="text-light text-decoration-none" key={i}>
                <MDBCard background='dark' className='text-white m-1 mb-2 bg-image hover-overlay' alignment='end'>
                    <MDBCardImage overlay
                        src={`https://${IMAGEDELIVERYHOST}/public/${(album.featuredImage) ? album.featuredImage.id : ''}-${(album.featuredImage) ? album.featuredImage.filename : ''}?width=720`}
                        alt='...'
                        style={height_style}
                        className='' />
                    <MDBCardOverlay style={{ background: 'linear-gradient(to top, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))' }}>
                        <MDBCardTitle>{album.title}</MDBCardTitle>
                        {(album.desc && album.desc.length > 0) ? <MDBCardText className='text-truncate'>{album.desc}</MDBCardText> : <></>}
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
                    breakpoints={breakpoints}
                    loadNextItems={fetchNextAlbums}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            </div>
        </>
    );



}