const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    payer: {
        type: String,
        required: true
    },
    splitType: {
        type: String,
        required: true
    },
    contributors: {
        type: [],
        required: true
    }
});

module.exports = mongoose.model("Expense",ExpenseSchema);