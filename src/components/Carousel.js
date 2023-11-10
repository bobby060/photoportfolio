import React, {useContext} from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useOutletContext } from "react-router-dom";

import {AlbumsContext} from '../helpers/AlbumsContext';

export default function CarouselWrapper(){

	const [selectedAlbum, setSelectedAlbum] = useOutletContext();
	const {albums, setAlbums} = useContext(AlbumsContext);

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
	return (	
		<Carousel indicators={false} interval = {3000} className='w-100 pe-auto '>
			{albums.map((album, i) =>
				(
					<Carousel.Item onClick={() => {setSelectedAlbum(album)}} itemId={i}  style={{height: '600px', cursor: 'pointer' }}>
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