import React, { useState } from 'react'
import './SettleUp.css'

function SettleUp(props) {

    const [mode,setMode] = useState("Cash");
    const closeSettleUp = () => {
        props.setSettleUpVisible(false);
    }

    const settleTransaction = async () => {

        var pendingTransactions = props.pendingTransactions;
        console.log(pendingTransactions);
        pendingTransactions[props.row][props.col] = 0;

        const transaction = {
            payerName: props.payer,
            payeeName: props.payee,
            amount: props.amount,
            mode: mode,
            groupId: props.groupId,
            pendingTransactions: pendingTransactions
        }

        console.log(transaction);

        const response = await fetch(`http://localhost:5000/expensia/transactions/settle`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transaction)
        });

        const data = await response.json();
        if(data.exec)
        {
            console.log(data);
        }
        alert(data.message);
        props.setTransactions(data.group.pendingTransactions);
        props.setTransactionLog(data.group.transactionLog);

        closeSettleUp();
    }
  
    return (
    <div className='SettleUpContainer'>
        <div className='SettleUpBox'>
        <div className='LoginClose' onClick={closeSettleUp}></div>
            <div className='SettleUpHeader'>Settle up your debt with&nbsp;<b>{props.payee}</b>&nbsp;?</div>
            <div className='SettleUpAmount'><b>Total debt :</b> ₹{props.amount}</div>
            <div className='SettleUpPayment'>
                <div><b>Mode of Payment :</b></div>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Cheque</option>
                </select>
            </div>
            <button onClick={settleTransaction}
            >Settle up</button>
        </div>

    </div>
  )
}

export default SettleUp