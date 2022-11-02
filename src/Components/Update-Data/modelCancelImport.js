import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { Auth } from 'Action';
const ModalDeleteData = (props) => {
    const navigate = useNavigate()
    const refOne = useRef(null)
    const { GetCancelDelete, projectId, projectNumber, GetNeedConfirm} = props;
    const { chooseQ, chooseA, chooseD } = props
    // console.log(chooseQ)
    const handler = (event) => {
        if (refOne.current && refOne.current.contains(event.target)) {
            return
        } else {
            // setChangeName(false)
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, []);
    const HandleCancel = () => {
        GetNeedConfirm(false)
    }
    const HandleCancel1 = () => {
        navigate('/')
        
    }
    return (
        <div className="modal modal-blur fade show" id="modal-danger" tabIndex="-1" style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div className="modal-content" style={{border: '1px solid #ffc0c0'}}>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => HandleCancel()}></button>
                    <div className="modal-status bg-danger"></div>
                    <div className="modal-body text-center py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon mb-2 text-danger icon-lg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 9v2m0 4v.01"></path><path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path></svg>
                        <h3>CANCEL IMPORT - {projectNumber} - ({chooseA ? 'Actual' : chooseD ? 'Design' : 'Quotation'})?</h3>
                        <div className="text-muted">You are processing data from excel! Are you really want to cancel import?<br /> 
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="w-100">
                            <div className="row">
                                <div className="col" onClick={() => HandleCancel()}><a className="btn w-100" data-bs-dismiss="modal">
                                    Cancel
                                </a></div>
                                <div className="col" onClick={() => HandleCancel1()} ><a className="btn btn-danger w-100" data-bs-dismiss="modal">
                                    Go to page project list
                                </a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalDeleteData;