const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const coachController = require('../controllers/coach.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.post('/request/:coachId', verifyToken, coachController.requestCoach);
router.post('/send-request', verifyToken, userController.sendRequest);

module.exports = router;
