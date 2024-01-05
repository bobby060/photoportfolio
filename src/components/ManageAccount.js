import React, { useEffect, useState } from "react";
import { API } from 'aws-amplify';
import {
    MDBCol,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBContainer,
    MDBSpinner,
    MDBIcon
} from 'mdb-react-ui-kit';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from "react-router-dom";

import { fetchAllAlbumTags, fetchPublicAlbumTags } from "../helpers/loaders";
import { deleteAlbumTagsAlbums, deleteAlbumTags } from "../graphql/mutations";
import { listAlbumTagsAlbums } from "../graphql/queries";



export default function ManageAccount() {

    const user_item = useAuthenticator((context) => [context.user]);
    const authStatus = useAuthenticator(context => [context.authStatus]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        const adminStatus = isAdminGroup();
        setIsAdmin(adminStatus);
    }, [authStatus]);

    async function fetchTags() {
        const loadedTags = await fetchPublicAlbumTags();
        setTags(loadedTags);
    }

    async function deleteTag(id) {

    }

    function isAdminGroup() {
        if (authStatus.authStatus === 'configuring'
            || !user_item.user
            || !user_item.user.signInUserSession.accessToken.payload['cognito:groups']) {
            return false;
        }
        if (user_item.user.signInUserSession.accessToken.payload['cognito:groups'][0] === "portfolio_admin") {
            return true;
        }
        return false;
    }

    function AdminSettings() {
        return (
            <MDBCol md='3' lg='2' sm='5' className="ms-auto me-auto">
                <p className="mt-1">Current Tags</p>
                <MDBListGroup light>
                    {tags.map((tag) => (<MDBListGroupItem key={tag.id} className="d-flex">
                        <p className="w-100">{tag.title}</p>
                        <MDBBtn tag='a' color='none' style={{ color: '#000000' }} onClick={() => { deleteTag(tag.id) }} ><MDBIcon className="" fas icon="trash" /></MDBBtn>
                    </MDBListGroupItem>))}
                </MDBListGroup>


            </MDBCol>
        );
    }

    const { signOut } = useAuthenticator((context) => [context.user]);

    if (authStatus.authStatus === "unauthenticated") {
        navigate('/signin');
    }

    return (
        <MDBContainer>
            <h4 className="mt-1"> Manage Account Here</h4>
            {isAdmin ? <AdminSettings /> : <></>}
            <MDBBtn className="bg-dark" onClick={signOut}>Sign Out</MDBBtn>
        </MDBContainer>

    );
}
