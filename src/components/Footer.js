import React from 'react';
import {
    MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon,
} from 'mdb-react-ui-kit';


/**
 * @brief React Component for the Footer
 * 
 * 
 * 
 */
export default function Footer() {

    return (
        <MDBFooter bgColor='light' className='mt-auto text-center text-lg-start text-muted'>
            <section className='w-100'>
                <MDBContainer className='text-center text-md-start mt-5 pt-2'>
                    <MDBRow className='mt-3'>
                        <MDBCol md="5" lg="4" xl="4" className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>
                                About this site
                            </h6>
                            <p>
                                I created this site both to share my love for photography and also as an experiment to renew my coding skills. If you want to find out more about how I built this
                                website, please check out my <a href='https://github.com/bobby060/photoportfolio'>Github</a> for this project!
                            </p>
                        </MDBCol>

                        <MDBCol md="5" lg="4" xl="4" className='mx-auto mb-md-0 mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Find Me</h6>
                            <MDBRow>
                                <MDBCol md="6">
                                    <div className='mt-2'>
                                        <MDBIcon fab icon="github" className="me-3" />
                                        <a href="https://github.com/bobby060/" target="_new" className='me-4 text-reset' >Github
                                        </a>
                                    </div>
                                    <div className='mt-2'>
                                        <MDBIcon fab icon="linkedin" className="me-3" />
                                        <a href="https://www.linkedin.com/in/robert-p-norwood/" target="_new" className='me-4 text-reset'>LinkedIn
                                        </a>
                                    </div>
                                </MDBCol>

                            </MDBRow>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                    © 2024 Robert Norwood
                </div>
            </section>


        </MDBFooter>
    );
}
