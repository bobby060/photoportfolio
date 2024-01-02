import React from 'react';

import { useRouteError } from "react-router-dom";
import { MDBContainer } from 'mdb-react-ui-kit';

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <MDBContainer id="error-page text-align-center">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </MDBContainer>
    );
}