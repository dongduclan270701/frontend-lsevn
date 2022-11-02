import { Auth } from 'Action';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ProjectDataDetail from './projectDataDetail';
import './projectData.css'
const TableProjectData = (props) => {
    const nf = new Intl.NumberFormat('en-US')
    const { taskNameArr2 } = props
    const { getAvg, getAvgAD } = props;
    const { lengthTaskName } = props;
    const { projectId } = props;
    let totalDesign = 0
    let totalQuotation = 0
    let totalActual = 0
    // const [dataNameProject, setDataNameProject] = useState("")
    // const [arrDataNameProject, setArrDataNameProject] = useState("")
    // const [arrDP, setArrDP] = useState([])
    const SumDesign = () => {

        return totalDesign
    }
    for (let index = 0; index < taskNameArr2.length; index++) {
        totalDesign += taskNameArr2[index].value.designs
    }
    const SumQuotations = () => {

        return totalQuotation
    }
    for (let index = 0; index < taskNameArr2.length; index++) {
        totalQuotation += taskNameArr2[index].value.quotations
    }
    const SumActual = () => {

        return totalActual
    }
    for (let index = 0; index < taskNameArr2.length; index++) {
        totalActual += taskNameArr2[index].value.actuals
    }
    if (lengthTaskName) {
        document.getElementById('table-data').style.height = lengthTaskName * 45 + 75 + 'px';
    }
    useEffect(() => {
        getAvgAD(Math.round((totalActual - totalDesign) / (totalDesign / 100))) 
        getAvg(Math.round((totalActual - totalQuotation) / (totalQuotation / 100)))
        // console.log(Math.round((totalActual - totalDesign) / (totalDesign / 100)))
        if (taskNameArr2.length !== lengthTaskName || lengthTaskName === 0 || taskNameArr2.length === 0) {
            document.getElementById('taskname-head').style.color = 'red';
        } else {
            document.getElementById('taskname-head').style.color = 'black';
        }
    }, [taskNameArr2]);

    const ToChart = () => {
        //lay vi tri
        const e = document.getElementById('taskname-bar').getBoundingClientRect();
        document.documentElement.scrollTo(0, e.y - 70)
    }
    const ToChartAD = () => {
        const e = document.getElementById('taskname-barAD').getBoundingClientRect();
        document.documentElement.scrollTo(0, e.y - 70)
    }
    return (
        <div className="row row-cards">
            <div className="col-12">
                <div className="card">
                    <div className="table-responsive table-data table-project-data" id='table-data' >
                        <table className="table table-vcenter card-table">
                            <thead>
                                <tr >
                                    <th style={{ fontSize: '0.8rem', width: '0%' }}>Panel quantity</th>
                                    <th id='taskname-head' style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>Task name ({taskNameArr2.length}/{lengthTaskName})</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>Design (USD)</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>Quotation (USD)</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>Actual (USD)</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>GAP (A-Q)</th>
                                    <th style={{ fontSize: '0.8rem' }}>% (A-Q)
                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => ToChart()} className="icon icon-tabler icon-tabler-chart-bar icon-chart-head" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <rect x="3" y="12" width="6" height="8" rx="1"></rect>
                                            <rect x="9" y="8" width="6" height="12" rx="1"></rect>
                                            <rect x="15" y="4" width="6" height="16" rx="1"></rect>
                                            <line x1="4" y1="20" x2="18" y2="20"></line>
                                        </svg>
                                    </th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>GAP (A-D)</th>
                                    <th style={{ fontSize: '0.8rem' }}>% (A-D)
                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => ToChartAD()} className="icon icon-tabler icon-tabler-chart-bar icon-chart-head" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <rect x="3" y="12" width="6" height="8" rx="1"></rect>
                                            <rect x="9" y="8" width="6" height="12" rx="1"></rect>
                                            <rect x="15" y="4" width="6" height="16" rx="1"></rect>
                                            <line x1="4" y1="20" x2="18" y2="20"></line>
                                        </svg>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {taskNameArr2.map((item, index) => {
                                    return (
                                        <ProjectDataDetail item={item} key={index} />
                                    )
                                })}
                            </tbody>
                            <thead>
                                <tr>
                                    <th style={{ fontSize: '0.9rem' }}>{projectId}</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>Grand-Total of Project</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>{nf.format(Math.round(totalDesign))}</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>{nf.format(Math.round(totalQuotation))}</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>{nf.format(Math.round(totalActual))}</th>

                                    {/* <th style={{ fontSize: '0.8rem' }}>{Math.round(totalActual / 2 - totalQuotation / 2)}</th> */}
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>{nf.format(Math.round(totalActual  - totalQuotation ))}</th>
                                    <th style={{ fontSize: '0.8rem',color : (totalActual - totalQuotation) / ((totalQuotation) / 100) <= -10 && "red" || (totalActual - totalQuotation) / ((totalQuotation) / 100) >=10 && "red"}}>{nf.format(Math.round((totalActual - totalQuotation) / ((totalQuotation) / 100)))}%</th>
                                    {/* {getAvg(Math.round((totalActual  - totalQuotation ) / (totalQuotation / 100)))} */}

                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>{nf.format(Math.round(totalActual - totalDesign ))}</th>
                                    <th style={{ fontSize: '0.8rem',color: (totalActual - totalDesign ) / (totalDesign / 100) <= -10 && "red" || (totalActual - totalDesign ) / (totalDesign / 100) >=10 && "red" }}>{nf.format(Math.round((totalActual - totalDesign ) / (totalDesign / 100)))}%</th>


                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TableProjectData;
