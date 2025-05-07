import React from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';

export default function ErrorPage({ error }) {
    console.error(error);

    return (
        <MDBContainer id="error-page text-align-center">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error?.message || 'An unknown error occurred'}</i>
            </p>
        </MDBContainer>
    );
}