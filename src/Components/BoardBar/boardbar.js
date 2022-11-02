import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom'
import './boardbar.css'
import axios from 'axios';
// import "Assets/scss/boardbar.scss"
import Logo from "Assets/images/000m.jpg"
import { hostProduction } from 'Action/host'
import { hostDev } from 'Action/host'

const endpoint = `${hostProduction}`
const Boardbar = (props) => {
    let navigate = useNavigate();
    const refOne = useRef(null)
    const refOne1 = useRef(null)
    const { selectMenu, username } = props;
    const [selectLogout, setSelectLogout] = useState(false)
    const { changeSelectMenu } = props
    const [width, setWidth] = useState(window.innerWidth)
    const SelectLogout = () => {
        setSelectLogout(!selectLogout)
    }
    const handler = (event) => {
        if (refOne.current && refOne.current.contains(event.target)) {
            // event.preventDefault()
            return
        } else {
            // setChangeName(false)
            setSelectLogout(false)
        }
        // if (refOne1.current && refOne1.current.contains(event.target)) {
        //     // event.preventDefault()
        // } else {
        //     // setChangeName(false)
        //     changeSelectMenu(!selectMenu)
        // }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, []);

    const SetMenu = () => {
        changeSelectMenu(!selectMenu)
    }
    // window.onresize(() => width = window.innerWidth);
    window.addEventListener('orientationchange', () => {
        setWidth(window.innerWidth);
    })
    window.addEventListener('resize', () => {
        setWidth(window.innerWidth);
    })
    const Logout = () => {
        localStorage.removeItem('token');
        // navigate('/');
        window.location.assign(window.location.origin);
        
    }
    useEffect(() => {
        if (window.innerWidth <= 767) {
            if (selectMenu === true) {
                document.getElementById('right-content').style.display = 'none';
                document.getElementById('board-bar').style.display = 'block';
                document.getElementById('board-bar').style.position = 'fixed';
                document.getElementById('board-bar').style.top = '50px';
                document.getElementById('board-bar').style.zIndex = '99';
                document.getElementById('list-board-bar').style.display = 'block';
            } else if (selectMenu === false) {
                document.getElementById('board-bar').style.display = 'none';
            }
        }
        else {
            document.getElementById('board-bar').style.top = '0px';
            document.getElementById('right-content').style.display = 'flex';
            document.getElementById('list-board-bar').style.display = 'flex';
            document.getElementById('board-bar').style.display = 'flex';
        }
    }, [width, selectMenu]);
    return (
        <div ref={refOne1} className="navbar-expand-md board-bar" id='board-bar'>
            <div className={selectMenu === true ? "collapse navbar-collapse show" : "collapse navbar-collapse"} style={{ width: "100%" }} id="navbar-menu">
                <div className="navbar navbar-light" style={{ width: "100%" }}>
                    <div className="container-xl board-bar-mobile menu-boardbar-mobile">
                        <ul className="navbar-nav" id="list-board-bar"> 
                            <li className="nav-link nav-item" activeclassname="active">
                                <NavLink className='nav-link1' style={{ textDecoration: "none" }} true="true" to="/dashboard" onClick={SetMenu}>
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="5 12 3 12 12 3 21 12 19 12" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>
                                    </span>
                                    <span className="nav-link-title">Dashboard</span>
                                </NavLink>
                            </li>
                            <li className="nav-link nav-item" activeclassname="active" >
                                <NavLink className='nav-link1' style={{ textDecoration: "none" }} true="true" to="/" onClick={SetMenu}>
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-report-analytics" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><rect x={9} y={3} width={6} height={4} rx={2} /><path d="M9 17v-5" /><path d="M12 17v-1" /><path d="M15 17v-3" />
                                        </svg>
                                    </span>
                                    <span className="nav-link-title">Project List</span>
                                </NavLink>
                            </li>
                            <li className="nav-link nav-item" activeclassname="active" >
                                <NavLink className="nav-link1" style={{ textDecoration: "none" }} true="true" to={"/project-data"} onClick={SetMenu}>
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">{/* Download SVG icon from http://tabler-icons.io/i/package */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" /><line x1={12} y1={12} x2={20} y2="7.5" /><line x1={12} y1={12} x2={12} y2={21} /><line x1={12} y1={12} x2={4} y2="7.5" /><line x1={16} y1="5.25" x2={8} y2="9.75" /></svg>
                                    </span>
                                    <span className="nav-link-title">Project Data</span>
                                </NavLink>
                            </li>
                            <li className="nav-link nav-item" activeclassname="active">
                                <NavLink style={{ textDecoration: "none" }} true="true" to={"/category-analysis"} className=" nav-link1" onClick={SetMenu}>
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">{/* Download SVG icon from http://tabler-icons.io/i/checkbox */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-category" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 4h6v6h-6z"></path><path d="M14 4h6v6h-6z"></path><path d="M4 14h6v6h-6z"></path><circle cx="17" cy="17" r="3"></circle>
                                        </svg>
                                    </span>
                                    <span className="nav-link-title">Category Analysis</span>
                                </NavLink>
                            </li>
                            <li className="nav-link nav-item" activeclassname="active">
                             {/* data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false"> */}
                                <NavLink style={{ textDecoration: "none" }} true="true" to={"/item-analysis"} className="nav-link1" onClick={SetMenu}>
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">{/* Download SVG icon from http://tabler-icons.io/i/star */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                                    </span>
                                    <span className="nav-link-title">Item Analysis</span>
                                </NavLink>
                            </li>
                        </ul>

                        <div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last button-logout">
                            <ul className="navbar-nav" id='right-content' style={{ cursor: 'pointer' }}>
                                <div ref={refOne} className="nav-item dropdown" onClick={SelectLogout}>
                                    <a className={selectLogout === true ? "nav-link d-flex lh-1 text-reset p-0 show" : "nav-link d-flex lh-1 text-reset p-0"} data-bs-toggle="dropdown" aria-label="Open user menu" aria-expanded={selectLogout === true ? "true" : "false"}>
                                        <span className="avatar avatar-sm button-username" >
                                            {username.substr(0,2)}
                                        </span>
                                    </a>
                                    <div className={selectLogout === true ? "dropdown-menu dropdown-menu-end dropdown-menu-arrow show" : "dropdown-menu dropdown-menu-end dropdown-menu-arrow "} data-bs-popper={selectLogout === true ? `"static"` : ``}>
                                        {/* <a className="dropdown-item">Logout</a> */}
                                        <span onClick={Logout} id='link-logout' className="dropdown-item nav-link-title" style={{ textDecoration: "none", color: "black" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                                                <path d="M7 12h14l-3 -3m0 6l3 -3"></path>
                                            </svg>
                                            <span className="nav-link-title">Logout</span>
                                        </span>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default Boardbar;
