import React, { useState, useEffect, useContext } from 'react';
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
	MDBBtn
	// MDBCarouselCaption,
} from 'mdb-react-ui-kit';
import Carousel from 'react-bootstrap/Carousel';
import { API, Storage } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useOutletContext } from "react-router-dom";
import Album from './Album';
import addURL from '../helpers/addURL';
import {listImages} from '../graphql/queries';
import CarouselWrapper from './Carousel';
import {AlbumsContext} from '../helpers/AlbumsContext';
import PhotoGrid from './PhotoGrid';

export default function Home(){
	const [images, setImages] = useState([]);

	 useEffect(() => {
    pullImages();
  }, []);

	async function pullImages() {
		const apiData = await API.graphql({ 
    query: listImages,
    authMode: 'API_KEY',
    });
    const imgsFromAPI = apiData.data.listImages.items;
     const new_imgs = await Promise.all(
      imgsFromAPI.map((img) => (addURL(img)))
    );
    setImages(new_imgs);
	}

	function PhotoWrapper(){
			if(images.length < 1 ) return;

			return(
				<PhotoGrid
					items={images}/>
					);
	}


return(
	<div>
		<CarouselWrapper/>
		<PhotoWrapper/>
	</div>

	);


};