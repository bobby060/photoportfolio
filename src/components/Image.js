import React from 'react';

import { IMAGEDELIVERYHOST } from './App';

export default function Image({ img_obj, className }) {
    // const small = 300;
    // const md = 768;
    // const lg = 1280;
    const delivery_domain = `https://${IMAGEDELIVERYHOST}/public`;
    const img_url = `${delivery_domain}/${img_obj.id}-${img_obj.filename}`.replaceAll(' ', '%20');

    // function image_loader(url){
    //   let retries = 0;
    //   const maxRetries = 4;

    //   const loadImage =  () => {
    //   fetch(imageUrl)
    //     .then(response => {
    //       if (response.status === 429 && retries < maxRetries) {
    //         console.warn(`Image request failed with 429 status code. Retrying...`);
    //         retries++;
    //         setTimeout(loadImage, 1000);
    //       } else if (response.ok) {
    //         return response.blob();
    //       } else {
    //         throw new Error(`Image request failed with status code ${response.status}`);
    //       }
    //     })
    //     .then(blob => {
    //       const image = new Image();
    //       image.src = URL.createObjectURL(blob);
    //       return image;
    //     })
    //     .catch(error => {
    //       console.error(error);
    //       return null;
    //     });
    // };

    // return loadImage();

    // }

    return (
        <picture>
            <source
                type="image/avif"
                srcSet={`${img_url}?width=300&format=avif 300w, ${img_url}?width=768&format=avif 768w,  ${img_url}?width=1280&format=avif 1280w`}
                sizes="(max-width: 300px) 300px, (max-width: 768px) 768px, 1280px"
            />
            <source
                type="image/jpeg"
                srcSet={`${img_url}?width=300&format=jpeg 300w, ${img_url}?width=768&format=jpeg 768w,  ${img_url}?width=1280&format=jpeg 1280w`}
                sizes="(max-width: 300px) 300px, (max-width: 768px) 768px, 1280px"
            />
            <img src={`${img_url}?width=1920`} className={className} loading='lazy' alt={img_url} />
        </picture>
    );


}

// Delete file
// Image delivery domain: d2brh14yl9j2nl.cloudfront.net

// d2brh14yl9j2nl.cloudfront.net/public/19d4fd82-13cf-474d-a671-d5ea796b1ec7-jinji-lanterns-1140.jpg?format=auto&width=300

