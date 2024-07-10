import React, { useEffect, useState } from 'react'
import './GroupPaymentCard.css'

function GroupPaymentCard(props) {

    const [toggleGroupPaymentDetails,setToggleGroupPaymentDetails] = useState(false);
    const [monthlyExpense,setMonthlyExpense] = useState();
    const [month,setMonth] = useState();
    const [day,setDay] = useState();
    const [payerName,setPayerName] = useState();

    useEffect(() => {
        if(props.expense){
            setMonthlyExpense(props.expense);
            const date = new Date(props.expense.date);
            const monthIndex = date.getMonth();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthName = monthNames[monthIndex].toUpperCase();
            const fetchPayerName = async () => {
                const response = await fetch(`http://localhost:5000/expensia/users/name?userId=${props.expense.payer}`);
                const data = await response.json();
                setPayerName(data.name);
            }

            setMonth(monthName);
            setDay(date.getDate());
            fetchPayerName();
        }
    },[props.expense])

    const onToggleGroupPaymentDetail = () => {setToggleGroupPaymentDetails(!toggleGroupPaymentDetails)};

    if(!monthlyExpense){
        return (
            <p>Loading...</p>
        )
    }

  return (
    <div className='GroupPaymentCard'>
        <div className='GroupPaymentPrimary' onClick={onToggleGroupPaymentDetail}
        style={toggleGroupPaymentDetails ? {boxShadow: '0px 1px 2px black'} : null}>
        <div className='GroupPaymentDate'>
            <div className='GroupPaymentDay'>{day}</div>
            <div className='GroupPaymentMonth'>{month}</div>
        </div>
        <div className='GroupPaymentInfo'>
            <div className='GroupPaymentDescription'>{monthlyExpense.description}</div>
            <div className='GroupPaymentPayee'>paid by {payerName}</div>
        </div>
        <div className='GroupPaymentAmountSection'>
            <div className='GroupPaymentAmount'>₹{monthlyExpense.amount}</div>
            <div className='GroupPaymentAmountSubtitle'>Amount paid</div>
        </div>
        </div>
        <div className='GroupPaymentSecondary'
        style={toggleGroupPaymentDetails ? {display : 'flex'} : {display : 'none'}}>
            <div className='SplitType'>Split type : <b>{monthlyExpense.splitType}</b></div>
            <div className='ContributorHeading'>
                <div>Contributor</div>
                <div>Split Percentage (%)</div>
                <div>Amount (₹)</div>
            </div>
            {
                monthlyExpense.contributors.map(contribution => {
                    var percentage = (contribution.pay / monthlyExpense.amount)*100
                    percentage = percentage.toFixed(2);
                    const amount = contribution.pay.toFixed(2);
                    return (
                        <div className='Contribution'>
                        <div>{contribution.member}</div>
                        <div>{percentage}</div>
                        <div>{amount}</div>
                    </div>
                    );
                })
            }
            
        </div>
    </div>
  )
}

export default GroupPaymentCard