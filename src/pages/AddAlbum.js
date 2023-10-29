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
import "../css/dropzone.css";
import ReactDOM from 'react-dom/client';


import {createAlbums, updateAlbums, deleteAlbums, createImages, updateImages, deleteImages} from '../graphql/mutations'; 
import {listAlbums} from '../graphql/queries';

import {DropZone} from './Dropzone'



export default function AddAlbum(){

	const [albums, setAlbums] = useState([])
	const [selectedAlbum, selectAlbum] = useState([])
	const [showEditAlbum, CanEditAlbum] = useState(false);

	// stores selected files
	const [selectedFiles, setSelectedFiles] = useState(null);

	useEffect(() => {
	    fetchAlbums();
	  }, []);

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
	    selectAlbum([])
	    // await Storage.remove(name);
	    await API.graphql({
	      query: deleteAlbums,
	      variables: { input: { id } },
	    });
	 }

	 // Image handler functions

	 function getExifDate(photo) {

	 	// if (photo.name.endsWith(".jpg" || ".jpeg")){
		//   // Get the EXIF metadata of the photo.
		//   const exifData = EXIF.getData(photo);

		//   // Get the date and time the photo was taken.
		//   const dateTaken = exifData.DateTimeOriginal;

		//   // Convert the date and time to a Date object.
		//   const date = new Date(dateTaken);

		//   // Return the date of the photo.
		//   return date.toISOString();
		//   	}

		  const date2 = new Date()

		  return date2.toISOString()

	}


	async function newImage(image){
	 	console.log('starting image')
	 	const data = {
	 		name: image.name,
	 		description: "",
	 		filename: image.name,
	 		date: getExifDate(image),
	 		albumsID: selectedAlbum.id
	 	}
	 	console.log('data good')
	 	const response = await API.graphql({
	 		query: createImages,
	 		variables: data,
	 	});

	 	const img = response?.data?.createImages

	 	if (!img) return;
	 	console.log(`starting upload for ${image.name}`)
	 	const result = await Storage.put(`${img.id}-${image.name}`, image, {
  			contentType: "image/png", // contentType is optional
			});
	 	console.log('image uploaded')
	 }

	 async function handleFiles() {
	 	console.log('loading files')
	 	const files = Array.from(selectedFiles)
	 	files.map((file) => newImage(file))
	 }

	 async function setFiles(event){
	 	console.log("setting files")
	 	const files = event.target.files;
	 	setSelectedFiles(files);
	 	console.log(files)
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

  	function EditAlbum() {
  		if (showEditAlbum){
  			return(
	  			<div>
					<MDBRow  className='d-flex justify-content-center align-items-center' >
						<MDBCol className='d-flex justify-content-start align-items-center' lg='5'>
						    <h2 className="p-2">{selectedAlbum.title}</h2>
						    <div className="vr" style={{ height: '50px' }}></div>
						    <h5 className="p-2">{selectedAlbum.date}</h5>
						</MDBCol>
						<MDBCol className ='d-flex justify-content-end' lg='5'>
						    <p className='p-2'>{selectedAlbum.desc}</p>
						    <MDBBtn  title='Delete Album' onClick={()=>deleteAlbum(selectedAlbum)} color='tertiary' data-mdb-toggle="tooltip" title="Delete album"  >
						    	<MDBIcon fas icon="times text-dark" size='4x' />
						    </MDBBtn>
						</MDBCol>
					 </MDBRow>
					 <MDBRow className='d-flex justify-content-center'>
				    	<MDBCol lg='6'>
				    		{/*<div className='bg-light text-dark ' {...getRootProps({className: 'dropzone'})}>
						      <input {...getInputProps()} />
						           {
							        isDragActive ?
							          <p>Drop the files here ...</p> :
							          <p>Drag 'n' drop some files here, or click to select files</p>
							      }
						    </div>*/}
				    		<MDBFile
				    			multiple
				    			onChange={setFiles}
				    			/>

				    		<MDBBtn onClick={handleFiles}>Upload Photos</MDBBtn>
				    	</MDBCol>
				    </MDBRow>
			    </div>
  				);
  		}
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
			        <MDBBtn type='submit' className="bg-dark mb-3">Submit</MDBBtn>
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
				    <EditAlbum/>
			    {/*Add more photos*/}








		  </div>
		)
}

