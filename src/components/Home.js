
"use client"
/**Home.js
 * @brief Home page component
 * 
 * @author Robert Norwood
 * @date October, 2023 
 */
import React, { useState, useEffect } from 'react';
import {
    MDBCol,
    MDBBtn,
    MDBCard,
    MDBCardTitle,
    MDBCardBody,
    MDBIcon,
    MDBTypography
} from 'mdb-react-ui-kit';
import { list } from 'aws-amplify/storage';

// Components
import Carousel from 'react-bootstrap/Carousel';
import AllAlbums from './AllAlbums';
import FeaturedCarouselWrapper from './Carousel';
import Image from 'next/image';
// Helpers
import { IMAGEDELIVERYHOST } from "../helpers/Config";

// import {createDefaultTags} from '../helpers/upgrade_database';

export const breakpoints = [0, 350, 750, 1200];


// import {upgradeDB} from '../helpers/upgrade_database';

export default function Home() {

    // State for header images
    const [headerImgs, setHeaderImgs] = useState([]);
    const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });

    // Handles resizing
    useEffect(() => {
        getHeaderImgs();
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        if (typeof window !== 'undefined') {
            handleResize();
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);



    /**
     * @brief fetch header images
     * 
     * Header images are stored in the folder 'highlights' on the image delivery host.
     * 
     */
    async function getHeaderImgs() {
        const response = await list({
            prefix: 'highlights/h',
            options: {
                listAll: true,
                pageSize: 50,
            }
        });

        const urls = response.items.map((item) => `https://${IMAGEDELIVERYHOST}/public/${item.key}?width=1280`);
        setHeaderImgs(urls);
    }

    // React component holding the home page header images
    function HeaderCarousel() {
        const s = { width: windowSize.width || '100vw', height: windowSize.height || '100vh', 'objectFit': 'cover' };


        // Carousel with placeholders
        if (headerImgs.length < 1) return (
            <Carousel indicators={false} interval={2500} style={s} controls={false} pause={false}>
                <Carousel.Item itemID={1} className='overflow-hidden placeholder' >
                    {/*<img src = {album.featuredImage.filename} className='d-block w-100' alt='...' />*/}
                    <Carousel.Caption className='placeholder-glow' style={{ 'backgroundColor': 'rgba(0, 0, 0, 0.3)' }}>
                        <span className="placeholder w-25" />
                        <span className="placeholder w-25" />
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        );
        // Carousel weth images mapped
        return (
            <Carousel fade indicators={false} interval={3000} controls={false} pause={false} >
                {headerImgs.map((img, i) =>


                (
                    <Carousel.Item itemID={i} key={i}  >
                        <Image src={img} alt='...'
                            style={s}
                            width={s.width}
                            height={s.height}
                            priority={true}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>);

    }

    return (
        <div>
            <HeaderCarousel />
            {/* <div className='pt-2'>
                <h2 className='mb-0 fw-light'>
                    Featured Albums
                </h2>
            </div> */}
            <MDBCol lg='10' xl='8' className='me-auto ms-auto'>
                <FeaturedCarouselWrapper />
            </MDBCol>
            <span id="albums" />
            <MDBCol lg='10' xl='8' className='me-auto ms-auto'>
                {/*<AlbumCards/>*/}
                {/* <div className='p-1'>
                    <h2 className='m-0 fw-light'>
                        All Albums
                    </h2>
                </div> */}
                <hr className="hr m-0" />
                <AllAlbums />
            </MDBCol>
            {/* Floating card above splash image */}
            <MDBCard
                alignment='start'
                className='text-dark p-3'
                background='light'
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    borderRadius: 0,
                }}>
                <MDBCardBody>
                    <MDBCardTitle>Robert Norwood</MDBCardTitle>
                    <MDBTypography className='lead d-none d-sm-block' >
                        Through pictures we see the world not just for what it is, but for what it can be
                    </MDBTypography>
                    <div className='text-center'>
                        <MDBBtn outline href='#albums' color='dark' className="m-1">Photos</MDBBtn>
                        {/*<MDBBtn  outline color='dark' className="m-1" onClick={()=>createDefaultTags()}>Upgrade DB</MDBBtn>*/}
                        <MDBBtn href='https://github.com/bobby060' target="_blank" outline color='dark' className="m-1">Coding</MDBBtn>
                    </div>
                </MDBCardBody>
            </MDBCard>

            {/* jump to arrow */}
            <a href="#albums">
                <MDBIcon fas icon="angle-down" size='4x' color='white-50'
                    style={{
                        position: 'absolute',
                        top: '95%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                    }}
                />
            </a>

        </div>

    );


}