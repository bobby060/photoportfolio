import React, { useState, useEffect } from 'react';
import {
	MDBRow,
	MDBCol,
	MDBBtn
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import {listImages} from '../graphql/queries';
import {AlbumsContext} from '../helpers/AlbumsContext';

// Components
import PhotoGrid from './PhotoGrid';
import CarouselWrapper from './Carousel';

// Helpers
import addURL from '../helpers/addURL';

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