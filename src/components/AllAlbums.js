import React, { useContext, useState, useEffect } from 'react';

import {
	MDBRow,
	MDBCol,
	MDBBtn,
	MDBCard,
	MDBCardTitle,
	MDBCardText,
	MDBCardOverlay,
	MDBCardImage,
	MDBCardBody,
	MDBCardSubTitle,
	MDBCardLink,
	MDBIcon,
	MDBTypography
} from 'mdb-react-ui-kit';

import {AlbumsContext} from '../helpers/AlbumsContext';
import {Link} from 'react-router-dom';
import Tag from './Tag';

import {albumTagsAlbumsByAlbumsId} from '../graphql/queries';

// Helpers
import getFeaturedImgs from '../helpers/getFeatured';
import {urlhelperEncode} from '../helpers/urlhelper';
import {IMAGEDELIVERYHOST} from './App';
import {fetchAllAlbumTags} from '../helpers/loaders';


export default function AllAlbums(){

	const {albums} = useContext(AlbumsContext);
	const [allTags, setAllTags] = useState([]);
	const [currentVisibleAlbums, setCurrentVisibleAlbums] = useState([]);
	const [nextToken, setNextToken] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  	});

	function dateFormat(date){
		const d = new Date(date);
		return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
	}

	useEffect(()=> {
		fetchTags();
		setCurrentVisibleAlbums(albums);
	}, []);

	useEffect(()=> {
		getFilteredAlbums();

	}, [selectedTags]);


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

 	{/*Breakpoints. Breakpoint will be set to the last value before window width. Index will be the number of columns
  Example  breakpoints = [0 ,  350, 750, 900, 1300]
        number columns = [0 ,   1 ,  2 , 3  ,   4 ]
        Window with of 850 will have 2 columns. 2000 will have 4

  */}
  const breakPoints = [0, 350, 750, 1200];
 // const breakPoints = [0,0];

  // Gets breakpoint for current width
  function getBreakpoint() {
    const cur_width = windowSize.width;
    for (let i = breakPoints.length-1; i >= 0; i--){
        if (breakPoints[i] < cur_width ) return i;
    }
  }


  // Responsiveness functions
  const num_columns = getBreakpoint();
  function getImgHeight() {
  	if (windowSize.width < 750) {
  		return -1
  	} if (windowSize.width <= 992) {
  		return (windowSize.width*2/6);
  	} else {
  		return (windowSize.width*0.833*0.6667/num_columns)
  	}
  }
  const imgHeight = getImgHeight();
  const height_style = imgHeight<0?{}:{'height':imgHeight, 'object-fit':'cover'}

   // Holds the columns for the photo grid 
  const columns = new Array(num_columns);

    // Splits the images into the right number of columns
  for (let i = 0; i < currentVisibleAlbums.length; i++) {
    const item = currentVisibleAlbums[i];
    const columnIndex = i % num_columns;

    if (!columns[columnIndex]) {
      columns[columnIndex] = [];
    }
    columns[columnIndex].push(item);
  }

  // ///////////////////
  // TAGS
  // //////////////////
  async function fetchTags(){
		  const tags = await fetchAllAlbumTags();
    	setAllTags(tags);
	}

	async function getFilteredAlbums(){
		// gets filtered albums based on the current tag
	}

	async function onSelectTag(tag){
		const newTags = [...selectedTags, tag];
		setSelectedTags(newTags);
	}

	async function onDeselectTag(tag){
		const newTags = selectedTags.filter((t) => t.id !== tag.id);
		setSelectedTags(newTags);
	}



	function AlbumCards() {
		if (currentVisibleAlbums.length < 1) return;

		return (

			<div className="d-flex">
				{columns.map((column) => (
					<MDBCol className=''>
						{column.map( (album, i) => (
							<Link to={`/albums/${urlhelperEncode(album)}`} className="text-light">
							 <MDBCard background='dark' className='text-white m-1 mb-2 bg-image hover-overlay' alignment='end'>
							 
						      <MDBCardImage overlay
						       src={`https://${IMAGEDELIVERYHOST}/public/${album.featuredImage.url}?width=1920`}
						       alt='...'
						       style={height_style}
						       className=''/>
						      <MDBCardOverlay style={{background: 'linear-gradient(to top, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))'}}>
						        <MDBCardTitle>{album.title}</MDBCardTitle>
						        {(album.desc.length > 0)?<MDBCardText className='text-truncate'>{album.desc}</MDBCardText>:<></>}
						        <MDBCardText>{dateFormat(album.date)}</MDBCardText>
						      </MDBCardOverlay>
						      <div className='mask overlay'
                      			style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
						      </MDBCard>
						    </Link>))}
						</MDBCol>

				))}
			</div>

		);
	}

	return(
		<MDBCol lg='10' className="me-auto ms-auto">
				<MDBRow className='mt-1'>
					<MDBCol>
					{allTags.map((tag, i ) => (
					<Tag 
		    		selected={false}
		    		name={tag.title}
		    		onSelect={() => onSelectTag(tag)}
		    		onDeselect={() => onDeselectTag(tag)}
		    	/>
						))}
		    	</MDBCol>
		    </MDBRow>
			<AlbumCards/>
		</MDBCol>
		);



};