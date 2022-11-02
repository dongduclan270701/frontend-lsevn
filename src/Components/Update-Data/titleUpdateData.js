import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TitleUpdateData = (props) => {
    const { chooseQ, chooseA, chooseD, SelectQ, SelectA, SelectD } = props
    const { isImporting, shouldReload } = props
    // const GetIsImporting = (isCheck) =>{
    //     setIsImporint(isCheck)
    // }

    const ClickA = () => {
            SelectA(true)
    }
    const ClickD = () => {
            SelectD(true)
    }
    const ClickQ = () => {
            SelectQ(true)
    }
    return (
        <div className="container-xl">
            {/* Page title */}
            <div className="row">
                <div className="col-6 col-sm-4 col-md-2 col-xl py-3">
                    {isImporting === false ?
                        <a onClick={ClickA} className={chooseA === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Actual</a>
                        :
                        chooseA ? <a onClick={ClickA} className={chooseA === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Actual</a>
                        : <a style={{ cursor: 'not-allowed', backgroundColor: '#f5f7fb', color: 'black' }} className={"btn btn-outline-secondary w-100"}>Actual</a>
                    }
                </div>
                <div className="col-6 col-sm-4 col-md-2 col-xl py-3">
                    {isImporting === false ?
                        <a onClick={ClickD} className={chooseD === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Design</a>
                        :
                        chooseD ? <a onClick={ClickD} className={chooseD === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Design</a>
                        :
                        <a style={{ cursor: 'not-allowed', backgroundColor: '#f5f7fb', color: 'black' }} className={"btn btn-outline-secondary w-100"}>Design</a>
                    }
                </div>
                <div className="col-6 col-sm-4 col-md-2 col-xl py-3">
                    {isImporting === false ?
                        <a onClick={ClickQ} className={chooseQ === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Quotation</a>
                        :
                        chooseQ ? <a onClick={ClickQ} className={chooseQ === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Quotation</a>
                        :
                        <a style={{ cursor: 'not-allowed', backgroundColor: '#f5f7fb', color: 'black' }} className={"btn btn-outline-secondary w-100"}>Quotation</a>
                    }
                </div>
            </div>
        </div>
    );
}

export default TitleUpdateData;