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
    // MDBTypography,
} from 'mdb-react-ui-kit';

import { Link } from 'react-router-dom';
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
    const [currentVisibleAlbums, setCurrentVisibleAlbums] = useState([]);
    const [nextToken, setNextToken] = useState([]);

    // Used 
    const [selectedTagsIndexes, setSelectedTagsIndexes] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    function dateFormat(date) {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }

    // Fetches list of tags and initial albums on load
    useEffect(() => {
        fetchTags();
        fetchInitialAlbums();
    }, []);

    // Adds ability to adjust column layout after resize
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


    //  	Breakpoints. Breakpoint will be set to the last value before window width. Index will be the number of columns
    //   Example  breakpoints = [0 ,  350, 750, 900, 1300]
    //         number columns = [0 ,   1 ,  2 , 3  ,   4 ]
    //         Window with of 850 will have 2 columns. 2000 will have 4

    const breakPoints = [0, 350, 750, 1200];
    // const breakPoints = [0,0];

    // Gets breakpoint for current width
    function getBreakpoint() {
        const cur_width = windowSize.width;
        for (let i = breakPoints.length - 1; i >= 0; i--) {
            if (breakPoints[i] < cur_width) return i;
        }
    }


    // Responsiveness functions
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
    const height_style = imgHeight < 0 ? {} : { 'height': imgHeight, 'object-fit': 'cover' }

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

    const fetchNextAlbums = useCallback(async () => {
        if (isLoading || !nextToken) return;

        setIsLoading(true);

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
        } else {
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
    async function fetchTags() {
        const tags = await fetchPublicAlbumTags();
        const tagsSelected = tags.map((tag, i) => ({ ...tag, selected: false, visible: true, index: i }))

        setAllTags(tagsSelected);
    }

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

            // Hides all tags except the currently selected one. Later, update this to intersection instead
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
            // console.log(taggedConnections);
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

    async function onSelectTag(tag) {
        const newSelectedTags = { ...selectedTagsIndexes, [tag.index]: tag.id };
        getFilteredAlbums(newSelectedTags);
    }

    async function onDeselectTag(tag) {
        const newSelectedTags = selectedTagsIndexes;
        delete newSelectedTags[tag.index];
        getFilteredAlbums(newSelectedTags);
    }

    // async function deselectAllTags(){
    // 	getFilteredAlbums({});
    // }

    function Tags({ tags }) {
        if (tags.length < 1) {
            return (
                <>
                    <Tag name='____' />
                </>)
        }
        // console.log(tags);
        return (
            <div className='p-1 pb-0'>
                {tags.map((tag) => (
                    (tag.visible) ? <Tag
                        key={tag.id}
                        selected={tag.selected}
                        name={tag.title}
                        onSelect={() => onSelectTag(tag)}
                        onDeselect={() => onDeselectTag(tag)}
                    /> : <></>
                ))}
                {/*<MDBBtn rounded className='text-light m-1' size='sm' color='dark' onClick={()=>deselectAllTags()}>Clear</MDBBtn>*/}
            </div>
        );
    }


    const placeHolderItems = [1, 2, 3, 4, 5, 6].map((a, i) => (
        <MDBCard background='dark' className='text-white m-1 mb-2 bg-image hover-overlay' alignment='end'>
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


    const responsiveItems =
        currentVisibleAlbums.map((album, i) => (
            <Link to={`/albums/${urlhelperEncode(album)}`} className="text-light" key={i}>
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