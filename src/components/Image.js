/** Image.js
 * @brief React Component for one album image
 * 
 * Takes an image object and classname (what is that?) as input and fetches the image
 * 
 * In order to add repeated requests, removed srcset. This increases the data usage of this site. Shouldn't be a 
 * big issue on modern devices, but a small throughput issue and could increase costs
 * 
 * @author: Robert Norwood
 * @date 8/11/2024
 */
import React, { useState, useEffect } from 'react';
import projectConfig from '../helpers/Config';


import { MDBSpinner } from 'mdb-react-ui-kit';

export default function Image({ img_obj, className }) {
    // const small = 300;
    // const md = 768;
    // const lg = 1280;
    const delivery_domain = `https://${projectConfig.getValue('imageDeliveryHost')}/public`;
    const img_url = `${delivery_domain}/${img_obj.id}-${img_obj.filename}`.replaceAll(' ', '%20');

    const [img, setImg] = useState();

    // function image_loader(url){
    let retries = 0;
    const maxRetries = 4;

    // Attempt to fetch image up to 4 times.
    const fetchImage = () => {
        fetch(`${img_url}?width=1920`)
            .then(response => {
                if (response.status === 429 && retries < maxRetries) {
                    console.warn(`Image request failed with 429 status code. Retrying...`);
                    retries++;
                    setTimeout(fetchImage, 1000);
                    return;
                } else if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error(`Image request failed with status code ${response.status}`);
                }
            })
            .then(blob => {
                const imgObj = URL.createObjectURL(blob);
                setImg(imgObj);
            })
            .catch(error => {
                console.error(error);
            });
    }


    useEffect(() => {
        fetchImage();
    });

    if (!img) {
        return (
            <MDBSpinner role='loading'>
                <span className='visually-hidden'>Loading...</span>
            </MDBSpinner>
        )
    }


    return (
        <picture>
            <img src={img} className={className} loading='lazy' alt={img_url} />
        </picture>);


}

// Delete file
// Image delivery domain: d2brh14yl9j2nl.cloudfront.net

// d2brh14yl9j2nl.cloudfront.net/public/19d4fd82-13cf-474d-a671-d5ea796b1ec7-jinji-lanterns-1140.jpg?format=auto&width=300

