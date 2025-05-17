/** uploadImages.js
 * 
 * Methods related to uploading images
 * 
 * @author Robert Norwood
 * 
 * @date 10/10/2024
 * 
 */
import { generateClient } from 'aws-amplify/api';

import { uploadData } from 'aws-amplify/storage';
import { createImages, deleteImages } from '../graphql/mutations';

const client = generateClient();


/**
 * @brief upload images
 * 
 * @param {Object} targetAlbum Album to upload to
 * @param {*} files Files to upload
 * @param {*} returnTotalUploaded callback to update the total images sucessfully uploaded
 * @returns 
 */
export default async function uploadImages(targetAlbum, files, returnTotalUploaded = () => { }) {

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    let totalUploaded = 0;

    // Originally intended to extract date from photo. Right now 
    // simply sets date to current date
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


    /**
     * @brief uploads one image
     * 
     * Creates image object and stores in database. Uploads image to storage.
     * 
     * @param {*} image image file
     * @returns None
     */
    async function newImage(image) {

        // Won't upload images of invalid type (or files that aren't images)
        if (!validImageTypes.includes(image['type'])) {
            console.warn(`file ${image.name} is not a valid file type!`);
            return;
        }

        let newImageId = '';
        let uploadedImg = {};
        let url = '';

        try {

            // Gets height, width for image
            const img = new Image();
            img.src = window.URL.createObjectURL(image);
            await img.decode();
            const dims = [img.naturalHeight, img.naturalWidth];

            // Package data for image database entry
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
                const response = await client.graphql({
                    query: createImages,
                    variables: { input: data },
                });

                uploadedImg = response?.data?.createImages;
                newImageId = uploadedImg.id;

                // Image url (S3 object key) is combination of id and image name ensures uniqueness while preserving image title
                url = `${uploadedImg.id}-${image.name}`;
            } catch (error) {
                console.warn('Error creating image: ', image.name, error);
                return;
            }

            try {
                // Upload to S3
                await uploadData({
                    key: url,
                    data: image
                }
                );
            } catch (error) {
                // Delete image object if S3 file doesn't upload
                console.warn('Image not uploaded. Error: ', error);
                await client.graphql({
                    query: deleteImages,
                    variables: { input: { id: newImageId } }
                });
                return;
            }

            totalUploaded = totalUploaded + 1;
            returnTotalUploaded(totalUploaded);

        } catch (error) {
            console.warn('Error uploading image: ', image.name, error);
            return;
        }

        console.log(`${image.name} sucessfully uploaded`)
    }


    // Upload each image individually
    if (files.length > 0) {
        const files_array = Array.from(files)
        console.log(`starting uploads`)
        await Promise.all(files_array.map((file) => newImage(file)));
        console.log(`All images uploaded!`)
        return;
    }
    return;
}