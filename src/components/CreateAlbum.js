import React, { useState, useEffect } from "react";
import { API } from 'aws-amplify';
import {
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
  MDBTextArea
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import {createAlbums} from '../graphql/mutations';
import { useNavigate } from "react-router-dom";


export default function CreateAlbum(){
	const authStatus = useAuthenticator((context) => [context.authStatus]);
	const navigate = useNavigate();

	useEffect(() => {
		console.log(authStatus);
	    if (authStatus.authStatus === 'unauthenticated') navigate('/');
	 }, [authStatus]);


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
	    console.log(`Created new album named: ${form.get("title")}`);
	    event.target.reset();
	 }


	if (authStatus.authStatus != 'authenticated'){
		return (<p> You don't have access, redirecting! </p>);

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
	  </div>
	)

}