import React from 'react'
import './PendingTransactionCard.css'

function PendingTransactionCard(props) {

  const amount = parseFloat(props.amount.toFixed(2));

  return (
    <div className='PendingTransactionCard'>
        <div className='PendingTransactionInfo'>
            <b>{props.payerName}</b> owes to <b>{props.payeeName}</b> an amount of <b>₹{amount}</b>
        </div>
        <button style={props.userId===props.payerId ? {visibility: 'visible'} : {visibility: 'hidden'}}
        onClick={() => { props.showSettleUp(props.payerName,props.payeeName,amount, props.row,props.col) }}
        >Settle up</button>
    </div>
  )
}

export default PendingTransactionCard