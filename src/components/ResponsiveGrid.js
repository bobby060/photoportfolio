import React,  {  useState, useEffect}  from 'react';
import {
  MDBCol,
} from 'mdb-react-ui-kit';

export default function ResponsiveGrid({items, breakpoints}) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });


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


//  {/*Breakpoints. Breakpoint will be set to the last value before window width. Index will be the number of columns
//   Example  breakpoints = [0 ,  350, 750, 900, 1300]
//         number columns = [0 ,   1 ,  2 , 3  ,   4 ]
//         Window with of 850 will have 2 columns. 2000 will have 4

  // const breakPoints = [0, 350, 750, 1200];
 // const breakPoints = [0,0];

  // Gets breakpoint for current width
  function getBreakpoint() {
    const cur_width = windowSize.width;
    for (let i = breakpoints.length-1; i >= 0; i--){
        if (breakpoints[i] < cur_width ) return i;
    }
  }

  const num_columns = getBreakpoint();

  // Holds the columns for the photo grid 
  const columns = new Array(num_columns);

  // Splits the images into the right number of columns
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const columnIndex = i % num_columns;

    if (!columns[columnIndex]) {
      columns[columnIndex] = [];
    }
    columns[columnIndex].push(item);
  }


  return(
    <>
        {columns.map((column) => (
        <MDBCol className="column">
          {column.map((item, i) => (
            item
                ))}
        </MDBCol>
            ))}
        </>

    )




}