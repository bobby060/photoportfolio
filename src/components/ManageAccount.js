"use client"
import React, { useEffect, useState } from "react";
import { generateClient } from 'aws-amplify/api';
import {
    MDBCol,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBContainer,
    MDBIcon,
    MDBRadio,
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';

import { fetchPublicAlbumTags } from "../helpers/loaders";
import { deleteAlbumTagsAlbums, deleteAlbumTags } from "../graphql/mutations";
import { albumTagsAlbumsByAlbumTagsId } from "../graphql/queries";
import currentUser from "../helpers/CurrentUser";
import { upgradeAlbums } from "../helpers/upgrade_database";

const client = generateClient();

/**
 * @brief React Component for the manage account page
 * 
 * Provides acess for admin to
 * - manage tags
 * - manually change the environment
 * 
 */
export default function ManageAccount() {

    const authStatus = useAuthenticator(context => [context.authStatus]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [tags, setTags] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const adminObject = new currentUser();
        fetchTags();
        adminObject.isAdmin(setIsAdmin);
    }, [authStatus.authStatus]);


    async function fetchTags() {
        const loadedTags = await fetchPublicAlbumTags();
        setTags(loadedTags);
    }

    /**
     * @brief delete an Album Tag
     * 
     * with confirmation
     * First deletes all Tag Connections to that tag, then deletes the tag itself
     * 
     * @param {*} tag 
     * @returns 
     */
    async function deleteTag(tag) {
        if (!window.confirm(`Are you sure you want to delete the tag ${tag.title}?`)) return;

        const newTags = tags.filter((t) => t.id !== tag.id);
        setTags(newTags);

        const tagConnections = await client.graphql({
            query: albumTagsAlbumsByAlbumTagsId,
            variables: { albumTagsId: tag.id }
        });
        tagConnections.data.albumTagsAlbumsByAlbumTagsId.items.map(async (tagConnection) => {
            await client.graphql({
                query: deleteAlbumTagsAlbums,
                variables: { input: { id: tagConnection.id } }
            });
        });
        await client.graphql({
            query: deleteAlbumTags,
            variables: { input: { id: tag.id } }
        });
        console.log('tag deleted');

    }


    function AdminSettings() {

        return (
            <MDBCol md='3' lg='2' sm='5' className="ms-auto me-auto">
                <hr className="hr" />
                <p className="mt-1">Manage Tags</p>
                <MDBListGroup light>
                    {tags.map((tag) => (<MDBListGroupItem key={tag.id} className="d-flex">
                        <p className="w-100">{tag.title}</p>
                        <MDBBtn tag='a' color='none' style={{ color: '#000000' }} onClick={() => { deleteTag(tag) }} ><MDBIcon className="" fas icon="trash" /></MDBBtn>
                    </MDBListGroupItem>))}
                </MDBListGroup>


                <hr className="hr" />
                <MDBBtn className="bg-dark m-1" onClick={() => upgradeAlbums()}>Update DB</MDBBtn>
            </MDBCol>
        );
    }

    const { signOut } = useAuthenticator((context) => [context.user]);

    function signOutWrapper() {
        signOut();
        router.push('/signin');
    }

    // Redirect to sign in if user isn't authenticated
    if (authStatus.authStatus === "unauthenticated") {
        router.push('/signin');
    }

    //  
    return (
        <MDBContainer>
            <h4 className="mt-2"> Manage Account Here</h4>

            {isAdmin ? <AdminSettings /> : <></>}
            {/* Non-admin users don't have any options right now! This would be where 
            those options would be added in the future */}

            <MDBBtn className="bg-dark" onClick={signOutWrapper}>Sign Out</MDBBtn>
        </MDBContainer>

    );
}
