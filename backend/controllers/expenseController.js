const Expense = require("../models/expense");
const Group = require("../models/group");

exports.addExpense = async (req,res) => {
    try{
        const newExpense = req.body;
        const toAddExpense = new Expense({
            description: newExpense.description,
            amount: newExpense.amount,
            date: new Date(newExpense.date),
            payer: newExpense.payer,
            splitType: newExpense.splitType,
            contributors: newExpense.contributors
        });

        const addedExpense = await toAddExpense.save();

        if(addedExpense)
        {
            const groupId = newExpense.groupId;
            const addExpenseToGroup = await Group.findByIdAndUpdate(groupId,{
                $push: {expenses: addedExpense._id}
            });

            const members = addExpenseToGroup.members;
            const pendingTransactions = addExpenseToGroup.pendingTransactions;
            const payeeIndex = members.indexOf(newExpense.payer);
            for(contributor of newExpense.contributors)
            {
                if(contributor.id!==newExpense.payer)
                {
                    const payerIndex=members.indexOf(contributor.id);
                    pendingTransactions[payerIndex][payeeIndex]+=contributor.pay;
                }
            }
            
            const optimisedTransactions = process(pendingTransactions);

            const addPendingTransactionToGroup = await Group.findByIdAndUpdate(groupId,{
                pendingTransactions: optimisedTransactions
            });
        

            if(addPendingTransactionToGroup)
            {
                res.json({
                    exec: true,
                    message: "Expense registered successfully!",
                    expense: addedExpense,
                    transactions: optimisedTransactions
                });
            }
            else
            {
                res.json({
                    exec: true,
                    message: "Failed to Add expense"
                })
            }

        }
        else{
            res.json({
                exec: true,
                message: "Failed to Add expense"
            })
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

exports.getExpense = async (req,res) => {
    try{
        const expenseId = req.query.expenseId;

        const expense = await Expense.findById(expenseId);

        if(expense)
        {
            res.json({
                exists: true,
                expense: expense
            });
        }
        else
        {
            res.json({
                exists: false
            })   
        }
    }
    catch(err){
        console.log(err);
    }
}


const process = (transactions) => {

        
    const combinedTransactions = combine(transactions);

    var finalTransactions;
    if(checkForSimplification(combinedTransactions))
    {
        finalTransactions = simplify(combinedTransactions);
    }
    else
    {
        finalTransactions = reduction(combinedTransactions);
    }

    return finalTransactions;
    
}

const combine = (transactions) => {
    for(i=0;i<transactions.length;i++)
    {
        for(j=i+1;j<transactions.length;j++)
        {
            transactions[i][j]-=transactions[j][i];
            transactions[j][i]=0;
        }
    }

    return transactions;
}

const checkForSimplification = (transactions) => {
    var rowCheck=true,columnCheck=true;

    for(i=0;i<transactions.length;i++)
    {
        var count=0;
        for(j=0;j<transactions.length;j++)
        {
            if(transactions[i][j]!=0)
            {
                count++;
            }
        }

        if(count>1)
        {
            rowCheck=false;
        }
    }

    for(j=0;j<transactions.length;j++)
    {
        var count=0;
        for(i=0;i<transactions.length;i++)
        {
            if(transactions[i][j]!=0)
            {
                count++;
            }
        }

        if(count>1)
        {
            columnCheck=false;
        }
    }

    return !(columnCheck || rowCheck);

}

const simplify = (transactions) => {

    for(i=0;i<transactions.length-1;i++)
    {
        for(j=i+2;j<transactions.length;j++)
        {
            transactions[i][i+1]+=transactions[i][j];
            transactions[i+1][j]+=transactions[i][j];
            transactions[i][j]=0;
        }
    }

    const reducedTransactions = reduction(transactions);
    return reducedTransactions;
}

const reduction = (transactions) => {
    // removing transactions of those who were not involved in any transaction
    for(i=0;i<transactions.length;i++)
    {
        var j=1;
        while(i+1+j<transactions.length && transactions[i+j][i+1+j]==transactions[i][i+1])
        {
            transactions[i+j][i+1+j]=0;
            j++;
        }
        j--;
        if(i+1+j<transactions.length && j>0)
        {
        transactions[i][i+1+j]=transactions[i][i+1];
        transactions[i][i+1]=0;
        }
    }

    return transactions;
} 
