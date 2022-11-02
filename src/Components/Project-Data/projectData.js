import { Auth } from 'Action';
import axios from 'axios';
import Footer from 'Components/Footer/footer';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TableProjectData from './tableProjectData';
import TableProjectData2 from './tableProjectData2';
import TitleProjectData from './titleProjectData';
import ChartTaskNameAQ from 'Components/chartTaskName/chartTaskNameAQ';
import ChartTaskNameAD from 'Components/chartTaskName/chartTaskNameAD';
import { Button } from './Styles';
import './projectData.css'
import { AiOutlineBarChart } from 'react-icons/ai';
import { hostProduction } from 'Action/host'
import { hostDev } from 'Action/host'
import { toast } from 'react-toastify'
const endpointapi = `${hostProduction}`
const endpoint = `${hostProduction}/graphql`
const endpoint_1 = `${hostProduction}/api/project/distinctTaskNameByProject`
const endpoint_2 = `${hostProduction}/api/project/projectDataByTaskName`

const ProjectData = (props) => {
    const {GetUserName} = props;
    let navigate = useNavigate()
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
            url: endpointapi + "/graphql",
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
            })
            .catch(error => {
                navigate('/');
            })
    }
    const { projectId } = props
    const [dataProject, setDataProject] = useState({ PROJECT_NUMBER: "1" })
    const [distinctTaskNameByProject, setDistinctTaskNameByProject] = useState([])
    const [projectGetData, setProjectGetData] = useState([])
    const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
    const [taskNameArr, setTaskNameArr] = useState()
    const [taskNameArr2, setTaskNameArr2] = useState([])
    const lengthTaskName = useRef(0)
    const [dataTaskNameWithGap, setDataTaskNameWithGap] = useState([]);
    const [dataTaskNameWithName, setDataTaskNameWithName] = useState([]);
    const [dataTaskNameWithGapAD, setDataTaskNameWithGapAD] = useState([]);
    const [dataTaskNameWithNameAD, setDataTaskNameWithNameAD] = useState([]);
    const [avg, setAvg] = useState(0);
    const [avgAD, setAvgAD] = useState(0);
    const position = useRef();
    const positionAD = useRef();
    const length = useRef(0);
    const [ getDataIndoor, setGetDataIndoor] = useState([])
    const [ getDataOutdoor, setGetDataOutdoor] = useState([])
    const QUERY_PROJECT_NUMBER = `{
        projects(
        filters:{
          PROJECT_NUMBER:{
            eq:"${projectId}"
          }
        })
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
      }
`
    const GetNewDataTaskNameWithName = (name) => {
        setDataTaskNameWithName(dataTaskNameWithName => [...dataTaskNameWithName, name])
    }
    const GetNewDataTaskNameWithGap = (gapValue) => {
        setDataTaskNameWithGap(dataTaskNameWithGap => [...dataTaskNameWithGap, gapValue])
    }
    const GetNewDataTaskNameWithNameAD = (name) => {
        setDataTaskNameWithNameAD(dataTaskNameWithNameAD => [...dataTaskNameWithNameAD, name])
    }
    const GetNewDataTaskNameWithGapAD = (gapValue) => {
        setDataTaskNameWithGapAD(dataTaskNameWithGapAD => [...dataTaskNameWithGapAD, gapValue])
    }
    const GetTaskNameByProject = async () => {
        await axios({
            url: endpointapi + '/api/project/distinctTaskNameByProject',
            method: 'post',
            data: {
                "data": {
                    "projectNumber": projectId
                }
            },
            headers: {
                'Authorization': Auth
            }
        }).then(async (result) => {
            lengthTaskName.current = result.data.data.length;
            let arrayOfPromise = [];
            result.data.data.map((item) => {
                const taskname = item;
                const fetchData1 = async () => {
                    await axios({
                        url: endpointapi + "/api/project/projectDataByTaskName",
                        method: 'post',
                        data: {
                            "data": {
                                "projectNumber": projectId,
                                "taskName": taskname
                            }
                        },
                        headers: {
                            'Authorization': Auth
                        }
                    }).then(async (result1) => {
                        await Promise.all([
                            GetNewDataTaskNameWithName(taskname),
                            GetNewDataTaskNameWithGap(result1.data.data.gapAQPercentage),
                            GetNewDataTaskNameWithNameAD(taskname),
                            GetNewDataTaskNameWithGapAD(result1.data.data.gapADPercentage),
                            // setDataTaskNameWithName(dataTaskNameWithName => [...dataTaskNameWithName, taskname]),
                            // setDataTaskNameWithGap(dataTaskNameWithGap => [...dataTaskNameWithGap, result1.data.data.gapAQPercentage])
                        ])
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
                arrayOfPromise.push(fetchData1())
            })
            await Promise.all(arrayOfPromise)
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

    const GetAllData = async () => {
        await Promise.all([
            GetCurrentUser(),
            // GetTaskNameByProject(),
        ])
    }

    useEffect(() => {
        GetAllData();
        const fetchData = async () => {
            await axios({
                url: endpoint_1,
                method: 'post',
                data: {
                    "data": {
                        "projectNumber": projectId
                    }
                }
                ,
                headers: {
                    'Authorization': Auth
                }
            }).then(async result => {
                setTaskNameArr(result.data.data)
                length.current = result.data.data.length;
                lengthTaskName.current = result.data.data.length;
                const controller = new AbortController();
                const currentHash = window.location.hash;
                for (let index = 0; index < result.data.data.length; index++) {
                    await 
                    axios({
                        url: endpoint_2,
                        method: 'post',
                        data: {
                            "data": {
                                "projectNumber": projectId,
                                "taskName": result.data.data[index]
                            }
                        },
                        signal: controller.signal
                        ,
                        headers: {
                            'Authorization': Auth
                        }
                    }).then(result1 => {
                        if(window.location.hash !== currentHash){
                            // controller.abort();
                            return;
                        }
                        setTaskNameArr2(taskNameArr2 => [...taskNameArr2, { state: result.data.data[index], value: result1.data.data }])
                        GetNewDataTaskNameWithName(result.data.data[index])
                        GetNewDataTaskNameWithGap(result1.data.data.gapAQPercentage)
                        GetNewDataTaskNameWithNameAD(result.data.data[index])
                        GetNewDataTaskNameWithGapAD(result1.data.data.gapADPercentage)
                    })
                    if(window.location.hash !== currentHash){
                        // controller.abort();
                        break;
                    }
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
            await axios({
                url: endpointapi + '/api/project/projectDataByOutSourcing',
                method: 'post',
                data: {
                    "data": {
                        "projectNumber": projectId,
                        "isOutSourcing": false
                    }
                },
                headers: {
                    'Authorization': Auth
                }
            }).then(result => {
                setGetDataIndoor(result.data.data)
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
            await axios({
                url: endpointapi + '/api/project/projectDataByOutSourcing',
                method: 'post',
                data: {
                    "data": {
                        "projectNumber": projectId,
                        "isOutSourcing": true
                    }
                },
                headers: {
                    'Authorization': Auth
                }
            }).then(result => {
                setGetDataOutdoor(result.data.data)
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
        fetchData()
    }, [projectId]);
    let arrNew = uniqueArray(taskNameArr2)
    const GetAvg = (avgFromTable) => {
        setAvg(avgFromTable);
    }
    const GetAvgAD = (avgADFromTable) => {
        setAvgAD(avgADFromTable);
    }
   
    return (
        <div className="page-wrapper">
            {/* <Button id='button-show-chart'>
                <AiOutlineBarChart onClick={() => ToChart()} /> 
            </Button> */}
            <div className="page-body">
                <div className="container-xl">
                    {/* <TitleProjectData projectId={projectId} /> */}
                    <TableProjectData lengthTaskName={length.current} projectId={projectId} distinctTaskNameByProject={distinctTaskNameByProject} taskNameArr2={arrNew} 
                    getAvg={GetAvg} getAvgAD={GetAvgAD}/>
                    <br/>
                    <TableProjectData2 
                    length={length.current} 
                    projectId={projectId} 
                    distinctTaskNameByProject={distinctTaskNameByProject} 
                    taskNameArr2={arrNew} 
                    // getAvg={GetAvg} 
                    getDataIndoor={getDataIndoor}  
                    getDataOutdoor={getDataOutdoor}
                    />
            <ChartTaskNameAQ projectId={projectId} id='chart-task-nameAQ' lengthTaskName={lengthTaskName.current} dataTaskNameWithGap={dataTaskNameWithGap} dataTaskNameWithName={dataTaskNameWithName} avg={avg} />
            <ChartTaskNameAD projectId={projectId} id='chart-task-nameAD' lengthTaskName={lengthTaskName.current} dataTaskNameWithGapAD={dataTaskNameWithGapAD} dataTaskNameWithNameAD={dataTaskNameWithNameAD} avgAD={avgAD} />
            </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProjectData;