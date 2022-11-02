import React, { useState, useEffect, useRef } from 'react';
import NumberFormat from 'react-number-format';
import { useNavigate } from 'react-router-dom';
// import { gql, useQuery } from '@apollo/client';
import './dashboard.css';
import { Auth } from 'Action';
import axios from 'axios';
import ChartTaskName from 'Components/chartTaskName/chartTaskNameAQ';
import ChartCategory from 'Components/chartCategory/chartCategory';
import Footer from 'Components/Footer/footer';
import { hostProduction } from 'Action/host'
import { hostDev } from 'Action/host'
import { toast } from 'react-toastify'

const endpoint = `${hostProduction}`
// const endpoint = "http://localhost:1338"
const Dashboard = (props) => {
    const {GetUserName} = props;
    let navigate = useNavigate();
    const GET_CURRENT_USER = `
    query{
        me{
          username
          email
          role{
            name
          }
        }
      }`
    const GetCurrentUser = async () => {
        await axios({
            url: endpoint + "/graphql",
            method: 'POST',
            data: {
                query: GET_CURRENT_USER
            }
            ,
            headers: {
                'Authorization': "Bearer " + window.localStorage.getItem('token')
            }
        })
            .then(result => {
                GetUserName(result.data.data.me.username)
            })
            .catch(error => {
                navigate('/');
            })
    }
    const [project, setProject] = useState();
    const [itemcode, setItemcode] = useState();
    const [timeTBDesignsAddLatest, setTimeTBDesignsAddLatest] = useState(new Date());
    const [timeTBQuotationsAddLatest, setTimeTBQuotationsAddLatest] = useState(new Date());
    const [timeTBActualsAddLatest, setTimeTBActualsAddLatest] = useState(new Date());
    const [recordDesignsLatest, setRecordDesignsLatest] = useState();
    const [recordQuotationsLatest, setRecordQuotationsLatest] = useState();
    const [recordActualsLatest, setRecordActualsLatest] = useState();
    const [actuals, setActuals] = useState([]);
    const [designs, setDesigns] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const actualsPart = useRef(0);
    const designsPart = useRef(0);
    const quotationsPart = useRef(0);

    const QueryGetLastRecords = `
    query{
        actuals(
          sort:"id:desc"
          pagination:{
            pageSize: 1
          }
        ){
          data{
            attributes{
              createdAt
            }}}
        designs(
          sort:"id:desc"
          pagination:{
            pageSize: 1
          }
        ){
          data{
            attributes{
              createdAt
            }} }
        quotations(
           sort:"id:desc"
          pagination:{
            pageSize: 1
          }
        ){
          data{
            attributes{
              createdAt
            }}}
      }`
    const GetAllProject = async () => {
        await axios({
            url: endpoint + "/api/projects",
            method: 'get',
            headers: {
                'Authorization': Auth
            }
        }).then(result => {
            setProject(result.data.meta.pagination.total);
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
    const GetCateAItcodeATask = async () => {
        await axios({
            url: endpoint + "/api/dashboard",
            method: 'get',
            headers: {
                'Authorization': Auth
            }
        }).then(async (result) => {
            await Promise.all([
                // setCategory(result.data.data.attributes.category.length),
                setItemcode(result.data.data.attributes.itemCode.length),
                // setTaskname(result.data.data.attributes.taskName.length)
            ])
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
    const GetRecordsOfDesigns = async () => {
        await axios({
            url: endpoint + "/api/designs",
            method: 'get',
            headers: {
                'Authorization': Auth
            }
        }).then(result => {
            // setTbDesign(result.data.meta.pagination.total);
        })
    }
    const GetRecordsOfQuotations = async () => {
        await axios({
            url: endpoint + "/api/quotations",
            method: 'get',
            headers: {
                'Authorization': Auth
            }
        }).then(result => {
            // setTbQuotation(result.data.meta.pagination.total);
        })
    }
    const GetRecordsOfActuals = async () => {
        await axios({
            url: endpoint + "/api/actuals",
            method: 'get',
            headers: {
                'Authorization': Auth
            }
        }).then(result => {
            // setTbActual(result.data.meta.pagination.total);
        })
    }
    const GetRecordsLatest = async () => {
        //get last record each table of 3 table
        await axios({
            url: endpoint + "/graphql",
            method: 'POST',
            data: {
                query: QueryGetLastRecords
            }
            ,
            headers: {
                'Authorization': Auth
            }
        })
            .then(result => {
                let timeDesigns = new Date(result.data.data.designs.data[0].attributes.createdAt)
                let timeQuotations = new Date(result.data.data.quotations.data[0].attributes.createdAt)
                let timeActuals = new Date(result.data.data.actuals.data[0].attributes.createdAt)
                timeDesigns.setHours(timeDesigns.getHours(), timeDesigns.getMinutes(), 0, 0);
                timeQuotations.setHours(timeQuotations.getHours(), timeQuotations.getMinutes(), 0, 0);
                timeActuals.setHours(timeActuals.getHours(), timeActuals.getMinutes(), 0, 0);
                setTimeTBDesignsAddLatest(new Date(timeDesigns));
                setTimeTBQuotationsAddLatest(new Date(timeQuotations));
                setTimeTBActualsAddLatest(new Date(timeActuals));
                const QueryGetRecordWithLastTime = `
        query {
            designs(filters: { createdAt: { gte: "${timeDesigns.toISOString()}" } }) {
              meta {pagination {total}}}
            actuals(filters: { createdAt: { gte: "${timeActuals.toISOString()}" } }) {
              meta {pagination {total }}}
            quotations(filters: { createdAt: { gte: "${timeQuotations.toISOString()}" } }) {
              meta { pagination {total}}}
        }`
                //get records same time with last record
                axios({
                    url: endpoint + "/graphql",
                    method: 'POST',
                    data: {
                        query: QueryGetRecordWithLastTime
                    }
                    ,
                    headers: {
                        'Authorization': Auth
                    }
                }).then(async (result) => {
                    await Promise.all([
                        setRecordDesignsLatest(result.data.data.designs.meta.pagination.total),
                        setRecordQuotationsLatest(result.data.data.quotations.meta.pagination.total),
                        setRecordActualsLatest(result.data.data.actuals.meta.pagination.total)
                    ])
                })
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
    const totalAQD = useRef(0);

    const GetTotalAmountOutSourcing = async () => {
        await axios({
            url: endpoint + "/api/dashboard/totalAmountUSDOutSourcing",
            method: 'get',
            headers: {
                'Authorization': Auth
            }
        }).then(result => {
            setActuals(actuals => [...actuals, result.data.data[0]])
            setActuals(actuals => [...actuals, result.data.data[1]])
            setDesigns(designs => [...designs, result.data.data[2]])
            setDesigns(designs => [...designs, result.data.data[3]])
            setQuotations(quotations => [...quotations, result.data.data[4]])
            setQuotations(quotations => [...quotations, result.data.data[5]])
            for (let i = 0; i < result.data.data.length; i++) {
                totalAQD.current += Math.round(result.data.data[i].TOTAL_AMOUNT_USD);
            }
            actualsPart.outdoor = result.data.data[0].TOTAL_AMOUNT_USD
            actualsPart.indoor = result.data.data[1].TOTAL_AMOUNT_USD
            designsPart.outdoor = result.data.data[2].TOTAL_AMOUNT_USD
            designsPart.indoor = result.data.data[3].TOTAL_AMOUNT_USD
            quotationsPart.outdoor = result.data.data[4].TOTAL_AMOUNT_USD
            quotationsPart.indoor = result.data.data[5].TOTAL_AMOUNT_USD
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
    const GetAllData = async () => {
        await Promise.all([
            GetCurrentUser(),
            GetAllProject(),
            GetCateAItcodeATask(),
            GetTotalAmountOutSourcing(),
            GetRecordsLatest()
        ])
    }
    useEffect(() => {
        GetAllData();
    }, []);
    return (
        <>
            <div className='page-wrapper'>
                {/* <div className="container-xl">
                    <div className="page-header d-print-none">
                        <div className="row align-items-center">
                            <div className="col">
                                <h2 className="page-title">Dashboard</h2>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className='page-body'>
                    <div className="container-xl">
                        <div className="row row-deck row-cards">
                            <div className="col-sm-6 col-lg-3" id='demo'>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="subheader">Total Project</div>
                                            <div className="ms-auto lh-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-database" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <ellipse cx="12" cy="6" rx="8" ry="3"></ellipse>
                                                    <path d="M4 6v6a8 3 0 0 0 16 0v-6"></path>
                                                    <path d="M4 12v6a8 3 0 0 0 16 0v-6"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <div className="text-green h1 mb-3 me-2"><NumberFormat value={project || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">
                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    PRJ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="subheader">Total item code</div>
                                            <div className="ms-auto lh-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-clipboard-list" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                                    <rect x="9" y="3" width="6" height="4" rx="2"></rect>
                                                    <line x1="9" y1="12" x2="9.01" y2="12"></line>
                                                    <line x1="13" y1="12" x2="15" y2="12"></line>
                                                    <line x1="9" y1="16" x2="9.01" y2="16"></line>
                                                    <line x1="13" y1="16" x2="15" y2="16"></line>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <div className="text-green h1 mb-3 me-2"><NumberFormat value={itemcode || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">
                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    ITEM
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-sm-6 col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="subheader">Total category</div>
                                        <div className="ms-auto lh-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-checklist" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8"></path>
                                                <path d="M14 19l2 2l4 -4"></path>
                                                <path d="M9 8h4"></path>
                                                <path d="M9 12h2"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-baseline">
                                        <div className="h1 mb-3 me-2"><NumberFormat value={category || 0} displayType={'text'} thousandSeparator={true} /></div>
                                        <div className="me-auto">
                                            <span className="text-green d-inline-flex align-items-center lh-1">
                                                CAT
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                            {/* <div className="col-sm-6 col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="subheader">Total task name</div>
                                        <div className="ms-auto lh-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-address-book" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z"></path>
                                                <path d="M10 16h6"></path>
                                                <circle cx="13" cy="11" r="2"></circle>
                                                <path d="M4 8h3"></path>
                                                <path d="M4 12h3"></path>
                                                <path d="M4 16h3"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-baseline">
                                        <div className="h1 mb-3 me-2"><NumberFormat value={taskname || 0} displayType={'text'} thousandSeparator={true} /></div>
                                        <div className="me-auto">
                                            <span className="text-green d-inline-flex align-items-center lh-1">
                                                ITEM
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                            {/* <div className="col-sm-6 col-lg-3">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="subheader">Total task name</div>
                                        <div className="ms-auto lh-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-3" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M12 12a2 2 0 1 0 -2 -2"></path>
                                                <path d="M10 14a2 2 0 1 0 2 -2"></path>
                                                <circle cx="12" cy="12" r="9"></circle>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-baseline">
                                        <div className="h1 mb-3 me-2">1200</div>
                                        <div className="me-auto">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        </div>
                        <div className="row row-deck row-cards" style={{ marginTop: '0px' }}>
                            {/* <div className="col-sm-6 col-lg-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="subheader">Total A-Q-D</div>
                                            <div className="ms-auto lh-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M12 16v-8l-2 2"></path>
                                                    <circle cx="12" cy="12" r="9"></circle>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <div className="h1 mb-0 me-2"><NumberFormat value={totalAQD.current} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">
                                                <span className="text-green d-inline-flex align-items-center lh-1">
                                                    USD
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div> */}
                            <div className="col-sm-4 col-lg-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="subheader">Total Actuals</div>
                                            <div className="ms-auto lh-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-1" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M12 16v-8l-2 2"></path>
                                                    <circle cx="12" cy="12" r="9"></circle>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <span className="text-dark h4 d-inline-flex align-items-center lh-1">
                                                TOTAL &nbsp;
                                            </span>
                                            <div className="text-green h2 mb-2 me-2"><NumberFormat value={Math.round(actualsPart.indoor + actualsPart.outdoor) || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">
                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    USD
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline" style={{ marginTop: '-10px' }}>
                                            <span className="text-dark h6 d-inline-flex align-items-center lh-1">
                                                INDOOR &nbsp;
                                            </span>
                                            <div className="text-green h2 mb-2 me-2"><NumberFormat value={Math.round(actualsPart.indoor) || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">

                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    USD
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline" style={{ marginTop: '-10px' }}>
                                            <span className="text-dark h6 d-inline-flex align-items-center lh-1">
                                                OUTDOOR &nbsp;
                                            </span>
                                            <div className="text-green h2 mb-2 me-2"><NumberFormat value={Math.round(actualsPart.outdoor) || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">
                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    USD
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 col-lg-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="subheader">Total Designs</div>
                                            <div className="ms-auto lh-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-2" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M10 10a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0"></path>
                                                    <circle cx="12" cy="12" r="9"></circle>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <span className="text-dark h4 d-inline-flex align-items-center lh-1">
                                                TOTAL &nbsp;
                                            </span>
                                            <div className="text-green h2 mb-2 me-2"><NumberFormat value={Math.round(designsPart.indoor + designsPart.outdoor) || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">
                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    USD
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline" style={{ marginTop: '-10px' }}>
                                            <span className="text-dark h6 d-inline-flex align-items-center lh-1">
                                                INDOOR &nbsp;
                                            </span>
                                            <div className="text-green h2 mb-2 me-2"><NumberFormat value={Math.round(designsPart.indoor) || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">

                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    USD
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline" style={{ marginTop: '-10px' }}>
                                            <span className="text-dark h6 d-inline-flex align-items-center lh-1">
                                                OUTDOOR &nbsp;
                                            </span>
                                            <div className="text-green h2 mb-2 me-2"><NumberFormat value={Math.round(designsPart.outdoor) || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">
                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    USD
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4 col-lg-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="subheader">Total Quotations</div>
                                            <div className="ms-auto lh-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-3" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M12 12a2 2 0 1 0 -2 -2"></path>
                                                    <path d="M10 14a2 2 0 1 0 2 -2"></path>
                                                    <circle cx="12" cy="12" r="9"></circle>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline">
                                            <span className="text-dark h4 d-inline-flex align-items-center lh-1">
                                                TOTAL &nbsp;
                                            </span>
                                            <div className="text-green h2 mb-2 me-2"><NumberFormat value={Math.round(quotationsPart.indoor + quotationsPart.outdoor) || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">
                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    USD
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline" style={{ marginTop: '-10px' }}>
                                            <span className="text-dark h6 d-inline-flex align-items-center lh-1">
                                                INDOOR &nbsp;
                                            </span>
                                            <div className="text-green h2 mb-2 me-2"><NumberFormat value={Math.round(quotationsPart.indoor) || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">

                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    USD
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-baseline" style={{ marginTop: '-10px' }}>
                                            <span className="text-dark h6 d-inline-flex align-items-center lh-1">
                                                OUTDOOR &nbsp;
                                            </span>
                                            <div className="text-green h2 mb-2 me-2"><NumberFormat value={Math.round(quotationsPart.outdoor) || 0} displayType={'text'} thousandSeparator={true} /></div>
                                            <div className="me-auto">
                                                <span className="text-dark d-inline-flex align-items-center lh-1" style={{ fontSize: "0.8rem" }}>
                                                    USD
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-xl">
                        <div className="page-header d-print-none">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h2 className="page-title">New record (latest)</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row row-cards">
                            <div className="col-12">
                                <div className="card">
                                    <div className="table-responsive">
                                        <table className="table table-vcenter card-table">
                                            <thead>
                                                <tr>
                                                    <th>Table</th>
                                                    <th style={{borderLeft:"1px solid #ddd5d5"}}>New Record</th>
                                                    <th style={{borderLeft:"1px solid #ddd5d5"}}>Time added</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Design</td>
                                                    <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-green text-muted">
                                                        <NumberFormat value={recordDesignsLatest || 0} displayType={'text'} thousandSeparator={true} />
                                                    </td>
                                                    <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                                        {timeTBDesignsAddLatest.getHours() + ':' + timeTBDesignsAddLatest.getMinutes() + ' ' + timeTBDesignsAddLatest.getDate() + '-' + (timeTBDesignsAddLatest.getMonth() + 1) + '-' + timeTBDesignsAddLatest.getFullYear()}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Quotation</td>
                                                    <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-green text-muted">
                                                        <NumberFormat value={recordQuotationsLatest || 0} displayType={'text'} thousandSeparator={true} />
                                                    </td>
                                                    <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                                        {timeTBQuotationsAddLatest.getHours() + ':' + timeTBQuotationsAddLatest.getMinutes() + ' ' + timeTBQuotationsAddLatest.getDate() + '-' + (timeTBQuotationsAddLatest.getMonth() + 1) + '-' + timeTBQuotationsAddLatest.getFullYear()}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Actual</td>
                                                    <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-green text-muted">
                                                        <NumberFormat value={recordActualsLatest || 0} displayType={'text'} thousandSeparator={true} />
                                                    </td>
                                                    <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                                        {timeTBActualsAddLatest.getHours() + ':' + timeTBActualsAddLatest.getMinutes() + ' ' + timeTBActualsAddLatest.getDate() + '-' + (timeTBActualsAddLatest.getMonth() + 1) + '-' + timeTBActualsAddLatest.getFullYear()}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default Dashboard;