import React, { useEffect, useState } from 'react'
import './TransactionLog.css'
import TransactionLogCard from './TransactionLogCard'

function TransactionLog(props) {

  const [groupedTransactionsByMonth, setGroupedTransactionsByMonth] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (props.transactionLog) {
        const transactionIds = props.transactionLog;
        const transactionPromises = transactionIds.map(async (transactionId) => {
          const response = await fetch(`http://localhost:5000/expensia/transactions/transactionLog?transactionId=${transactionId}`);
          const data = await response.json();
          if (data.exists) {
            return data.transaction;
          }
          else {
            return null;
          }
        });

        const transactions = await Promise.all(transactionPromises);
        transactions.sort((a,b) => b.date.localeCompare(a.date));
        groupTransactionsByMonth(transactions);
      }
    }

    const groupTransactionsByMonth = (payments) => {
      const getMonthYear = dateStr => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1; // getMonth() returns month from 0-11
        const year = date.getFullYear();
        return `${year}-${month < 10 ? '0' + month : month}`; // Format as "YYYY-MM"
      };

      // Group expenses by month-year
      const groupedTransactions = payments.reduce((acc, transaction) => {
        const monthYear = getMonthYear(transaction.date);
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(transaction);
        return acc;
      }, {});

      // Convert the grouped object to an array and sort by month-year
      const sortedGroupedTransactions = Object.keys(groupedTransactions)
        .sort((a, b) => b.localeCompare(a))
        .map(monthYear => ({
          monthYear,
          transactions: groupedTransactions[monthYear]
        }));

      setGroupedTransactionsByMonth(sortedGroupedTransactions);
    }


    fetchTransactions();

  }, [props.transactionLog]);


  return (
    <div className='TransactionLogContainer'>
      {
          groupedTransactionsByMonth.map(transactionGroup => {
            const monthYear = transactionGroup.monthYear;
            const year = monthYear.substring(0, monthYear.indexOf('-'));
            const month = monthYear.substring(monthYear.indexOf('-')+1,monthYear.length);
        
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthName = monthNames[month-1].toUpperCase();

            const transactions = transactionGroup.transactions;

            return (
              <>
                <div className='MonthHeader'>{monthName} {year}</div>
                <div>
                  {
                    transactions.map(transaction => {
                      return (
                        <TransactionLogCard transaction={transaction}/>
                      );
                    })
                  }
                </div>
             </>
            )
          })
        }
    </div>
  )
}

export default TransactionLog