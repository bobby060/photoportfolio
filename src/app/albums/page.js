"use client"

import AllAlbums from '../../components/AllAlbums';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        router.push('/#albums');
    }, [router]);

    // return <AllAlbums />;
} 