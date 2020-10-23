const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
/* GET users listing. */

// ------------------------------------------------------------------------------
//Signup end point
router.post('/signup', userController.createUser);

// ------------------------------------------------------------------------------
// login end point
router.post('/login', userController.loginUser);

module.exports = router;
