import Album from '../../../components/Album';

export default async function Page({ params }) {


    const { album_url, children } = await params;


    return <Album album_url={album_url}>{children}</Album>
}