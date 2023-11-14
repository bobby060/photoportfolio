import React,  { useState, useEffect }  from 'react';
import {
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// import "animate.css/animate.min.css";
// import { AnimationOnScroll } from 'react-animation-on-scroll';
 

// Photogrid items takes an array of Image objects as input
// deleteImage callback allows authenticated users to delete images
export default function PhotoGrid({items, deleteImage = null, setFeaturedImg = null, selectedAlbum, editMode = false }) {

  const authStatus = useAuthenticator((context) => [context.authStatus]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  // Slides object for lightbox doesn't hold full image object, just the url 
  const slides = items.map( (image) => ({src: image.filename}));

  // Adds ability to adjust column layout after resize
 useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }; 

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  {/*Breakpoints. Breakpoint will be set to the last value before window width. Index will be the number of columns
  Example  breakpoints = [0 ,  350, 750, 900, 1300]
        number columns = [0 ,   1 ,  2 , 3  ,   4 ]
        Window with of 850 will have 2 columns. 2000 will have 4

  */}
  const breakPoints = [0, 350, 750, 900, 1300];

  function getBreakpoint() {
    const cur_width = windowSize.width;
    for (let i = breakPoints.length-1; i >= 0; i--){
        if (breakPoints[i] < cur_width ) return i;
    }
  }

  const num_columns = getBreakpoint();

  // Holds the columns for the photo grid 
  const columns = new Array(num_columns);

  if (items.length==0) return;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const columnIndex = i % num_columns;

    if (!columns[columnIndex]) {
      columns[columnIndex] = [];
    }
    columns[columnIndex].push(item);
  }


  function DeleteImageWrapper(image) {
      if (!deleteImage || authStatus.authStatus != 'authenticated'  || !editMode) {
        return;
      }
      return (<MDBBtn  className="position-absolute top-0 end-0 btn-light m-1" onClick={()=> deleteImage(image.image)} color='text-dark' data-mdb-toggle="tooltip" title="Delete photo"  >
              <MDBIcon fas icon="times text-dark" size='2x' />
            </MDBBtn>);
   }

  function MakeFeaturedWrapper(image){
      if (!setFeaturedImg || authStatus.authStatus != 'authenticated' || !editMode) {
        return;
      }

      if (selectedAlbum.albumsFeaturedImageId && image.image.id===selectedAlbum.albumsFeaturedImageId ) {
              return (<MDBBtn className="position-absolute bottom-0 end-0 btn-light m-1" title='Make Featured Photo' disabled MDBColor='text-dark' data-mdb-toggle="tooltip" title="Delete photo"  >
              <MDBIcon fas icon="square text-dark" size='2x' />
            </MDBBtn>);
      }
      return (<MDBBtn  className="position-absolute bottom-0 end-0 btn-light m-1" title='Make Featured Photo' onClick={()=> setFeaturedImg(image)} MDBColor='text-dark' data-mdb-toggle="tooltip" title="Set Featured"  >
              <MDBIcon fas icon="square text-dark" size='2x' />
            </MDBBtn>);
  }



  return (
    <div className=" d-flex photo-album">
      {columns.map((column) => (
        <MDBCol className="column">
          {column.map((image, i) => (
           <div className= 'm-0 p-1'>        
                <div className='bg-image hover-overlay position-relative'>
                <img
                    src={image.filename}
                    alt={`visual aid for ${image.name}`}
                    className='img-fluid shadow-4' 
                  />
                  <a type="button" >
                    <div className='mask overlay' onClick={() => setOpen(true)} style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                  </a>
                  <DeleteImageWrapper
                  image={image} />
                  <MakeFeaturedWrapper
                  image = {image}/>
                </div>

                </div>
                ))}
              </MDBCol>
            ))}
      <Lightbox
        index={index}
        slides={slides}
        close={() => setOpen(false)}
        open={open}
        controller={{closeonBackDropClick: true}}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .5)" } }}
        />
    </div>
  );
}