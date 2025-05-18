/**
 * Basic loading page component
 * 
 * @author: rnorwood
 */

"use client"
import { MDBSpinner } from 'mdb-react-ui-kit';

export default function Loading() {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <MDBSpinner />
        </div>
    );
} 