const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth');


// EXAMPLE
// router.get('/', userController.getAllUsers);

router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile', verifyToken, userController.getUser);
router.get('/name',userController.getName);

module.exports = router;