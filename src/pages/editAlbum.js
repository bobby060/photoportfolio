import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {useDropzone} from 'react-dropzone'
import {
	MDBContainer,
  MDBRow,
  MDBCol,
  MDBCheckbox,
  MDBSwitch,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
} from 'mdb-react-ui-kit';
import { API, Storage } from 'aws-amplify';
import '../css/index.css'
import "../css/dropzone.css";
import ReactDOM from 'react-dom/client';


import {createAlbums, updateAlbums, deleteAlbums, createImages, updateImages, deleteImages} from '../graphql/mutations'; 
import {listAlbums} from '../graphql/queries';









return(
                <MDBRow>
                    < MDBCol xl ='10' lg='10'>
                        <MDBRow>
                            <MDBCol className='d-flex justify-content-start align-items-center'>
                                <h2 className="p-2">{selectedAlbum.title}</h2>
                                <div className="vr" style={{ height: '50px' }}></div>
                                <h5 className="p-2">{selectedAlbum.date}</h5>
                            </MDBCol>
                            <MDBCol className ='d-flex justify-content-start'>
                                <p className='p-2'>{selectedAlbum.desc}</p>
                                <MDBBtn onClick={()=>deleteAlbum(selectedAlbum)} color='tertiary'>
                                    <MDBIcon fas icon="times text-dark" size='4x' />
                                </MDBBtn>
                            </MDBCol>

                        </MDBRow>
                        {/*Where current photos will be displayed*/}
                    </MDBCol>
                    <editAlbum/>
                </MDBRow>
                {/*Add more photos*/}
                <MDBRow className='d-flex justify-content-center'>
                    <MDBCol lg='6'>
                        <MDBBtn className='bg-light text-dark' {...getRootProps()}>
                          <input {...getInputProps()} />
                          {
                            isDragActive ?
                              <p>Drop the files here ...</p> :
                              <p>Drag 'n' drop some files here, or click to select files</p>
                          }
                        </MDBBtn>

                    </MDBCol>
                </MDBRow>
)