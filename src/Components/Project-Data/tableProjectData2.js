import { Auth } from 'Action';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ProjectDataDetail2 from './projectDataDetail2';
import ProjectDataDetail3 from './projectDataDetail3';

const TableProjectData = (props) => {
    const { taskNameArr2, getDataOutdoor, getDataIndoor } = props
    const { getAvg } = props;
    const { length } = props;
    let totalDesign = 0
    let totalQuotation = 0
    let totalActual = 0
    // const [dataNameProject, setDataNameProject] = useState("")
    // const [arrDataNameProject, setArrDataNameProject] = useState("")
    // const [arrDP, setArrDP] = useState([])
    const SumDesign = () => {
        for (let index = 0; index < taskNameArr2.length; index++) {
            totalDesign += taskNameArr2[index].value.designs
        }
        return totalDesign
    }
    const SumQuotations = () => {
        for (let index = 0; index < taskNameArr2.length; index++) {
            totalQuotation += taskNameArr2[index].value.quotations
        }
        return totalQuotation
    }
    const SumActual = () => {
        for (let index = 0; index < taskNameArr2.length; index++) {
            totalActual += taskNameArr2[index].value.actuals
        }
        return totalActual
    }
    if (length) {
        document.getElementById('table-data').style.height = length * 45 + 80 + 'px';
    }
    const nf = new Intl.NumberFormat('en-US')
    return (
        <div className="row row-cards">
            <div className="col-12">
                <div className="card">
                    <div className="table-responsive table-data" id='table-data'>
                        <table className="table table-vcenter card-table">

                            <thead>
                                <tr >
                                    <th style={{ fontSize: '0.8rem' }}>Goods type</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>Design Material (USD)</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>Quotation Material (USD)</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>Actual Material (USD)</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>GAP (A-Q)</th>
                                    <th style={{ fontSize: '0.8rem' }}>% (A-Q)</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>GAP (A-D)</th>
                                    <th style={{ fontSize: '0.8rem' }}>% (A-D)</th>
                                    {/* <th className="tw-1" /> */}
                                </tr>
                            </thead>
                            <tbody>
                                <ProjectDataDetail2 getDataIndoor={getDataIndoor} />
                                <ProjectDataDetail3 getDataOutdoor={getDataOutdoor} />
                            </tbody>
                            <thead>
                                <tr>
                                    <th style={{ fontSize: '0.8rem' }}>Grand-Total of Project</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>
                                        {(nf.format(Math.round(getDataIndoor.designs + getDataOutdoor.designs)).toString())}</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>
                                        {(nf.format(Math.round(getDataIndoor.quotations + getDataOutdoor.quotations)).toString())}</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>
                                        {(nf.format(Math.round(getDataIndoor.actuals + getDataOutdoor.actuals)).toString())}</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>
                                        {(nf.format(Math.round((getDataIndoor.actuals + getDataOutdoor.actuals) - (getDataIndoor.quotations + getDataOutdoor.quotations))).toString())}</th>
                                    <th style={{ fontSize: '0.8rem',color: (((getDataIndoor.actuals + getDataOutdoor.actuals) - (getDataIndoor.quotations + getDataOutdoor.quotations)) / (getDataIndoor.quotations + getDataOutdoor.quotations) * 100) <= -10 && "red" || (((getDataIndoor.actuals + getDataOutdoor.actuals) - (getDataIndoor.quotations + getDataOutdoor.quotations)) / (getDataIndoor.quotations + getDataOutdoor.quotations) * 100) >= 10 && "red" }}>
                                        {(nf.format(Math.round(((getDataIndoor.actuals + getDataOutdoor.actuals) - (getDataIndoor.quotations + getDataOutdoor.quotations)) / (getDataIndoor.quotations + getDataOutdoor.quotations) * 100)).toString())}%</th>
                                    <th style={{ fontSize: '0.8rem', borderLeft: "1px solid #ddd5d5" }}>
                                        {(nf.format(Math.round((getDataIndoor.actuals + getDataOutdoor.actuals) - (getDataIndoor.designs + getDataOutdoor.designs))).toString())}</th>
                                    <th style={{ fontSize: '0.8rem',color:(((getDataIndoor.actuals + getDataOutdoor.actuals) - (getDataIndoor.designs + getDataOutdoor.designs)) / (getDataIndoor.designs + getDataOutdoor.designs) * 100) <= -10 && "red" || (((getDataIndoor.actuals + getDataOutdoor.actuals) - (getDataIndoor.designs + getDataOutdoor.designs)) / (getDataIndoor.designs + getDataOutdoor.designs) * 100) >= 10 && "red" }}>
                                        {(nf.format(Math.round(((getDataIndoor.actuals + getDataOutdoor.actuals) - (getDataIndoor.designs + getDataOutdoor.designs)) / (getDataIndoor.designs + getDataOutdoor.designs) * 100)).toString())}%</th>

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