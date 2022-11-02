import { Auth } from 'Action/index';
import axios from 'axios';
import Footer from 'Components/Footer/footer';
import React, { useState, useEffect, useRef } from 'react';
import './category-analysis.css'
import { useNavigate } from 'react-router-dom';
import TableCategoryAnalysis from './tableCategoryAnalysis';
import TitleCategoryAnalysis from './titleCategoryAnalysis';
import ChartCategory from 'Components/chartCategory/chartCategory';
import ChartCategoryAD from 'Components/chartCategory/chartCategoryAD';
import { AiOutlineBarChart } from 'react-icons/ai';
import { Button } from './Styles';
import { toast } from 'react-toastify'
import { hostProduction } from 'Action/host';
import { hostDev } from 'Action/host'
import CategoryList from './category-list';
const endpointapi = `${hostProduction}`
const endpoint = `${hostProduction}/api/project/distinctCategoryByProject`
const endpoint_2 = `${hostProduction}/api/category/categoryByProject`
const endpoint_3 = `${hostProduction}/api/project/distinctTaskNameByProject`

const CategoryAnalysis = (props) => {
    let navigate = useNavigate()
      const {GetUserName} = props;
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
    const [category, setCategory] = useState([])
    const [arrCategory, setArrCategory] = useState([])
    const [taskName, setTaskName] = useState([])
    const [chooseOption, setChooseOption] = useState({ value: "ALL TASK", label: "ALL TASK" })
    const [chooseOptionTaskName, setChooseOptionTaskName] = useState({ value: "ALL TASK", label: "ALL TASK" })
    const [CategoryArr2, setCategoryArr2] = useState([])
    const [CategoryArr3, setCategoryArr3] = useState([])
    const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
    const lengthCategory = useRef(0)
    const lengthCategoryOption = useRef(0)
    const [dataCategoryWithGapAllTask, setDataCategoryWithGapAllTask] = useState([]);
    const [dataCategoryWithNameAllTask, setDataCategoryWithNameAllTask] = useState([]);
    const [dataCategoryWithGapOptionTask, setDataCategoryWithGapOptionTask] = useState([]);
    const [dataCategoryWithNameOptionTask, setDataCategoryWithNameOptionTask] = useState([]);
    const [dataCategoryWithGapAllTaskAD, setDataCategoryWithGapAllTaskAD] = useState([]);
    const [dataCategoryWithNameAllTaskAD, setDataCategoryWithNameAllTaskAD] = useState([]);
    const [dataCategoryWithGapOptionTaskAD, setDataCategoryWithGapOptionTaskAD] = useState([]);
    const [dataCategoryWithNameOptionTaskAD, setDataCategoryWithNameOptionTaskAD] = useState([]);
    const [select, setSelect] = useState({ value: 'ALL TASK', label: 'ALL TASK' });
    const [avg, setAvg] = useState(0);
    const [avgAD, setAvgAD] = useState(0);
    const [queryOptionDone, setQueryOptionDone] = useState(false)
    const position = useRef();
    const positionAD = useRef();
    const prevTaskName = useRef('ALL TASK')
    const taskNameFromMenu = useRef('ALL TASK');
    const changeOption = useRef(false);

    const GetAvg = (avgFromTable) => {
        setAvg(avgFromTable);
    }
    const GetAvgAD = (avgFromTable) => {
        setAvgAD(avgFromTable);
    }
    const GetNewDataCategoryWithNameAllTask = (name) => {
        setDataCategoryWithNameAllTask(dataTaskNameWithName => [...dataTaskNameWithName, name])
    }
    const GetNewDataCategoryWithGapAllTask = (gapValue) => {
        setDataCategoryWithGapAllTask(dataTaskNameWithGap => [...dataTaskNameWithGap, gapValue])
    }
    const GetNewDataCategoryWithNameOptionTask = (name) => {
        setDataCategoryWithNameOptionTask(dataTaskNameWithName => [...dataTaskNameWithName, name])
    }
    const GetNewDataCategoryWithGapOptionTask = (gapValue) => {
        setDataCategoryWithGapOptionTask(dataTaskNameWithGap => [...dataTaskNameWithGap, gapValue])
    }

    const GetNewDataCategoryWithNameAllTaskAD = (name) => {
        setDataCategoryWithNameAllTaskAD(dataTaskNameWithNameAD => [...dataTaskNameWithNameAD, name])
    }
    const GetNewDataCategoryWithGapAllTaskAD = (gapValue) => {
        setDataCategoryWithGapAllTaskAD(dataTaskNameWithGapAD => [...dataTaskNameWithGapAD, gapValue])
    }
    const GetNewDataCategoryWithNameOptionTaskAD = (name) => {
        setDataCategoryWithNameOptionTaskAD(dataTaskNameWithNameAD => [...dataTaskNameWithNameAD, name])
    }
    const GetNewDataCategoryWithGapOptionTaskAD = (gapValue) => {
        setDataCategoryWithGapOptionTaskAD(dataTaskNameWithGapAD => [...dataTaskNameWithGapAD, gapValue])
    }
    const GetCategoryByProject = async () => {
        await axios({
            url: endpointapi + '/api/project/distinctCategoryByProject',
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
        }).then(async (result) => {
            lengthCategory.current = result.data.data.length
            let arrayOfPromise = []
            result.data.data.map((item, index) => {
                const category = item;
                const fetchData2 = async () => {
                    await axios({
                        url: endpointapi + "/api/category/categoryByProject",
                        method: 'post',
                        data: {
                            "data": {
                                "projectNumber": projectId,
                                "category": category
                            }
                        }
                        ,
                        headers: {
                            'Authorization': Auth
                        }
                    }).then(async (result1) => {
                        await Promise.all([
                            GetNewDataCategoryWithNameAllTask(category),
                            GetNewDataCategoryWithGapAllTask(result1.data.data.gapAQPercentage),
                            GetNewDataCategoryWithNameAllTaskAD(category),
                            GetNewDataCategoryWithGapAllTaskAD(result1.data.data.gapADPercentage),
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
                arrayOfPromise.push(fetchData2());
            })
            await Promise.all(arrayOfPromise);
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
            // GetCategoryByProject(),
        ])
    }
    useEffect(() => {
        GetAllData();
    }, [])
    useEffect(() => {
        let fetchData = async () => {
            const controller = new AbortController();
            const currentHash = window.location.hash;
            //get data for taskname
            await axios({
                url: endpoint_3,
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
            }).then(result => {
                for (let index = 0; index < result.data.data.length; index++) {
                    setTaskName(category => [...category, { value: result.data.data[index], label: result.data.data[index] }])
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

            //get data for category
            await axios({
                url: endpoint,
                method: 'post',
                data: {
                    "data": {
                        "projectNumber": projectId
                    }
                },

                headers: {
                    'Authorization': Auth
                }
            }).then(async result => {
                setArrCategory(result.data.data)
                lengthCategory.current = result.data.data.length;

                for (let index = 0; index < result.data.data.length; index++) {
                    await axios({
                        url: endpoint_2,
                        method: 'post',
                        data: {
                            "data": {
                                "projectNumber": projectId,
                                "category": result.data.data[index]
                            }
                        }
                        ,
                        signal: controller.signal,
                        headers: {
                            'Authorization': Auth
                        }
                    }).then(result1 => {
                        if (window.location.hash !== currentHash) {
                            // controller.abort();
                            return;
                        }
                        GetNewDataCategoryWithNameAllTask(result.data.data[index]);
                        GetNewDataCategoryWithGapAllTask(result1.data.data.gapAQPercentage);
                        GetNewDataCategoryWithNameAllTaskAD(result.data.data[index]);
                        GetNewDataCategoryWithGapAllTaskAD(result1.data.data.gapADPercentage);

                        setCategoryArr2(CategoryArr2 => [...CategoryArr2, { state: result.data.data[index], value: result1.data.data }])
                        setCategory(category => [...category, { value: result.data.data[index], label: result.data.data[index] }])

                    })

                    if (window.location.hash !== currentHash) {
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

        }
        fetchData()
    }, [projectId, chooseOption]);
    const GetOption = async (option) => {
        const queryTaskName = option.value;
        const currentHash = window.location.hash;

        if (queryTaskName === prevTaskName.current) {
            // console.log('Selected this option', queryTaskName)
        } else {
            prevTaskName.current = queryTaskName;
            if (queryTaskName !== "ALL TASK") {
                taskNameFromMenu.current = queryTaskName;
                setCategoryArr3([])
                setDataCategoryWithGapOptionTask([])
                setDataCategoryWithNameOptionTask([])
                setDataCategoryWithGapOptionTaskAD([])
                setDataCategoryWithNameOptionTaskAD([])
                // console.log(arrCategory);
                // console.log("start for", queryTaskName)
                // console.log(`prevTaskName.current`, prevTaskName.current);
                // console.log(`queryTaskName`, queryTaskName);
                const controller = new AbortController();
                lengthCategoryOption.current = 0;
                // setQueryOptionDone(false)
                for (let index = 0; index < arrCategory.length; index++) {
                    // console.log(queryTaskName, 0, prevTaskName.current)
                    setQueryOptionDone(false)
                    await
                        axios({
                            url: endpoint_2,
                            method: 'post',
                            data: {
                                "data": {
                                    "projectNumber": projectId,
                                    "category": arrCategory[index],
                                    "taskName": queryTaskName
                                }
                            },
                            signal: controller.signal,
                            headers: {
                                'Authorization': Auth
                            }
                        }).then(result1 => {
                            if (prevTaskName.current !== queryTaskName || window.location.hash !== currentHash) {
                                // controller.abort();
                                return;
                            }

                            if (result1.data.data.designs === 0
                                && result1.data.data.quotations === 0
                                && result1.data.data.actuals === 0
                                && result1.data.data.gapAQ === 0
                                && result1.data.data.gapAQPercentage === 0
                                && result1.data.data.gapAD === 0
                                && result1.data.data.gapADPercentage === 0) return

                            lengthCategoryOption.current++;
                            setCategoryArr3(CategoryArr3 => [...CategoryArr3, { state: arrCategory[index], value: result1.data.data }])

                            GetNewDataCategoryWithNameOptionTask(arrCategory[index]);
                            GetNewDataCategoryWithGapOptionTask(result1.data.data.gapAQPercentage);
                            GetNewDataCategoryWithNameOptionTaskAD(arrCategory[index]);
                            GetNewDataCategoryWithGapOptionTaskAD(result1.data.data.gapADPercentage);
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
                    if (prevTaskName.current !== queryTaskName || window.location.hash !== currentHash) {
                        // console.log("You choosed other option", queryTaskName, prevTaskName.current)
                        // controller.abort();
                        break;
                    }

                }
                setQueryOptionDone(true)
                // console.log("end for", queryTaskName)
            }
            if (queryTaskName === "ALL TASK") {
                taskNameFromMenu.current = 'ALL TASK'
                lengthCategoryOption.current = 0;
            }
        }
    }
    const GetSelect = (selected) => {
        setSelect(selected)
    }
    const GetPosition = (positionAgr) => {
        position.current = positionAgr.y;
        // if (position.current < window.innerHeight) {
        //     document.getElementById('button-show-chart').style.display = 'none'
        // }
        // else {
        //     document.getElementById('button-show-chart').style.display = 'block'
        // }
    }
    const GetPositionAD = (positionAgr) => {
        positionAD.current = positionAgr.y;
        // if (positionAD.current < window.innerHeight) {
        //     document.getElementById('button-show-chart').style.display = 'none'
        // }
        // else {
        //     document.getElementById('button-show-chart').style.display = 'block'
        // }
    }
    useEffect(() => {
        // lengthCategoryOption.current = CategoryArr3.length;
    }, [CategoryArr3])
    const ToChart = () => {
        document.documentElement.scrollTo(0, position.current - 100)
    }
    const ToChartAD = () => {
        document.documentElement.scrollTo(0, positionAD.current - 100)
    }
    let arrNew = uniqueArray(CategoryArr2)
    let arrNew1 = uniqueArray(CategoryArr3)
    let arrNew2 = uniqueArray(category)
    return (
        <div className="page-wrapper">
            {/* <Button id='button-show-chart'>
                <AiOutlineBarChart onClick={() => ToChart()} />
            </Button> */}

            <CategoryList taskName={taskName} GetOption={GetOption} GetSelect={GetSelect} />

            {/* <TitleCategoryAnalysis projectId={projectId} /> */}
            <div className="page-body page-category">
                <div className="container-xl">
                    <TableCategoryAnalysis projectId={projectId} lengthCategory={lengthCategory.current} lengthCategoryOption={lengthCategoryOption.current}
                        CategoryArr2={arrNew} CategoryArr3={arrNew1}
                        GetOption={GetOption} select={select} category={arrNew2} taskName={taskName} getAvg={GetAvg} getAvgAD={GetAvgAD} />

                    <ChartCategory queryOptionDone={queryOptionDone} projectId={projectId} taskNameFromMenu={taskNameFromMenu.current} GetPosition={GetPosition} lengthCategory={lengthCategory.current}
                        lengthCategoryOption={lengthCategoryOption.current}
                        dataCategoryWithGapAllTask={dataCategoryWithGapAllTask} dataCategoryWithNameAllTask={dataCategoryWithNameAllTask}
                        dataCategoryWithGapOptionTask={dataCategoryWithGapOptionTask} dataCategoryWithNameOptionTask={dataCategoryWithNameOptionTask}
                        select={select.value} avg={avg} />
                    <ChartCategoryAD queryOptionDone={queryOptionDone} projectId={projectId} taskNameFromMenu={taskNameFromMenu.current} GetPositionAD={GetPositionAD} lengthCategory={lengthCategory.current}
                        lengthCategoryOption={lengthCategoryOption.current}
                        dataCategoryWithGapAllTaskAD={dataCategoryWithGapAllTaskAD} dataCategoryWithNameAllTaskAD={dataCategoryWithNameAllTaskAD}
                        dataCategoryWithGapOptionTaskAD={dataCategoryWithGapOptionTaskAD} dataCategoryWithNameOptionTaskAD={dataCategoryWithNameOptionTaskAD}
                        select={select.value} avgAD={avgAD} />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CategoryAnalysis;