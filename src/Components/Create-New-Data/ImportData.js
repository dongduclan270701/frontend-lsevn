import Footer from 'Components/Footer/footer';
import React,{useState} from 'react';
import CreateNewData from './createNewData';
import TitleCreateNewData from './titleCreateNewData';

const ImportData = () => {
    const [ chooseQ , setChooseQ] = useState(true)
    const [ chooseA , setChooseA] = useState(false)
    const [ chooseD , setChooseD] = useState(false)
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
            {/* <TitleCreateNewData chooseQ={chooseQ} chooseA={chooseA} chooseD={chooseD} SelectQ={SelectQ} SelectA={SelectA} SelectD={SelectD}/> */}
            <CreateNewData chooseQ={chooseQ} chooseA={chooseA} chooseD={chooseD}/>
            <Footer />
        </div>
    );
}

export default ImportData;
