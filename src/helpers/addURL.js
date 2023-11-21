// Depricated with cloudfront addition

import { Storage } from 'aws-amplify';

export default async function addURL(img){
	const real_name = `${img.id}-${img.filename}`;
	const url =  await Storage.get(real_name, { level: 'public' });
	// img.filename = url;
    return img;
}