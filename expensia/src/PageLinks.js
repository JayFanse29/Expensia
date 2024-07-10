import React, { useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LandingPage from './Components/LandingPage/LandingPage'
import Dashboard from './Components/Dashboard/Dashboard';
import Invitation from './Components/Invitation/Invitation';

function PageLinks() {

    const token = localStorage.getItem('token');
    const [login,setLogin] = useState(sessionStorage.getItem('login'));
    const [userId,setUserId] = useState('');

  return (
    <>
    <Router>
        <Routes>
            console.log(token)
            {token || login ? 
                <Route path='/' element={<Dashboard setLogin={setLogin} userId={userId} login={token ? token : login}/>} />
            :
                <Route path='/' element={<LandingPage setLogin={setLogin} setUserId={setUserId}/>} />
            }

                <Route path='/invitation' element={<Invitation />}/>
            </Routes>
    </Router>
    </>
    )
}

export default PageLinks