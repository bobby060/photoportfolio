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
		console.log(albums);
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
	<DropdownWrapper/>
	<AlbumWrapper/>
	</div>

	);


};