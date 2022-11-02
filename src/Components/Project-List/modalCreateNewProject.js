import React, {useRef,useEffect} from 'react';

const ModalCreateNewProject = (props) => {
    const refOne = useRef(null)
    const { getCloseModalCreateNewProject, DataFile } = props
    const handler = (event) => {
        if (refOne.current && refOne.current.contains(event.target)) {
            return
        } else {
            // setChangeName(false)
            getCloseModalCreateNewProject(false)
        }
    }
    const CloseButton = () => {
        getCloseModalCreateNewProject(false)
    }
    useEffect(() => {
        document.addEventListener("mousedown", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, []);
    return (
        <div className="modal modal-blur fade show" id="modal-report" tabIndex={-1} style={{ display: 'block', paddingLeft: '0px' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div style={{border:"1px solid #c3bcbc", borderRadius:"10px"}} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{"Sheet1"}</h5>
                        <button onClick={CloseButton} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Project Number</label>
                            <input type="text" className="form-control" name="example-text-input" placeholder="Your report name" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Project Name</label>
                            <input type="text" className="form-control" name="example-text-input" placeholder="Your report name" />
                        </div>
                    </div>
                    <div className="modal-body">
                    </div>
                    <div className="modal-footer">
                        <a onClick={CloseButton} className="btn btn-link link-secondary" data-bs-dismiss="modal">
                            Cancel
                        </a>
                        <a className="btn btn-primary ms-auto" data-bs-dismiss="modal">
                            {/* Download SVG icon from http://tabler-icons.io/i/plus */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
                            Create new project
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalCreateNewProject;
