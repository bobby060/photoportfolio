// Not used anymore
import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { generateClient } from 'aws-amplify/api';
import {
    MDBCard,
    MDBCardText,
    MDBCardOverlay,
    MDBCardImage,
    MDBTypography
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

// Helpers
import { urlhelperEncode } from '../helpers/urlhelper';

import { albumTagsAlbumsByAlbumTagsId } from '../graphql/customQueries';
import projectConfig from '../helpers/Config';

const client = generateClient({
    authMode: 'apiKey'
});


export default function FeaturedCarouselWrapper() {
    const featuredAlbumTag = projectConfig.getValue('featuredTagId');
    const [featuredAlbums, setFeaturedAlbums] = useState([]);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        updateFeatured();
    }, []);

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


    async function updateFeatured() {

        const result = await client.graphql({
            query: albumTagsAlbumsByAlbumTagsId,
            variables: {
                albumTagsId: featuredAlbumTag,
                // albumTagsId: 'c0240971-8b4d-4aff-848a-4fc336629e37',
            },
        });
        const taggedConnections = result.data.albumTagsAlbumsByAlbumTagsId.items;
        const newAlbums = taggedConnections.map((connection) => connection.albums);
        setFeaturedAlbums(newAlbums);
    }

    function dateFormat(date) {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }


    if (featuredAlbums.length < 1) return (
        <Carousel indicators={false} interval={5000}>
            <Carousel.Item itemID={1} className='w-100 overflow-hidden placeholder' style={{ height: '600px' }}>
                {/*<img src = {album.featuredImage.filename} className='d-block w-100' alt='...' />*/}
                {/*				<Carousel.Caption className='placeholder-glow' style={{'backgroundColor': 'rgba(0, 0, 0, 0.3)'}}>
							<span class="placeholder w-25"/>
							<span class="placeholder w-25"/>
						</Carousel.Caption>*/}

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
                    return (
                        <Carousel.Item itemID={i} style={{}} key={i}>
                            <MDBCard background='dark' className='text-white bg-image' alignment='end'>
                                <MDBCardImage overlay
                                    src={`https://${projectConfig.getValue('imageDeliveryHost')}/public/${album.featuredImage.id}-${album.featuredImage.filename}?width=1920`}
                                    alt='...'
                                    style={{ 'objectFit': 'cover', height: height }}
                                    className='' />
                                <Link to={`/albums/${urlhelperEncode(album)}`} className="text-light">
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