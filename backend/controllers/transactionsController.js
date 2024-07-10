const Group = require("../models/group");
const TransactionLog = require("../models/transactionLog");

exports.getTransactions = async (req,res) => {
    try{
        const groupId = req.query.groupId;
        const group = await Group.findById(groupId);

        const transactions = group.pendingTransactions;
        if(transactions)
        {
            res.json({
                exec: true,
                transactions: transactions
            });
        }
        else
        {
            res.json({
                exec: false
            });
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.settleTransaction = async (req,res) => {
    try{
        const transaction = req.body;
        console.log(transaction);

        const transactionLog = new TransactionLog({
            payerName: transaction.payerName,
            payeeName: transaction.payeeName,
            amount: transaction.amount,
            mode: transaction.mode,
            date: new Date()
        });

        const savedLog = await transactionLog.save(); 
        if(savedLog)
        {
            const logId = savedLog._id;

            console.log(logId);

            const updatedGroup = await Group.findByIdAndUpdate(transaction.groupId,{
                $push: {transactionLog: logId},
                pendingTransactions: transaction.pendingTransactions
            },
            { new : true }
            );

            if(updatedGroup)
            {
                res.json({
                    exec: true,
                    log: savedLog,
                    group: updatedGroup,
                    message: "Transaction stored successfully!"
                })
            }
            else
            {
                res.json({
                    exec: false,
                    message: "Failed to add Transaction to Group"
                })
            }
        }
        else
        {
            res.json({
                exec: false,
                message: "Failed to log Transaction"
            })
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.getTransactionLog = async (req,res) => {
    try{
        const transactionId = req.query.transactionId;
        const transaction = await TransactionLog.findById(transactionId);

        if(transaction)
        {
            res.json({
                exists: true,
                transaction: transaction
            });
        }
        else
        {
            res.json({
                exists: false
            });
        }
    }
    catch(err){
        console.log(err);
    }
}