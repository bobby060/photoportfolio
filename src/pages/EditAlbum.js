import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {useDropzone} from 'react-dropzone'
import {EXIF} from 'exif-js'
import {
	MDBContainer,
  MDBRow,
  MDBCol,
  MDBCheckbox,
  MDBSwitch,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
  MDBTooltip,
  MDBFile,
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import '../css/index.css'
import ReactDOM from 'react-dom/client';


import {createAlbums, updateAlbums, deleteAlbums, createImages, updateImages, deleteImages} from '../graphql/mutations'; 
import {listAlbums, imagesByAlbumsID} from '../graphql/queries';

// import * from './Album';

import AddImages from './AddImages';
import Album from './Album';



export default function EditAlbum(){

	const [albums, setAlbums] = useState([])
	const [selectedAlbum, selectAlbum] = useState([])
	const [showEditAlbum, CanEditAlbum] = useState(false);

	const [images, setImages] = useState([])
	const debug = true;

	useEffect(() => {
	    fetchAlbums();
	  }, []);


	function updateAlbum(album) {
		selectAlbum(album);
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
	      featuredImg: "fakeID",
	    };
	    await API.graphql({
	      query: createAlbums,
	      variables: { input: data },
	    });
	    fetchAlbums();
	    event.target.reset();
	 }

	 async function fetchAlbums() {
	    const apiData = await API.graphql({ query: listAlbums});
	    const albumsFromAPI = apiData.data.listAlbums.items;
	    setAlbums(albumsFromAPI);
	    // Put logic to pull urls for images here
	 }

	 async function deleteAlbum({ id, title}) {
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
	    selectAlbum([])
	    // await Storage.remove(name);
	    await API.graphql({
	      query: deleteAlbums,
	      variables: { input: { id } },
	    });

	    // TODO delete all associated images
	 }










	 // Add dropped files to current album
	//  const onDrop = useCallback(acceptedFiles => {
	//  	acceptedFiles.map((pic) => newImage(pic))
	//  }, [])

	// const {
    // 	getRootProps,
    // 	getInputProps,
    // 	isDragActive
  	// } = useDropzone({onDrop});

  	function ShowAlbum() {
  		if (showEditAlbum){
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
					        <MDBBtn  title='Delete Album' onClick={()=>deleteAlbum(selectedAlbum)} color='dark' data-mdb-toggle="tooltip" title="Delete album"  >
					          {/*<MDBIcon fas icon="times text-dark" size='4x' />*/}Delete Album
					        </MDBBtn>
					    </MDBCol>
				   </MDBRow>
				  </div>
				  );}
  		return;
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
			    {/*View selected album*/}
			     <MDBRow className='d-flex justify-content-center'>
			      <MDBCol xl='2' lg='2'>
				    <MDBDropdown >
				      <MDBDropdownToggle tag='a' className='btn btn-primary bg-dark'>
				        Albums
				      </MDBDropdownToggle>
				      <MDBDropdownMenu >
				      	{albums.map((album) => (
				      		<MDBDropdownItem link onClick={() => {selectAlbum(album); CanEditAlbum(true);}}>{album.title}</MDBDropdownItem>
				      		))}
				      </MDBDropdownMenu>
				    </MDBDropdown>
				
				    </MDBCol>
				</MDBRow>
				    <ShowAlbum/>


			    {/*Add more photos*/}








		  </div>
		)
}

