import React, { useContext, useState, useEffect } from 'react';
// import {EXIF} from 'exif-js';
import {
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBSpinner,
  MDBFile
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {Link} from 'react-router-dom';

// Database
import {updateAlbums, deleteAlbums , deleteImages} from '../graphql/mutations'; 
import {imagesByAlbumsID} from '../graphql/queries';

// Helpers
import fetchAlbums from '../helpers/fetchAlbums';
import {urlhelperEncode, urlhelperDecode} from '../helpers/urlhelper';
import {AlbumsContext} from '../helpers/AlbumsContext';
import uploadImages from '../helpers/uploadImages';



export default function EditAlbum(){
	const [showEditAlbum, CanEditAlbum] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const {albums, setAlbums} = useContext(AlbumsContext);
	const navigate = useNavigate();
	const debug = true;

	const [albumIndex, setAlbumIndex] = useState(-1);
	let {album_id} = useParams();

	useEffect(() => {
    getAlbum();
  }, [album_id]);


  // Helper that determines which album in the albums list the url album_id is triggering the component to pull
  async function findIndex(albums){
  	console.log(album_id);
    for(let i = 0; i < albums.length; i++){
      if (urlhelperDecode(albums[i], album_id)) {
        return i;
      }
    }
    console.log('album not found');
    return -1;
  }


     // tracks files uploaded by clicker, sets state object
  async function setFiles(event){
    const files = event.target.files;
    setSelectedFiles(files);
  }

  async function getAlbum() {
    setAlbumIndex(-1);
    // If albums wasn't already set, fetch them. This should be removed by better data handling in future versions.
    const newA = (albums.length < 1) ? await fetchAlbums(): albums;
    const index = await findIndex(newA);
    if (index < 0) {
      throw new Error(`404. Album at url, ${album_id}, was not found!`);
    }
    setAlbumIndex(index);


  }

  // Updates title, description, and date fields
  // Doesn't error handle if user deletes date and title, need to fix
	async function updateAlbum(event) {
			event.preventDefault();
	    const form = new FormData(event.target);
	    const date = form.get("date") + 'T00:00:00.000Z';
	    const data = {
	    	id: albums[albumIndex].id,
	      title: form.get("title"),
	      desc: form.get("desc"),
	      date: date,
	    };
	    const response = await API.graphql({
	      query: updateAlbums,
	      variables: { input: data },
	    });
	    if(selectedFiles.length>0){
	   		await uploadImages(albums[albumIndex], selectedFiles);
	   	}
	    const updatedAlbums = await fetchAlbums();
			setAlbums(updatedAlbums);
	    console.log(`Updated album: ${form.get("title")}`);
	    // After save, navigates to album
	   	navigate('../../'.concat(urlhelperEncode(response.data.updateAlbums)));
	}

	 async function deleteAlbum(id) {
	 	// Make sure you really want to delete...
	 		if (!window.confirm("Are you sure you want to delete this album?")) return;

	 		// Remove album being deleted from the current list of albums
	    const newAlbums = albums.filter((album) => album.id !== id);
	    setAlbums(newAlbums);
	    CanEditAlbum(false);

	    // Gets all the images associated with the old album ID
	   	const imgs = await API.graphql({
	      	query: imagesByAlbumsID,
	       	variables: { albumsID: id}
	     });

	   	// Deletes albums associated with old album
	   	imgs.data.imagesByAlbumsID.items.map(async (img) => {
	   		await Storage.remove(`${img.id}-${img.filename}`);
	   		await API.graphql({
	   			query: deleteImages,
	   			variables: {input: {id: img.id}},
	   		});
	   	});
	    await API.graphql({
	      query: deleteAlbums,
	      variables: { input: { id } },
	    });
	    console.log('album successfully deleted')
	    // Go to root after deleting album
	    navigate('/');
	 }

	 if(albumIndex<0){
    return(
      <MDBSpinner className='m-3'>

      </MDBSpinner>);
  }

  // Ensures the date is formatted correctly
		const date = new Date(albums[albumIndex].date);
		const d = date.getDate();
		const d2 = (d < 10)  ? '0'.concat(d): String(d);
		const month = date.getMonth()+1;
		const month2 = (month < 10)  ? '0'.concat(month): String(month);
		const year = date.getFullYear();
		const dateString = String(year).concat('-',month2,'-',d2);

	return(
			<form onSubmit={updateAlbum}>
				<MDBRow className='mt-3 d-flex justify-content-center'>
			      <MDBCol xl='3' lg='5' md ='6'>
			        <MDBInput className='mb-3' label = 'Title' name='title' type ='text' defaultValue={albums[albumIndex].title}/>
			        <MDBInput className='mb-3' label = 'Date' name='date' type ='date'  defaultValue={dateString}/>
			      </MDBCol>
			      <MDBCol xl='3'  lg='5' md ='6'>
			        <MDBTextArea className='mb-3' label = 'Description' name='desc' type ='text' rows={3} defaultValue={albums[albumIndex].desc}/>
			      </MDBCol>
			   </MDBRow>
			   <MDBRow className='d-flex justify-content-center'>
			      <MDBCol lg='6'>
							<MDBFile
			        multiple
			        onChange={setFiles}
			        className='m-1 mb-3'
			      	/>
			      </MDBCol>
		   </MDBRow>
		   	   	<MDBRow  className='d-flex justify-content-center align-items-center' >
		    <MDBCol className ='d-flex justify-content-center' lg='5'>
		        <MDBBtn className='m-1' title='Delete Album' onClick={()=>deleteAlbum(albums[albumIndex].id)} color='dark' data-mdb-toggle="tooltip" >
		          Delete Album
		        </MDBBtn>
		        <MDBBtn type='submit' className="bg-dark m-1">Save</MDBBtn>
		        <MDBBtn className="bg-dark m-1"><Link className='text-light' to={`/album/${urlhelperEncode(albums[albumIndex])}`}>Cancel</Link></MDBBtn>
		    </MDBCol>
	   </MDBRow>
		</form>

		)
}

