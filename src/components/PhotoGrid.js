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


export default function PhotoGrid({ items, deleteImage }) {

  const authStatus = useAuthenticator((context) => [context.authStatus]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

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
      if (authStatus.authStatus != 'authenticated') {
        return;
      }
      return (<MDBBtn  title='Delete Photo' onClick={()=> deleteImage(image.image)} color='text-dark' data-mdb-toggle="tooltip" title="Delete photo"  >
              <MDBIcon fas icon="times text-dark" size='2x' />
            </MDBBtn>);
   }


  return (
    <div className=" d-flex photo-album">
      {columns.map((column) => (
        <MDBCol className="column">
          {column.map((image, i) => (
              <div className= 'm-0 p-1'>        
                <div className='bg-image hover-overlay'>
                <img
                    src={image.filename}
                    alt={`visual aid for ${image.name}`}
                    className='img-fluid shadow-4' 
                  />
                  <a type="button" >
                    <div className='mask overlay' onClick={() => setOpen(true)} style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                  </a>
                </div>
                <DeleteImageWrapper
                  image={image} />
      {/*          <MakeFeaturedWrapper
                image = {image}/>*/}
                </div>))}
              </MDBCol>
            ))}
      <Lightbox
        index={index}
        slides={slides}
        close={() => setOpen(false)}
        open={open}
        />
    </div>
  );
}