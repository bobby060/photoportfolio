import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';


export default function Tag({selected, onSelect, onDeselect, name}){

  if (selected){
    return (
        <MDBBtn rounded toggle className='text-light m-1' size='sm' color='dark'><MDBIcon fas icon="times" /> {name}</MDBBtn>
              );
  } else {
    return (
      <MDBBtn rounded toggle outline className='text-dark m-1' size='sm' color='dark'>{name}</MDBBtn>
      );
  }


}