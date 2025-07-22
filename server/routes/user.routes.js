const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/request-coach/:coachId', verifyToken, userController.requestCoach);


module.exports = router;
