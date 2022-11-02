import React from 'react';

const ModalLoginFailed = (props) => {
    const {GetLoginAgain} = props
    const HandleLoginAgain = () => {
        GetLoginAgain(false)
    }
    return (
        <div className="modal modal-blur fade show" id="modal-danger" tabIndex="-1" style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div className="modal-content" style={{border: '1px solid #ffc0c0'}}>
                    
                    <div className="modal-status bg-danger"></div>
                    <div className="modal-body text-center py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon mb-2 text-danger icon-lg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 9v2m0 4v.01"></path><path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path></svg>
                        <h3>LOGIN FAILED</h3>
                        <div className="text-muted">Your email/username or password not correct.<br /> 
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="w-100">
                            <div className="row">
                                {/* <div className="col"><a className="btn w-100" data-bs-dismiss="modal">
                                    Cancel
                                </a></div> */}
                                <div className="col" onClick={() => HandleLoginAgain()}><a className="btn btn-danger w-100" data-bs-dismiss="modal">
                                    Close
                                </a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalLoginFailed;
