import React, { useState } from 'react'
import "./LoginWindow.css"
const validator = require('validator');

function LoginWindow(props) {
    const [signUpVisible, setSignupVisible] = useState(false);
    const [fname,setFname] = useState("");
    const [lname,setLname] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confPassword,setConfPassword] = useState("");
    const [loginPassword,setLoginPassword] = useState("");
    const [loginEmail,setLoginEmail] = useState("");
    const [rememberMe,setRememberMe] = useState(false);

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    }

    const loginEmailChangeListener = (event) => {
        setLoginEmail(event.target.value);
    }
    const loginPasswordChangeListener = (event) => {
        setLoginPassword(event.target.value);
    }

    const fnameChangeListener = (event) => {
        setFname(event.target.value);
    }
    const lnameChangeListener = (event) => {
        setLname(event.target.value);
    }
    const emailChangeListener = (event) => {
        setEmail(event.target.value);
    }
    const passwordChangeListener = (event) => {
        setPassword(event.target.value);
    }
    const confPasswordChangeListener = (event) => {
        setConfPassword(event.target.value);
    }

    const closelogin = () => {
        props.setLoginVisible(false);
    }

    const showSignUp = () => {
        setSignupVisible(true);
    }

    const hideSignUp = () => {
        setSignupVisible(false);
    }

    const processLogin = (event) => {
        event.preventDefault();
        if(!validator.isEmail(loginEmail))
        {
            alert("Invalid email address!");
        }
        else if(loginPassword.length<8)
        {
            alert("Password must be atleast 8 characters long");
        }
        else
        {
            const loginData = {
                email: loginEmail,
                password: loginPassword
            }

            checkLogin(loginData);
        }


    }

    const checkLogin = async (loginData) => {
        const response = await fetch('http://localhost:5000/expensia/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        if(data.exists)
        {
            sessionStorage.setItem("login",data.token);
            props.setUserId(data.user._id);
            console.log(data.user);
            console.log(data.token);
            if(rememberMe)
            {
                localStorage.setItem('token',data.token);
            }
            props.setLogin(data.token);
        }
        else
        {
            alert(data.message);
        }
    }

    const processSignup = (event) => {

        event.preventDefault();
        if(password===confPassword)
        {
            if(password.length<8)
            {
                alert("Password must be atleast 8 characters long");
            }
            else if(validator.isEmail(email))
            {
                const userData = {
                    fname: fname,
                    lname: lname,
                    email: email,
                    password: password
                }
                createUser(userData);
            }
            else
            {
                alert("Invalid email address!");
            }
        }
        else
        {
            alert("password and confirm password don't match");
        }

    }

    const createUser = async (userData) => {
        try{
            const response = await fetch('http://localhost:5000/expensia/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            console.log(data);
            if(data.executed)
            {
                props.setUserId(data.user._id);
                sessionStorage.setItem("login",data.token);
                console.log(data.user);
                props.setLogin(data.token);

            }
            else
            {
                alert(data.message);
            }

            
        }
        catch(err){
            console.log('Create user : ',err);
        }
    }

    return (
        <>
            {signUpVisible === false ?
                /* Login */
                <>
                    <div className='LoginContainer'>
                        <div className='LoginPanel'>
                            <div className='LoginClose' onClick={closelogin} />
                            
                            <div className='LoginRight'>
                                <div className='LoginHeader'>Login to Expensia</div>
                                <form>
                                    <div className='InputSet'>
                                        <div className='LoginFieldName'>Email Address </div>
                                        <input type='text' className='LoginFieldInput' id='login_mail' required value={loginEmail} onChange={loginEmailChangeListener}/>
                                    </div>
                                    <div className='InputSet'>
                                        <div className='LoginFieldName'>Password </div>
                                        <input type='password' className='LoginFieldInput' id='login_pass' required value={loginPassword} onChange={loginPasswordChangeListener}/>
                                    </div>
                                    <div className='RememberMe'>
                                        <input type='checkbox' id='login_remember_me' checked={rememberMe} onClick={toggleRememberMe}/>
                                        <label for='login_remember_me'>Remember me</label>
                                    </div>
                                    <button type='submit' className='LoginFormButton' onClick={processLogin}>Login</button>
                                </form>
                                <div className="LoginSeparator">
                                    <p id="or">or</p>
                                </div>
                                <button className='LoginSignUpButton' onClick={showSignUp}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                </>
                :
                /* SignUp */
                <>
                    <div className='LoginContainer'>
                        <div className='LoginPanel'>
                            <div className='LoginClose' onClick={closelogin}></div>
                            <div className='LoginLeft'>

                            </div>
                            <div className='LoginRight'>
                            <div className='SignUpBack' onClick={hideSignUp}></div>

                            <div className='LoginHeader'>SignUp to Expensia</div>
                            <form onSubmit={processSignup}>
                                <div className='SignUpNameGrid'>
                                    <div className='InputSet'>
                                        <div className='LoginFieldName'>First Name </div>
                                        <input type='text' className='LoginFieldInput' id='fname' required value={fname} onChange={fnameChangeListener}/>
                                    </div>
                                    <div className='InputSet'>
                                        <div className='LoginFieldName'>Last Name </div>
                                        <input type='text' className='LoginFieldInput' id='lname' required value={lname} onChange={lnameChangeListener}/>
                                    </div>
                                </div>
                                <div className='InputSet'>
                                    <div className='LoginFieldName'>Email Address </div>
                                    <input type='text' className='LoginFieldInput' id='signup_mail' required value={email} onChange={emailChangeListener}/>
                                </div>
                                <div className='InputSet'>
                                    <div className='LoginFieldName'>Password </div>
                                    <input type='password' className='LoginFieldInput' id='signup_pass' required value={password} onChange={passwordChangeListener}/>
                                </div>
                                <div className='InputSet'>
                                    <div className='LoginFieldName'>Confirm Password </div>
                                    <input type='password' className='LoginFieldInput' id='conf_pass' required value={confPassword} onChange={confPasswordChangeListener}/>
                                </div>
                                <button type='submit' className='LoginSignUpButton' id='signUpBtn'>Sign Up</button>
                            </form>
                            
                        </div>
                    </div>
                    </div>
                </>
            }
        </>
    )
}

export default LoginWindow