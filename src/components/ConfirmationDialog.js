// Not implemented yet
import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

// For later implementation, couldn't get it to render

export default function ConfirmationDialog({message, action, button_desc}){

	// 
	// In parent, declare `const [visible, setVisible] = useState(false)` and
	// `const toggleOpen = () => setCentredModal(!centredModal);``

  const [visible, setVisible] = useState(false);

  const toggleOpen = () => setVisible(!visible);

  console.log(visible);

	return (
  <>
  <MDBBtn onClick={toggleOpen}>{button_desc}</MDBBtn>
      <MDBModal tabIndex='-1' open={visible} setOpen={setVisible}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modal title</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>
                Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
                egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
              </p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      </>
  );


}