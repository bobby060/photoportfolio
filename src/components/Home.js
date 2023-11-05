import React, { useState, useEffect } from 'react';
import {
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBDropdown,
	MDBDropdownToggle,
	MDBDropdownMenu,
	MDBDropdownItem,
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import {listAlbums} from '../graphql/queries';
import { useAuthenticator } from '@aws-amplify/ui-react';

import Album from './Album';

export default function Home(){
	const [albums, setAlbums] = useState([])
	const [selectedAlbum, selectAlbum] = useState(undefined)

	useEffect(() => {
	    fetchAlbums();
	  }, []);

	async function fetchAlbums() {
	const apiData = await API.graphql({ 
		query: listAlbums,
		authMode: 'API_KEY',
	});
	const albumsFromAPI = apiData.data.listAlbums.items;
	setAlbums(albumsFromAPI);
	}	

	function AlbumWrapper() {
		if(selectedAlbum===undefined){
			return;
		}
	  	return(<Album
			curAlbum = {selectedAlbum}
			/>);
	}

return(
	<div>
     <MDBContainer>
	    <MDBDropdown >
	      <MDBDropdownToggle tag='a' className='btn btn-primary bg-dark'>
	        Albums
	      </MDBDropdownToggle>
	      <MDBDropdownMenu >
	      	{albums.map((album) => (
	      		<MDBDropdownItem link onClick={() => {selectAlbum(album)}}>{album.title}</MDBDropdownItem>
	      		))}
	      </MDBDropdownMenu>
	    </MDBDropdown>
	</MDBContainer>
	<MDBContainer>
		<AlbumWrapper/>
	</MDBContainer>
	</div>

	);


};