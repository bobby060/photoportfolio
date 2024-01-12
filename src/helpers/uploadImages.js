import { API, Storage } from 'aws-amplify';
// import { uploadData } from 'aws-amplify/storage';
import { createImages, deleteImages } from '../graphql/mutations';


export default async function uploadImages(targetAlbum, files) {

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    function getExifDate() {

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


    async function newImage(image) {

        if (!validImageTypes.includes(image['type'])) {
            console.warn(`file ${image.name} is not a valid file type!`);
            return;
        }

        let newImageId = '';
        let uploadedImg = {};
        let url = '';

        // Gets height for image
        const img = new Image();
        img.src = window.URL.createObjectURL(image);
        await img.decode();
        const dims = [img.naturalHeight, img.naturalWidth];

        const data = {
            title: image.name,
            desc: "",
            filename: image.name,
            date: getExifDate(image),
            albumsID: targetAlbum.id,
            height: dims[0],
            width: dims[1],
        }
        try {
            const response = await API.graphql({
                query: createImages,
                variables: { input: data },
            });

            uploadedImg = response?.data?.createImages;
            newImageId = uploadedImg.id;
            url = `${uploadedImg.id}-${image.name}`;
            // Need to add error handling here\
        } catch (error) {
            console.warn('Error creating image: ', image.name, error);
            return;
        }

        // Combining id and image name ensures uniqueness while preserving information
        try {
            await Storage.put(url, image);
            // throw new Error('storage error');
        } catch (error) {
            // Delete image object if S3 file doesn't upload
            console.warn('Image not uploaded. Error: ', error);
            await API.graphql({
                query: deleteImages,
                variables: { input: { id: newImageId } }
            });
            return;
        }

        console.log(`${image.name} uploaded`)
    }

    if (files.length > 0) {
        const files_array = Array.from(files)
        console.log(`starting uploads`)
        await Promise.all(files_array.map((file) => newImage(file)));
        console.log(`All images uploaded!`)
        return;
    }
    return;
}