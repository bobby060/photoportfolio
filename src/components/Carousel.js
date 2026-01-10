import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import {
    MDBCard,
    MDBCardText,
    MDBCardOverlay,
    MDBCardImage,
    MDBTypography
} from 'mdb-react-ui-kit';
import Link from 'next/link';

// Hooks
import { useRepositories } from '../hooks/useRepositories';

import { IMAGEDELIVERYHOST, FEATURED_TAG_ID } from '../helpers/Config';


/**
 * @brief formats date to month/day/year
 * @param date
 * @returns {string}
 */
function dateFormat(date) {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

/**
 * @brief wrapper for featured carousel
 * @returns {JSX}
 */
export default function FeaturedCarouselWrapper() {
    const { albums: albumRepo } = useRepositories();
    const featuredAlbumTag = FEATURED_TAG_ID;
    const [featuredAlbums, setFeaturedAlbums] = useState([]);
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        async function fetchFeaturedAlbums() {
            try {
                const albums = await albumRepo.getAlbumsByTag(featuredAlbumTag);
                setFeaturedAlbums(albums);
            } catch (error) {
                console.error('Failed to fetch featured albums:', error);
            }
        }

        fetchFeaturedAlbums();
    }, [featuredAlbumTag, albumRepo]);

    // Adds ability to adjust column layout after resize
    useEffect(() => {
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
     * @brief returns placeholder carousel if no featured albums
     * @returns {JSX}
     */
    if (featuredAlbums.length < 1) return (
        <Carousel indicators={false} interval={5000}>
            <Carousel.Item itemID={1} className='w-100 overflow-hidden placeholder' style={{ height: '600px' }}>


            </Carousel.Item>
        </Carousel>
    );

    // const breakPoints = [0, 576, 768, 992, 1200]
    const columnsMultplier = () => {
        if (windowSize.width > 992) {
            return 8 / 12;
        } else if (windowSize.width > 768) {
            return 10 / 12;
        } else {
            return 1;
        }
    }
    const heightArray = [featuredAlbums.map((album) => (windowSize.width * (album.featuredImage.height / album.featuredImage.width)))];
    const height = Math.min(...heightArray[0]) * (columnsMultplier());
    return (
        <div>
            <Carousel indicators={false} fade interval={3000} className='w-100 pe-auto p-2' touch={true} >
                {featuredAlbums.map((album, i) => {
                    const albumUrl = albumRepo.generateAlbumUrl(album);
                    return (
                        <Carousel.Item itemID={i} style={{}} key={i}>
                            <MDBCard background='dark' className='text-white bg-image' alignment='end'>
                                <MDBCardImage overlay
                                    src={`https://${IMAGEDELIVERYHOST}/public/${album.featuredImage.id}-${album.featuredImage.filename}?width=1920`}
                                    alt='...'
                                    style={{ 'objectFit': 'cover', height: height }}
                                    className='' />
                                <Link href={`/albums/${albumUrl}`} className="text-light">
                                    <MDBCardOverlay style={{ background: 'linear-gradient(to top, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.2))' }}>
                                        <MDBTypography className='display-6'>{album.title}</MDBTypography>
                                        <MDBCardText>{dateFormat(album.date)}</MDBCardText>
                                    </MDBCardOverlay>
                                </Link>
                            </MDBCard>
                        </Carousel.Item>
                    )
                }
                )}
            </Carousel>
        </div>
    );
}