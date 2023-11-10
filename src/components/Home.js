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
	MDBBtn
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

	function CarouselWrapper(){
		console.log(albums.length);
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
			<Carousel indicators={false} interval = {3000}>
				{albums.map((album, i) =>
					(
						<Carousel.Item onClick={() => {setSelectedAlbum(album)}} itemId={i} className='w-100 pe-auto ' style={{height: '600px', cursor: 'pointer' }}>
								<img src = {album.featuredImage.filename} className='h-100 w-100 object-fit-cover' alt='...' 
								 style={{ width:'100%', height:'100%', 'object-fit': 'cover'}}/>
							<Carousel.Caption className='' style={{'background-color': 'rgba(0, 0, 0, 0.3)'}}>
								<h5 >{album.title}</h5>
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