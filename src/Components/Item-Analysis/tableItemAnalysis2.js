import React, { useState, useEffect } from 'react';
import Select from "react-select";
import "Assets/scss/1.scss"


const ChooseCompare = (props) => {
    const { newArrCate, newArrTask, QtyGap, AmountGap } = props
    const optionList = [
        ...newArrCate
    ];
    const optionList1 = [
        { value: "ALL TASK", label: "ALL TASK" }, ...newArrTask
    ];
    const [selectedOptions, setSelectedOptions] = useState({value:"MCB/FUSE", label:"MCB/FUSE"});
    const [selectedOptions1, setSelectedOptions1] = useState();

    const handleSelect = (data) => {
        setSelectedOptions(data);
    }
    const handleSelect1 = (data) => {
        setSelectedOptions1(data);
    }
    return (
        <div className="page-body">
            <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-12">
                        <div className="card">
                            <div className="table-responsive">
                                <table className="table table-vcenter card-table">
                                    <thead>
                                        <tr>
                                            <th />
                                            <th />
                                            <th />
                                            <th />
                                            <th />
                                            <th /><th>GAP</th></tr>
                                    </thead><thead>
                                        <tr>
                                            <th>Project number</th>
                                            <th>Category</th>
                                            <th>Task name</th>

                                            <th>Item code</th>
                                            <th>Item name</th>
                                            <th>Qty</th><th>Total amount (USD)</th></tr>
                                    </thead><tbody>
                                        <tr>
                                            <td>L211A065</td>
                                            <td >
                                                <Select
                                                    options={optionList}
                                                    placeholder="Select category"
                                                    value={selectedOptions}
                                                    onChange={handleSelect}
                                                    className="abscs"
                                                />
                                            </td>
                                            <td >
                                                <Select
                                                    options={optionList1}
                                                    placeholder="Select category"
                                                    value={selectedOptions1}
                                                    onChange={handleSelect1}
                                                    className="abscs"

                                                /></td>

                                            <td className="text-muted"></td>
                                            <td className="text-muted" />
                                            <td className>{QtyGap}</td><td className>{AmountGap}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChooseCompare;
