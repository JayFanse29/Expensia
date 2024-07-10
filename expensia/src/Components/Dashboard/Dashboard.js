import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css"
import GroupListItem from '../ListItem/GroupListItem';
import GroupDisplay from '../GroupDisplay/GroupDisplay';
import useUser from '../../useUser/useUser';

function Dashboard(props) {

    const navigate = useNavigate();
    const {user,loading} = useUser(props.login);

    const [groupsAdd,setGroupsAdd] = useState(false);
    const [createGroupOption,setCreateGroupOption] = useState(false);
    const [display,setDisplay] = useState(0);
    const [newGroupName,setNewGroupName] = useState("");
    const [groupList,setGroupList] = useState([]);
    const [displayGroup,setDisplayGroup] = useState("");

    useEffect(() => {
        if(user){
            setGroupList(user.groups);
        }
    },[user])
    
    const toggleGroupsAdd = () => { setGroupsAdd(!groupsAdd); }
    const showCreateGroup = () => { setCreateGroupOption(true); }
    const hideCreateGroup = () => { setCreateGroupOption(false); }
    const createGroup = async () => {

        const newGroup = {
            name: newGroupName,
            owner: user._id,
            members: [user._id]
        }

        const response = await fetch("http://localhost:5000/expensia/groups/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newGroup)
        });

        const group = await response.json();
        if(group.created)
        {
            groupList.push(group.data._id);
        }
        else
        {
            alert("Not created");
        }

        setNewGroupName("");
        hideCreateGroup();
    }

    const deleteGroup = async (delGroupId) => {

        const response = await fetch(`http://localhost:5000/expensia/groups/delete?groupId=${delGroupId}`);

        const data = await response.json();
        
        setGroupList(groupList.filter(groupId => groupId !== delGroupId));
        alert(data.message);
        setDisplay(0);
    }

    const newGroupNameChangeListener = (event) => {
        setNewGroupName(event.target.value);
    }

    const logout = (e) => {
        sessionStorage.removeItem("login");
        localStorage.removeItem("token");
        
        navigate('/');
        window.location.reload();
    }

    if(loading)
        return <p>Loading...</p>


  return (
    <>
    <div className='DashboardContainer'>
    <div className='DashboardNavBar'>
        <div className='DashboardNavBarLayer'>
        <div className='DashboardNavBarLeftChild'>
            <li id="DashboardLogo">Expensia</li>
        </div>
        <div className='DashboardNavBarRightChild'>
            <li id='DashboardProfile'></li>
            <li id='DashboardUsername'>{user.fname} {user.lname}</li>
            <li id='logout' onClick={logout}></li>
        </div>
        </div>
    </div>
    <div className='DashboardMainContainer'>
    <div className='DashboardLeftPanelContainer'>
    <div className='DashboardLeftPanel'>

        <div className='PanelTitle' onMouseEnter={toggleGroupsAdd} onMouseLeave={toggleGroupsAdd}>
            <div className='PanelTitleLeftComponent'>
            Groups
            </div>
            <button onClick={showCreateGroup}
            id='createGroupBtn' style={groupsAdd ? {display : 'flex'} : {display : 'none'}}>
                
            </button>
        </div>
        <div className='PanelCreateGroup' style={createGroupOption ? {display : 'grid'} : {display : 'none'}}>
            <input type='text' id='newGroup' placeholder="Group Name" value={newGroupName} onChange={newGroupNameChangeListener}/>
            <button id='createGroup' onClick={createGroup}></button>
            <button id='cancelGroup' onClick={hideCreateGroup}></button>
        </div>
        <div className='PanelList'>

            {
                groupList.map((id) => {
                    return <GroupListItem key={id} user={user} groupName={id} id={id} setDisplay={setDisplay} setDisplayGroup={setDisplayGroup} deleteGroup={deleteGroup}/>
                })
            }


        </div>
    </div>
    </div>
    <div className='MainPanelContainer'>
        {
            display===0 ? 
            null 
            :
            (
                display===1 ?
                null
                :
                <>
                <GroupDisplay displayGroup={displayGroup} user={user}/> 
                </>
            )
        }
    </div>
    </div>
    </div>
    </>
  )
}

export default Dashboard