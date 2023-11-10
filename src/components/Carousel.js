import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useOutletContext } from "react-router-dom";
import addURL from '../helpers/addURL';
import {getImages} from '../graphql/queries';
import { API} from 'aws-amplify';

export default function CarouselWrapper(){
	const [selectedAlbum, setSelectedAlbum, albums] = useOutletContext();
	const [featuredImgs, setFeaturedImg] = useState([]);

	useEffect(() => {
    	fetchFeaturedImg();
  	}, []);

  	async function fetchFeaturedImg() {
  		console.log('updated featured ims')
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

	console.log(`featured alb length ${featuredImgs.length}`);
	if(albums.length<1 || featuredImgs.length<1) return(
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