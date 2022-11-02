import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify'
import { Auth } from 'Action';
import { hostDev } from 'Action/host'
import { hostProduction } from 'Action/host'
const endpointDeleteA = `${hostProduction}/api/actuals/deleteData`
const endpointDeleteD = `${hostProduction}/api/designs/deleteData`
const endpointDeleteQ = `${hostProduction}/api/quotations/deleteData`
const ModalDeleteData = (props) => {
    const refOne = useRef(null)
    const { GetCancelDelete, projectId, projectNumber } = props;
    const { chooseQ, chooseA, chooseD } = props
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
        GetCancelDelete(false)
    }
    const HandleDelete = () => {
        toast.success('START DELETE ALL DATA', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        })
        axios({
            url: chooseA ? endpointDeleteA : chooseD ? endpointDeleteD : endpointDeleteQ,
            method: "POST",
            data: {
                "data": {
                    "projectId": projectId
                }
            },
            headers: {
                'Authorization': Auth
            }
        }).then(result => {
            // console.log(result)
            toast.success(`ALL DATA WERE DELETED (${result.data.data.count} RECORDS)`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            })
        }).catch(error=>{
            // console.log(error)
            toast.error("SERVER ERROR: " + error.code, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            })
        })
        GetCancelDelete(false)
    }
    return (
        <div className="modal modal-blur fade show" id="modal-danger" tabindex="-1" style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div ref={refOne} className="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div className="modal-content" style={{border: '1px solid #ffc0c0'}}>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => HandleCancel()}></button>
                    <div className="modal-status bg-danger"></div>
                    <div className="modal-body text-center py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon mb-2 text-danger icon-lg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 9v2m0 4v.01"></path><path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path></svg>
                        <h3>DELETE DATA - {projectNumber} - ({chooseA ? 'Actual' : chooseD ? 'Design' : 'Quotation'})?</h3>
                        <div className="text-muted">Do you really want to remove all data from <br /> PROJECT: {projectNumber} - TABLE:
                            {chooseA ? ' Actual' : chooseD ? ' Design' : ' Quotation'}?</div>
                    </div>
                    <div className="modal-footer">
                        <div className="w-100">
                            <div className="row">
                                <div className="col" onClick={() => HandleCancel()}><a className="btn w-100" data-bs-dismiss="modal">
                                    Cancel
                                </a></div>
                                <div className="col" onClick={() => HandleDelete()} ><a className="btn btn-danger w-100" data-bs-dismiss="modal">
                                    Delete all items
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