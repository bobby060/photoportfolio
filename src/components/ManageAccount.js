import React, { useEffect, useState } from "react";
import { generateClient } from 'aws-amplify/api';
import {
    MDBCol,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBContainer,
    MDBSpinner,
    MDBIcon,
    MDBRadio,
    MDBBtnGroup
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from "react-router-dom";

import { fetchAllAlbumTags, fetchPublicAlbumTags } from "../helpers/loaders";
import { deleteAlbumTagsAlbums, deleteAlbumTags } from "../graphql/mutations";
import { albumTagsAlbumsByAlbumTagsId, listAlbumTagsAlbums } from "../graphql/queries";
import currentUser from "../helpers/CurrentUser";
import projectConfig from "../helpers/Config";

const client = generateClient();


export default function ManageAccount() {

    // const user_item = useAuthenticator((context) => [context.user]);
    const authStatus = useAuthenticator(context => [context.authStatus]);
    const [isAdmin, setIsAdmin] = useState(false);
    const adminObject = new currentUser();
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTags();
        adminObject.isAdmin(setIsAdmin);
    }, []);


    async function fetchTags() {
        const loadedTags = await fetchPublicAlbumTags();
        setTags(loadedTags);
    }

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

    async function updateBranch(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const radioValue = form.get("inlineRadio");
        console.log(radioValue);
        projectConfig.setCurrentEnvironment(radioValue);
        projectConfig.save();
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
                <p className="mt-1">Change branch</p>
                <form className="m-1" onSubmit={updateBranch}>
                    {(projectConfig.getCurrentEnvironment === 'dev') ? (
                        <>
                            <MDBRadio name='inlineRadio' value='dev' label='dev' inline defaultChecked />
                            <MDBRadio name='inlineRadio' value='staging' label='staging' inline />
                        </>) : (<><MDBRadio name='inlineRadio' value='dev' label='dev' inline />
                            <MDBRadio name='inlineRadio' value='staging' label='staging' inline defaultChecked />
                        </>)}
                    <MDBBtn className="bg-dark m-1" >Save</MDBBtn>
                </form>
                <hr className="hr" />
            </MDBCol>
        );
    }

    const { signOut } = useAuthenticator((context) => [context.user]);

    if (authStatus.authStatus === "unauthenticated") {
        navigate('/signin');
    }

    return (
        <MDBContainer>
            <h4 className="mt-2"> Manage Account Here</h4>

            {isAdmin ? <AdminSettings /> : <></>}


            <MDBBtn className="bg-dark" onClick={signOut}>Sign Out</MDBBtn>
        </MDBContainer>

    );
}
