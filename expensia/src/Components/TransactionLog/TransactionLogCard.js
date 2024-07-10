import React, { useEffect, useState } from 'react'
import './TransactionLogCard.css'

function TransactionLogCard(props) {

  const [month,setMonth] = useState();
  const [day,setDay] = useState();

  useEffect(() => {
    if(props.transaction){
      const date = new Date(props.transaction.date);
      const monthIndex = date.getMonth();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthName = monthNames[monthIndex].toUpperCase();

      setMonth(monthName);
      setDay(date.getDate());
    }
  },[props.transaction])

  return (
    <div className='TransactionLogCard'>
        <div className='TransactionLogDate'>
            <div className='TransactionLogDay'>{day}</div>
            <div className='TransactionLogMonth'>{month}</div>
        </div>
        <div className='TransactionLogInfo'>
        <div><b>{props.transaction.payerName}</b> paid to <b>{props.transaction.payeeName}</b> an amount of <b>₹{props.transaction.amount}</b></div>
        <div className='TransactionLogPaymentMode'>Payment mode : <b>{props.transaction.mode}</b></div>
        </div>
    </div>
  )
}

export default TransactionLogCard