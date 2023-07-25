const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

//auth routes

router.post('/login', authController.login);

router.post('/register', authController.register);


module.exports = router;