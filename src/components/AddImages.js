import React, { useState } from 'react';
import {
  MDBBtn,
  MDBFile} from 'mdb-react-ui-kit';
// import Toast from 'react-bootstrap/Toast';

import uploadImages from '../helpers/uploadImages';
// Args:
// curAlbum is album to upload images to
// onUpload is callback to call after upload is completed
export default function AddImages({curAlbum, onUpload = {}}){
    // stores selected files
  const [selectedFiles, setSelectedFiles] = useState([]);


     // Creates images and uploads
   async function handleFiles() {
    uploadImages(curAlbum, selectedFiles);
    onUpload();
     // Error popup
   }


   // tracks files uploaded by clicker, sets state object
   async function setFiles(event){
      const files = event.target.files;
      setSelectedFiles(files);
   }




  // Creates new image object and uploads source to AWS
  // TODO: implement automatic resizing/saving for thumbnails, different sized photos

   // function UploadedToast(filename){
   //    return (
   //     <Toast>
   //        <Toast.Header>
   //          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
   //          <strong className="me-auto">Bootstrap</strong>
   //          <small>11 mins ago</small>
   //        </Toast.Header>
   //        <Toast.Body>{filename} has been uploaded</Toast.Body>
   //      </Toast>
   //    );
   // }

   function UploadButtonWrapper(){
    if (selectedFiles.length<1) return(
        <MDBBtn className='bg-dark m-1' disabled>Upload Photos</MDBBtn>
      );
    return(<MDBBtn className='bg-dark mm-1' onClick={handleFiles}>Upload Photos</MDBBtn>);
   };

  return(
  <div>
    {/*Implement Dropzone here*/}
      <MDBFile
        multiple
        onChange={setFiles}
        className='m-1'
      />
    <UploadButtonWrapper/>
  </div>
  );

};
