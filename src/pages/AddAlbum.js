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
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
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
	 	console.log(albums)
	    const apiData = await API.graphql({ query: listAlbums});
	    console.log('api passed')
	    const albumsFromAPI = apiData.data.listAlbums.items;
	    console.log(albumsFromAPI)
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


			    <MDBDropdown>
			      <MDBDropdownToggle tag='a' className='btn btn-primary'>
			        Albums
			      </MDBDropdownToggle>
			      <MDBDropdownMenu>
			      	{albums.map((album) => (
			      		<MDBDropdownItem link>{album.title}</MDBDropdownItem>
			      		))}
			      </MDBDropdownMenu>
			    </MDBDropdown>






		  </div>
		)
}

