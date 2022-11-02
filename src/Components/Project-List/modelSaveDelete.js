import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Auth } from 'Action';
import { toast } from 'react-toastify'
import { hostDev } from 'Action/host'
import { hostProduction } from 'Action/host'
const endpoint2 = hostProduction + "/graphql"

const ModalSaveDelete = (props) => {
    
    const { getSelectCloseButton, item, RefreshT2,refOne } = props

    const handler = (event) => {
        if (refOne.current && refOne.current.contains(event.target)) {
            return
        } else {
            // setChangeName(false)
            getSelectCloseButton(false)
        }
    }
    const CloseButton = () => {
        getSelectCloseButton(false)
    }
    useEffect(() => {
        document.addEventListener("mousedown", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, []);
    const AcceptButtonDelete = async () => {
        const MUATATION_DELETE = `mutation deletePanel {
                deletePanel(id: ${item.id}) {
                  data {
                    id
                    attributes {
                      TASK_NAME
                    }
                  }
                }
              }`
        //   console.log(item.id)
        await axios({
            url: endpoint2,
            method: 'POST',
            data: {
                query: MUATATION_DELETE
            }
            ,
            headers: {
                'Authorization': Auth
            }


        }).then(result => {
            toast.success('Delete Successfully!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            })
            getSelectCloseButton(false)
            RefreshT2(false)
        })
            .catch(error => {
                toast.error("SERVER ERROR: " + error.name, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                })
            })
            getSelectCloseButton(false)
    }
    return (
        <React.Fragment>
        <div className="modal modal-blur fade show" id="modal-report" tabIndex={-1} style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div ref={refOne} className="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div className="modal-content" style={{ border: "1px solid #d3cfcf", borderRadius: "10px" }}>
                    <div className="modal-body">
                        <div className="modal-title">Are you sure?</div>
                        <div>If you proceed, you will lose your personal data.</div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={CloseButton} type="button" className="btn btn-link link-secondary me-auto" data-bs-dismiss="modal">Cancel</button>
                        <button onClick={AcceptButtonDelete} type="button" className="btn btn-danger" data-bs-dismiss="modal">Yes, delete my data</button>
                    </div>
                </div>
            </div>
        </div></React.Fragment>
    );
}

export default ModalSaveDelete;