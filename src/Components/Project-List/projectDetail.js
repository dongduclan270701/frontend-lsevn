import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hostDev } from 'Action/host'
import { hostProduction } from 'Action/host'
import axios from 'axios';
import { Auth } from 'Action';
import ModalChangeName from './modelChangeName';
import { toast } from 'react-toastify'

const endpoint = hostProduction + "/api/project/changeProjectName"

const ProjectDetail = (props) => {
    const { item, index, ChooseProjectID, role, page } = props
    const [changeName, setChangeName] = useState(false)
    const [newName, setNewName] = useState("")
    const [getStatusObj, setGetStatusObj] = useState(0) ;
    const endpoint2 = hostProduction + `/api/project/pdf/find/${item.attributes.PROJECT_NUMBER}.pdf`
    const {pageToChangeName} = props;
    useEffect(() => {
        setChangeName(false)
        setNewName(item.attributes.PROJECT_NAME)
        
        
    }, [item.attributes.PROJECT_NAME]);
    useEffect(() => {
        const fetchData = async () => {
            await axios({
                url: endpoint2,
                method: 'get',
                headers: {
                    'Authorization': Auth
                }
            }).then(result => {
                setGetStatusObj(result.data.result)
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
        }
        fetchData()
    }, [item.attributes.PROJECT_NUMBER]);
    const navigate = useNavigate()

    const onNavigatePage = () => {
        ChooseProjectID(item.attributes.PROJECT_NUMBER)
        // navigate(`/`, {state: {page: page}})
    }
    const onNavigatePageImportData = () => {
        navigate(`/import-data`, {state:{ item : item}})
    }
    const getNewProjectName = (projectName) => {
        setNewName(projectName)
    }
    const getSelectCloseButton = (value) => {
        setChangeName(value)
    }
    const ChooseChangeProjectName = async () => {
        setChangeName(!changeName)
    }
    const ChooseChangeProjectName1 = async () => {
        setChangeName(!changeName)
        if (newName !== item.attributes.PROJECT_NAME) {
            await axios({
                url: endpoint,
                method: 'post',
                data: {
                    "data": {
                        "id": item.id,
                        "projectName": newName
                    }
                }
                ,
                headers: {
                    'Authorization': Auth
                }
            }).then((result) => {
                if (result.statusText === "OK") {
                    window.location.reload()
                    navigate('/', {state: {page: pageToChangeName}})
                }
            }
            )
            
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
            
        }

    }
    const PDFDownload2 = async () => {
        await axios({
            method: 'GET',
            url: hostProduction + "/api/project/pdf/download/" + `${item.attributes.PROJECT_NUMBER}.pdf`,
            responseType: 'arraybuffer',
            headers: {
                "Content-Type": "application/pdf",
                // "Content-Disposition":"11",
                // "filename":"filename",
                // "filename":'filename"
                "Authorization": Auth
            }
        }).then(function (response) {
            var file = new Blob([response.data], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            // var file = new Blob([response.data], {type: 'application/pdf'});
            // var fileURL = URL.createObjectURL(file);
            // window.open(fileURL)
            // // window.open(fileURL,'my window')
            // // window.location.assign(fileURL);
            window.open(fileURL);
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
    }
    const onFocus = () => setChangeName(true)
    const onBlur = (e) => {
        setChangeName(false)
    }
    return (
        <tr >
            <td><span className="text-muted">{index + 1}</span></td>
            <td  className="tw-1" /><td style={{borderLeft:"1px solid #ddd5d5"}}><a className="text-reset" tabIndex={-1} style={{ textDecoration: "none" }}>{item.attributes.PROJECT_NUMBER}</a></td>
            <td  style={{borderLeft:"1px solid #ddd5d5"}}>
                {item.attributes.PROJECT_NAME}
                &ensp;&ensp;
                <span onClick={role === 'Authenticated' ? ChooseChangeProjectName : null} style={role === 'Authenticated' ? { cursor: 'pointer' } : { display: 'none' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                        <path d="M16 5l3 3"></path>
                    </svg>
                </span>
            </td>
            {/* <td>
                    <input 
                    // ref={refOne}
                    autoFocus 
                    className="btn" 
                    style={{ width: 'auto', cursor: 'auto' }} 
                    type='text' value={newName} 
                    onChange={(e) => onChangeProjectName(e)} 
                    // onMouseDown={setChangeName(false)}
                    // onFocus={onFocus} 
                    // onBlur={e => onBlur(e)}
                    />
                    &ensp;&ensp;
                    <button className="btn" onClick={() => ChooseChangeProjectName1()}>Submit</button>
                </td> */}

            <td style={{ width: "200px", borderLeft:"1px solid #ddd5d5" }} className="text-center">
                <span className="dropdown">
                    <button className="btn align-text-top" data-bs-boundary="viewport" data-bs-toggle="dropdown" onClick={onNavigatePage}>Select</button>
                </span>
                &ensp;&ensp;
                <span className="dropdown">

                    <span style={{ textDecoration: "none" }} >
                        {getStatusObj === 0
                            &&
                            //chinh border button PDF khi chua co data
                            <button className="btn align-text-top" style={{ border: "1px solid white" }} data-bs-boundary="viewport" data-bs-toggle="dropdown" disabled>PDF</button>}
                        {getStatusObj === 1
                            &&
                            <a onClick={PDFDownload2} className="btn align-text-top" data-bs-boundary="viewport" data-bs-toggle="dropdown">PDF</a>}
                    </span>
                </span>
                &ensp;&ensp;
                <span className="dropdown" style={role === 'Authenticated' ? { cursor: 'pointer' } : { display: 'none' }}>
                    <button className="btn align-text-top" data-bs-boundary="viewport" data-bs-toggle="dropdown" onClick={onNavigatePageImportData}>Import Data</button>
                </span>
            </td>
            {changeName ? <ModalChangeName page={page} getNewProjectName={getNewProjectName} getSelectCloseButton={getSelectCloseButton} ChooseChangeProjectName1={ChooseChangeProjectName1} item={item} newName={newName} /> : ""}
        </tr>
    );
}

export default ProjectDetail;