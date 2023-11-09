import React, { useState, useEffect } from 'react';
import {
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBDropdown,
	MDBDropdownToggle,
	MDBDropdownMenu,
	MDBDropdownItem,
	MDBCarousel,
	MDBCarouselItem,
	// MDBCarouselCaption,
} from 'mdb-react-ui-kit';
import Carousel from 'react-bootstrap/Carousel';
import { API, Storage } from 'aws-amplify';
import {listAlbums} from '../graphql/queries';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useOutletContext } from "react-router-dom";
import Album from './Album';
import addURL from '../helpers/addURL';
import {getImages} from '../graphql/queries';

export default function Home(){
	const [selectedAlbum, setSelectedAlbum, albums] = useOutletContext();
	const [featuredImgs, setFeaturedImg] = useState([]);


	useEffect(() => {
    	updateFeaturedImg();
  	}, []);


  	async function updateFeaturedImg() {
			const new_feat_img = await Promise.all(albums.map(async (album) => {
					const data = {
						id: album.albumsFeaturedImageId
					}
					const image = await API.graphql({
						query: getImages,
						variables: data,
						authMode: 'API_KEY'
					});
					const featuredImage =  await addURL(image.data.getImages);
					return { ...album, featuredImage: featuredImage};
			  	}));
			setFeaturedImg(new_feat_img);
	}

	function CarouselWrapper(){
		console.log(albums.length);
		console.log(`featured alb length ${featuredImgs.length}`);
		if(albums.length < 1) return(
			<Carousel indicators={false} interval = {3000}>
						<Carousel.Item itemId={1} className='w-100 overflow-hidden placeholder' style={{height: '600px'}}>
								{/*<img src = {album.featuredImage.filename} className='d-block w-100' alt='...' />*/}
							<Carousel.Caption className='placeholder-glow' style={{'background-color': 'rgba(0, 0, 0, 0.3)'}}>
								<span class="placeholder w-25"/>
								<span class="placeholder w-25"/>
							</Carousel.Caption>
						</Carousel.Item>
			</Carousel>
			);
		if(featuredImgs.length < 1) updateFeaturedImg();
		return (	
			<Carousel indicators={false} interval = {3000}>
				{featuredImgs.map((album, i) =>
					(
						<Carousel.Item itemId={i} className='w-100 ' style={{height: '600px'}}>
								<img src = {album.featuredImage.filename} className='h-100 w-100 object-fit-cover' alt='...' 
								 style={{ width:'100%', height:'100%', 'object-fit': 'cover'}}/>
							<Carousel.Caption className='' style={{'background-color': 'rgba(0, 0, 0, 0.3)'}}>
								<h5>{album.title}</h5>
								<p>{album.desc}</p>
							</Carousel.Caption>
						</Carousel.Item>
						))}
			</Carousel>);
	}

	function AlbumWrapper() {
		if(selectedAlbum.length<1){
			return (<h2> 
				Please select an album to view it!
			</h2> );
		}
	  	return(<Album
			curAlbum = {selectedAlbum}
			/>);
	}

	function DropdownWrapper(){
      if(albums.length < 1) return;
      return (
          <MDBDropdown>
            <MDBDropdownToggle tag='a' className='btn-tertiary text-dark'>
              Albums
            </MDBDropdownToggle>
            <MDBDropdownMenu >
              {albums.map((album) => (
                <MDBDropdownItem link onClick={() => {setSelectedAlbum(album)}}>{album.title}</MDBDropdownItem>
                ))}
            </MDBDropdownMenu>
          </MDBDropdown>
        );
    }

return(
	<div>
		<CarouselWrapper/>
		<DropdownWrapper/>
		<AlbumWrapper/>
	</div>

	);


};