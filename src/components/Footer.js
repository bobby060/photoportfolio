import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon,
MDBBtn } from 'mdb-react-ui-kit';
import  { useAuthenticator } from '@aws-amplify/ui-react';

export default function Footer() {

  // function ShowLogOut() {
  //     if (authStatus.authStatus != 'authenticated') {
  //       return;
  //     }
  //     return (<MDBBtn className=' float-center mt-3 bg-dark' onClick={signOut}>Sign Out</MDBBtn> );
  // }

  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5 pt-2'>
          <MDBRow className='mt-3'>
            <MDBCol md="5" lg="4" xl="4" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                About this site
              </h6>
              <p>
                The front-end of this website was built with React. The site runs on AWS Amplify and uses AWS for storage, database, and authentication.
              </p>
            </MDBCol>

            <MDBCol md="5" lg="4" xl="4" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Find Me</h6>
              <MDBRow>
                <MDBCol md="6">
                  <div>
                    <MDBIcon fab icon="github" className="me-3" />
                    <a href="https://github.com/bobby060/" className='me-4 text-reset' >Github
                    </a>
                  </div>
                  <div className='mt-2'>
                    <MDBIcon fab icon="linkedin" className="me-3" />
                    <a href="https://www.linkedin.com/in/robert-p-norwood/" className='me-4 text-reset'>LinkedIn
                    </a>
                  </div>
                </MDBCol>
                <MDBCol md="6">
                  <div>
                    <MDBIcon fab icon="facebook" className="me-3" />
                    <a href="https://www.facebook.com/bobby.norwood.84/" className='me-4 text-reset'>Facebook
                    </a>
                  </div>
                  <div className='mt-2'>
                    <MDBIcon fab icon="etsy" className="me-3" />
                    <a href="" className='me-4 text-reset'>Etsy
                  </a>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2023 Robert Norwood

      </div>
    </MDBFooter>
  );
}
