import React, { useState, useEffect, useRef } from 'react';
// import 'Assets/scss/tableProjectList.scss'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ProjectDetail2 from './projectInformationDetail';
import * as XLSX from 'xlsx/xlsx.mjs';
const TableProjectList2 = (props) => {
  const { arrDataProjectListT2, projectId, getFileName, getDataFile, role, CheckReadAndImportExcel, RefreshT2 } = props

  const [exportArr, setExportArr] = useState([])
  // const { onDownload } = useDownloadExcel({
  //   currentTableRef: refOne.current,
  //   filename: projectId +' table',
  //   sheet: projectId
  // })
  // console.log(refOne.current)
  const [arrData, setArrData] = useState(arrDataProjectListT2)
  useEffect(() => {
    setArrData(arrDataProjectListT2)
    setExportArr([])
    arrDataProjectListT2.map(item => {
      setExportArr(exportArr => [...exportArr, [item.attributes.project.data.attributes.PROJECT_NUMBER, item.attributes.QUOTATION_NUMBER, item.attributes.project.data.attributes.PROJECT_NAME, item.attributes.TASK_NO, item.attributes.TASK_NAME, item.attributes.TASK_TYPE, item.attributes.EXCHANGE_RATE, item.attributes.PANEL_QTY]])
    })
  }, [arrDataProjectListT2]);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    getDataFile(file)
    e.target.value = ''
    // RefreshT2(false)
  }
  const handleOnExport = () => {

    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.aoa_to_sheet([["DE_NUMBER", "QUOTATION_NUMBER", "PROJECT_NAME", "TASK_NO", "TASK_NAME", "TASK_TYPE", "EXCHANGE_RATE", "PANEL_QTY"], ...exportArr])
    var wscols = [
      { wch: 12 },
      { wch: 21 },
      { wch: 40 },
      { wch: 9 },
      { wch: 33 },
      { wch: 11 },
      { wch: 16 },
      { wch: 11 },
    ];

    ws['!cols'] = wscols;
    XLSX.utils.book_append_sheet(wb, ws, "MySheet1")
    XLSX.writeFile(wb, projectId + " - Project Information.xlsx")
  }
  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="row row-cards">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Project Information</h3>
                <div className="ms-auto text-muted" style={{ display: role === 'Authenticated' ? 'inline' : 'none' }}>
                  <input
                    style={{ display: "none" }}
                    type="file" name="file" id="file" className="inputfile" onChange={e => handleFile(e)} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                  <div className="d-flex">
                    <label onClick={handleOnExport} style={{ marginRight: '15px' }}>
                      <a className="nav-link" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-fold-down" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M12 11v8l3 -3m-6 0l3 3"></path>
                          <line x1="9" y1="7" x2="10" y2="7"></line>
                          <line x1="14" y1="7" x2="15" y2="7"></line>
                          <line x1="19" y1="7" x2="20" y2="7"></line>
                          <line x1="4" y1="7" x2="5" y2="7"></line>
                        </svg>&ensp;&ensp;
                        <span className="nav-link-title" style={{ marginLeft: '-5px' }}>Export</span>
                      </a>
                    </label>&ensp;&ensp;
                    <label htmlFor="file">
                      <a className="nav-link" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-fold-up" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M12 13v-8l-3 3m6 0l-3 -3"></path>
                          <line x1="9" y1="17" x2="10" y2="17"></line>
                          <line x1="14" y1="17" x2="15" y2="17"></line>
                          <line x1="19" y1="17" x2="20" y2="17"></line>
                          <line x1="4" y1="17" x2="5" y2="17"></line>
                        </svg>&ensp;&ensp;
                        <span className="nav-link-title" style={{ marginLeft: '-5px' }}>Import</span>
                      </a>
                    </label>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table card-table table-vcenter text-nowrap datatable">
                  <thead>
                    <tr>
                      <th>DE_NUMBER</th>
                      <th style={{borderLeft:"1px solid #ddd5d5"}}>QUOTATION_NUMBER</th>
                      <th style={{borderLeft:"1px solid #ddd5d5"}}>PROJECT_NAME</th>
                      <th style={{borderLeft:"1px solid #ddd5d5"}}>TASK_NO</th>
                      <th style={{borderLeft:"1px solid #ddd5d5"}}>TASK_NAME</th>
                      <th style={{borderLeft:"1px solid #ddd5d5"}}>TASK_TYPE</th>
                      <th style={{borderLeft:"1px solid #ddd5d5"}}>EXCHANGE_RATE</th>
                      <th style={{borderLeft:"1px solid #ddd5d5"}}>PANEL_QTY</th>
                      <th style={{ display: role === 'Authenticated' ? 'block' : 'none',borderLeft:"1px solid #ddd5d5" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrData.map((item, index) => {
                      return (

                        <ProjectDetail2 key={index} role={role} item={item} index={index} RefreshT2={RefreshT2} />

                      )
                    })}
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

export default TableProjectList2;