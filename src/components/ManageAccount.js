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
import { fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from "react-router-dom";

import { fetchAllAlbumTags, fetchPublicAlbumTags } from "../helpers/loaders";
import { deleteAlbumTagsAlbums, deleteAlbumTags } from "../graphql/mutations";
import { albumTagsAlbumsByAlbumTagsId, listAlbumTagsAlbums } from "../graphql/queries";
import currentUser from "../helpers/CurrentUser";

const client = generateClient();


export default function ManageAccount() {

    // const user_item = useAuthenticator((context) => [context.user]);
    const authStatus = useAuthenticator(context => [context.authStatus]);
    const [isAdmin, setIsAdmin] = useState(false);
    const adminObject = new currentUser;
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTags();
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
                <div className="m-1">
                    <MDBRadio name='inlineRadio' id='inlineRadio1' value='option1' label='dev' inline />
                    <MDBRadio name='inlineRadio' id='inlineRadio2' value='option2' label='staging' inline defaultChecked />
                </div>
                <MDBBtn className="bg-dark m-1" >Save</MDBBtn>
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

            {adminObject.isAdmin() ? <AdminSettings /> : <></>}


            <MDBBtn className="bg-dark" onClick={signOut}>Sign Out</MDBBtn>
        </MDBContainer>

    );
}
