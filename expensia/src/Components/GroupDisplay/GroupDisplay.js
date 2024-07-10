import React, { useEffect, useState } from 'react'
import './GroupDisplay.css'
import GroupMember from '../GroupMember/GroupMember'
import GroupPayments from '../GroupPayments/GroupPayments';
import PendingTransactions from '../PendingTransactions/PendingTransactions';
import TransactionLog from '../TransactionLog/TransactionLog';
import AddExpense from '../AddExpense/AddExpense';
const validator = require('validator');

function GroupDisplay(props) {

    const [groupInfo,setGroupInfo] = useState();
    const [selectOption,setSelectOption] = useState(0);
    const [addExpenseVisible, setAddExpenseVisible] = useState(false);
    const [ownerName,setOwnerName] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [dateCreated,setDateCreated] = useState("");
    const [inviteMemberVisible,setInviteMemberVisible] = useState(false);
    const [newMemberMail,setNewMemberMail] = useState("");       
    const [expenses,setExpenses] = useState();
    const [transactions,setTransactions] = useState();
    const [transactionLog,setTransactionLog] = useState();

        useEffect( () => {
            if(props.displayGroup)
            {
                setGroupInfo(props.displayGroup);
                setGroupMembers(props.displayGroup.members);
                setTransactions(props.displayGroup.pendingTransactions);
                setTransactionLog(props.displayGroup.transactionLog);

                const fetchDate = () => {
                    const date = new Date(props.displayGroup.dateCreated);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
    
                    setDateCreated(day+"/"+month+"/"+year);
                }

                const fetchOwner = async () => {
                    const response = await fetch(`http://localhost:5000/expensia/users/name?userId=${props.displayGroup.owner}`);
            
                    const data = await response.json();
                    setOwnerName(data.name);
                }

                const fetchExpenses = async () => {
                    if (props.displayGroup) {
                      const expenseIds = props.displayGroup.expenses;
                      const expensePromises = expenseIds.map(async (expenseId) => {
                        const response = await fetch(`http://localhost:5000/expensia/expense/get?expenseId=${expenseId}`);
                        const data = await response.json();
                        if (data.exists) {
                          return data.expense;
                        }
                        else {
                          return null;
                        }
                      });
              
                      setExpenses(await Promise.all(expensePromises));
                      
                    }
                  }
            
                fetchOwner();
                fetchDate();
                fetchExpenses();
        
            }
        },[props.displayGroup]);

        

    const showInviteMember = () => { setInviteMemberVisible(true) }
    const hideInviteMember = () => { setInviteMemberVisible(false) }
    const newMemberMailChangeListener = (event) => {
        setNewMemberMail(event.target.value);
    }

    const showAddExpense = () => { setAddExpenseVisible(true) }

    const inviteMember = async () => {

        if(!validator.isEmail(newMemberMail))
        {
            alert("Invalid email address!");
        }
        else
        {
            const inviteMember = {
                mail: newMemberMail,
                group: groupInfo._id
            }

            const response = await fetch('http://localhost:5000/expensia/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inviteMember)
            });

            const data = await response.json();

            alert(data.message);
        }
    }

    const selectedOptionStyle = {
        'background-color' : 'aliceblue',
        'border-top-right-radius' : '10px',
        'border-bottom-right-radius' : '10px',
        'box-shadow' : '1px 1px 2px black',
        'z-index' : '5'
    };

    if(!groupInfo)
    {
        return <p>Loading...</p>
    }
   
  return (
    <div className='GroupDisplayMain'>
        <div className='GroupDisplayLeft'>

            {
                addExpenseVisible
                ?
                <AddExpense 
                setAddExpenseVisible={setAddExpenseVisible} 
                groupId={groupInfo._id} 
                groupMembers={groupMembers} 
                setSelectOption={setSelectOption}
                groupInfo={groupInfo}
                user={props.user}
                expenses={expenses}
                setExpenses={setExpenses}
                setTransactions={setTransactions}/>
                : 
                null
            }

            <div className='GroupTitle'>
                <div className='GroupName'>{groupInfo.groupName}</div>
                <div className='GroupCreated'>Created by {ownerName} on {dateCreated}</div>
                <button id='addGroupExpense' onClick={showAddExpense}>Add Expense</button>
            </div>

            <div className='GroupTransactionContainer'>
                {
                    selectOption===0
                    ?
                    <div className='TransactionDisplayContainer'><GroupPayments groupInfo={groupInfo} expenses={expenses} /></div>
                    :
                    selectOption===1
                    ?
                    <div className='TransactionDisplayContainer'>
                        <PendingTransactions 
                        groupInfo={groupInfo} 
                        transactions={transactions} 
                        setTransactions={setTransactions} 
                        user={props.user}
                        setTransactionLog={setTransactionLog}/>
                    </div>
                    :
                    <div className='TransactionDisplayContainer'><TransactionLog groupInfo={groupInfo} transactionLog={transactionLog}/></div>
                }
                <div className='TransactionSelectorContainer'>
                    <div className='TransactionSelector' onClick={() => {setSelectOption(0)}} style={selectOption===0 ? selectedOptionStyle : null}>Group Payments</div>
                    <div className='TransactionSelector' onClick={() => {setSelectOption(1)}} style={selectOption===1 ? selectedOptionStyle : null}>Pending Transactions</div>
                    <div className='TransactionSelector' onClick={() => {setSelectOption(2)}} style={selectOption===2 ? selectedOptionStyle : null}>Transaction Log</div>
                </div>
            </div>
        </div>
        <div className='GroupDisplayRight'>
            <div className='GroupMemberHeader'>
            <div className='GroupMemberTitle'>Group Members</div>
            <button id='inviteGroupMember' onClick={showInviteMember}></button>
            </div>
            <div className='GroupMemberList'>
                <div className='PanelInviteFriend' style={inviteMemberVisible ? {display : 'grid'} : {display : 'none'}}>
                <input type='text' id='newGroup' placeholder="Member Email" value={newMemberMail} onChange={newMemberMailChangeListener}/>
                <button id='createGroup' onClick={inviteMember}></button>
                <button id='cancelGroup' onClick={hideInviteMember}></button>
        </div>

            {
                groupMembers.map((memberId,index) => {
                    var debt=0;
                    transactions.map( (row) => {
                        debt+=row[index];
                        return null;
                    });

                    transactions[index].map( (col) => {
                        debt-=col;
                        return null;
                    });

                    console.log(debt);
                    return <GroupMember memberId={memberId} status={"settled up"} amount={debt}/>

                })
            }
                
            </div>
        </div>

        
    </div>

  )
}

export default GroupDisplay