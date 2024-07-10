const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/inviteController');
const verifyToken = require('../middlewares/auth');

router.post('/',inviteController.inviteMember);
router.get('/accept',verifyToken,inviteController.acceptInvitation);

module.exports = router;