import React, { useEffect, useState } from 'react'
import './GroupPayments.css'
import GroupPaymentCard from './GroupPaymentCard'

function GroupPayments(props) {

  const [groupedExpensesByMonth, setGroupedExpensesByMonth] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (props.expenses) {
        // const expenseIds = props.groupInfo.expenses;
        // const expensePromises = expenseIds.map(async (expenseId) => {
        //   const response = await fetch(`https://expensia-backend.vercel.app/expensia/expense/get?expenseId=${expenseId}`);
        //   const data = await response.json();
        //   if (data.exists) {
        //     return data.expense;
        //   }
        //   else {
        //     return null;
        //   }
        // });

        // const expenses = await Promise.all(expensePromises);
        props.expenses.sort((a,b) => b.date.localeCompare(a.date));
        groupExpensesByMonth(props.expenses);
      }
    }

    const groupExpensesByMonth = (payments) => {
      const getMonthYear = dateStr => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1; // getMonth() returns month from 0-11
        const year = date.getFullYear();
        return `${year}-${month < 10 ? '0' + month : month}`; // Format as "YYYY-MM"
      };

      // Group expenses by month-year
      const groupedExpenses = payments.reduce((acc, expense) => {
        const monthYear = getMonthYear(expense.date);
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(expense);
        return acc;
      }, {});

      // Convert the grouped object to an array and sort by month-year
      const sortedGroupedExpenses = Object.keys(groupedExpenses)
        .sort((a, b) => b.localeCompare(a))
        .map(monthYear => ({
          monthYear,
          expenses: groupedExpenses[monthYear]
        }));

      setGroupedExpensesByMonth(sortedGroupedExpenses);
    }


    fetchExpenses();

  }, [props.expenses]);

  return (
    <div className='GroupPaymentsContainer'>
      <div className='GroupPaymentsMonthly'>
        {
          groupedExpensesByMonth.map(expenseGroup => {
            const monthYear = expenseGroup.monthYear;
            const year = monthYear.substring(0, monthYear.indexOf('-'));
            const month = monthYear.substring(monthYear.indexOf('-')+1,monthYear.length);
        
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthName = monthNames[month-1].toUpperCase();

            const expenses = expenseGroup.expenses;

            return (
              <>
                <div className='MonthHeader'>{monthName} {year}</div>
                <div>
                  {
                    expenses.map(expense => {
                      return (
                        <GroupPaymentCard expense={expense}/>
                      );
                    })
                  }
                </div>
             </>
            )
          })
        }
      </div>
    </div>
  )
}

export default GroupPayments