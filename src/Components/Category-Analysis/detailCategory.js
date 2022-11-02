import React from 'react';
import { useNavigate } from 'react-router-dom';
import './category-analysis.css'
const DetailCategory = (props) => {
    const navigate = useNavigate()
    const {taskName} = props;
    const { item, index } = props
    const ClickTr = (table) => {
        navigate("/item-analysis", { state: { category: item.state, table: table, taskName: taskName } });
    }
    const ShowButtonToItem = (index) => {
        document.getElementsByClassName('buttonToAQItem')[index].style.display = 'inline'
        document.getElementsByClassName('buttonToADItem')[index].style.display = 'inline'
    }
    const HiddenButtonToItem = (index) => {
        document.getElementsByClassName('buttonToAQItem')[index].style.display = 'none'
        document.getElementsByClassName('buttonToADItem')[index].style.display = 'none'
    }
    const nf = new Intl.NumberFormat('en-US')
    return (
        <tr className='row-category-table1' onClick={() => ShowButtonToItem(index)} onMouseOver={() => ShowButtonToItem(index)} onMouseOut={() => HiddenButtonToItem(index)}>
            <td>{index + 1}</td>
            <td style={{borderLeft:"1px solid #ddd5d5"}}>{item.state}</td>
            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                {nf.format(Math.round(item.value.designs))}
            </td>
            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">{nf.format(Math.round(item.value.quotations))}</td>
            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                {nf.format(Math.round(item.value.actuals))}
            </td>
            <td style={{borderLeft:"1px solid #ddd5d5", position: 'relative'}}>

                {nf.format(Math.round(item.value.gapAQ))}
                <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>ClickTr('AQ')} className="icon icon-tabler icon-tabler-list-details buttonToAQItem" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M13 5h8"></path>
                    <path d="M13 9h5"></path>
                    <path d="M13 15h8"></path>
                    <path d="M13 19h5"></path>
                    <rect x="3" y="4" width="6" height="6" rx="1"></rect>
                    <rect x="3" y="14" width="6" height="6" rx="1"></rect>
                </svg>
            </td>
            <td style={{color:Math.round(item.value.gapAQPercentage) <= -10 && "red" || Math.round(item.value.gapAQPercentage) >= 10 && "red"}}>{nf.format(Math.round(item.value.gapAQPercentage))}%</td>
            <td style={{borderLeft:"1px solid #ddd5d5", position: 'relative'}}>

                {nf.format(Math.round(item.value.gapAD))}
                <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>ClickTr('AD')} className="icon icon-tabler icon-tabler-list-details buttonToADItem" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M13 5h8"></path>
                    <path d="M13 9h5"></path>
                    <path d="M13 15h8"></path>
                    <path d="M13 19h5"></path>
                    <rect x="3" y="4" width="6" height="6" rx="1"></rect>
                    <rect x="3" y="14" width="6" height="6" rx="1"></rect>
                </svg>
            </td>
            <td style={{color:Math.round(item.value.gapADPercentage) <= -10 && "red" || Math.round(item.value.gapADPercentage) >= 10 && "red"}}>{nf.format(Math.round(item.value.gapADPercentage))}%</td>
        </tr>
    );
}

export default DetailCategory;