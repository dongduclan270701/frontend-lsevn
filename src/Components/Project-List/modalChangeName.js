import React, { useState, useEffect, useRef} from 'react';

const ModalChangeName = (props) => {
    const refOne = useRef(null)
    const {getNewProjectName, getSelectCloseButton, ChooseChangeProjectName1,item, newName} = props
    const [projectName, setProjectName] = useState("")
    useEffect(() => {
        setProjectName(item.attributes.PROJECT_NAME)
    }, [item.attributes.PROJECT_NAME]);
    const getProjectName = (e) => {
        setProjectName(e.target.value)
        getNewProjectName(e.target.value)
    }
    const getSelectButton = () => {
        
        getSelectCloseButton(false)
    }
    const getInputProjectName = () => {
        ChooseChangeProjectName1()
    }
        const handler = (event) => {
        if (refOne.current && refOne.current.contains(event.target)) {
            return
        } else {
            // setChangeName(false)
            getSelectCloseButton(false)
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, []);
    return (
        <div className="modal modal-blur fade show" id="modal-report" tabIndex={-1} style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div ref={refOne} className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content" style={{border: "1px solid #d3cfcf",borderRadius: "10px"}}>
                    <div className="modal-header">
                        <h5 className="modal-title">Project Number {item.attributes.PROJECT_NUMBER}</h5>
                        <button onClick={getSelectButton} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Project Name</label>
                            <input  onChange={e => getProjectName(e)} type="text" value={projectName} className="form-control" name="example-text-input" placeholder={projectName} />
                        </div>
                    </div>
                    
                    <div className="modal-footer">
                        <a onClick={getSelectButton} className="btn btn-link link-secondary" data-bs-dismiss="modal">
                            Cancel
                        </a>
                        <a onClick={getInputProjectName} className="btn btn-primary ms-auto" data-bs-dismiss="modal">
                            Update
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalChangeName;
