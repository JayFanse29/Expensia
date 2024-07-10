const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        default: []
    },
    expenses: {
        type: [String],
        default: []
    },
    pendingTransactions: {
        type: [[Number]]
    },
    transactionLog: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model("Group",GroupSchema);