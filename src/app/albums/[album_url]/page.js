import Album from '../../../components/Album';
import awsconfig from '../../../aws-exports';

export default async function Page({ params }) {

    const { album_url, children } = await params;

    return <Album album_url={album_url}>{children}</Album>
}

Amplify.configure(awsconfig);

// src/app/albums/[album_url]/page.js or .tsx

// ... (your other imports and page component logic)

import { generateClient } from 'aws-amplify/api';
// Assuming you have a query to get all album IDs or slugs
import { listAlbums } from '../../../graphql/queries'; // Adjust path as needed
import { urlhelperEncodeUrlSafe } from '../../../helpers/urlhelper'; // Adjust path
import { Amplify } from 'aws-amplify';

const client = generateClient({ authMode: 'apiKey' }); // Or your preferred auth mode

export async function generateStaticParams() {
    try {
        // Fetch all albums. You might need to handle pagination if you have many.
        // This query should return at least the data needed to form the URL segment.
        // For example, if your album objects have a 'title' or a 'slug' field
        // that you use in urlhelperEncode.
        const apiData = await client.graphql({
            query: listAlbums, // Or a more specific query for just IDs/titles/slugs
            // Add variables if needed, e.g., for pagination to fetch all items
        });


        const albums = apiData.data.listAlbums.items;

        const albumUrls = albums.map((album) => ({
            album_url: urlhelperEncodeUrlSafe(album), // Ensure this matches your Link href structure
        }));


        return albumUrls;
    } catch (error) {
        console.error("Error fetching albums for generateStaticParams:", error);
        return []; // Return empty array on error to prevent build failure, or handle differently
    }
}
