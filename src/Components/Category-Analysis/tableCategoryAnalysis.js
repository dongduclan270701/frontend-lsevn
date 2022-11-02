import { Auth } from 'Action';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Select from "react-select";
import "Assets/scss/1.scss"
import DetailCategory from './detailCategory';

const TableCategoryAnalysis = (props) => {
  const { projectId, CategoryArr2, CategoryArr3, GetOption, category, taskName, select, lengthCategory, lengthCategoryOption } = props
  const [selectedOptions, setSelectedOptions] = useState({ value: "ALL TASK", label: "ALL TASK" });
  const [selectedOptionsTaskName, setSelectedOptionsTaskName] = useState({ value: "ALL TASK", label: "ALL TASK" });
  const optionList = [{ value: "ALL TASK", label: "ALL TASK" }, ...category]
  const optioneListTaskName = [{ value: "ALL TASK", label: "ALL TASK" }, ...taskName]
  let totalDesign = 0
  let totalQuotation = 0
  let totalActual = 0
  let totalDesign1 = 0
  let totalQuotation1 = 0
  let totalActual1 = 0
  const { getAvg, getAvgAD } = props;
  const { GetGapPercentage } = props;
  const { GetGapName } = props;

  // const [dataNameProject, setDataNameProject] = useState("")
  // const [arrDataNameProject, setArrDataNameProject] = useState("")
  // const [arrDP, setArrDP] = useState([])
  const SumDesign = () => {
    return totalDesign
  }
  for (let index = 0; index < CategoryArr2.length; index++) {
    totalDesign += CategoryArr2[index].value.designs
  }
  const SumQuotations = () => {
    return totalQuotation
  }
  for (let index = 0; index < CategoryArr2.length; index++) {
    totalQuotation += CategoryArr2[index].value.quotations
  }
  const SumActual = () => {
    return totalActual
  }
  for (let index = 0; index < CategoryArr2.length; index++) {
    totalActual += CategoryArr2[index].value.actuals
  }

  const SumDesign1 = () => {
    return totalDesign
  }

  for (let index = 0; index < CategoryArr3.length; index++) {
    totalDesign1 += CategoryArr3[index].value.designs
    
  }
  const SumQuotations1 = () => {
    return totalQuotation
  }
  for (let index = 0; index < CategoryArr3.length; index++) {
    totalQuotation1 += CategoryArr3[index].value.quotations
  }

  const SumActual1 = () => {
    return totalActual
  }
  for (let index = 0; index < CategoryArr3.length; index++) {
    totalActual1 += CategoryArr3[index].value.actuals
  }
  // const handleSelect = (data) => {
  //   setSelectedOptions(data);
  //   GetOption(data)
  // }
  const handleSelectTaskName = (data) => {
    setSelectedOptionsTaskName(data);
    GetOption(data)
  }
  useEffect(() => {
    if (select) {
      setSelectedOptionsTaskName(select);
    }
  }, [select]);

  if (lengthCategory && lengthCategoryOption ===0) {
    document.getElementById('table-data').style.height = lengthCategory * 45 + 75 + 'px';

  }else if(lengthCategoryOption > 0){
    document.getElementById('table-data').style.height = lengthCategoryOption * 45 + 75 + 'px';
  }
  useEffect(() => {

    if (selectedOptionsTaskName.value === "ALL TASK") {
      getAvg(Math.round((totalActual - totalQuotation) / (totalQuotation / 100)))
      getAvgAD(Math.round((totalActual - totalDesign) / (totalDesign / 100)))
      if (CategoryArr2.length !== lengthCategory || lengthCategory === 0 || CategoryArr2.length === 0) {
        document.getElementById('category-head').style.color = 'red';
      } else {
        document.getElementById('category-head').style.color = 'black';
      }
    }
    else {
      getAvg(Math.round((totalActual1 - totalQuotation1) / (totalQuotation1 / 100)))
      getAvgAD(Math.round((totalActual1 - totalDesign1) / (totalDesign1 / 100)))
      // console.log(Math.round((totalActual1 - totalDesign1 / (totalDesign1 / 100))))
      if (CategoryArr3.length !== lengthCategory || lengthCategory === 0 || CategoryArr3.length === 0) {
        document.getElementById('category-head').style.color = 'red';
      } else {
        document.getElementById('category-head').style.color = 'black';
      }
    }
  }, [CategoryArr2.length, CategoryArr3.length, selectedOptionsTaskName.value, lengthCategory, totalActual1, totalDesign1, totalQuotation1]);

  const ToChart = () => {
    //lay vi tri
    const e = document.getElementById('category-bar').getBoundingClientRect();
    document.documentElement.scrollTo(0, e.y - 70)
  }
  const ToChartAD = () => {
    const e = document.getElementById('category-barAD').getBoundingClientRect();
    document.documentElement.scrollTo(0, e.y - 70)
  }
  const nf = new Intl.NumberFormat('en-US')

  return (
    <div className="row row-cards">
      <div className="col-12">
        <div className="card ">
          {/* <Select options={optioneListTaskName}
            placeholder="Select category"
            value={selectedOptionsTaskName}
            onChange={handleSelectTaskName}
            className="abscs2"
          /> */}
          <div className="table-responsive table-data" id='table-data'>
            <table className="table table-vcenter card-table">
              <thead>
                <tr>
                  <th style={{ fontSize: '0.8rem' }}>No.</th>
                  <th id='category-head' style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5" }}>Category (
                    {selectedOptionsTaskName.value === "ALL TASK" ? CategoryArr2.length : CategoryArr3.length}

                    /{lengthCategory}
                    )</th>
                  <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5" }}>Design (USD)</th>
                  <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5" }}>Quotation (USD)</th>
                  <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5" }}>Actual (USD)</th>
                  <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5" }}>GAP (A-Q)</th>
                  <th style={{ fontSize: '0.8rem' }}>% (A-Q)
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => ToChart()} className="icon icon-tabler icon-tabler-chart-bar icon-chart-head" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <rect x="3" y="12" width="6" height="8" rx="1"></rect>
                      <rect x="9" y="8" width="6" height="12" rx="1"></rect>
                      <rect x="15" y="4" width="6" height="16" rx="1"></rect>
                      <line x1="4" y1="20" x2="18" y2="20"></line>
                    </svg>
                  </th>
                  <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5" }}>GAP (A-D)</th>
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
              </thead><tbody >
                {selectedOptionsTaskName.value === "ALL TASK" ? CategoryArr2.map((item, index) => {
                  // 

                  return (
                    <DetailCategory taskName={selectedOptionsTaskName.value} item={item} index={index} key={index} />
                  )
                }) : CategoryArr3.map((item, index) => {
                  return (
                    <DetailCategory taskName={selectedOptionsTaskName.value} item={item} index={index} key={index} />
                  )
                })}
              </tbody>
              <thead>
                {selectedOptionsTaskName.value === "ALL TASK" ?
                  <tr>
                    <th style={{ fontSize: '0.9rem' }}> {projectId}
                    </th>
                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>GRAND-TOTAL OF PROJECT</th>
                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(SumDesign()))}</th>
                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(SumQuotations()))}</th>
                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(SumActual()))}</th>


                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(totalActual - totalQuotation))}</th>
                    <th style={{ fontSize: '0.8rem',color:(totalActual - totalQuotation) / (totalQuotation / 100)<= -10 && "red" || (totalActual - totalQuotation) / (totalQuotation / 100) >= 10 && "red" }}>{nf.format(Math.round((totalActual - totalQuotation) / (totalQuotation / 100)))}%</th>
                    {/* {getAvg(Math.round((SumActual() / 4 - SumQuotations() / 5) / (SumQuotations() / 6 / 100)))} */}

                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(totalActual - totalDesign))}</th>
                    <th style={{ fontSize: '0.8rem',color:(totalActual - totalDesign ) / (totalDesign  / 100)<= -10 && "red" || (totalActual - totalDesign ) / (totalDesign  / 100)>= 10 && "red" }}>{nf.format(Math.round((totalActual - totalDesign ) / (totalDesign  / 100)))}%</th>
                    {/* {getAvgAD(Math.round((SumActual() / 7 - SumDesign() / 5) / (SumDesign() / 6 / 100)))} */}
                  </tr>
                  :
                  <tr>
                    <th style={{ fontSize: '0.9rem' }}>{projectId}
                    </th>
                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>GRAND-TOAL OF PROJECT</th>
                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(totalDesign1))}</th>
                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(totalQuotation1))}</th>
                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(totalActual1))}</th>

                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(totalActual1 - totalQuotation1))}</th>
                    <th style={{ fontSize: '0.8rem' }}>{nf.format(Math.round((totalActual1 - totalQuotation1) / (totalQuotation1 / 100)))}%</th>

                    <th style={{ fontSize: '0.8rem',borderLeft:"1px solid #ddd5d5"  }}>{nf.format(Math.round(totalActual1 - totalDesign1))}</th>
                    <th style={{ fontSize: '0.8rem' }}>{Math.round((totalActual1 - totalDesign1) / (totalDesign1 / 100)) 
                    ? nf.format(Math.round((totalActual1 - totalDesign1) / (totalDesign1 / 100))) 
                    : 0}
                    %</th>

                    
                  </tr>}
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
}

export default TableCategoryAnalysis;
