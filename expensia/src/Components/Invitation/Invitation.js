import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import "./Invitation.css"

function Invitation() {
  
  const location = useLocation();
  const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [groupName,setGroupName] = useState("");
    const [exec,setExec] = useState(false);
    const [message,setMessage] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const groupName = queryParams.get('groupName');
        setToken(token);
        setGroupName(groupName);
    }, [location]);

    const acceptInvitation = async () => {

        const response = await fetch('http://localhost:5000/expensia/invite/accept', {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        setMessage(data.message);
        setExec(data.exec);

        if(!data.exec)
        {
          alert(data.message);
        }
    }

    const navigateDashboard = () => {
      navigate('/');
    }

  return (
    <>
    <div className='Invitation'>
      <div className='InvitationBGLayer'>
        {
          exec ? 
          <>
          <h1>{message}</h1>
          <button id='navigateToDashboard' onClick={navigateDashboard}>Go back to Dashboard</button>
          </>
          :
          <>
          <h1>You've been invited to join {groupName}</h1>
          <button id='acceptInvite' onClick={acceptInvitation}>Accept Invitation</button>
          </>
        }
      </div>
    </div>
    </>
  )
}

export default Invitation