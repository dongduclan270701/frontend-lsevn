import { Auth } from 'Action';
import axios from 'axios';
import Footer from 'Components/Footer/footer';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
// import TableItemAnalysis2 from './tableItemAnalysis2';
import TableItemAnalysis from './tableItemAnalysis';
// import TitleItemAnalysis from './titleItemAnalysis';
import { hostProduction } from 'Action/host';
import { hostDev } from 'Action/host'
const endpointapi = `${hostProduction}`
const endpoint = `${hostProduction}/api/project/distinctCategoryByProject`
const endpoint_3 = `${hostProduction}/api/project/distinctTaskNameByProject`
const endpoint_4 = `${hostProduction}/graphql`
// const endpoint = "http://localhost:1337/api/project/distinctCategoryByProject"
// const endpoint_2 = "http://localhost:1337/api/category/categoryByProject"
// const endpoint_3 = "http://localhost:1337/api/project/distinctTaskNameByProject"
// const endpoint_4 = "http://localhost:1337/graphql"
const ItemAnalysis = (props) => {
  const {GetUserName} = props;

  let navigate = useNavigate();
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
  // const [category, setCategory] = useState([])
  const [taskName, setTaskName] = useState([])
  const [arrCategory, setArrCategory] = useState([])
  const [arrQuotations, setArrQuotations] = useState([])
  const [arrActuals, setArrActuals] = useState([])
  const [arrDesigns, setArrDesigns] = useState([])
  const  projectId  = window.localStorage.getItem('projectNumber') ? window.localStorage.getItem('projectNumber') : ''
  const [optionCategory, setOptionCategory] = useState("")
  const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
  useEffect(() => {
    GetCurrentUser();
    //check neu co location thi bo qua buoc nay
    const fetchData = async () => {
      await axios({
        url: endpoint,
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
        // setArrCategory(result.data.data)
        for (let index = 0; index < result.data.data.length; index++) {
          setArrCategory(arrCategory => [...arrCategory, { value: result.data.data[index], label: result.data.data[index] }])
        }
        setOptionCategory(result.data.data[0])
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
          setTaskName(taskName => [...taskName, { value: result.data.data[index], label: result.data.data[index] }])
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
  }, []);


  const getOptionCategory = async (option) => {
    setOptionCategory(option.CATEGORY)
    const FIND_DATA_QUERY_QUOTATION = `{
      quotations(
        pagination: { pageSize: 1000 }
        filters: {
          project: { PROJECT_NUMBER: { eq: "${projectId}" } }
          CATEGORY: { eq: "${option.CATEGORY}" }
          # TASK_NAME: { eq: "MCSG 24kV" }
        }
      ) {
        data {
          attributes {
            TASK_NAME
            ITEM_CODE
            ITEM_NAME
            DESCRIPTION
            UNIT
            QTY
            UNIT_PRICE_USD
            TOTAL_AMOUNT_USD
          }
        }
        meta {
          pagination {
            total
          }
        }
      }
    }`
  const FIND_DATA_QUERY_ACTUALS = `{
  
    actuals(
      pagination: { pageSize: 1000 }
      filters: {
        project: { PROJECT_NUMBER: { eq: "${projectId}" } }
        CATEGORY: { eq: "${option.CATEGORY}" }
        # TASK_NAME: { eq: "MCSG 24kV" }
      }
    ) {
      data {
        attributes {
          TASK_NAME
          ITEM_CODE
          ITEM_NAME
          DESCRIPTION
          UNIT
          QTY
          UNIT_PRICE_USD
          TOTAL_AMOUNT_USD
        }
      }
      meta {
        pagination {
          total
        }
      }
    }
  }
  `
  const FIND_DATA_QUERY_DESIGNS = `{
    designs(
      pagination: { pageSize: 1000 }
      filters: {
        project: { PROJECT_NUMBER: { eq: "${projectId}" } }
        CATEGORY: { eq: "${option.CATEGORY}" }
        # TASK_NAME: { eq: "MCSG 24kV" }
      }
    ) {
      data {
        attributes {
          TASK_NAME
          ITEM_CODE
          ITEM_NAME
          DESCRIPTION
          UNIT
          QTY
          UNIT_PRICE_USD
          TOTAL_AMOUNT_USD
        }
      }
      meta {
        pagination {
          total
        }
      }
    }
  }
  `
  console.log(1)
  if (option.CATEGORY && option.CATEGORY !== "") {
    console.log(option.CATEGORY)
        await axios({
          url: endpoint_4,
          method: 'post',
          data: {
            query: FIND_DATA_QUERY_QUOTATION
          }
          ,
          headers: {
            'Authorization': Auth
          }
        }).then(result => {
          setArrQuotations(result.data.data.quotations.data)
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
          url: endpoint_4,
          method: 'post',
          data: {
            query: FIND_DATA_QUERY_ACTUALS
          }
          ,
          headers: {
            'Authorization': Auth
          }
        }).then(result => {
          setArrActuals(result.data.data.actuals.data)
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
          url: endpoint_4,
          method: 'post',
          data: {
            query: FIND_DATA_QUERY_DESIGNS
          }
          ,
          headers: {
            'Authorization': Auth
          }
        }).then(result => {
          setArrDesigns(result.data.data.designs.data)
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

  const [chooseQD, setChooseQD] = useState(true)
  const [chooseQA, setChooseQA] = useState(false)
  const [chooseDA, setChooseDA] = useState(false)
  const ChooseQD = (select) => {
    setChooseQD(select)
    setChooseQA(!select)
    setChooseDA(!select)
  }
  const ChooseQA = (select) => {
    setChooseQD(!select)
    setChooseQA(select)
    setChooseDA(!select)
  }
  const ChooseDA = (select) => {
    setChooseQD(!select)
    setChooseQA(!select)
    setChooseDA(select)
  }
  
  const newArrCate = uniqueArray(arrCategory)
  const newArrTask = uniqueArray(taskName)
  return (
    <div className="page-wrapper">

      {/* <TitleItemAnalysis chooseQD={chooseQD} chooseQA={chooseQA} chooseDA={chooseDA} ChooseQD={ChooseQD} ChooseQA={ChooseQA} ChooseDA={ChooseDA} projectId={projectId} /> */}
      {/* <TableItemAnalysis2 projectId={projectId} newArrCate={newArrCate} newArrTask={newArrTask} QtyGap={QtyGap} AmountGap={AmountGap}/> */}
      <TableItemAnalysis
        ChooseQD={ChooseQD}
        ChooseQA={ChooseQA}
        ChooseDA={ChooseDA}
        chooseQD={chooseQD}
        chooseQA={chooseQA}
        chooseDA={chooseDA}
        projectId={projectId}
        arrQuotations={arrQuotations}
        arrActuals={arrActuals}
        arrDesigns={arrDesigns}
        newArrCate={newArrCate}
        getOptionCategory={getOptionCategory}
        optionCategory={optionCategory}
      />
      <Footer />
    </div>
  );
}

export default ItemAnalysis;