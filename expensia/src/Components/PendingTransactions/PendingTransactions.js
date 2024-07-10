import React, { useEffect, useState } from 'react'
import './PendingTransactions.css'
import PendingTransactionCard from './PendingTransactionCard'
import SettleUp from '../SettleUp/SettleUp';

function PendingTransactions(props) {

  
  const [user] = useState(props.user);
  const [SettleUpVisible,setSettleUpVisible] = useState(false);
  const [settleUpPayeeName,setSettleUpPayeeName] = useState("");
  const [settleUpPayerName,setSettleUpPayerName] = useState("");
  const [settleUpRow,setSettleUpRow] = useState("");
  const [settleUpColumn,setSettleUpColumn] = useState("");
  const [settleUpAmount,setSettleUpAmount] = useState("");
  const [transactions] = useState(props.transactions);
  const [groupMemberNames, setGroupMemberNames] = useState([]);
  const [groupMemberIds, setGroupMemberIds] = useState([]);

  useEffect(() => {
    const fetchGroupMemberNames = async () => {
        if (props.groupInfo) {
            setGroupMemberIds(props.groupInfo.members);

            const memberNamesPromises = props.groupInfo.members.map(async (groupMember) => {
                const response = await fetch(`http://localhost:5000/expensia/users/name?userId=${groupMember}`);
                const data = await response.json();
                return data.name;
            });

            const memberNames = await Promise.all(memberNamesPromises);
            setGroupMemberNames(memberNames);
        }
    };

    fetchGroupMemberNames();
}, [props.groupInfo]);
  
  const showSettleUp = (payer,payee,amount,row,col) => {
    setSettleUpPayerName(payer);
    setSettleUpPayeeName(payee);
    setSettleUpAmount(amount);
    setSettleUpRow(row);
    setSettleUpColumn(col);
    setSettleUpVisible(true);
  }
  
  return (
    <>
    <div className='PendingTransactionsContainer'>
      
        
      {console.log(transactions)}
        {
          transactions.map( (transactionRow,rowIndex) => (
            transactionRow.map( (transaction,colIndex) => {
              if(transaction<0)
              {
                const payerIndex=colIndex;
                const payeeIndex=rowIndex;

                return (<PendingTransactionCard 
                userId={user._id} 
                payerId={groupMemberIds[payerIndex]} 
                payerName={groupMemberNames[payerIndex]} 
                payeeId={groupMemberIds[payeeIndex]}
                payeeName={groupMemberNames[payeeIndex]} 
                amount={-transactions[rowIndex][colIndex]} 
                showSettleUp={showSettleUp}
                row={rowIndex}
                col={colIndex}/>)

              }
              else if(transaction>0)
              {
                  const payerIndex=rowIndex;
                  const payeeIndex=colIndex;

                  return (<PendingTransactionCard 
                  userId={user._id} 
                  payerId={groupMemberIds[payerIndex]} 
                  payerName={groupMemberNames[payerIndex]} 
                  payeeId={groupMemberIds[payeeIndex]}
                  payeeName={groupMemberNames[payeeIndex]} 
                  amount={transactions[rowIndex][colIndex]} 
                  showSettleUp={showSettleUp}
                  row={rowIndex}
                  col={colIndex}/>)

              }  
              else
              {
                return null
              }

            })
          ))
        }
      
      {
      SettleUpVisible 
      ? 
      <SettleUp 
      payee={settleUpPayeeName} 
      payer={settleUpPayerName} 
      amount={settleUpAmount} 
      setSettleUpVisible={setSettleUpVisible} 
      groupId={props.groupInfo._id}
      pendingTransactions={transactions}
      row={settleUpRow}
      col={settleUpColumn}
      setTransactions={props.setTransactions}
      setTransactionLog={props.setTransactionLog}/>
      :
      null
    }
    </div>
    </>
  )
}

export default PendingTransactions