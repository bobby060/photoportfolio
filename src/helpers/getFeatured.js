import React, { useEffect, useState} from 'react';
import { API } from 'aws-amplify';

import {getImages} from '../graphql/queries';

import fetchAlbums from '../helpers/fetchAlbums';
import addURL from '../helpers/addURL';
import {urlhelperEncode} from '../helpers/urlhelper';


export default async function getFeaturedImgs(albums){ 

  	const newA = (albums.length < 1) ? await fetchAlbums(): albums;

  	const a = await Promise.all(newA.map(async (album) => {
	  		if (!album.albumsFeaturedImageId) return null;
		  const data = {
	        id: album.albumsFeaturedImageId
	      }
	      const image = await API.graphql({
	        query: getImages,
	        variables: data,
	        authMode: 'API_KEY'
	      });
	      const featuredImage =  await addURL(image.data.getImages);
	      return { ...album, featuredImage: featuredImage};
	      }));
  		return (a.filter(value => value !== null));
}