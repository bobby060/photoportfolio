import React, {useEffect, useContext, useState } from "react";
import { API } from 'aws-amplify';
import {
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBContainer,
  MDBFile
} from 'mdb-react-ui-kit';

import { useNavigate } from "react-router-dom";

// Database
import { useAuthenticator } from '@aws-amplify/ui-react';
import {createAlbums, updateAlbums} from '../graphql/mutations';
import { imagesByAlbumsID } from '../graphql/queries';


// Helpers
import {urlhelperEncode} from '../helpers/urlhelper';
import {AlbumsContext} from '../helpers/AlbumsContext';
import fetchAlbums from '../helpers/fetchAlbums';
import uploadImages from '../helpers/uploadImages';


export default function CreateAlbum(){
	const authStatus = useAuthenticator((context) => [context.authStatus]);
	const {albums, setAlbums} = useContext(AlbumsContext);
	const navigate = useNavigate();
	const [selectedFiles, setSelectedFiles] = useState([]);


	useEffect(() => {
		console.log(authStatus);
	    if (authStatus.authStatus === 'unauthenticated') navigate('/');
	 }, [authStatus]);

	function handleNew(){
		document.getElementById("createAlbumForm").submit();
	}


   // tracks files uploaded by clicker, sets state object
  async function setFiles(event){
    const files = event.target.files;
    setSelectedFiles(files);
  }

	async function newAlbum(event) {
		event.preventDefault();
	    const form = new FormData(event.target);
	    // Date in format 2023-11-11T00:00:00.000Z
	    const date = form.get("date") + 'T00:00:00.000Z';
	    const cur_date = new Date();
	    // Sets default date to current time if not set by user
	   	const cleaned_date = (date==='T00:00:00.000Z') ? cur_date.toISOString(): date;
	   	const title = form.get("title");
	   	// Ensures album has a name...
	   	const cleaned_title = (title.length===0) ?
	   		 `Album created at ${cur_date.getMonth()+1}-${cur_date.getDate()}-${cur_date.getFullYear()} at ${cur_date.getHours()}:${cur_date.getMinutes()}`:title;
	    const data = {
	      title: cleaned_title,
	      desc: form.get("desc"),
	      date: cleaned_date,
	    };
	    const response = await API.graphql({
	      query: createAlbums,
	      variables: { input: data },
	    });
	    const newAlbum = response.data.createAlbums;
	    await uploadImages(newAlbum, selectedFiles);

	    const res = await API.graphql({
      query: imagesByAlbumsID,
       variables: { 
        albumsID: newAlbum.id,
        limit: 1},
       authMode: 'API_KEY',
      });

      const img = res.data.imagesByAlbumsID.items[0]
      console.log(img)

	    const featured_img_query_data = {
	      id: newAlbum.id,
	      albumsFeaturedImageId: img.id
	    }
	    const updateAlbumResponse = await API.graphql({
	      query: updateAlbums,
	      variables: { input: featured_img_query_data
	    },
	    })
	    const new_album = updateAlbumResponse.data.updateAlbums;
	    console.log(new_album.albumsFeaturedImageId);
			const updatedAlbums = await fetchAlbums();
			setAlbums(updatedAlbums);
	    console.log(`Created new album named: ${form.get("title")}`);
	    navigate(`../album/${urlhelperEncode(new_album)}`);
	    event.target.reset();
	 }

	 // Ensures only authenticated users can view this route
	if (authStatus.authStatus !== 'authenticated'){
		return (<p> You don't have access, redirecting! </p>);

	}

	 function SubmitButtonWrapper(){
    if (selectedFiles.length<1) return(
    	<>
        <MDBBtn type='submit' className='bg-dark m-1' disabled>Create</MDBBtn>
        <p>Select photos to enable create button</p>
       </>
      );
    return(<MDBBtn className='bg-dark m-1' >Create</MDBBtn>);
   };


	return(
	<MDBContainer className=''>
		<h2 className="mt-2"> Create new album </h2>
		<form id="createAlbumForm" onSubmit={newAlbum}>
			<MDBRow className=' justify-content-center'>
		      <MDBCol xl='3' lg='5' md ='6'>
		        <MDBInput className='mb-3' label = 'Title' name='title' type ='text'/>
		        <MDBInput className='mb-3' label = 'Date' name='date' type ='date'/>
		      </MDBCol>
		      <MDBCol xl='3'  lg='5' md ='6'>
		        <MDBTextArea className='mb-3' label = 'Description' name='desc' type ='text' rows={3}/>
		      </MDBCol>
		    </MDBRow>
		    <MDBRow className=' justify-content-center'>
		   		<MDBCol xl='3' lg='5' md ='6'>
		   		<MDBFile
	        multiple
	        onChange={setFiles}
	        className='m-1 mb-3'
	      	/>
      	</MDBCol>
      	</MDBRow>
		    <SubmitButtonWrapper/>
		</form>
		
	  </MDBContainer>
	)

}