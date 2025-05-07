import React, { useState } from 'react';
import {
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit';


/** @brief React Component for an Album Tag
 * 
 * @param {Bool} selected, whether or not selected 
 * @param onSelect callback for action to take on select
 * @param onDeselect callback for action to take on deselect
 */
export default function Tag({ selected = false, onSelect = () => { }, onDeselect = () => { }, name }) {

    // Local state for selected status
    const [isSelected, setIsSeleted] = useState(selected);

    function handleClick() {
        if (isSelected) {
            setIsSeleted(false);
            onDeselect();
        } else {
            setIsSeleted(true);
            onSelect();
        }
    }

    if (isSelected) {
        return (
            <MDBBtn rounded className='text-light m-1' size='sm' color='dark' onClick={() => handleClick()}>{name}  <MDBIcon className="text-white-50" icon="times" /></MDBBtn>
        );
    } else {
        return (
            <MDBBtn rounded outline onClick={() => handleClick()} className='text-dark m-1' size='sm' color='dark'>{name}</MDBBtn>
        );
    }


}