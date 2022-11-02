import React, { useState, useEffect } from 'react';
// import 'Assets/scss/tableProjectList.scss'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ModalCreateNewProject from './modalCreateNewProject';
import ProjectDetail from './projectDetail';
import './projectList.css'
import * as XLSX from 'xlsx/xlsx.mjs';
const TableProjectList = (props) => {
  const { arrDataProjectList, countPagination, countTotal, pageSize, page, ChangePageSize, SearchProject, ChangePage,
    ChooseProjectID, Refesh, projectId, GetDataFileImportProject } = props
  const { role } = props;
  
  const [newPage, setNewPage] = useState()
  const [newPageSize, setNewPageSize] = useState()
  const {getStatusObjs} = props;
  const [pageToChangeName, setPageToChangeName] = useState(1);
   const [selectModalCreateNewProject, setSelectModalCreateNewProject] = useState(false)
   const [FileName, setFileName] = useState(null)
   const [sheet, setSheet] = useState(null)
   const [DataFile, setDataFile] = useState([])
   const [checkExcel, setCheckExcel] = useState(false)
  useEffect(() => {
    setNewPage(page)
    setNewPageSize(pageSize)
  }, [pageSize, page]);
  const navigate = useNavigate()
  const onChangePageSize = (e) => {
    ChangePageSize(e.target.value)
  }
  const onChangeSearchProjectNumber = (e) => {
    SearchProject(e.target.value)
  }
  const onChangePage = (page) => {
    ChangePage(page)
    setPageToChangeName(page)
  }
  const onNavigatePage = () => {
    // navigate(`/detail/${todo.id}`)
  }
  const ChooseRefesh = () => {
    Refesh()
  }
  const SelectModalCreateNewProject = () => {
    setSelectModalCreateNewProject(true)
  }
  const getCloseModalCreateNewProject = (data) => {
    setSelectModalCreateNewProject(data)
  }
  const handleFile = async (e) => {
    const file = e.target.files[0];
    GetDataFileImportProject(file)
    e.target.value = ''
  }
  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="row row-cards">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Selected Project: {projectId}</h3>
                <div className="ms-auto text-muted">
                  <div className="d-flex">
                  <div className="ms-auto text-muted" style={{ paddingTop: "1px" }}>
                      Search:
                      <div className="ms-2 d-inline-block search-tag-input">
                        <input type="search" onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            onChangeSearchProjectNumber(e)
                          }
                        }
                        }
                          className="form-control form-control-sm" aria-label="Search invoice" />
                      </div>

                    </div>
                    {/*<input
                      style={{ display: "none" }}
                      type="file" name="file" id="file" className="inputfile" onChange={e => handleFile(e)} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                     <label htmlFor="file"><a className="nav-link" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-fold-up" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 13v-8l-3 3m6 0l-3 -3"></path>
                        <line x1="9" y1="17" x2="10" y2="17"></line>
                        <line x1="14" y1="17" x2="15" y2="17"></line>
                        <line x1="19" y1="17" x2="20" y2="17"></line>
                        <line x1="4" y1="17" x2="5" y2="17"></line>
                      </svg>&ensp;&ensp;
                      <span className="nav-link-title" style={{ marginLeft: '-5px' }}>Import Project</span>
                    </a></label> */}
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table card-table table-vcenter text-nowrap datatable">
                  <thead>
                    <tr>
                      <th className="w-1">No.
                      </th>
                      <th className="w-1"></th>
                      <th style={{borderLeft:"1px solid #ddd5d5"}}>Project number</th>

                      <th style={{borderLeft:"1px solid #ddd5d5"}}>Project name</th>
                      <th style={{borderLeft:"1px solid #ddd5d5"}} className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>

                    {arrDataProjectList.map((item, index) => {
                      return (
                        <ProjectDetail pageToChangeName={pageToChangeName} getStatusObj={getStatusObjs[index] || 0} item={item} index={index} key={index} ChooseProjectID={ChooseProjectID} role={role} />
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="card-footer d-flex align-items-center">
                <div className="text-muted">
                  Show
                  <div className="mx-2 d-inline-block">
                    {/* <input type="text" onChange={(e) => onChangePageSize(e)} className="form-control form-control-sm" defaultValue={pageSize} size={3} aria-label="Invoices count" /> */}
                    <select className="form-select" defaultValue={newPageSize} onChange={(e) => onChangePageSize(e)} selected>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  entries
                </div>

                <ul className="pagination m-0 ms-auto">
                  <p className="m-0 text-muted" style={{ padding: "3px", paddingTop: '10px' }}><span>Total {countTotal.toString()}</span> Project</p>
                  <li className="page-item" onClick={() => onChangePage(parseFloat(1))}>
                    <a className="page-link">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="15 6 9 12 15 18" /></svg>
                      First
                    </a>
                  </li>
                  {newPage - 2 === 0 ? "" : (1 >= newPage ? "" : <li className="page-item" onClick={() => onChangePage(parseFloat(newPage - 2))}><a className="page-link">{(newPage - 2).toString()}</a></li>)}
                  {1 >= newPage ? "" : <li className="page-item" onClick={() => onChangePage(parseFloat(newPage - 1))}><a className="page-link">{(newPage - 1).toString()}</a></li>}

                  <li className="page-item active" onClick={() => onChangePage(parseFloat(newPage))}><a className="page-link">{newPage}</a></li>
                  {countPagination <= newPage ? "" : <li className="page-item" onClick={() => onChangePage(parseFloat(newPage + 1))}><a className="page-link">{(newPage + 1).toString()}</a></li>}
                  {newPage + 2 > countPagination ? "" : (countPagination <= newPage ? "" : <li className="page-item" onClick={() => onChangePage(parseFloat((newPage + 2)))}><a className="page-link">{(newPage + 2).toString()}</a></li>)}
                  <li className="page-item" onClick={() => onChangePage(parseFloat(countPagination))}>
                    <a className="page-link">
                      Last
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="9 6 15 12 9 18" /></svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
  );
}

export default TableProjectList;