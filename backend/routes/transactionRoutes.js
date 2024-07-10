const express = require('express');
const router = express.Router();
const transactionController = require("../controllers/transactionsController");

router.get("/",transactionController.getTransactions);
router.post("/settle",transactionController.settleTransaction);
router.get("/transactionLog",transactionController.getTransactionLog);

module.exports = router;
