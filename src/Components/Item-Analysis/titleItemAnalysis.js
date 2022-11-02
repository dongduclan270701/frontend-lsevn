import React, { useState } from 'react';

const TitleItemAnalysis = (props) => {
  const { chooseQD, chooseQA, chooseDA, ChooseQD, ChooseQA, ChooseDA, projectId } = props

  const SelectQD = () => {
    ChooseQD(true)
  }
  const SelectQA = () => {
    ChooseQA(true)
  }
  const SelectDA = () => {
    ChooseDA(true)
  }
  return (
    <div className="container-xl">
      {/* Page title */}

      {/* <div className="page-header d-print-none">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">Project number: {projectId}</h2>
          </div><div className="col">
            <h2 className="page-title">Project name: {projectId}</h2>
          </div>
        </div>
      </div> */}
      <div className="row"><div className="col-6 col-sm-4 col-md-2 col-xl py-3">
        <a onClick={SelectQA} className={chooseQA === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Quotation - Actual</a>
      </div><div className="col-6 col-sm-4 col-md-2 col-xl py-3">
          <a onClick={SelectQD} className={chooseQD === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Quotation - Design</a>
        </div><div className="col-6 col-sm-4 col-md-2 col-xl py-3">
          <a onClick={SelectDA} className={chooseDA === true ? "btn btn-outline-secondary w-100 active" : "btn btn-outline-secondary w-100"}>Design - Actual</a>
        </div></div></div>
  );
}

export default TitleItemAnalysis;
