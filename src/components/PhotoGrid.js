import React,  { lazy, useState, useEffect, useRef, useCallback }  from 'react';
import {
  MDBCol,
  MDBBtn,
  MDBIcon,
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';

// Database
import { imagesByAlbumsID } from '../graphql/queries';
import {deleteImages as deleteImageMutation} from '../graphql/mutations';

// Components
import {Lightbox} from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
// import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import Image from "./Image";
// import "animate.css/animate.min.css";
// import { AnimationOnScroll } from 'react-animation-on-scroll';

// Inputs:
// setFeaturedImg - callback to set an image as the albums featured image
// editMode - lets photogrid know if it is in edit mode
// selectedAlbum - where photogrid is pulling photos from


export default function PhotoGrid({ setFeaturedImg, selectedAlbum, editMode = false }) {

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [open, setOpen] = React.useState(false);
  // Tracks index for Lightbox
  const [index, setIndex] = React.useState(0);
  // Stores items to display in grid/lightbox
  const [items, setItems] = useState([]);
  // Observer for infinite scroll
  const observerTarget = useRef(null);
  // Holds next token for data
  const [nextToken, setNextToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

// Fetches next set of items when bottom of scroll is reached
  const fetchData = useCallback(async () => {
  // async function fetchData(){

    if (isLoading || !nextToken ) return;

    setIsLoading(true);

    const res = await API.graphql({
      query: imagesByAlbumsID,
       variables: { 
        albumsID: selectedAlbum.id,
        limit: 10,
        nextToken: nextToken },
       authMode: 'API_KEY',
      });

    setNextToken(res.data.imagesByAlbumsID.nextToken);
    const new_items = [...items, ...res.data.imagesByAlbumsID.items].map((img, i) => {
     img.index = i;
      return img});
    setItems(new_items);
    setIsLoading(false);
  // }
  }, [nextToken, isLoading, index]);

  useEffect(() => {
    if (index < items.length -1){
      fetchData();
   }
  }, [index]);



  // Initalizes intersection observer to call each time observer enters view
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchData();
        }
      },
      // { threshold: 1 }
    );

    if (observerTarget.current && !isLoading) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchData]);

