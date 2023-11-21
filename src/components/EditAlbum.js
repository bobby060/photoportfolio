import React, { useContext, useState } from 'react';
// import {EXIF} from 'exif-js';
import {
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
  MDBTextArea,
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import '../css/index.css';
import { useNavigate } from "react-router-dom";
import {updateAlbums, deleteAlbums , deleteImages} from '../graphql/mutations'; 
import {imagesByAlbumsID} from '../graphql/queries';
import AddImages from './AddImages';
// import ConfirmationDialog from './ConfirmationDialog';


// Helpers
import fetchAlbums from '../helpers/fetchAlbums';
import {urlhelperEncode} from '../helpers/urlhelper';
import {AlbumsContext} from '../helpers/AlbumsContext';

export default function EditAlbum({selectedAlbum, pullAlbum}){
	const [showEditAlbum, CanEditAlbum] = useState(false);
	const {albums, setAlbums} = useContext(AlbumsContext);
	const navigate = useNavigate();
	const debug = true;

	async function updateAlbum(event) {
			event.preventDefault();
	    const form = new FormData(event.target);
	    console.log(form.get("title"));
	    const date = form.get("date") + 'T00:00:00.000Z';
	    const data = {
	    	id: selectedAlbum.id,
	      title: form.get("title"),
	      desc: form.get("desc"),
	      date: date,
	    };
	    const response = await API.graphql({
	      query: updateAlbums,
	      variables: { input: data },
	    });
	    const updatedAlbums = await fetchAlbums();
			setAlbums(updatedAlbums);
	    console.log(`Updated album: ${form.get("title")}`);
	   	navigate('../'.concat(urlhelperEncode(response.data.updateAlbums)));
	}

	 async function deleteAlbum(id) {
	 		if (!window.confirm("Are you sure you want to delete this album?")) return;

	    const newAlbums = albums.filter((album) => album.id !== id);
	    setAlbums(newAlbums);
	    CanEditAlbum(false);
	   	const imgs = await API.graphql({
	      	query: imagesByAlbumsID,
	       	variables: { albumsID: id}
	     });

	   	// Deletes albums associated with album
	   	imgs.data.imagesByAlbumsID.items.map(async (img) => {
	   		await Storage.remove(`${img.id}-${img.filename}`);
	   		await API.graphql({
	   			query: deleteImages,
	   			variables: {input: {id: img.id}},
	   		});
	   		if (debug) {console.log(`${img.id} deleted`)}
	   	});
	    await API.graphql({
	      query: deleteAlbums,
	      variables: { input: { id } },
	    });
	    navigate('/');
	 }

		const date = new Date(selectedAlbum.date);
		const d = date.getDate();
		const d2 = (d < 10)  ? '0'.concat(d): String(d);
		const month = date.getMonth()+1;
		const month2 = (month < 10)  ? '0'.concat(month): String(month);
		const year = date.getFullYear();
		const dateString = String(year).concat('-',month2,'-',d2);

	return(
		<div className=''>
			<h2> Edit album </h2>
			<form onSubmit={updateAlbum}>
				<MDBRow className='d-flex justify-content-center'>
			      <MDBCol xl='3' lg='5' md ='6'>
			        <MDBInput className='mb-3' label = 'Title' name='title' type ='text' defaultValue={selectedAlbum.title}/>
			        <MDBInput className='mb-3' label = 'Date' name='date' type ='date'  defaultValue={dateString}/>
			      </MDBCol>
			      <MDBCol xl='3'  lg='5' md ='6'>
			        <MDBTextArea className='mb-3' label = 'Description' name='desc' type ='text' rows={3} defaultValue={selectedAlbum.desc}/>
			      </MDBCol>
			      <MDBCol xl ='12'>
			        <MDBBtn type='submit' className="bg-dark mb-3">Save</MDBBtn>
			      </MDBCol>
			    </MDBRow>
			</form>

			<MDBRow className='d-flex justify-content-center'>
	      <MDBCol lg='6'>
	        <AddImages
	        	curAlbum = {selectedAlbum}
	        	onUpload = {pullAlbum}
	        />
	      </MDBCol>
		   </MDBRow>
	   	<MDBRow  className='d-flex justify-content-center align-items-center' >
		    <MDBCol className ='d-flex justify-content-center mt-3' lg='5'>
		        <MDBBtn  title='Delete Album' onClick={()=>deleteAlbum(selectedAlbum.id)} color='dark' data-mdb-toggle="tooltip" >
		          Delete Album
		        </MDBBtn>
		    </MDBCol>
	   </MDBRow>
		  </div>
		)
}

