import React, { useState } from 'react';
import './login.css'
import { useQuery, gql, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import ModelLoginFailed from './modalLoginFailed'
const LoginPage = () => {
    // if (localStorage.getItem('token')) {
    //     localStorage.removeItem('token');
    // }

    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginFailed, setLoginFailed] = useState(false);
    const queryLogin = gql`
    mutation{
        login(
        input: {
            identifier: "${email}",
            password: "${password}",
            provider: "local"
        }
        ) {
        jwt
        user {
            id
            username
            email
        }   
        }
    }
    `;
    const [loginFunction, { data, loading, error }] = useMutation(queryLogin);
    const handleChangeEmail = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    }
    const handleChangePass = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }
    const submitDataLogin = (e) => {
        if (email === '' || password === '') {e.preventDefault();}
        else {
            e.preventDefault();
            loginFunction()
                .then(result => {
                    window.localStorage.setItem('token', result.data.login.jwt)
                    console.log(result.data.login.jwt)
                    // navigate(`/`);
                    window.location.reload()

                }).catch(error => {
                    setLoginFailed(true)
                    // swal("Error!", "Wrong email or password", "error"); 
                }
                )
        }
    }
    const GetLoginAgain = (value) => {
        setLoginFailed(value)
    }
    return (
        <>
            <div className="container-tight py-4">
                <div className="text-center mb-4">
                    <a href="." className="navbar-brand navbar-brand-autodark"><img src="./static/logo.svg" height="36" alt="" /></a>
                </div>
                <form className="card card-md" action="." method="get" autoComplete="off">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Login to your account</h2>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" placeholder="Enter email" autoComplete="off" onChange={(ev) => handleChangeEmail(ev)} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">
                                Password
                            </label>
                            <div className="input-group input-group-flat">
                                <input type="password" className="form-control" placeholder="Password" autoComplete="off" onChange={(ev) => handleChangePass(ev)} />
                            </div>
                        </div>
                        <div className="form-footer">
                            <button type="submit" className="btn btn-primary w-100" onClick={(e) => submitDataLogin(e)}>Sign in</button>
                        </div>
                    </div>

                </form>
            </div>
            {loginFailed ? <ModelLoginFailed GetLoginAgain={GetLoginAgain} /> : null}
        </>

    );
}

export default LoginPage;
