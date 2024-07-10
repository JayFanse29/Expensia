const mongoose = require('mongoose');

const TransactionLogSchema = new mongoose.Schema({
    payerName: {
        type: String,
        required: true
    },
    payeeName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("TransactionLog",TransactionLogSchema);