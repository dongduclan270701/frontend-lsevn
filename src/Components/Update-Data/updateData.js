import Footer from 'Components/Footer/footer';
import React,{useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImportUpdateData from './importUpdateData';
import TitleUpdateData from './titleUpdateData';
import { hostProduction } from 'Action/host'
import { hostDev } from 'Action/host'
import axios from 'axios';

const endpoint = `${hostProduction}`

const UpdateData = (props) => {
    const { GetUserName } = props;

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
            url: endpoint + "/graphql",
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
                if(result.data.data.me.role.name === 'Authenticated'){
                }else{
                    navigate('/')
                }
                // console.log(result)
            })
            .catch(error => {
                navigate('/');
                // console.log(error)
            })
    }
    const location = useLocation()
    const [chooseA, setChooseA] = useState(true)
    const [chooseD, setChooseD] = useState(false)
    const [chooseQ, setChooseQ] = useState(false)
    const [projectId, setProjectId] = useState()
    const [projectNumber, setProjectNumber] = useState()
    const [isImporting, setIsImporting] = useState(false)
    const [shouldReload, setShouldReload] = useState(false)
    const GetIsImporting = (isCheck) =>{
        setIsImporting(isCheck)
    }
    const GetShouldReload = (isCheck, table) =>{
        setShouldReload(isCheck)
    }
   
    useEffect(() => {
        if(location.state){
            setProjectId(location.state.item.id)
            setProjectNumber(location.state.item.attributes.PROJECT_NUMBER)
        }else{
            navigate('/')
        }
    }, [location.state]);
    useEffect(() => {
        GetCurrentUser()
    }, [])
    const SelectQ = (select) => {
        setChooseQ(select)
        setChooseA(!select)
        setChooseD(!select)
    }
    const SelectA = (select) => {
        setChooseQ(!select)
        setChooseA(select)
        setChooseD(!select)
    }
    const SelectD = (select) => {
        setChooseQ(!select)
        setChooseA(!select)
        setChooseD(select)
    }
    
    return (
        <div className="page-wrapper">
            <TitleUpdateData shouldReload={shouldReload} isImporting={isImporting} chooseQ={chooseQ} chooseA={chooseA} chooseD={chooseD} SelectQ={SelectQ} SelectA={SelectA} SelectD={SelectD}/>
            <ImportUpdateData GetShouldReload={GetShouldReload} isImporting={isImporting} GetIsImporting={GetIsImporting} projectId={projectId} projectNumber={projectNumber} chooseQ={chooseQ} chooseA={chooseA} chooseD={chooseD}/>
            <Footer />
        </div>
    );
}

export default UpdateData;
