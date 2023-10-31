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
import {listAlbums, imagesByAlbumsID} from '../graphql/queries';

import {DropZone} from './Dropzone'



export default function AddAlbum(){

	const [albums, setAlbums] = useState([])
	const [selectedAlbum, selectAlbum] = useState([])
	const [showEditAlbum, CanEditAlbum] = useState(false);
	const debug = true;

	// stores selected files
	const [selectedFiles, setSelectedFiles] = useState(null);

	// for storing images in current album
	const [images, setImages] = useState([])

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
	 	if (debug) {console.log(`selected ID: ${selectedAlbum.id}`)}
	 	const data = {
	 		title: image.name,
	 		desc: "",
	 		filename: image.name,
	 		date: getExifDate(image),
	 		albumsID: selectedAlbum.id
	 	}
	 	if (debug) {console.log('data good')}
	 	const response = await API.graphql({
	 		query: createImages,
	 		variables: {input: data},
	 	});
	 	if (debug){console.log('image database created ID:')}
	 	const img = response?.data?.createImages
	 	if (debug) {console.log(img.id)}
	 	if (!img) return;
	 	console.log(`starting upload for ${image.name}`)
	 	// Combining id and image name ensures uniqueness while preserving information
	 	const result = await Storage.put(`${img.id}-${image.name}`, image, {
  			contentType: "image/png", // contentType is optional
			});
	 	console.log('image uploaded')
	 }


	 // Creates images and uploads
	 async function handleFiles() {
	 	console.log('loading files')
	 	const files = Array.from(selectedFiles)
	 	files.map((file) => newImage(file))
	 }


	 // tracks files uploaded by clicker, sets state object
	 async function setFiles(event){
	 	const files = event.target.files;
	 	setSelectedFiles(files);
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

  	// async function getUrl(img){
  	// 	if (debug) {console.log(img.id)};
  	// 	if (debug) {console.log(img.filename)};	
  	// 	const url = await Storage.get(`${img.id}-${img.filename}`);
  	// 	if (debug) {console.log(url)}
  	// 	// return url;
  	// }


  	function AlbumImage(){

	 	return (
	 		images.map((image) => {
	 		<div>
	 		  	<img
				        src={image.filename}
				        alt={`visual aid for ${image.name}`}
				        className='img-fluid shadow-4' 
			      />
			      <p>{image.filename}</p>
			      </div>
			  }));
	 }

	 async function setAlbum(album){
	 	selectAlbum(album);
	 	console.log('test');
	 	const imgs = await API.graphql({
	 		query: imagesByAlbumsID,
	 		 variables: { albumsID: selectedAlbum.id}
	 		});

	 	const imgs2 = imgs.data.imagesByAlbumsID.items;
	 	console.log(imgs2);
	 	imgs2.map((img) => console.log(img.id))
	 	const new_imgs = await Promise.all(
	 		imgs2.map(async (img) => {
	 			const real_name = `${img.id}-${img.filename}`
	 			if (debug) {console.log(real_name)};
	 			const url = await Storage.get(real_name, { level: 'public' });
	 			
	 			// const url = await Storage.get(`03c8ccc1-7993-4df4-847c-9e3b99b94ea7-jinji-lanterns--3.jpg`)
	 			img.filename = url;
 		 		return img;
 		 	})

	 	);

	 	console.log(new_imgs);
	 	setImages(new_imgs);
	 	if (debug) {console.log(`images set`)};
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
				      		<MDBDropdownItem link onClick={() => {setAlbum(album); CanEditAlbum(true);}}>{album.title}</MDBDropdownItem>
				      		))}
				      </MDBDropdownMenu>
				    </MDBDropdown>
				
				    </MDBCol>
				</MDBRow>
				    <EditAlbum/>
			<MDBRow className='p-3'>			    
				 {images.map((image) => (
			 		<MDBCol lg='6' xl='4'>
			 		  	<img
						        src={image.filename}
						        alt={`visual aid for ${image.name}`}
						        className='img-fluid shadow-4 m-2' 
					      />
					  </MDBCol>))}
				</MDBRow>

			    {/*Add more photos*/}








		  </div>
		)
}

