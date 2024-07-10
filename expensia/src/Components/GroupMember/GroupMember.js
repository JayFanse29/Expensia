import React, { useEffect, useState } from 'react'
import './GroupMember.css'

function GroupMember(props) {
    const [memberName,setMemberName] = useState("");
  
    useEffect(() => {
        if(props.memberId)
        {
            const fetchMemberName = async () => {
                const response = await fetch(`http://localhost:5000/expensia/users/name?userId=${props.memberId}`);
        
                const data = await response.json();
                setMemberName(data.name);
            }
        
            fetchMemberName();
        }

    },[props.memberId]);

    return (
        <div className='GroupMemberBox'>
            <div className='GroupMemberName'>{memberName}</div>

            {
                props.amount===0
                ?
                <div className='GroupMemberStatus'>settled up</div>
                :
                    props.amount<0
                    ?
                    <>
                    <div className='GroupMemberStatus'
                    style={{color : 'red'}}
                    >owes ₹{-props.amount.toFixed(2)}</div>
                    </>
                    :
                    <div className='GroupMemberStatus'
                    style={{color : 'green'}}
                    >lends ₹{props.amount.toFixed(2)}</div>
            }
        </div>
    )
}

export default GroupMember