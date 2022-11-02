import React, { useState, useRef, useEffect } from 'react';
// import "Assets/scss/header.scss"
import './header.css'
import Logo from "Assets/images/000m.jpg"
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { hostProduction } from 'Action/host'
import { hostDev } from 'Action/host'
const endpoint = `${hostProduction}`
const Header = (props) => {
    let navigate = useNavigate();
    const { selectMenu, changeSelectMenu, projectId } = props
    const refOne = useRef(null)
    const [username, setUsername] = useState('');
    const GET_CURRENT_USER = `
    query{
        me{
          username
          email
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
                setUsername(result.data.data.me.username.substr(0, 2))
            })
            .catch(error => {
                navigate('/');
            })
    }
    const SetMenu = () => {
        changeSelectMenu(!selectMenu)
    }
    const [selectLogout, setSelectLogout] = useState(false)
    const SelectLogout = () => {
        setSelectLogout(!selectLogout)
    }
    const handler = (event) => {
        if (refOne.current && refOne.current.contains(event.target)) {
            return
        } else {
            setSelectLogout(false)
        }
    }
     useEffect(() => {
        
        // GetCurrentUser()
        document.addEventListener("mousedown", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, []);
    return (
        <header className="navbar navbar-expand-md navbar-light d-print-none header">
            <div className="container-xl">
                <button className="navbar-toggler collapsed" onClick={SetMenu} data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-expanded={selectMenu}>
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
                            <ul className="navbar-nav" id='right-content' style={{ cursor: 'pointer' }}>
                                <div ref={refOne} className="nav-item dropdown" onClick={SelectLogout}>
                                    {/* <a className={selectLogout === true ? "nav-link d-flex lh-1 text-reset p-0 show" : "nav-link d-flex lh-1 text-reset p-0"} data-bs-toggle="dropdown" aria-label="Open user menu" aria-expanded={selectLogout === true ? "true" : "false"}>
                                        <span className="avatar avatar-sm button-username" >
                                            {username}
                                        </span>
                                    </a> */}
                                    {/* <div className={selectLogout === true ? "dropdown-menu dropdown-menu-end dropdown-menu-arrow show" : "dropdown-menu dropdown-menu-end dropdown-menu-arrow "} data-bs-popper={selectLogout === true ? `"static"` : ``}>
                                        <Link to='/' className="dropdown-item nav-link-title" style={{ textDecoration: "none", color: "black" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                                                <path d="M7 12h14l-3 -3m0 6l3 -3"></path>
                                            </svg>
                                            <span className="nav-link-title">Logoutasa</span>
                                        </Link>
                                    </div> */}
                                </div>
                            </ul>
                        </div>
            </div>
        </header>
    );
}

export default Header;
