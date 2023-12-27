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
import { API, Storage } from 'aws-amplify';
import {listImages} from '../graphql/queries';
import {AlbumsContext} from '../helpers/AlbumsContext';
import {Link} from 'react-router-dom';

// Components
import Carousel from 'react-bootstrap/Carousel';
import Image from './Image';
import AllAlbums from './AllAlbums';
import FeaturedCarouselWrapper from './Carousel';

// Helpers
import getFeaturedImgs from '../helpers/getFeatured';
import {urlhelperEncode} from '../helpers/urlhelper';
import {IMAGEDELIVERYHOST} from './App';

// import {createDefaultTags} from '../helpers/upgrade_database';


// import {upgradeDB} from '../helpers/upgrade_database';

export default function Home(){
	const {albums} = useContext(AlbumsContext);
	const [featuredAlbums, setFeaturedAlbums]= useState([]);
	const [headerImgs, setHeaderImgs]=useState([]);
	const [windowSize, setWindowSize] = useState({
	    width: window.innerWidth,
	    height: window.innerHeight,
	  });

	useEffect(() => {
	updateFeatured();
	getHeaderImgs();
	const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }; 

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
	}, []);

	async function getHeaderImgs(){
		const response = await Storage.list('highlights/h', {
			options: {
				listAll: true,
				pageSize: 50,
			}
		})

		console.log(response.results);

		const urls = response.results.map((item) => `https://${IMAGEDELIVERYHOST}/public/${item.key}?width=1280`);
		setHeaderImgs(urls);
	}

	async function updateFeatured(){
  		const a = await getFeaturedImgs(albums);
  		setFeaturedAlbums(a);
	}

	function dateFormat(date){
		const d = new Date(date);
		return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
	}

	// style={{height: '600px'}}
	// style={{ width:'100%', height:'100%', 'object-fit': 'cover'}}

	function HeaderCarousel(){
		const s = { width:windowSize.width, height: windowSize.height,'objectFit': 'cover'};
		if(headerImgs.length < 1) return(
			<Carousel indicators={false} interval = {2500} style={s} controls={false} pause={false}>
						<Carousel.Item itemID={1} className='overflow-hidden placeholder' >
								{/*<img src = {album.featuredImage.filename} className='d-block w-100' alt='...' />*/}
							<Carousel.Caption className='placeholder-glow' style={{'backgroundColor': 'rgba(0, 0, 0, 0.3)'}}>
								<span className="placeholder w-25"/>
								<span className="placeholder w-25"/>
							</Carousel.Caption>
						</Carousel.Item>
			</Carousel>
			);
		return (	
			<Carousel fade indicators={false} interval = {3000} controls={false} pause={false} >
				{headerImgs.map((img, i) =>
					(
						<Carousel.Item  itemID={i} key={i}  >
								<img src = {img} alt='...'
								style={s} 
								 />
						</Carousel.Item>
						))}
			</Carousel>);

	}

	function AlbumCards() {
		if (featuredAlbums.length < 1) return;

		return (
			featuredAlbums.map( (album, i) => (
				 <MDBCard background='dark' className='text-white m-4' alignment='end'>
				 <Link to={`/albums/${urlhelperEncode(album)}`} className="text-light">
			      <MDBCardImage overlay
			       src={`https://${IMAGEDELIVERYHOST}/public/${album.featuredImage.url}?width=1920`}
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
	<div>
		<HeaderCarousel/>
		<div className='p-3'>
		 <h2 className='m-0 fw-light'>
		 	Featured Albums
		 </h2>
		</div>
		<MDBCol lg='10' className='me-auto ms-auto'>
		<FeaturedCarouselWrapper/>
		</MDBCol>
		<span id="albums"/>
		<MDBCol lg='10' className='me-auto ms-auto'>
		{/*<AlbumCards/>*/}
		<div className='p-3'>
		 <h2 className='m-0 fw-light'>
		 	All Albums
		 </h2>
		</div>
		<hr className="hr m-0" />
		<AllAlbums/>
		</MDBCol>
		 <MDBCard
				alignment='start'
		 		className='text-dark'
		 		background='light'
		 		className='p-3'
		 	  style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          borderRadius: 0,
        }}>
      <MDBCardBody>
        <MDBCardTitle>Robert Norwood</MDBCardTitle>
				      <MDBTypography className='lead d-none d-sm-block' >
				        Through pictures we see the world not just for what it is, but for what it can be
				      </MDBTypography>
        <div className='text-center'>
        	<MDBBtn outline href='#albums' color='dark' className="m-1">Photos</MDBBtn>
        	{/*<MDBBtn  outline color='dark' className="m-1" onClick={()=>createDefaultTags()}>Upgrade DB</MDBBtn>*/}
        	<MDBBtn href='https://github.com/bobby060' target="_blank" outline color='dark' className="m-1">Coding</MDBBtn>
        </div>
      </MDBCardBody>
    </MDBCard>
    <a href="#albums">
    <MDBIcon fas icon="angle-down" size='4x' color='white-50'
    	style={{
          position: 'absolute',
          top: '95%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex:1,
        }}
    />
    </a>

	</div>

	);


};