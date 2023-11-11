import React, {useContext, useEffect, useState} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useOutletContext } from "react-router-dom";
import {getImages} from '../graphql/queries';
import { API, Storage} from 'aws-amplify';
import addURL from '../helpers/addURL';
import {AlbumsContext} from '../helpers/AlbumsContext';
import fetchAlbums from '../helpers/fetchAlbums';

export default function CarouselWrapper(){

	const {albums, setAlbums} = useContext(AlbumsContext);
	const [featuredAlbums, setFeaturedAlbums]= useState([]);

	  useEffect(() => {
	    updateFeatured();
	  }, [albums]);


	  async function updateFeatured(){

	  	const newA = (albums.length < 1) ? await fetchAlbums(): albums;

	  	const a = await Promise.all(newA.map(async (album) => {
	  		if (!album.albumsFeaturedImageId) return null;
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
	  		console.log(a.filter(value => value !== null));
	  		setFeaturedAlbums(a.filter(value => value !== null));
		  }

	if(featuredAlbums.length < 1) return(
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
		<Carousel indicators={false} interval = {3000} className='w-100 pe-auto '>
			{featuredAlbums.map((album, i) =>
				(
					<Carousel.Item  itemId={i}  style={{height: '600px', cursor: 'pointer' }}>
							<img src = {album.featuredImage.filename} className='h-100 w-100 ' alt='...' 
							 style={{ width:'100%', height:'100%', 'object-fit': 'cover'}}/>
						<Carousel.Caption className='' style={{'background-color': 'rgba(0, 0, 0, 0.3)'}}>
							<h5 >{album.title}</h5>
							<p>{album.desc}</p>
						</Carousel.Caption>
					</Carousel.Item>
					))}
		</Carousel>);
	}