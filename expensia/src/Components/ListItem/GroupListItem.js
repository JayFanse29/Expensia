import React, { useEffect, useState } from 'react'
import './FriendListItem.css'

function GroupListItem(props) {

    const [hoverGroup,setHoverGroup] = useState(false);
    const [groupData,setGroupData] = useState({});

    useEffect(() => {
      const fetchGroupData = async () => {
          if (props.id) {
              try {
                  const response = await fetch(`http://localhost:5000/expensia/groups/data?groupId=${props.id}`);
                  const data = await response.json();
                  setGroupData(data.groupData);
              } catch (error) {
                  console.error('Error fetching group data:', error);
              }
          }
      };

      fetchGroupData();

      return () => {      };
  }, [props.id]);

    const toggleHoverGroup = () => { setHoverGroup(!hoverGroup) }
    const onGroupClickListener = () => {
      props.setDisplay(2);
      console.log("clicked",groupData);
      props.setDisplayGroup(groupData);
    }

    const deleteGroup = () => {
      props.deleteGroup(groupData._id);
    }

  return (
    <>
    <div className='ListItem'
    onMouseEnter={toggleHoverGroup} onMouseLeave={toggleHoverGroup} 
    >
        <div className='ListItemName' onClick={onGroupClickListener}>{groupData.groupName}</div>
        <button id={props.id} style={ (props.user._id===groupData.owner && hoverGroup) ? {display:'flex'} : {display:'none'}} onClick={deleteGroup}></button>
    </div>
    </>
  )
}

export default GroupListItem