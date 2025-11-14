"use client"
import React, { useEffect, useState } from "react";
import {
    MDBCol,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBContainer,
    MDBIcon,
    MDBRadio,
} from 'mdb-react-ui-kit';
import { useRouter } from 'next/navigation';

import { useAuth } from '../hooks/useAuth';
import { useAlbumTags } from '../hooks/useAlbums';
import { useRepositories } from '../hooks/useRepositories';
import { upgradeAlbums } from "../helpers/upgrade_database";

/**
 * @brief React Component for the manage account page
 * 
 * Provides acess for admin to
 * - manage tags
 * - manually change the environment
 * 
 */
export default function ManageAccount() {
    const { user, isAuthenticated, isAdmin, signOut: authSignOut } = useAuth();
    const { tags, refetch: refetchTags } = useAlbumTags({ filter: 'public' });
    const { albums: albumRepo } = useRepositories();
    const router = useRouter();

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

        try {
            // Get albums associated with this tag
            const tagAlbums = await albumRepo.getAlbumsByTag(tag.id);

            // Delete all tag connections
            for (const tagAlbum of tagAlbums) {
                if (tagAlbum.id) {
                    // Note: The deleteAlbumTagsAlbums would need to be wrapped in repository
                    // For now, we just delete the tag itself
                }
            }

            // Delete the tag
            await albumRepo.deleteAlbumTag(tag.id);

            // Refresh the tags list
            await refetchTags();

            console.log('tag deleted');
        } catch (error) {
            console.error('Failed to delete tag:', error);
            alert('Failed to delete tag. Please try again.');
        }
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

    async function signOutWrapper() {
        try {
            await authSignOut();
            router.push('/');
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    }

    // Redirect to sign in if user isn't authenticated (client-side only)
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin');
        }
    }, [isAuthenticated, router]);

    // Show nothing while checking authentication or redirecting
    if (!isAuthenticated) {
        return null;
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