// https://dev.to/vishnusatheesh/exploring-infinite-scroll-techniques-in-react-1bn0

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

 // 
 useEffect(() => {
   getImages();
 }, []);

  {/*Breakpoints. Breakpoint will be set to the last value before window width. Index will be the number of columns
  Example  breakpoints = [0 ,  350, 750, 900, 1300]
        number columns = [0 ,   1 ,  2 , 3  ,   4 ]
        Window with of 850 will have 2 columns. 2000 will have 4

  */}
  const breakPoints = [0, 350, 750, 1200];
 // const breakPoints = [0,0];

  // Gets breakpoint for current width
  function getBreakpoint() {
    const cur_width = windowSize.width;
    for (let i = breakPoints.length-1; i >= 0; i--){
        if (breakPoints[i] < cur_width ) return i;
    }
  }


  // Requests the first 10 images
  async function getImages(){
    setIsLoading(true);
    // Pulls the image objects associated with the selected album
    const res = await API.graphql({
      query: imagesByAlbumsID,
       variables: { 
        albumsID: selectedAlbum.id,
        limit: 10},
       authMode: 'API_KEY',
      });
    console.log('loading images');
    const imgs = res.data.imagesByAlbumsID.items.map((img, i) => {
     img.index = i;
      return img});
    const nextT = res.data.imagesByAlbumsID.nextToken;
    setNextToken(nextT);

    setItems(imgs);
    setIsLoading(false);
  }

  // Deletes image object and source image on AWS
  async function deleteImage(image){
    const newImages = items.filter((img) => img.id !== image.id);
    await Storage.remove(`${image.id}-${image.name}`)
    await API.graphql({
      query: deleteImageMutation,
      variables: { input: {id: image.id}},
    });
    console.log(`image with ID ${image.id} is deleted from album`);
    setItems(newImages);
  }


  const num_columns = getBreakpoint();

  // Holds the columns for the photo grid 
  const columns = new Array(num_columns);

  // Ensures grid does not render if no items are in props
  if (items.length===0) return;

  // Ensures each image has a unique index to map to the lightbox
  const items_with_index = items.map((item,i) => {
    item.index = i;
    return item;});

  // Slides object for lightbox doesn't hold full image object, just the url 
  const slides = items.map( (image) => (
    {src: `https://d2brh14yl9j2nl.cloudfront.net/public/${image.id}-${image.filename}`,
      alt: image.filename,
      srcSet:[
          { src: `https://d2brh14yl9j2nl.cloudfront.net/public/${image.url}?width=768`, width: 768}, 
          { src: `https://d2brh14yl9j2nl.cloudfront.net/public/${image.url}?width=1280`, width: 1280},
          { src: `https://d2brh14yl9j2nl.cloudfront.net/public/${image.url}?width=1920`, width: 1920},
          ],
      downloadUrl: `https://d2brh14yl9j2nl.cloudfront.net/public/${image.url}`}
));

  // Splits the images into the right number of columns
  for (let i = 0; i < items_with_index.length; i++) {
    const item = items_with_index[i];
    const columnIndex = i % num_columns;

    if (!columns[columnIndex]) {
      columns[columnIndex] = [];
    }
    columns[columnIndex].push(item);
  }

  function confirmDeleteImage(image){
    if (window.confirm("Are you sure you want to delete this image?")){
      deleteImage(image);
    }
  }

  function DeleteImageWrapper(image) {
      if (!deleteImage || !editMode) {
        return;
      }
      return (<MDBBtn floating className="position-absolute top-0 end-0 btn-light m-1" onClick={()=> confirmDeleteImage(image.image)} color='text-dark' data-mdb-toggle="tooltip" title="Delete photo"  >
              <MDBIcon fas icon="times text-dark" size='2x' />
            </MDBBtn>);
   }

  function MakeFeaturedWrapper(image){
      if (!setFeaturedImg || !editMode) {
        return;
      }

      if (selectedAlbum.albumsFeaturedImageId && image.image.id===selectedAlbum.albumsFeaturedImageId ) {
              return (<MDBBtn floating className="position-absolute bottom-0 end-0 btn-light m-1" title='Set Featured' disabled MDBColor='text-dark' data-mdb-toggle="tooltip" >
              <MDBIcon fas icon="star text-dark" size='2x' />
            </MDBBtn>);
      }
      return (<MDBBtn  floating className="position-absolute bottom-0 end-0 btn-light m-1" 
        onClick={ ()=> (setFeaturedImg(image))}
         MDBColor='text-dark' 
         data-mdb-toggle="tooltip" 
         title="Set Featured"  >
              <MDBIcon far icon="star text-dark" size='2x' />
            </MDBBtn>);
  }

  return (
    <div className="d-flex photo-album">
      {columns.map((column) => (
        <MDBCol className="column">
          {column.map((image, i) => (
           <div className= 'm-0 p-1'>        
                <div className='bg-image hover-overlay position-relative'>
{/*                <img
                    src={image.filename}
                    alt={`visual aid for ${image.name}`}
                    className='img-fluid shadow-4' 
                  />*/}
                  <Image
                    img_obj = {image }
                    className = 'img-fluid shadow-4'
                  />
                  <a type="button" >
                    <div className='mask overlay' onClick={() => (setOpen(true), setIndex(image.index))} 
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
                  </a>
                  <DeleteImageWrapper
                  image={image} />
                  <MakeFeaturedWrapper
                  image = {image}/>
                </div>

                </div>
                ))}
            <div ref={observerTarget}></div>
              </MDBCol>
            ))}

      <Lightbox
        index={index}
        slides={slides}
        close={() => setOpen(false)}
        open={open}
        controller={{closeonBackDropClick: true}}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .5)" } }}
        plugins={[Download]}
        on={{ view: ({ index: currentIndex }) => setIndex(currentIndex) }}
        // zoom={{maxZoomPixelRatio: 3}}
        />

    </div>
  );
}