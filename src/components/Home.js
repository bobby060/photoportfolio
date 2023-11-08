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

import { useOutletContext } from "react-router-dom";

import Album from './Album';

export default function Home(){
	const [selectedAlbum, setSelectedAlbum] = useOutletContext();


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

return(
	<div>

	<div>
		<AlbumWrapper/>
	</div>
	</div>

	);


};