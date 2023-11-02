import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
// 	MDBContainer,
  MDBRow,
  MDBCol,
  // MDBCheckbox,
  // MDBSwitch,
  MDBBtn,
  // MDBInput,
  // MDBTextArea,
  // MDBDropdown,
  // MDBDropdownToggle,
  // MDBDropdownMenu,
  // MDBDropdownItem,
  MDBIcon,
  // MDBTooltip,
  // MDBFile,
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import {imagesByAlbumsID} from '../graphql/queries';
import {deleteImages as deleteImageMutation} from '../graphql/mutations';

export default function Album({curAlbum}){ 

  // for storing images in current album
  const [images, setImages] = useState([])
  const debug = false;

  // Initializes images after component render
  useEffect(() => {
    updateAlbum();
  }, []);

 async function updateAlbum(album){
    // selectAlbum(album);
  // Pulls the image objects associated with the selected album
    const imgs = await API.graphql({
      query: imagesByAlbumsID,
       variables: { albumsID: curAlbum.id}
      });

    const imgs2 = imgs.data.imagesByAlbumsID.items;
    // Waits until all images have been requested from storag
    const new_imgs = await Promise.all(
      imgs2.map(async (img) => {
        const real_name = `${img.id}-${img.filename}`
        if (debug) {console.log(real_name)};
        const url = await Storage.get(real_name, { level: 'public' });
        img.filename = url;
        return img;
      })
    );

    console.log(`retrieved imgs: ${new_imgs}`);
    // Updates images to the new image objects that have urls
    setImages(new_imgs);
    if (debug) {console.log(`images set`)};
   }



  async function deleteImage(image){
    const newImages = images.filter((img) => img.id !== image.id);
    await Storage.remove(`${image.id}-${image.name}`)
    await API.graphql({
      query: deleteImageMutation,
      variables: { input: {id: image.id}},
    });

    setImages(newImages);
  }

 // Image handler functions

  return(
    <div>
      <MDBRow  className='d-flex justify-content-center align-items-center' >
        <MDBCol className='d-flex justify-content-start align-items-center' lg='5'>
            <h2 className="p-2">{curAlbum.title}</h2>
            <div className="vr" style={{ height: '50px' }}></div>
            <h5 className="p-2">{curAlbum.date}</h5>
        </MDBCol>
        <MDBCol className ='d-flex justify-content-end' lg='5'>
          <p className='p-2'>{curAlbum.desc}</p>
        
        </MDBCol>
       </MDBRow>
    <MDBRow className='p-3'>          
     {images.map((image) => (
      <MDBCol lg='6' xl='4'>
          <img
                src={image.filename}
                alt={`visual aid for ${image.name}`}
                className='img-fluid shadow-4 m-2' 
            />
            <MDBBtn  title='Delete Photo' onClick={()=> deleteImage(image)} color='text-dark' data-mdb-toggle="tooltip" title="Delete photo"  >
              <MDBIcon fas icon="times text-dark" size='2x' />
            </MDBBtn>
        </MDBCol>))}
    </MDBRow>

    </div>
    );

}



