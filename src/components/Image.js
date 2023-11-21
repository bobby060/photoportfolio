import React from 'react';

export default function Image({img_obj, className}) {
  const img_key =  `${img_obj.id}-${img_obj.filename}`;
  const small = 300;
  const md = 768;
  const lg = 1280;
  const delivery_domain = 'https://d2brh14yl9j2nl.cloudfront.net/public';
  const img_url = `${delivery_domain}/${img_key}`;

  return (
      <picture>
       <source
         type="image/avif"
         srcSet={ `${img_url}?width=300&format=avif 300w, ${img_url}?width=768&format=avif 768w,  ${img_url}?width=1280&format=avif 1280w`}
         sizes="(max-width: 300px) 300px, (max-width: 768px) 768px, 1280px"
       />
       <source
         type="image/jpeg"
         srcSet={ `${img_url}?width=300&format=jpeg 300w, ${img_url}?width=768&format=jpeg 768w,  ${img_url}?width=1280&format=jpeg 1280w`}
         sizes="(max-width: 300px) 300px, (max-width: 768px) 768px, 1280px"
       />
       <img src={`${img_url}?width=1920`}  className = {className} />
     </picture>
     );


};

// Delete file
// Image delivery domain: d2brh14yl9j2nl.cloudfront.net

// d2brh14yl9j2nl.cloudfront.net/public/19d4fd82-13cf-474d-a671-d5ea796b1ec7-jinji-lanterns-1140.jpg?format=auto&width=300

