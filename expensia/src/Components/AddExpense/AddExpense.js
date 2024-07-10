import React, { useEffect, useState } from 'react'
import './AddExpense.css'
import GroupPayments from '../GroupPayments/GroupPayments';

function AddExpense(props) {

    const [splitType, setSplitType] = useState("equal");
    const [groupMemberNames, setGroupMemberNames] = useState([]);
    const [groupMemberIds, setGroupMemberIds] = useState([]);
    const [paymentDescription, setPaymentDescription] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState();
    const [paidBy, setPaidBy] = useState();
    const [contributions, setContributions] = useState([]);
    var contributors = [];

    useEffect(() => {
        const fetchGroupMemberNames = async () => {
            if (props.groupMembers) {
                setGroupMemberIds(props.groupMembers);

                const memberNamesPromises = props.groupMembers.map(async (groupMember) => {
                    const response = await fetch(`http://localhost:5000/expensia/users/name?userId=${groupMember}`);
                    const data = await response.json();
                    return data.name;
                });

                const memberNames = await Promise.all(memberNamesPromises);
                setGroupMemberNames(memberNames);
                setPaidBy(memberNames[0]);
            }
        };

        fetchGroupMemberNames();
    }, [props.groupMembers]);

    const closeAddExpense = () => { props.setAddExpenseVisible(false) }
    const onSplitTypeChangeListener = (event) => {
        setSplitType(event.target.id);
    }
    const paymentDescriptionChangeListener = (event) => {
        setPaymentDescription(event.target.value);
    }
    const paymentAmountChangeListener = (event) => {
        setPaymentAmount(event.target.value);
    }
    const paymentDateChangeListener = (event) => {
        setPaymentDate(event.target.value);
    }
    const paidByChangeListener = (event) => {
        setPaidBy(event.target.value);
    }
    const handleContributionChange = (index, value) => {
        const newContributions = [...contributions];
        newContributions[index] = value;
        setContributions(newContributions);
    };
    const calculateSum = () => {
        return contributions.reduce((sum, contribution) => {
            return sum + (parseFloat(contribution) || 0);
        }, 0);
    };

    const addNewExpense = async (event) => {
        event.preventDefault();

        if ((splitType === "percentage" && calculateSum() === 100) || (splitType === "amount" && calculateSum() === parseFloat(paymentAmount)) || splitType === "equal") {
            if (splitType === "percentage") {
                for (let i = 0; i < contributions.length; i++) {
                    contributors.push({
                        id: groupMemberIds[i],
                        member: groupMemberNames[i],
                        pay: (contributions[i] * paymentAmount) / 100
                    })
                }
            }
            else if (splitType === "amount") {
                for (let i = 0; i < contributions.length; i++) {
                    contributors.push({
                        id: groupMemberIds[i],
                        member: groupMemberNames[i],
                        pay: parseFloat(contributions[i])
                    })
                }
            }
            else if (splitType === "equal") {
                for (let i = 0; i < groupMemberNames.length; i++) {
                    contributors.push({
                        id: groupMemberIds[i],
                        member: groupMemberNames[i],
                        pay: paymentAmount / groupMemberNames.length
                    })
                }
            }

            const newExpense = {
                description: paymentDescription,
                amount: parseFloat(paymentAmount),
                date: paymentDate,
                payer: groupMemberIds[groupMemberNames.indexOf(paidBy)],
                splitType: splitType,
                contributors: contributors,
                groupId: props.groupId
            }

            const response = await fetch(`http://localhost:5000/expensia/expense/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newExpense)
            });

            const data = await response.json();
            alert(data.message);
            
            props.setExpenses([...props.expenses,data.expense]);
            props.setTransactions(data.transactions);


            closeAddExpense();
            props.setSelectOption(0);

        }
        else {
            alert("Payment distribution is not proper");
        }


    }

    return (
        <div className='AddExpenseContainer'>
            <div className='AddExpenseBox'>
                <div className='LoginClose' onClick={closeAddExpense}></div>
                <div className='AddExpenseHeader'>Add New Expense</div>
                <form className='AddExpenseInfo' onSubmit={addNewExpense}>
                    <div className='AddExpenseInput'>
                        <div>Payment Description :</div>
                        <input type='text' required value={paymentDescription} onChange={paymentDescriptionChangeListener} />
                    </div>
                    <div className='AddExpenseInput'>
                        <div>Payment Amount(₹) :</div>
                        <input type='number' required value={paymentAmount} onChange={paymentAmountChangeListener} />
                    </div>
                    <div className='AddExpenseInput'>
                        <div>Payment Date :</div>
                        <input type='date' required value={paymentDate} onChange={paymentDateChangeListener} />
                    </div>
                    <div className='AddExpenseInput'>
                        <div>Paid by :</div>
                        <select value={paidBy} onChange={paidByChangeListener}>
                            {
                                groupMemberNames.map((groupMember) => {
                                    return <option>{groupMember}</option>
                                })
                            }

                        </select>
                    </div>
                    <div className='AddExpenseInput'>
                        <div>Split type :</div>
                        <div className='AddExpenseSplit'>
                            <div className='AddExpenseSplitGroup'>
                                <input type='radio' id='equal' name='splitType' onClick={onSplitTypeChangeListener} defaultChecked />
                                <label for='equal'>Equally</label>
                            </div>
                            <div className='AddExpenseSplitGroup'>
                                <input type='radio' id='amount' name='splitType' onClick={onSplitTypeChangeListener} />
                                <label for='amount'>By Amount</label>
                            </div>
                            <div className='AddExpenseSplitGroup'>
                                <input type='radio' id='percentage' name='splitType' onClick={onSplitTypeChangeListener} />
                                <label for='percentage'>By Percentage</label>
                            </div>
                        </div>
                    </div>
                    {
                        splitType === 'amount' || splitType === 'percentage'
                            ?
                            <div className='AddExpenseInput'>
                                <div></div>
                                <div>
                                    {
                                        splitType === 'amount'
                                            ?
                                            <div className='SplitGroupTitle'>Enter share in Rupees(₹) :</div>
                                            :
                                            <div className='SplitGroupTitle'>Enter share in Percentage(%) :</div>
                                    }
                                    <div className='AddExpenseSplitContributionGroup'>

                                        {groupMemberNames.map((groupMember, index) => (
                                            <div key={index} className='AddExpenseSplitContribution'>
                                                <div>{groupMember} :</div>
                                                <input
                                                    type='number'
                                                    required
                                                    value={contributions[index]}
                                                    onChange={(e) => handleContributionChange(index, e.target.value)}
                                                />
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }
                    <button type='submit'>Add Expense</button>
                </form>
            </div>
        </div>
    )
}

export default AddExpense