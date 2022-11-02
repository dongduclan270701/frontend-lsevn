import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx/xlsx.mjs';
import "./import.css"
import swal from 'sweetalert';
import { toast } from 'react-toastify'
import ModalDeleteData from './modelDeleteData';
import ModelCalcelImport from './modelCancelImport';
import ModelWaitSending from './modelWaitSending';
import { hostDev } from 'Action/host'
import { hostProduction } from 'Action/host'
import { Auth } from 'Action';
import { useQuery, gql, useMutation } from '@apollo/client';
const endpoint = `${hostProduction}/graphql`
const endpointA = `${hostProduction}/api/actuals/importData`
const endpointD = `${hostProduction}/api/designs/importData`
const endpointQ = `${hostProduction}/api/quotations/importData`
const endpointDistincItemCode = `${hostProduction}/api/dashboard/distinctItemCode`
const endpointUpdateDashBoard = `${hostProduction}/graphql`

const ImportUpdateData = (props) => {
    let navigate = useNavigate();
    const { chooseQ, chooseA, chooseD, isImporting } = props
    const [needConfirmCancel, setNeedConfirmCancel] = useState(false)
    const [isQueryDone, setIsQueryDone] = useState(false)
    const [fileName, setFileName] = useState(null)
    const [file, setFile] = useState(null)
    const [sheetNames, setSheetNames] = useState([])
    const [sheetData, setSheetData] = useState({})
    const [sheetDataV2, setSheetDataV2] = useState(null)
    const [sheet, setSheet] = useState(null)
    const { projectId, projectNumber, GetIsImporting, GetShouldReload } = props;
    const [deleteData, setDeleteData] = useState(false)
    const [notMatchIndex, setNotMatchIndex] = useState([-1]);
    const [svError, setSvError] = useState(false)
    const [exportArr, setExportArr] = useState([])
    const [arr, setArr] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    const [isSending, setIsSending] = useState(false);
    const [oldItemCode, setOldItemCode] = useState([])
    const [arrToUpdateDashBoard, setArrToUpdateDashBoard] = useState(["0"]);
    const isImportedDone = useRef(true);
    const asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        };
    };
    const handleFile = async (e) => {
        GetIsImporting(true);
        const file = e.target.files[0];
        getDataFile(file)
        e.target.value = ''
        // RefreshT2(false)
    }
    const acceptableFileName = ["xlsx", "xls"]
    const checkFileName = (name) => {
        // console.log(name.split(".").pop().toLowerCase())
        return acceptableFileName.includes(name.split(".").pop().toLowerCase())
    }
    const readDataFromExcel = (data) => {
        const wb = XLSX.read(data)
        setSheetNames(wb.SheetNames)
        var mySheetData = {}
        for (let index = 0; index < wb.SheetNames.length; index++) {
            let sheetName = wb.SheetNames[index]

            const worksheet = wb.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                blankrows: "",
                header: 1,
            })
            mySheetData[sheetName] = jsonData
        }
        setSheetData(mySheetData)
        return mySheetData
    }
    const handleFileUpLoaded = async (e) => {
        if (e) {
            let sheetNames = Object.keys(e)
            setSheetNames(sheetNames)
            setSheet(Object.keys(e)[0])
        } else {
            setSheetNames(null)
        }
        setSheetDataV2(e)
    }

    const getDataFile = async (datafile) => {
        setIsSending(true)
        setIsQueryDone(false)
        const myFile = datafile
        if (!myFile) return
        if (!checkFileName(myFile.name)) {
            alert("Invalid File Type");
            return;
        };
        const data = await myFile.arrayBuffer()
        const mySheetData = readDataFromExcel(data)
        setFile(myFile)
        setFileName(myFile.name)
        handleFileUpLoaded(mySheetData)
        setIsSending(false)
    }
    const ChooseDeleteData = () => {
        setDeleteData(!deleteData);
    }

    useEffect(() => {
        setExportArr([])
        setExportArr(exportArr => [...exportArr])
    }, []);
    useEffect(() => {
        if (sheetDataV2) {
            const QUERY_AR_DASHBOARD = `{
                dashboard{
                  data{
                    attributes{
                      itemCode
                    }
                  }
                }
              }`
            axios({
                url: endpointUpdateDashBoard,
                method: 'POST',
                data: {
                    query: QUERY_AR_DASHBOARD
                },
                headers: {
                    'Authorization': Auth
                }
            }).then(res => {
                console.log(res)
                if (res.data.data.dashboard.data) {
                    const arr = res.data.data.dashboard.data.attributes.itemCode;
                    sheetDataV2[sheet].slice(1).map((row, index) => {
                        if (row[1] === projectNumber) {
                            // console.log(row[4].toString())
                            if (!arr.includes(row[4] ? row[4].toString() : "0")) {
                                arr.unshift(row[4] ? row[4].toString() : "0")
                            }
                        }
                    },
                        setArrToUpdateDashBoard(arr)
                    )
                }
            }).catch(error => {
                console.log(error)
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
    }, [sheetDataV2]);
    const SubmitPushDataA = async () => {
        const importData = async () => {
            if (sheetDataV2 !== null) {
                // toast.configure();
                toast.success('Start Data Import', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                })
                setIsSending(true)
                isImportedDone.current = true
                await axios({
                    url: endpointA,
                    method: 'POST',
                    data: {
                        "data": {
                            "projectId": projectId,
                            "projectData": sheetDataV2[sheet].slice(1)
                        }
                    }
                    ,
                    headers: {
                        'Authorization': Auth
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data.result === 0) {
                        isImportedDone.current = false
                        setSvError(true)
                        setNotMatchIndex([-1])
                        toast.warn('SERVER ERROR', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined
                        })
                        return;
                    }
                    setSvError(false)
                    setNotMatchIndex(res.data.data.notMatchIndex)
                    toast.success('Imported Successfully', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    })

                }).catch(error => {
                    isImportedDone.current = false
                    setSvError(true)
                    setNotMatchIndex([-1])
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
                setIsSending(false)
            }
            else {
            }
        }
        const updateDashBoard = async () => {
            const queryUpdateDashBoard = `
                mutation updateDashboard($data: DashboardInput!) {
                    updateDashboard(data: $data){
                      data{
                        id
                        attributes{
                            itemCode
                        }
                      }
                    }
                  }
                    `;
            let body = {
                query: queryUpdateDashBoard,
                variables: {
                    "data": {
                        "itemCode": arrToUpdateDashBoard
                    }
                }
            }
            if (isImportedDone.current) {
                await axios.post(endpointUpdateDashBoard, body, {
                    headers: {
                        'Authorization': Auth
                    }
                }).then(res => {
                    if (res.data.data.updateDashboard === null) {
                        toast.error("SERVER ERROR: " + res.data.errors[0].message, {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                        return
                    }
                    toast.success('Update Dashboard Successfully', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    })
                    // console.log(res)
                }).catch(error => {
                    toast.error("SERVER ERROR: " + error.name, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
            }
        }

        await importData();
        await updateDashBoard();
        setIsQueryDone(true);
        GetIsImporting(false);
    }
    const SubmitPushDataD = async () => {
        const importData = async () => {
            if (sheetDataV2 !== null) {
                // toast.configure();
                toast.success('Start Data Import', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                })
                setIsSending(true)
                isImportedDone.current = true
                await axios({
                    url: endpointD,
                    method: 'POST',
                    data: {
                        "data": {
                            "projectId": projectId,
                            "projectData": sheetDataV2[sheet].slice(1)
                        }
                    }
                    ,
                    headers: {
                        'Authorization': Auth
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data.result === 0) {
                        isImportedDone.current = false
                        setSvError(true)
                        setNotMatchIndex([-1])
                        toast.warn('SERVER ERROR', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined
                        })
                        return;
                    }
                    setSvError(false)
                    setNotMatchIndex(res.data.data.notMatchIndex)
                    toast.success('Imported Successfully', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    })

                }).catch(error => {
                    isImportedDone.current = false
                    setSvError(true)
                    setNotMatchIndex([-1])
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
                setIsSending(false)
            }
            else {
            }
        }
        const updateDashBoard = async () => {
            const queryUpdateDashBoard = `
                mutation updateDashboard($data: DashboardInput!) {
                    updateDashboard(data: $data){
                      data{
                        id
                        attributes{
                            itemCode
                        }
                      }
                    }
                  }
                    `;
            let body = {
                query: queryUpdateDashBoard,
                variables: {
                    "data": {
                        "itemCode": arrToUpdateDashBoard
                    }
                }
            }
            if (isImportedDone.current) {
                await axios.post(endpointUpdateDashBoard, body, {
                    headers: {
                        'Authorization': Auth
                    }
                }).then(res => {
                    if (res.data.data.updateDashboard === null) {
                        toast.error("SERVER ERROR: " + res.data.errors[0].message, {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                        return
                    }
                    toast.success('Update Dashboard Successfully', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    })
                    // console.log(res)
                }).catch(error => {
                    toast.error("SERVER ERROR: " + error.name, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
            }
        }

        await importData();
        await updateDashBoard();
        setIsQueryDone(true);
        GetIsImporting(false);
    }
    const SubmitPushDataQ = async () => {
        const importData = async () => {
            if (sheetDataV2 !== null) {
                // toast.configure();
                toast.success('Start Data Import', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                })
                setIsSending(true)
                isImportedDone.current = true
                await axios({
                    url: endpointQ,
                    method: 'POST',
                    data: {
                        "data": {
                            "projectId": projectId,
                            "projectData": sheetDataV2[sheet].slice(1)
                        }
                    }
                    ,
                    headers: {
                        'Authorization': Auth
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.data.result === 0) {
                        isImportedDone.current = false
                        setSvError(true)
                        setNotMatchIndex([-1])
                        toast.warn('SERVER ERROR', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined
                        })
                        return;
                    }
                    setSvError(false)
                    setNotMatchIndex(res.data.data.notMatchIndex)
                    toast.success('Imported Successfully', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    })

                }).catch(error => {
                    isImportedDone.current = false
                    setSvError(true)
                    setNotMatchIndex([-1])
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
                setIsSending(false)
            }
            else {
            }
        }
        const updateDashBoard = async () => {
            const queryUpdateDashBoard = `
                mutation updateDashboard($data: DashboardInput!) {
                    updateDashboard(data: $data){
                      data{
                        id
                        attributes{
                            itemCode
                        }
                      }
                    }
                  }
                    `;
            let body = {
                query: queryUpdateDashBoard,
                variables: {
                    "data": {
                        "itemCode": arrToUpdateDashBoard
                    }
                }
            }
            if (isImportedDone.current) {
                await axios.post(endpointUpdateDashBoard, body, {
                    headers: {
                        'Authorization': Auth
                    }
                }).then(res => {
                    if (res.data.data.updateDashboard === null) {
                        toast.error("SERVER ERROR: " + res.data.errors[0].message, {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                        return
                    }
                    toast.success('Update Dashboard Successfully', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    })
                    // console.log(res)
                }).catch(error => {
                    toast.error("SERVER ERROR: " + error.name, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
            }
        }

        await importData();
        await updateDashBoard();
        setIsQueryDone(true);
        GetIsImporting(false);
    }

    const HandleCancel = () => {
        if (isImporting) {
            setNeedConfirmCancel(true)
        } else {
            navigate('/')
        }
    }
    const GetCancelDelete = (select) => {
        setDeleteData(select)
    }
    const GetNeedConfirm = (select) => {
        setNeedConfirmCancel(select)
    }
    const handleOnExport = () => {
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet([["OUTSOURCING", "PROJECT_NUMBER", "CATEGORY", "TASK_NAME", "ITEM_CODE", "ITEM_NAME", "DESCRIPTION", "UNIT", "QTY", "UNIT_PRICE_USD", "TOTAL_AMOUNT_USD"], ...exportArr])
        var wscols = [
            // { wch: 12 },
            { wch: 15 },
            { wch: 25 },
            { wch: 12 },
            { wch: 15 },
            { wch: 10 },
            { wch: 11 },
            { wch: 14 },
            { wch: 10 },
            { wch: 10 },
            { wch: 15 },
            { wch: 20 },
        ];
        ws['!cols'] = wscols;
        XLSX.utils.book_append_sheet(wb, ws, "MySheet1")
        XLSX.writeFile(wb, "Demo.xlsx")
    }
    return (
        <div className="page-body">
            <div className="container-xl" id='container-import-data'>
                <div className="row row-cards">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                {chooseA === true && <h4 className="card-title">Form Import Data: {projectNumber} - Actual  </h4>}
                                {chooseD === true && <h4 className="card-title">Form Import Data: {projectNumber} - Design </h4>}
                                {chooseQ === true && <h4 className="card-title">Form Import Data: {projectNumber} - Quotation </h4>}
                                <label style={{ marginLeft: '25px', color: 'red' }} onClick={() => ChooseDeleteData()}>
                                    <a className="nav-link" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-diff" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                            <line x1="12" y1="10" x2="12" y2="14"></line>
                                            <line x1="10" y1="12" x2="14" y2="12"></line>
                                            <line x1="10" y1="17" x2="14" y2="17"></line>
                                        </svg>&ensp;
                                        <span className="nav-link-title" style={{ marginLeft: '-5px' }}>Delete Data</span>
                                    </a>
                                </label>
                                {/* <div className="ms-auto text-muted">
                                    <Link to="/create-new-data" className="nav-link" href="#navbar-extra" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-diff" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                <line x1={12} y1={10} x2={12} y2={14} />
                                                <line x1={10} y1={12} x2={14} y2={12} />
                                                <line x1={10} y1={17} x2={14} y2={17} />
                                            </svg>
                                        </span>
                                        <span className="nav-link-title">Create New Data</span>
                                    </Link>

                                </div><div>
                                    Import
                                </div> */}
                                <div className="ms-auto text-muted">
                                    <input
                                        style={{ display: "none" }}
                                        type="file" name="file" id="file" className="inputfile" onChange={e => handleFile(e)} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                                    <div className="d-flex">

                                        <label style={{ marginRight: '15px' }} onClick={handleOnExport}>
                                            <a className="nav-link" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-fold-down" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M12 11v8l3 -3m-6 0l3 3"></path>
                                                    <line x1="9" y1="7" x2="10" y2="7"></line>
                                                    <line x1="14" y1="7" x2="15" y2="7"></line>
                                                    <line x1="19" y1="7" x2="20" y2="7"></line>
                                                    <line x1="4" y1="7" x2="5" y2="7"></line>
                                                </svg>&ensp;
                                                <span className="nav-link-title" style={{ marginLeft: '-5px' }}>Demo.xlsx</span>
                                            </a>
                                        </label>
                                        <label htmlFor="file">
                                            <a className="nav-link" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-fold-up" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M12 13v-8l-3 3m6 0l-3 -3"></path>
                                                    <line x1="9" y1="17" x2="10" y2="17"></line>
                                                    <line x1="14" y1="17" x2="15" y2="17"></line>
                                                    <line x1="19" y1="17" x2="20" y2="17"></line>
                                                    <line x1="4" y1="17" x2="5" y2="17"></line>
                                                </svg>&ensp;
                                                <span className="nav-link-title" style={{ marginLeft: '-5px' }}>Load Excel</span>
                                            </a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: '0px' }}>
                                <div className="row" style={{ margin: '0px' }}>
                                    {/* <div className="col-xl-6">
                                        <div className="row">
                                            <div className="col-md-6 col-xl-12">
                                                <div className="mb-3">
                                                    <div className="form-label">Choose file data {chooseA ? 'Actual' : chooseD ? 'Design' : 'Quotation'}</div>
                                                    <div className="row"><input onChange={e => handleFile(e)} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" type="file" className="form-control" style={{ marginBottom: '9px', width: '82%', marginLeft: '1%' }} />
                                                    </div>
                                                </div> */}
                                    {/* <div className="mb-3">
                                                    <div className="form-label">Choose file data Quotation</div>
                                                    <div className="row"><input type="file" className="form-control is-valid mb-2" style={{ marginBottom: '9px', width: '82%', marginLeft: '1%' }} /><div className="col-2 col-sm-2 col-md-2 col-xl-2" style={{}}>
                                                        <a href="#" className="btn btn-outline-secondary w-100" style={{ padding: '5px -2px 5px 10px' }}>Check</a>
                                                    </div></div>
                                                </div><div className="mb-3">
                                                    <div className="form-label">Choose file data Quotation</div>
                                                    <div className="row"><input type="file" className="form-control is-invalid" style={{ marginBottom: '9px', width: '82%', marginLeft: '1%' }} /><div className="col-2 col-sm-2 col-md-2 col-xl-2" style={{}}>
                                                        <a href="#" className="btn btn-outline-secondary w-100" style={{ padding: '5px -2px 5px 10px' }}>Check</a>
                                                    </div><div className="invalid-feedback">Project chưa tồn tại, vui lòng kiểm tra lại</div></div>
                                                </div> */}
                                    {/* </div>
                                        </div>
                                    </div> */}
                                    {fileName && <div style={{ paddingLeft: '30px', marginTop: '10px', marginBottom: '10px' }}>{fileName}</div>}
                                    {sheetDataV2 &&
                                        <label style={{ paddingLeft: '30px' }}>{sheet}</label>}
                                    <table className="table card-table table-vcenter text-nowrap datatable datatable1">
                                        <thead>
                                            <tr>
                                                <th className='tdbreak'>No.</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>OUTSOURCING</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>PROJECT_NUMBER</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>CATEGORY</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>TASK_NAME</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>ITEM_CODE</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>ITEM_NAME</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>DESCRIPTION</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>UNIT</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>QTY</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>UNIT_PRICE_USD</th>
                                                <th style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>TOTAL_AMOUNT_USD</th>
                                                {/* {sheetDataV2[sheet][0].map(h => <th className='tdbreak' key={h}>{h}</th>)} */}
                                                {isQueryDone ? <th className='tdbreak'>STATUS</th> : null}

                                            </tr>
                                        </thead>

                                        {sheetDataV2 &&
                                            <tbody>
                                                {sheetDataV2[sheet].slice(1).map((row, index) => <tr key={index} className='thead-import'>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{index + 1}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[0] === undefined ? 0 : row[0].toString()}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[1] === undefined ? 0 : row[1]}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[2] === undefined ? 0 : row[2]}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[3] === undefined ? 0 : row[3]}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[4] === undefined ? 0 : row[4]}</td>

                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[5] === undefined ? 0 : row[5]}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[6] === undefined ? 0 : row[6]}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[7] === undefined ? 0 : row[7]}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[8] === undefined ? 0 : row[8]}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[9] === undefined ? 0 : row[9]}</td>
                                                    <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>{row[10] === undefined ? 0 : row[10]}</td>
                                                    {isQueryDone ? notMatchIndex.includes(index) || row[1] !== projectNumber || svError ? <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>❌</td>
                                                        :
                                                        <td style={{ borderLeft: "1px solid #ddd5d5" }} className='tdbreak'>✅</td>
                                                        :
                                                        null
                                                    }

                                                </tr>)}
                                            </tbody>
                                        }
                                        {!sheetDataV2 &&
                                            <tbody>{arr.map(index => <tr key={index}>
                                                <td className='tdbreak'>{index + 1}</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                                <td className='tdbreak'>--</td>
                                            </tr>)}
                                            </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer text-end">
                                <div className="d-flex">
                                    <a className="btn btn-link" id='cancel-link' onClick={() => HandleCancel()}>Cancel</a>
                                    {/* <button onClick={SubmitPushDataQ} className="btn btn-primary ms-auto">Send data</button> */}
                                    {/* <button onClick={SubmitPushDataA} className="btn btn-primary ms-auto">Send data</button> */}
                                    {isImporting ? <button onClick={chooseA ? SubmitPushDataA : chooseD ? SubmitPushDataD : SubmitPushDataQ} className="btn btn-primary ms-auto">Send Data</button>
                                        :
                                        <button style={{ cursor: 'not-allowed', opacity: '0.5' }} disabled className="btn btn-primary ms-auto">Send Data</button>}
                                    {/* <button  onClick={chooseA ? SubmitPushDataA : chooseD ? SubmitPushDataD : SubmitPushDataQ} className="btn btn-primary ms-auto">Send data</button> */}

                                </div>
                            </div>
                        </div>
                        {deleteData ? <ModalDeleteData GetCancelDelete={GetCancelDelete} projectId={projectId} projectNumber={projectNumber}
                            chooseA={chooseA} chooseD={chooseD} chooseQ={chooseQ} /> : null}
                        {isImporting && needConfirmCancel ? <ModelCalcelImport GetNeedConfirm={GetNeedConfirm} GetCancelDelete={GetCancelDelete} projectId={projectId} projectNumber={projectNumber}
                            chooseA={chooseA} chooseD={chooseD} chooseQ={chooseQ} /> : null}
                        {isSending ? <ModelWaitSending /> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImportUpdateData;