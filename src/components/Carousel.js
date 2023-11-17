import React, {useContext, useEffect, useState} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import {getImages} from '../graphql/queries';
import { API } from 'aws-amplify';
import {Link} from 'react-router-dom';

// Helpers
import fetchAlbums from '../helpers/fetchAlbums';
import {AlbumsContext} from '../helpers/AlbumsContext';
import addURL from '../helpers/addURL';
import {urlhelperEncode} from '../helpers/urlhelper';

export default function CarouselWrapper(){

	const {albums} = useContext(AlbumsContext);
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
		<Carousel indicators={false} interval = {5000}>
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
		<Carousel indicators={false} interval = {3000} className='w-100 pe-auto ' touch={true} >
			{featuredAlbums.map((album, i) =>
				(
					<Carousel.Item  itemId={i}  style={{height: '600px', cursor: 'pointer' }}>
						<Link to={`/${urlhelperEncode(album)}`}>
							<img src = {album.featuredImage.filename} className='h-100 w-100 ' alt='...' 
							 style={{ width:'100%', height:'100%', 'object-fit': 'cover'}}/>
						<Carousel.Caption className='' style={{'background-color': 'rgba(0, 0, 0, 0.3)'}}>
							<h5 >{album.title}</h5>
							<p>{album.desc}</p>
						</Carousel.Caption>
						</Link>
					</Carousel.Item>
					))}
		</Carousel>);
	}