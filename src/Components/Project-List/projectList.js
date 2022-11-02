import axios from 'axios';
import Footer from 'Components/Footer/footer';
import React, { useState, useEffect, useRef } from 'react';
import TableProjectList from './tableProjectList';
import TableProjectList2 from './tableProjectList2';
import * as XLSX from 'xlsx/xlsx.mjs';
import TitleProjectList from './titleProjectList';
import { Auth } from 'Action/index'
import { hostProduction } from 'Action/host'
import { hostDev } from 'Action/host'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import _ from 'lodash';

const endpoint = `${hostProduction}/graphql`
const endpoint1 = `${hostProduction}`
const endpoint2 = hostProduction + `/api/project/pdf/find/`
// const endpoint = "http://localhost:1337/graphql"

const ProjectList = (props) => {
  let navigate = useNavigate()
  let location = useLocation()
  const { getProjectId, projectId, getProject, GetUserName } = props
  const [pageSize, setPageSize] = useState(5)
  const [page, setPage] = useState(location.state ? location.state.page : 1)
  // if(location.state) {
  //   console.log(location.state.page)
  // }else{
  //   console.log()
  // }
  const [arrDataProjectListT2, setArrDataProjectListT2] = useState([])
  const [arrDataProjectList, setArrDataProjectList] = useState([])
  const [arrDataProjectListT2CHECK, setArrDataProjectListT2CHECK] = useState([])
  const [countPagination, setCountPagination] = useState(0)
  const [countTotal, setCountTotal] = useState(0)
  const [searchProjectNumber, setSearchProjectNumber] = useState("")
  const [FileName, setFileName] = useState(null)
  const [DataFile, setDataFile] = useState([])
  const [sheet, setSheet] = useState(null)
  // const [FileName, setFileName] = useState(null)
  // const [DataFile, setDataFile] = useState([])
  // const [sheet, setSheet] = useState(null)
  const nf = new Intl.NumberFormat('en-US');
  const [role, setRole] = useState();
  const [checkExcel, setCheckExcel] = useState(false)
  const [refreshT2, setRefreshT2] = useState(false)
  const [change, setChange] = useState(false)
  const isSearching = useRef(false);
  const [getStatusObjs, setGetStatusObjs] = useState([]);
  const [ArrDataImportProject, setArrDataImportProject] = useState([])
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
      url: endpoint1 + "/graphql",
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
        setRole(result.data.data.me.role.name);
      })
      .catch(error => {
        // navigate('/');
      })
  }
  const ChooseProjectID = (id) => {
    getProjectId(id)
  }
  const GetIsSearching = (isSearch) => {
    isSearching.current = isSearch
  }

  const QUERY_PROJECT_NUMBER_LIST = `{
        projects(sort:[
          "id:desc"
        ],pagination:{
          pageSize:${pageSize},
          page:${page}
        },
        
        filters: {or: [{PROJECT_NUMBER: {contains: "${searchProjectNumber}"} }, {PROJECT_NAME: {contains: "${searchProjectNumber}"}}]}
        )
          {
            data{
                id
              attributes {
                PROJECT_NUMBER
                PROJECT_NAME
                }
            }
            meta {
              pagination {
                page,
                pageSize,
                pageCount
                total
              }
            }
          },
      }`
  const QUERY_PROJECT_NUMBER_LIST_TABLE_2 = `{
    panels (filters:{project:{PROJECT_NUMBER:{contains:"${projectId}"}}}){
      data {
        id
        attributes {
          project {
            data {
              id
              attributes {
                PROJECT_NUMBER
                PROJECT_NAME
              }
            }
          }
          QUOTATION_NUMBER
          TASK_NO
          TASK_NAME
          EXCHANGE_RATE
          PANEL_QTY
          TASK_TYPE
        }
      }
      meta {
        pagination {
          total
        }
      }
    }
  }`
  const ChangePageSize = (number) => {
    setPageSize(number)
    setPage(1)
  }
  const SearchProject = (project) => {
    setSearchProjectNumber(project)
    setPage(1)
  }
  const ChangePage = (numberPage) => {
    setPage(numberPage)
  }
  const Refesh = () => {
    setPageSize(5)
    setPage(1)
    setSearchProjectNumber("")
  }
  const RefreshT2 = (get) => {
    setChange(!change)
  }

  useEffect(() => {
    GetCurrentUser();
  }, []);
  const [prevPage, setPrevPage] = useState(1)
  const currentPage = useRef(1)
  useEffect(() => {
    currentPage.current = page
    setPrevPage(page);
  }, [page]);


  useEffect(() => {
    const fetchData = async () => {
      await axios({
        url: endpoint,
        method: 'post',
        data: {
          query: QUERY_PROJECT_NUMBER_LIST
        },
        headers: {
          'Authorization': Auth
        }
      }).then(async (result) => {
        setArrDataProjectList(result.data.data.projects.data)
        setCountPagination(result.data.data.projects.meta.pagination.pageCount)
        setCountTotal(result.data.data.projects.meta.pagination.total)
        setGetStatusObjs([])
        // for (let i = 0; i < result.data.data.projects.data.length; i++) {
        //   await axios({
        //     url: endpoint2 + result.data.data.projects.data[i].attributes.PROJECT_NUMBER + '.pdf',
        //     method: 'get',
        //     headers: {
        //       'Authorization': Auth
        //     },
        //   }).then(result1 => {
        //     // console.log(endpoint2 + result.data.data.projects.data[i].attributes.PROJECT_NUMBER + '.pdf')
        //     console.log(result1.data.data)
        //     setGetStatusObjs(getStatusObjs => [...getStatusObjs, result1.data.result])
        //   })

        //     .catch(error => {

        //       toast.error("SERVER ERROR: " + error.name, {
        //         position: 'top-right',
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined
        //       })
        //     })
        // }
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
    if (window.localStorage.getItem('token')) {
      fetchData()
    }
  }, [pageSize, page, searchProjectNumber]);
  useEffect(() => {
    setRefreshT2(change)
    const fetchData = async () => {
      await axios({
        url: endpoint,
        method: 'post',
        data: {
          query: QUERY_PROJECT_NUMBER_LIST_TABLE_2
        }
        ,
        headers: {
          'Authorization': Auth
        }
      }).then(result => {
        setArrDataProjectListT2(result.data.data.panels.data)
        setArrDataProjectListT2CHECK(result.data.data.panels.data)
        setDataFile([])
        setFileName(null)
        setSheet(null)
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
    if (window.localStorage.getItem('token')) {
      fetchData()

    }
  }, [projectId, change]);
  const [sheetNames, setSheetNames] = useState([])
  const acceptableFileName = ["xlsx", "xls"]
  const checkFileName = (name) => {
    return acceptableFileName.includes(name.split(".").pop().toLowerCase())
  }
  let arrCheck = []
  const readDataFromExcel = (data) => {
    setCheckExcel(false)
    const wb = XLSX.readFile(data)
    var mySheetData = {}
    for (let index = 0; index < wb.SheetNames.length; index++) {
      let sheetName = wb.SheetNames[index]
      const ws = wb.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(ws, {
        blankrows: "",
        header: 1,
      })
      mySheetData[sheetName] = jsonData
    }
    setSheetNames(mySheetData)
    return mySheetData
  }
  const handleFileUpLoaded = async (e) => {

    if (e) {
      setSheet(Object.keys(e)[0])
    }
    setDataFile(e)
  }
  let arrTaskName = []
  arrDataProjectListT2CHECK.map(item => {
    arrTaskName.push(item.attributes.TASK_NAME)
  })
  // const getDataFile = async (datafile) => {
  //   setDataFile([])
  //   setSheet(null)
  //   const file = datafile
  //   setFileName(file.name)
  //   if (!checkFileName(file.name)) {
  //     alert("Invalid File Type");
  //     return;
  //   };
  //   const data = await file.arrayBuffer()
  //   const mySheetData = readDataFromExcel(data)
  //   handleFileUpLoaded(mySheetData)

  //   let arr = []
  //   mySheetData[Object.keys(mySheetData)[0]].slice(1).map(item => {
  //     if (item[1] && item[3] && item[4]) {
  //       arr.push(true)
  //     } else {
  //       arr.push(false)
  //     }
  //   })
  //   mySheetData[Object.keys(mySheetData)[0]][0].map(item1 => {
  //     if (item1 === "DE_NUMBER" || item1 === "QUOTATION_NUMBER" || item1 === "PROJECT_NAME" || item1 === "TASK_NO" || item1 === "TASK_NAME" || item1 === "EXCHANGE_RATE" || item1 === "PANEL_QTY") {
  //       arr.push(true)
  //     } else {
  //       arr.push(false)
  //     }
  //   })
  //   if (arr.includes(false) === false) {
  //     const QUERY_IMPORT = `mutation ImportProjectInformation($data: PanelInput!) {
  //       createPanel(data: $data) {
  //         data {
  //           id
  //           attributes {
  //             project {
  //               data {
  //                 attributes {
  //                   PROJECT_NUMBER
  //                   PROJECT_NAME
  //                 }
  //               }
  //             }
  //             QUOTATION_NUMBER
  //             TASK_NO
  //             TASK_NAME
  //             EXCHANGE_RATE
  //             PANEL_QTY
  //           }
  //         }
  //       }
  //     }`
  //     mySheetData[Object.keys(mySheetData)[0]].slice(1).map(async item => {
  //       let body = {
  //         query: QUERY_IMPORT,
  //         variables: {
  //           "data": {
  //             "QUOTATION_NUMBER": item[1].toString(),
  //             "TASK_NO": item[3].toString(),
  //             "TASK_NAME": item[4].toString(),
  //             "EXCHANGE_RATE": item[5] ? item[5] : 0,
  //             "PANEL_QTY": item[6] ? item[6] : 0,
  //             "project": getProject[0].id
  //           }
  //         },
  //       }
  //       // console.log(item[0])
  //       // console.log(projectId)
  //       if (arrTaskName.includes(item[4].toString()) === false && item[0] === projectId) {
  //         await axios.post(endpoint, body, {
  //           headers: {
  //             'Authorization': Auth
  //           }
  //         })
  //           .then(res => {
  //             if (res.status !== 200) {
  //               toast.warn('The data inside the excel file is not in the correct format of the server, please check again!', {
  //                 position: 'top-right',
  //                 autoClose: 5000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined
  //               })
  //             } else {
  //               console.log(res.data.data.createPanel.data)
  //               setArrDataProjectListT2(arrDataProjectListT2 => [...arrDataProjectListT2, res.data.data.createPanel.data])
  //               toast.success('Import successfully1!', {
  //                 position: 'top-right',
  //                 autoClose: 5000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined
  //               })
  //               // console.log(arrDataProjectListT2.push(res.data.data.createPanel))

  //               console.log(arrDataProjectListT2)
  //               // console.log(arrDataProjectListT2)
  //               // console.log(arrDataProjectListT2CHECK)
  //             }
  //           })
  //           .catch(error => {
  //             if (error) {
  //               toast.error('An error occurred while connecting to the server, please try again!', {
  //                 position: 'top-right',
  //                 autoClose: 5000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined
  //               })
  //             }
  //           })
  //       }
  //       if (arrTaskName.includes(item[4].toString()) === true) {
  //         toast.warn('Data already exist!', {
  //           position: 'top-right',
  //           autoClose: 5000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined
  //         })
  //       }

  //     })
  //   }
  //   else {
  //     toast.warn('Incorrect Excel Column Headers', {
  //       position: 'top-right',
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined
  //     })
  //   }
  // }
  const [arrTaskName1, setArrTaskName1] = useState([])
  const getDataFile = async (datafile) => {
    setDataFile([])
    setSheet(null)
    setFileName(null)
    setArrTaskName1([])
    const file = datafile
    setFileName(file.name)
    if (!checkFileName(file.name)) {
      alert("Invalid File Type");
      return;
    };
    const data = await file.arrayBuffer()
    const mySheetData = readDataFromExcel(data)
    handleFileUpLoaded(mySheetData)
    const newArr = _.filter(mySheetData[Object.keys(mySheetData)[0]].slice(1), _.size)
    if (mySheetData[Object.keys(mySheetData)[0]][0][0] !== "DE_NUMBER") {
      toast.warn('Incorrect Excel Column Headers', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    } else {
      for (let index = 0; index < newArr.length; index++) {
        const FIND_PROJECT = `{
          projects (filters:{PROJECT_NUMBER:{contains:"${newArr[index][0]}"}}){
            data {
              id
              attributes {
                PROJECT_NAME
                PROJECT_NUMBER
              }
            }
            meta {
              pagination {
                total
              }
            }
          }
        }`
        await axios({
          url: endpoint1 + "/graphql",
          method: 'POST',
          data: {
            query: FIND_PROJECT
          }
          ,
          headers: {
            'Authorization': "Bearer " + window.localStorage.getItem('token')
          }
        }).then(async result => {
          if (result.data.data.projects.meta.pagination.total === 0) {
            const CREATE_NEW_PROJECT = `mutation createProject($data: ProjectInput!) {
              createProject(data: $data){
                data{
                  id
                  attributes{
                    PROJECT_NAME
                    PROJECT_NUMBER
                  }
                }
              }
            }`
            let body = {
              query: CREATE_NEW_PROJECT,
              variables: {
                "data": {
                  "PROJECT_NAME": newArr[index][2].toString(),
                  "PROJECT_NUMBER": newArr[index][0].toString(),
                }
              },
            }
            await axios.post(endpoint, body, {
              headers: {
                'Authorization': Auth
              }
            }).then(async res => {
              if (res.data.data.createProject === null) {
                toast.error("SERVER ERROR: " + res.data.errors[0].message, {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })
                return
              }
              toast.success('Imported New Project Successfully!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
              })
              const CREATE_NEW_TASK_NAME = `mutation ImportProjectInformation($data: PanelInput!) {
                createPanel(data: $data) {
                  data {
                    id
                    attributes {
                      project {
                        data {
                          attributes {
                            PROJECT_NUMBER
                            PROJECT_NAME
                          }
                        }
                      }
                      QUOTATION_NUMBER
                      TASK_NO
                      TASK_NAME
                      EXCHANGE_RATE
                      PANEL_QTY
                    }
                  }
                }
              }`
              let body1 = {
                query: CREATE_NEW_TASK_NAME,
                variables: {
                  "data": {
                    "QUOTATION_NUMBER": newArr[index][1].toString(),
                    "TASK_NO": newArr[index][3].toString(),
                    "TASK_NAME": newArr[index][4].toString(),
                    "TASK_TYPE": newArr[index][5].toString(),
                    "EXCHANGE_RATE": newArr[index][6] ? newArr[index][6] : 0,
                    "PANEL_QTY": newArr[index][7] ? newArr[index][7] : 0,
                    "project": res.data.data.createProject.data.id
                  }
                },
              }
              await axios.post(endpoint, body1, {
                headers: {
                  'Authorization': Auth
                }
              }).then(resultCreate => {
                console.log(resultCreate)
                if (resultCreate.data.data.createPanel === null) {
                  toast.error("SERVER ERROR: " + resultCreate.data.errors[0].message, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                  return
                }
                setArrTaskName1(arrTaskName1 => [...arrTaskName1, [newArr[index][0], newArr[index][1], newArr[index][2], newArr[index][3], newArr[index][4], newArr[index][5], newArr[index][6], newArr[index][7], "accept"]]);
                toast.success('Imported Task Name Successfully!', {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined
                })
              }
              ).catch(error => {
                toast.error("SERVER ERROR: " + error.name, {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })
              })
            })
          } else {
            const FIND_TASK_NAME = `{
              panels(filters:{TASK_NAME:{eq:"${newArr[index][4]}"},project:{PROJECT_NUMBER:{eq:"${newArr[index][0]}"}}}){
                data{
                  id
                  attributes{
                    TASK_NO
                    TASK_NAME
                    PANEL_QTY
                    TASK_TYPE
                    EXCHANGE_RATE
                    QUOTATION_NUMBER
                  }
                }
                meta{
                  pagination{
                    total
                  }
                }
              }
            }`
            await axios({
              url: endpoint1 + "/graphql",
              method: 'POST',
              data: {
                query: FIND_TASK_NAME
              }
              ,
              headers: {
                'Authorization': "Bearer " + window.localStorage.getItem('token')
              }
            }).then(async res => {
              if (res.data.data.panels.meta.pagination.total === 0) {
                const CREATE_NEW_TASK_NAME = `mutation ImportProjectInformation($data: PanelInput!) {
                  createPanel(data: $data) {
                    data {
                      id
                      attributes {
                        project {
                          data {
                            attributes {
                              PROJECT_NUMBER
                              PROJECT_NAME
                            }
                          }
                        }
                        QUOTATION_NUMBER
                        TASK_NO
                        TASK_NAME
                        EXCHANGE_RATE
                        PANEL_QTY
                      }
                    }
                  }
                }`
                let body = {
                  query: CREATE_NEW_TASK_NAME,
                  variables: {
                    "data": {
                      "QUOTATION_NUMBER": newArr[index][1].toString(),
                      "TASK_NO": newArr[index][3].toString(),
                      "TASK_NAME": newArr[index][4].toString(),
                      "TASK_TYPE": newArr[index][5].toString(),
                      "EXCHANGE_RATE": newArr[index][6] ? newArr[index][6] : 0,
                      "PANEL_QTY": newArr[index][7] ? newArr[index][7] : 0,
                      "project": result.data.data.projects.data[0].id
                    }
                  },
                }
                await axios.post(endpoint, body, {
                  headers: {
                    'Authorization': Auth
                  }
                }).then(resultCreate => {

                  if (resultCreate.data.data.createPanel === null) {
                    toast.error("SERVER ERROR: " + resultCreate.data.errors[0].message, {
                      position: 'top-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                    return
                  }
                  setArrTaskName1(arrTaskName1 => [...arrTaskName1, [newArr[index][0], newArr[index][1], newArr[index][2], newArr[index][3], newArr[index][4], newArr[index][5], newArr[index][6], newArr[index][7], "accept"]]);
                  // setArrDataProjectListT2(arrDataProjectListT2 => [...arrDataProjectListT2, res.data.data.createPanel.data]),
                  toast.success('Imported Successfully!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                  }
                  )
                }
                ).catch(error => {
                  toast.error("SERVER ERROR: " + error.name, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                })
              }
              else {
                setArrTaskName1(arrTaskName1 => [...arrTaskName1, [newArr[index][0], newArr[index][1], newArr[index][2], newArr[index][3], newArr[index][4], newArr[index][5], newArr[index][6], newArr[index][7], "unaccept"]])
                toast.warn('Data Already Exists!', {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined
                })
              }

            })
          }
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
    }
  }

  return (

    <div className="page-wrapper">
      {/* <TitleProjectList /> */}
      <TableProjectList
        arrDataProjectList={arrDataProjectList}
        countPagination={countPagination}
        countTotal={countTotal}
        page={page}
        pageSize={pageSize}
        ChangePageSize={ChangePageSize}
        SearchProject={SearchProject}
        ChangePage={ChangePage}
        ChooseProjectID={ChooseProjectID}
        Refesh={Refesh}
        GetIsSearching={GetIsSearching}
        projectId={projectId}
        role={role}
        getStatusObjs={getStatusObjs}
      // GetDataFileImportProject={GetDataFileImportProject}
      />
      <TableProjectList2
        arrDataProjectListT2={arrDataProjectListT2}
        getDataFile={getDataFile}
        getProject={getProject}
        projectId={projectId}
        role={role}
        RefreshT2={RefreshT2}
      />
      <div className="page-body">
        <div className="container-xl">
          {FileName && (<p>{FileName}</p>)}
          {/* {DataFile.length !== 0 && arrTaskName1.length === 0 && (<div>
            <div style={{ marginBottom: "10px" }}>
              {sheet}
            </div>

            <div style={{ marginBottom: "10px" }} className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead><tr>{DataFile[sheet][0].map(h => <th>{h}</th>)}<th>Status</th></tr></thead>
                <tbody>
                  {_.filter(DataFile[sheet].slice(1), _.size).map((row, index) => (
                    <tr key={index}>
                      {row.map((c) => <td>{c}</td>)}
                      {arrTaskName.includes(row[4].toString()) === false && row[0] === projectId ? <td>✅</td> : <td>❌</td>}
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

          </div>
          )
          } */}
          {DataFile.length !== 0 && arrTaskName1.length !== 0 && (<div>
            <div style={{ marginBottom: "10px" }}>
              {sheet}
            </div>

            <div style={{ marginBottom: "10px" }} className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead><tr>{DataFile[sheet][0].map(h => <th>{h}</th>)}<th>Status</th></tr></thead>
                <tbody>
                  {arrTaskName1.map((row, index) => (
                    <tr key={index}>
                      {row.map((c) => {
                        if (c === "accept") {
                          return <td>✅</td>
                        }
                        if (c === "unaccept") {
                          return <td>❌</td>
                        } else {
                          return <td>{c > 0 ? nf.format(c) : c}</td>
                        }
                        return null
                      })}

                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

          </div>
          )
          }
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default ProjectList;