import React from 'react';

const TitleCreateNewData = (props) => {
    const { chooseQ, chooseA, chooseD, SelectQ, SelectA, SelectD } = props
    const ClickQ = () => {
        SelectQ(true)
    }
    const ClickA = () => {
        SelectA(true)
    }
    const ClickD = () => {
        SelectD(true)
    }
    return (
        <div className="container-xl">
            {/* Page title */}
            <div className="page-header d-print-none">
                <div className="row align-items-center">
                    <div className="col">
                        <h2 className="page-title">Create new data</h2>
                    </div>
                </div>
            </div><div className="row"><div className="col-6 col-sm-4 col-md-2 col-xl py-3">
                <a onClick={ClickQ} className="btn btn-outline-secondary w-100 active">Quotation</a>
            </div><div className="col-6 col-sm-4 col-md-2 col-xl py-3">
                    <a onClick={ClickA} className="btn btn-outline-secondary w-100">Actual</a>
                </div><div className="col-6 col-sm-4 col-md-2 col-xl py-3">
                    <a onClick={ClickD} className="btn btn-outline-secondary w-100">Design</a>
                </div></div>
        </div>
    );
}

export default TitleCreateNewData;
