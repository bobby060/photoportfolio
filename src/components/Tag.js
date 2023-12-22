import React, { useState } from 'react';
import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';


export default function Tag({selected = false, onSelect = () => {}, onDeselect = () => {}, name}){
  const [isSelected, setIsSeleted] = useState(selected);

  function handleClick(){
    if(isSelected){
      setIsSeleted(false);
      onDeselect();
    } else {
      setIsSeleted(true);
      onSelect();
    }
  }

  if (isSelected){
    return (
        <MDBBtn rounded toggle className='text-light m-1' size='sm' color='dark' onClick={()=>handleClick()}>{name}  <MDBIcon className="text-white-50" icon="times" /></MDBBtn>
              );
  } else {
    return (
      <MDBBtn rounded toggle outline onClick={()=>handleClick()} className='text-dark m-1' size='sm' color='dark'>{name}</MDBBtn>
      );
  }


}