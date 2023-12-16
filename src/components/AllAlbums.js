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


// Helpers
import getFeaturedImgs from '../helpers/getFeatured';
import {urlhelperEncode} from '../helpers/urlhelper';

export default function AllAlbums(){

	const {albums} = useContext(AlbumsContext);
	const [featuredAlbums, setFeaturedAlbums]= useState([]);

	 const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  	});


	async function updateFeatured(){
  		const a = await getFeaturedImgs(albums);
  		setFeaturedAlbums(a);
	}

	function dateFormat(date){
		const d = new Date(date);
		return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
	}

	useEffect(()=> {
		updateFeatured();
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

	function AlbumCards() {
		if (featuredAlbums.length < 1) return;

		return (
			featuredAlbums.map( (album, i) => (
				 <MDBCard background='dark' className='text-white m-4' alignment='end'>
				 <Link to={`/album/${urlhelperEncode(album)}`} className="text-light">
			      <MDBCardImage overlay
			       src={`https://d2brh14yl9j2nl.cloudfront.net/public/${album.featuredImage.url}?width=1920`}
			       alt='...'/>
			      <MDBCardOverlay style={{background: 'linear-gradient(to top, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))'}}>
			        <MDBCardTitle>{album.title}</MDBCardTitle>
			        <MDBCardText className='text-truncate'>
			          {album.desc}
			        </MDBCardText>
			        <MDBCardText>{dateFormat(album.date)}</MDBCardText>
			      </MDBCardOverlay>
			      </Link>
			    </MDBCard>

			)));
	}


	return(
		<MDBCol lg='10' className="me-auto ms-auto">
			<AlbumCards/>
		</MDBCol>
		);



};