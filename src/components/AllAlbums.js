import React, { useContext, useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import {
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardTitle,
    MDBCardText,
    MDBCardOverlay,
    MDBCardImage,
    // MDBTypography,
    MDBSpinner
} from 'mdb-react-ui-kit';

import { AlbumsContext } from '../helpers/AlbumsContext';
import { Link } from 'react-router-dom';
import Tag from './Tag';
import ResponsiveGrid from './ResponsiveGrid';

import { albumTagsAlbumsByAlbumTagsId } from '../graphql/queries';

// Helpers
import { urlhelperEncode } from '../helpers/urlhelper';
import { IMAGEDELIVERYHOST } from './App';
import { fetchPublicAlbumTags } from '../helpers/loaders';

// import {createDefaultTags} from '../helpers/upgrade_database';


export default function AllAlbums() {

    const { albums } = useContext(AlbumsContext);
    const [allTags, setAllTags] = useState([]);
    const [currentVisibleAlbums, setCurrentVisibleAlbums] = useState([]);
    // const [nextToken, setNextToken] = useState([]);
    const [selectedTagsIndexes, setSelectedTagsIndexes] = useState([]);
    // const [visibleTagsIndexes, setVisibleTagsIndexes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    function dateFormat(date) {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }

    useEffect(() => {
        fetchTags();
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

    useEffect(() => {
        fetchTags();
        setCurrentVisibleAlbums(albums);
    }, [albums]);

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

    // Holds the columns for the photo grid 
    //  function reflowAlbums(albumsToReflow){
    // 	  const newColumns = new Array(num_columns);

    // 	    // Splits the images into the right number of columns
    // 	  for (let i = 0; i < albumsToReflow.length; i++) {
    // 	    const item = albumsToReflow[i];
    // 	    const columnIndex = i % num_columns;

    // 	    if (!newColumns[columnIndex]) {
    // 	      newColumns[columnIndex] = [];
    // 	    }
    // 	    newColumns[columnIndex].push(item);
    // 	   }
    // 	   setColumns(newColumns);
    // }

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
        const keys = Object.keys(tagIndexes);
        if (keys.length < 1) {
            setCurrentVisibleAlbums(albums);
            const allTagsVisible = allTags.map((tag) => ({ ...tag, visible: true, selected: false }));
            setAllTags(allTagsVisible);
        } else {
            // Gets list of all the albums associated with tag

            const result = await API.graphql({
                query: albumTagsAlbumsByAlbumTagsId,
                variables: {
                    albumTagsId: tagIndexes[keys[0]],
                },
                authMode: 'API_KEY',
            });
            const taggedConnections = result.data.albumTagsAlbumsByAlbumTagsId.items;
            const allTagsInvisble = allTags.map((tag) => {
                if (tag.index in tagIndexes) {
                    return { ...tag, visible: true, selected: true };
                } else {
                    return { ...tag, visible: false }
                }
            });
            setAllTags(allTagsInvisble);
            // Loop through to ensure intersection of all tags
            // console.log(taggedConnections);
            // Set visible tags to only display tags possible to select/deselect within current set
            // Update albums to reflect
            setSelectedTagsIndexes(tagIndexes);
            const newVisAlbums = taggedConnections.map((connection) => connection.albums);
            setCurrentVisibleAlbums(newVisAlbums);
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
        console.log(newSelectedTags);
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
            <>
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
            </>
        );
    }

    const responsiveItems = currentVisibleAlbums.map((album, i) => (
        <Link to={`/albums/${urlhelperEncode(album)}`} className="text-light" key={i}>
            <MDBCard background='dark' className='text-white m-1 mb-2 bg-image hover-overlay' alignment='end'>
                <MDBCardImage overlay
                    src={`https://${IMAGEDELIVERYHOST}/public/${album.featuredImage.id}-${album.featuredImage.filename}?width=1920`}
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


    function AlbumCards() {

        if (isLoading || currentVisibleAlbums.length < 1) {

            return (
                <MDBSpinner className="mt-3"></MDBSpinner>
            );
        }

        return (
            <>
                <MDBRow className='p-2 pb-0'>
                    <MDBCol className='d-flex justify-items-start' xl='12'>
                        <Tags
                            tags={allTags}
                        />
                    </MDBCol>
                </MDBRow>

                <div className="d-flex">
                    <ResponsiveGrid
                        items={responsiveItems}
                        breakpoints={breakPoints}
                    />
                </div>
            </>

        );
    }

    return (
        <MDBCol lg='10' className="me-auto ms-auto">

            <AlbumCards />
        </MDBCol>
    );



}