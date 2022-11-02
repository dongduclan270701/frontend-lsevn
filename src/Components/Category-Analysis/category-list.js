import React, { useState, useEffect, useRef } from 'react';
import "Assets/scss/1.scss"
import './category-analysis.css'
const CategoryList = (props) => {
    const refOne = useRef(null)
    var { taskName } = props;
    var { GetOption } = props;
    const length = taskName.length;
    var { GetSelect } = props;
    const tasknameFromSelect = useRef('ALL TASK');
    const [isShow, setIsShow] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    
    const ChangeColorClicked = (index) => {
        for (let i = 0; i <= length; i++) {
            document.getElementsByClassName('row-task-name')[i].style.backgroundColor = 'white';
        }
        document.getElementsByClassName('row-task-name')[index].style.backgroundColor = 'rgb(242 243 244)';
    }

    const ClickRow = (item, index) => {
        //nhận task name đưa lên category analysis
        GetOption(item);
        GetSelect(item);
        ChangeColorClicked(index);
    }
    const GetTaskName = (name) => {
        tasknameFromSelect.current = name;
    }
    window.addEventListener('resize' , () => {
        setWidth(window.innerWidth)
    })
    window.addEventListener('orientationchange', () => {
        setWidth(window.innerWidth)
    })
    window.addEventListener('load' , () => {
        setWidth(window.innerWidth)
    })
    const ChangeStatusOfLeftMenu = () => {
        setIsShow(!isShow)
        if (isShow) {
            document.getElementById('button-show-left-menu').style.display = 'none';
            document.getElementById('left-category-list').style.display = 'inline-block';
        } else {
            document.getElementById('button-show-left-menu').style.display = 'block';
            document.getElementById('left-category-list').style.display = 'none';
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, []);
    const handler = (event) => {
        if (refOne.current && !refOne.current.contains(event.target)) {
            document.getElementById('button-show-left-menu').style.display = 'block';
            document.getElementById('left-category-list').style.display = 'none';
            setIsShow(!isShow)
            return
        } else {
            // setChangeName(false)
            setIsShow(false)
        }
    }
    return (
        <>
        <button className='button-show-left-menu' id='button-show-left-menu' onClick={ChangeStatusOfLeftMenu}>
        {tasknameFromSelect.current}
        </button>
        <div ref={refOne} className='left-category-list' id='left-category-list' onClick={window.innerWidth < 1200 ? ChangeStatusOfLeftMenu : null}>
            <div className="table-responsive">
                <table className="table table-vcenter card-table">
                    <thead>
                        <tr>
                            <th>Task name</th>
                        </tr>
                    </thead>
                    <tbody className='body-to-scroll' id='body-to-scroll'>
                        <tr >
                            <td className='row-task-name' style={{backgroundColor: 'rgb(242 243 244)'}} onClick={() => {ChangeStatusOfLeftMenu();ClickRow({ value: 'ALL TASK', label: 'ALL TASK' }, 0);;GetTaskName('ALL TASK') }}>ALL TASK</td>
                        </tr>
                        {taskName.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className='row-task-name' onClick={() => {ChangeStatusOfLeftMenu();ClickRow(item, index + 1);GetTaskName(item.value) }}>{item.value}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        </>
    );
}

export default CategoryList;
