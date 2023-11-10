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
import CarouselWrapper from './Carousel';

export default function Home(){
	const [selectedAlbum, setSelectedAlbum, albums] = useOutletContext();



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
		{/*<DropdownWrapper/>*/}
		<AlbumWrapper/>
	</div>

	);


};