import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {EXIF} from 'exif-js'
import {
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
} from 'mdb-react-ui-kit';
import { Auth, API, Storage } from 'aws-amplify';
import '../css/index.css'
import ReactDOM from 'react-dom/client';


import { useOutletContext } from "react-router-dom";
import {createAlbums, updateAlbums, deleteAlbums, createImages, updateImages, deleteImages} from '../graphql/mutations'; 
import {listAlbums, imagesByAlbumsID, getAlbums} from '../graphql/queries';
import AddImages from './AddImages';
import Album from './Album';



export default function EditAlbum(){
    const [selectedAlbum, setSelectedAlbum, albums, setAlbums] = useOutletContext();
	const [showEditAlbum, CanEditAlbum] = useState(false);

	const [images, setImages] = useState([])
	const debug = true;

	useEffect(() => {
	    fetchAlbums();
	  }, []);

	function updateAlbum(album) {
		setSelectedAlbum(album);
	}


	// Album handler functions
	async function newAlbum(event) {
		event.preventDefault();
	    const form = new FormData(event.target);

	    const date = form.get("date") + 'T00:00:00.000Z';
	    const data = {
	      title: form.get("title"),
	      desc: form.get("desc"),
	      date: date,
	    };
	    const response = await API.graphql({
	      query: createAlbums,
	      variables: { input: data },
	      authMode: 'AMAZON_COGNITO_USER_POOLS',
	    });
	    const new_id = response.data.createAlbums.id;
	    const newAlbum = await API.graphql({
	      	query: getAlbums,
	       	variables: { id: new_id}
	     });
	    fetchAlbums();
	    console.log(`Created new album named: ${newAlbum.data.title}`);
	    setSelectedAlbum(newAlbum.data.getAlbums);
	    event.target.reset();
	 }

	 async function fetchAlbums() {
	    const apiData = await API.graphql({ 
	    	query: listAlbums,
	    	authMode: 'API_KEY',
	    });
	    const albumsFromAPI = apiData.data.listAlbums.items;
	    setAlbums(albumsFromAPI);
	    // Put logic to pull urls for images here
	 }

	 async function deleteAlbum(id) {

	    const newAlbums = albums.filter((album) => album.id !== id);
	    setAlbums(newAlbums);
	    CanEditAlbum(false);
	   	const imgs = await API.graphql({
	      	query: imagesByAlbumsID,
	       	variables: { albumsID: id}
	     });
	   	imgs.data.imagesByAlbumsID.items.map(async (img) => {
	   		const i = img;
	   		await Storage.remove(`${img.id}-${img.filename}`);
	   		await API.graphql({
	   			query: deleteImages,
	   			variables: {input: {id: img.id}},
	   		});
	   		if (debug) {console.log(`${img.id} deleted`)}
	   	})
	    setSelectedAlbum([])
	    // await Storage.remove(name);
	    await API.graphql({
	      query: deleteAlbums,
	      variables: { input: { id } },
	    });

	    // TODO delete all associated images
	 }



  	function ShowAlbum() {
  		if(selectedAlbum.length < 1) return;
		  return(
		  <div>
		  	<Album
		  		curAlbum = {selectedAlbum}
		  		/>
		   <MDBRow className='d-flex justify-content-center'>
		      <MDBCol lg='6'>
		        <AddImages
		        	curAlbum = {selectedAlbum}
		        	setCurAlbum = {updateAlbum}
		        />
		      </MDBCol>
		    </MDBRow>
		   	<MDBRow  className='d-flex justify-content-center align-items-center' >
			    <MDBCol className ='d-flex justify-content-center mt-3' lg='5'>
			        <MDBBtn  title='Delete Album' onClick={()=>deleteAlbum(selectedAlbum.id)} color='dark' data-mdb-toggle="tooltip" title="Delete album"  >
			          {/*<MDBIcon fas icon="times text-dark" size='4x' />*/}Delete Album
			        </MDBBtn>
			    </MDBCol>
		   </MDBRow>
		  </div>
		  );
  	}

	return(
		<div className=''>
			<h2> Create new album </h2>
			<form onSubmit={newAlbum}>
				<MDBRow className='d-flex justify-content-center'>
			      <MDBCol xl='3' lg='5' md ='6'>
			        <MDBInput className='mb-3' label = 'Title' name='title' type ='text'/>
			        <MDBInput className='mb-3' label = 'Date' name='date' type ='date'/>
			      </MDBCol>
			      <MDBCol xl='3'  lg='5' md ='6'>
			        <MDBTextArea className='mb-3' label = 'Description' name='desc' type ='text' rows={3}/>
			      </MDBCol>
			      <MDBCol xl ='12'>
			        <MDBBtn type='submit' className="bg-dark mb-3">Create</MDBBtn>
			      </MDBCol>
			    </MDBRow>
			</form>

			<ShowAlbum/>
		  </div>
		)
}

