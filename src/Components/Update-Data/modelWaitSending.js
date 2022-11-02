import React, { useEffect, useState } from 'react';
import './import.css'
const ModelWaitSending = () => {

    const OnKeyDown =(e) => {
        alert(e) 
    }

    return (
        <div className="modal modal-blur fade show" id="modal-danger" tabIndex="-1" style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div className='circle-rotate'>
                    <svg id='wait-icon' xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-rotate-clockwise" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default ModelWaitSending;
