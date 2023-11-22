import React, {useEffect, useContext } from "react";
import { API } from 'aws-amplify';
import {
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBContainer
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import {createAlbums} from '../graphql/mutations';
import { useNavigate } from "react-router-dom";
import {urlhelperEncode} from '../helpers/urlhelper';
import {AlbumsContext} from '../helpers/AlbumsContext';
import fetchAlbums from '../helpers/fetchAlbums';

export default function CreateAlbum(){
	const authStatus = useAuthenticator((context) => [context.authStatus]);
	const {albums, setAlbums} = useContext(AlbumsContext);
	const navigate = useNavigate();

	useEffect(() => {
		console.log(authStatus);
	    if (authStatus.authStatus === 'unauthenticated') navigate('/');
	 }, [authStatus]);

	function handleNew(){
		document.getElementById("createAlbumForm").submit();
	}


	async function newAlbum(event) {
		event.preventDefault();
	    const form = new FormData(event.target);
	    // Date in format 2023-11-11T00:00:00.000Z
	    const date = form.get("date") + 'T00:00:00.000Z';
	    const cur_date = new Date();
	   	const cleaned_date = (date==='T00:00:00.000Z') ? cur_date.toISOString(): date;
	   	const title = form.get("title");
	   	const cleaned_title = (title.length===0) ?
	   		 `Album created at ${cur_date.getMonth()+1}-${cur_date.getDate()}-${cur_date.getFullYear()} at ${cur_date.getHours()}:${cur_date.getMinutes()}`:title;
	   	console.log(cleaned_date);
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
		const updatedAlbums = await fetchAlbums();
			setAlbums(updatedAlbums);
	    console.log(`Created new album named: ${form.get("title")}`);
	    navigate(`../albums/${urlhelperEncode(newAlbum)}`);
	    event.target.reset();
	 }


	if (authStatus.authStatus !== 'authenticated'){
		return (<p> You don't have access, redirecting! </p>);

	}
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
		    <MDBBtn type='submit' className="bg-dark mb-3">Create</MDBBtn>
		</form>
		
	  </MDBContainer>
	)

}