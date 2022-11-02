import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import ModalSaveDelete from './modelSaveDelete';
import { hostDev } from 'Action/host'
import { hostProduction } from 'Action/host'
import axios from 'axios';
import { Auth } from 'Action';
const endpoint = hostProduction + "/api/project/changeProjectName"
const endpoint2 = hostProduction + "/graphql"

const ProjectDetail2 = (props) => {
    const nf = new Intl.NumberFormat('en-US')
    const { item, RefreshT2, role } = props
    const [selectDelete, setSelectDelete] = useState(false)
    const refOne = useRef(null)
    const getSelectCloseButton = (get) => {
        setSelectDelete(get)
    }
    const DeleteRow = async () => {
        setSelectDelete(true)
    }
    return (
        
        <tr>
            <td><span className="text-muted">{item.attributes.project.data.attributes.PROJECT_NUMBER}</span></td>
            <td style={{borderLeft:"1px solid #ddd5d5"}}><a className="text-reset" tabIndex={-1} style={{ textDecoration: "none" }}>{item.attributes.QUOTATION_NUMBER}</a></td>
            <td style={{borderLeft:"1px solid #ddd5d5"}}>
                {item.attributes.project.data.attributes.PROJECT_NAME}
            </td>
            <td style={{borderLeft:"1px solid #ddd5d5"}}>
                {item.attributes.TASK_NO}
            </td>
            <td style={{borderLeft:"1px solid #ddd5d5"}}>
                {item.attributes.TASK_NAME}
            </td>
            <td style={{borderLeft:"1px solid #ddd5d5"}}>
            {item.attributes.TASK_TYPE}
            </td>
            <td style={{borderLeft:"1px solid #ddd5d5"}}>
                {nf.format(item.attributes.EXCHANGE_RATE)}
            </td>
            <td style={{borderLeft:"1px solid #ddd5d5"}}>
                {item.attributes.PANEL_QTY}
            </td>
            <td style={{borderLeft:"1px solid #ddd5d5",display: role === 'Authenticated' ? 'block' : 'none' }}>
                <button onClick={DeleteRow} className="btn btn-outline-secondary">X</button>
            </td>
            {selectDelete === true && <ModalSaveDelete refOne={refOne} getSelectCloseButton={getSelectCloseButton} item={item} RefreshT2={RefreshT2} />}
        </tr>

    );
}

export default ProjectDetail2;