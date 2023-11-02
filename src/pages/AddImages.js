import React, { useState, useEffect  } from 'react';
import {
// 	MDBContainer,
  // MDBRow,
  // MDBCol,
  // MDBCheckbox,
  // MDBSwitch,
  MDBBtn,
  // MDBInput,
  // MDBTextArea,
  // MDBDropdown,
  // MDBDropdownToggle,
  // MDBDropdownMenu,
  // MDBDropdownItem,
  // MDBIcon,
  // MDBTooltip,
  MDBFile,
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import {createImages } from '../graphql/mutations';


export default function AddImages({curAlbum, setCurAlbum}){
    // stores selected files
  const [selectedFiles, setSelectedFiles] = useState(null);

  // // Calls calback function to update selected album
  // const setSelectedAlbum = () => {
  //   setCurAlbum(curAlbum);
  // }

     // Creates images and uploads
   async function handleFiles() {
      const files = Array.from(selectedFiles)
      files.map((file) => newImage(file))
      setCurAlbum(curAlbum);
   }


   // tracks files uploaded by clicker, sets state object
   async function setFiles(event){
      const files = event.target.files;
      setSelectedFiles(files);
   }

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
    //    }

      const date2 = new Date()

      return date2.toISOString()

  }

  // Creates new image object and adds to AWS
  async function newImage(image){
    console.log(image.name);
    console.log(image.name);
    console.log(curAlbum.id);
    const data = {
      title: image.name,
      desc: "",
      filename: image.name,
      date: getExifDate(image),
      albumsID: curAlbum.id
    }
    const response = await API.graphql({
      query: createImages,
      variables: {input: data},
    });
    const img = response?.data?.createImages
    if (!img) return;
    console.log(`starting upload for ${image.name}`)
    // Combining id and image name ensures uniqueness while preserving information
    const result = await Storage.put(`${img.id}-${image.name}`, image, {
        contentType: "image/png", // contentType is optional
      });
    console.log(`${image.name} uploaded`)
   }


  return(
  <div>

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

        <MDBBtn className='bg-dark mt-3' onClick={handleFiles}>Upload Photos</MDBBtn>

  </div>
  );

};
