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
import { IMAGEDELIVERYHOST } from '../helpers/Config';
import { MDBSpinner } from 'mdb-react-ui-kit';

import Image from 'next/image';

// Create a shimmer effect data URL
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str);

export default function ImageWrapper({ img_obj, className }) {
    // const [img, setImg] = useState(null);
    // const [error, setError] = useState(null);
    // const [retries, setRetries] = useState(0);
    // const maxRetries = 4;

    const delivery_domain = `https://${IMAGEDELIVERYHOST}/public`;
    const img_url = `${delivery_domain}/${img_obj.id}-${img_obj.filename}`.replaceAll(' ', '%20');


    // Create blur data URL
    const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(img_obj.width, img_obj.height))}`;

    return (
        // <picture>
        //     <img
        //         src={img}
        //         className={className}
        //         loading='lazy'
        //         alt={img_obj.filename || 'Album image'}
        //     />
        // </picture>
        <Image
            src={img_url}
            className={className}
            loading='lazy'
            alt={img_obj.filename || 'Album image'}
            width={img_obj.width}
            height={img_obj.height}
            placeholder='blur'
            blurDataURL={blurDataURL}
            quality={75}
        />

    );
}

// Delete file
// Image delivery domain: d2brh14yl9j2nl.cloudfront.net

// d2brh14yl9j2nl.cloudfront.net/public/19d4fd82-13cf-474d-a671-d5ea796b1ec7-jinji-lanterns-1140.jpg?format=auto&width=300

