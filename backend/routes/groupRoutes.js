const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/create', groupController.createGroup);
router.get('/data', groupController.getGroup);
router.get('/delete', groupController.deleteGroup);

module.exports = router;