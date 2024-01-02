import { API, Storage } from 'aws-amplify';
import { createImages, updateImages } from '../graphql/mutations';
import { IMAGEDELIVERYHOST } from '../components/App';


export default async function uploadImages(targetAlbum, files) {

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

    const getMeta = async (url) => {
        const img = new Image();
        img.src = url;
        await img.decode();
        return [img.naturalHeight, img.naturalWidth];
    };

    async function newImage(image) {

        let img = {}
        let url = ''
        const data = {
            title: image.name,
            desc: "",
            filename: image.name,
            date: getExifDate(image),
            albumsID: targetAlbum.id
        }
        try {
            const response = await API.graphql({
                query: createImages,
                variables: { input: data },
            });


            img = response?.data?.createImages
            url = `${img.id}-${image.name}`;
            // Need to add error handling here\
        } catch {
            console.warn('Error creating image: ', image.name);
            return;
        }

        // Combining id and image name ensures uniqueness while preserving information
        try {
            const result = await Storage.put(url, image, {
                contentType: "image/png", // contentType is optional
            });
            console.log(result);
            // Add error handling with result
            console.log(`${image.name} uploaded`)
        } catch (error) {
            console.warn('Image not uploaded. Error: ', error);
            return;
        }


        // Adds dimensions and url to the image object that was just created
        const dims = await getMeta(`https://${IMAGEDELIVERYHOST}/public/${url}`);
        const update_data = {
            id: img.id,
            url: url,
            height: dims[0],
            width: dims[1]
        };
        try {
            await API.graphql({
                query: updateImages,
                variables: { input: update_data },
            });
        } catch (error) {
            await Storage.remove(url);
            console.warn('Image no inserted into database, deleting from storage. Error: ', error);
        }
    }

    if (files.length > 0) {
        const files_array = Array.from(files)
        console.log(`starting uploads`)
        await Promise.all(files_array.map((file) => newImage(file)));
        console.log(`All images uploaded!`)
        return 0;
    }
    return -1
}