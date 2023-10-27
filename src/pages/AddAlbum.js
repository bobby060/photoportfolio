import React, { useMemo, useState, useEffect } from 'react';
import {
	MDBContainer,
  MDBRow,
  MDBCol,
  MDBCheckbox,
  MDBSwitch,
  MDBBtn,
  MDBInput,
  MDBTextArea,
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import '../css/index.css'
import ReactDOM from 'react-dom/client';


import {createAlbums, updateAlbums, deleteAlbums, createImages, updateImages, deleteImages} from '../graphql/mutations'; 
import {listAlbums} from '../graphql/queries';



export default function AddAlbum(){

	const [albums, setAlbums] = useState([])

	useEffect(() => {
	    fetchAlbums();
	  }, []);

	async function newAlbum(event) {
		event.preventDefault();
	    const form = new FormData(event.target);

	    const date = form.get("date") + 'T00:00:00.000Z'
	    console.log(date)
	    const data = {
	      title: form.get("title"),
	      desc: form.get("desc"),
	      date: date,
	      albumsFeaturedImgID: '0',
	    };
	    console.log('read data')
	    await API.graphql({
	      query: createAlbums,
	      variables: { input: data },
	    });
	    console.log('album created')
	    fetchAlbums();
	    event.target.reset();
	 }

	 async function fetchAlbums() {
	    const apiData = await API.graphql({ query: listAlbums});
	    const albumsFromAPI = apiData.data.listAlbums.items;
	    // Put logic to pull urls for images here
	    setAlbums(albumsFromAPI);
	 }

	 async function deleteAlbum({ id, title}) {
	    const newAlbums = albums.filter((album) => album.id !== id);
	    setAlbums(newAlbums);
	    // await Storage.remove(name);
	    await API.graphql({
	      query: deleteAlbums,
	      variables: { input: { id } },
	    });
	 }


	return(
		<div>
			<h2> Create new album </h2>

			<form onSubmit={newAlbum}>
				<MDBRow className='d-flex justify-content-center'>
			      <MDBCol size='2'>
			        <MDBInput className='mb-3' label = 'Title' name='title' type ='text'/>
			        <MDBInput className='mb-3' label = 'Date' name='date' type ='date'/>
			      </MDBCol>
			      <MDBCol size='2'>
			        <MDBTextArea className='mb-3' label = 'Description' name='desc' type ='text' rows={3}/>
			      </MDBCol>
			      <MDBCol size='12'>
			        <MDBBtn type='submit' className="bg-dark">Submit</MDBBtn>
			      </MDBCol>
			    </MDBRow>
			</form>




		  </div>
		)
}

