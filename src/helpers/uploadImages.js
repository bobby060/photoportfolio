import { API, Storage } from 'aws-amplify';
import {createImages, updateImages } from '../graphql/mutations';
import {IMAGEDELIVERYHOST} from '../components/App';


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

  const getMeta = async (url) => {
		const img = new Image();
		img.src = url;
		await img.decode();
		return [img.naturalHeight, img.naturalWidth];
	};

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

	    // Need to add error handling here
	    if (!img) return;

	    const url = `${img.id}-${image.name}`;
	    // Combining id and image name ensures uniqueness while preserving information
	    const result = await Storage.put(url, image, {
	        contentType: "image/png", // contentType is optional
	      });
	    // Add error handling with result
	    console.log(`${image.name} uploaded`)
	   

	   // Adds dimensions and url to the image object that was just created
	   	const dims = await getMeta(`https://${IMAGEDELIVERYHOST}/public/${url}`);
			const update_data = {
			    	id: img.id,
			      	url: url,
			      	height: dims[0],
			      	width: dims[1]
			    };
	    const update_response = await API.graphql({
	      query: updateImages,
	      variables: { input: update_data },
	    });
	  };

	  if (files.length > 0){
        const files_array = Array.from(files)
        console.log(`starting uploads`)
        await Promise.all(files_array.map((file) => newImage(file)));
        console.log(`All images uploaded!`)
        return 0;
     }	
     return -1
}