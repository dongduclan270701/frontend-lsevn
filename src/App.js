import { BrowserRouter, Routes, Route, HashRouter, Navigate, useParams } from "react-router-dom";
import { Fragment } from 'react';
import ScrollButton from "Components/ScroolButton/ScrollButton";
import LoginPage from 'Components/Login/loginPage';
import './App.css'
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from 'Components/Header/header';
import Boardbar from 'Components/BoardBar/boardbar';
import Dashboard from 'Components/Dashboard/dashboard';
import ProjectList from 'Components/Project-List/projectList';
import ProjectData from 'Components/Project-Data/projectData';
import ItemAnalysis from 'Components/Item-Analysis/itemAnalysis';
import CategoryAnalysis from 'Components/Category-Analysis/category-analysis';
import UpdateData from 'Components/Update-Data/updateData';
import ImportData from 'Components/Create-New-Data/ImportData';
import axios from 'axios';
import { Auth } from 'Action';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'

import { hostProduction } from 'Action/host'
import { hostDev } from 'Action/host'

const endpoint = `${hostProduction}/graphql`

const App = () => {

  const [projectId, setProjectId] = useState(window.localStorage.getItem('projectNumber') ? window.localStorage.getItem('projectNumber') : '')
  const [getProject, setGetProject] = useState([])
  const [selectMenu, setSelectMenu] = useState(false)
  const [username, setUsername] = useState('')
  const GetUserName = (name) => {
    setUsername(name)
  }
  // const [projectId, setProjectId] = useState("TTTL211A1871")
  const changeSelectMenu = (selectMenu) => {
    setSelectMenu(selectMenu)
  }
  const QUERY_PROJECT_NUMBER_LIST = `{
    projects(pagination:{
      pageSize:1,
      page:1
    },filters:{
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
  }`

  useEffect(() => {
    if (!window.localStorage.getItem('token')) {
      axios({
        url: endpoint,
        method: 'post',
        data: {
          query: QUERY_PROJECT_NUMBER_LIST
        }
        ,
        headers: {
          'Authorization': Auth
        }
      }).then(result => {
        setProjectId(result.data.data.projects.data[0].attributes.PROJECT_NUMBER)
        setGetProject(result.data.data.projects.data)
      })
        .catch(error => {
          if (window.localStorage.getItem('token')) {
            // console.log(error)
            toast.error("SERVER ERROR: " + error.message, {
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
  }, [projectId]);
  const getProjectId = (id) => {
    window.localStorage.setItem('projectNumber', id)
    setProjectId(id)
  }

  return (
    <>
      <Fragment>
        <ScrollButton />
      </Fragment>
      <div className="page">
        <HashRouter hashType='hashbang'>
          <Routes>
            {/* <Route path='/login' element={<LoginPage />} /> */}

            <Route path='/dashboard' element={localStorage.getItem('token') ? <>
              <Header selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} />
              <Boardbar username={username} selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} />
              <Dashboard  GetUserName={GetUserName}/></> : <LoginPage />} />
            <Route path='/' element={localStorage.getItem('token') ? <>
              <Header selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} />
              <Boardbar username={username} selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} />
              <ProjectList GetUserName={GetUserName} getProject={getProject} getProjectId={getProjectId} projectId={projectId} /></> : <LoginPage />} />
            <Route path='/project-data' element={localStorage.getItem('token') ?
              <>
                <Header selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} projectId={projectId} />
                <Boardbar username={username} selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} projectId={projectId} />
                <ProjectData GetUserName={GetUserName} projectId={projectId} />
              </> : <LoginPage />}
            />
            <Route path='/category-analysis' element={localStorage.getItem('token') ?
              <>
                <Header selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} projectId={projectId} />
                <Boardbar username={username} selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} projectId={projectId} />
                <CategoryAnalysis GetUserName={GetUserName} projectId={projectId} />
              </> : <LoginPage />}
            />
            <Route path='/item-analysis' element={localStorage.getItem('token') ?
              <>
                <Header selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} projectId={projectId} />
                <Boardbar username={username} selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} projectId={projectId} />
                <ItemAnalysis GetUserName={GetUserName} projectId={projectId} />
              </> : <LoginPage />}
            />
            <Route path='/import-data' element={localStorage.getItem('token') ? <>
              <Header selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} />
              <Boardbar username={username} selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} />
              <UpdateData GetUserName={GetUserName} projectId={projectId} /></> : <LoginPage />} />
            <Route path='/create-new-data' element={localStorage.getItem('token') ? <>
              <Header selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} />
              <Boardbar username={username} selectMenu={selectMenu} changeSelectMenu={changeSelectMenu} />
              <ImportData GetUserName={GetUserName} /></> : <LoginPage />} />

          </Routes>
        </HashRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div >
    </>
  );
}

export default App;
