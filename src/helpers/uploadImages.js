import { API, Storage } from 'aws-amplify';
import {createImages } from '../graphql/mutations';


export default async function uploadImages(targetAlbum, files){

	 function getExifDate(photo) {

    // if (photo.name.endsWith(".jpg" || ".jpeg")){
    //   // Get the EXIF metadata of the photo.
    //   const exifData = EXIF.getData(photo);

    //   // Get the date and time the photo was taken.
    //   const dateTaken = exifData.DateTimeOriginal;

    //   // Convert the date and time to a Date object.
    //   const date = new Date(dateTaken);

    //   // Return the date of the photo.
    //   return date.toISOString();
    //    }

      const date2 = new Date()

      return date2.toISOString()

  }

	async function newImage(image){
	    const data = {
	      title: image.name,
	      desc: "",
	      filename: image.name,
	      date: getExifDate(image),
	      albumsID: targetAlbum.id
	    }
	    const response = await API.graphql({
	      query: createImages,
	      variables: {input: data},
	    });
	    const img = response?.data?.createImages
	    if (!img) return;
	    // Combining id and image name ensures uniqueness while preserving information
	    const result = await Storage.put(`${img.id}-${image.name}`, image, {
	        contentType: "image/png", // contentType is optional
	      });
	    // Add error handling with result
	    console.log(`${image.name} uploaded`)
	   }

	  if (files.length > 0){
        const files_array = Array.from(files)
        console.log(`starting uploads`)
        await Promise.all(files_array.map((file) => newImage(file)));
        console.log(`All images uploaded!`)
        return 0;
     }	
     return -1
}