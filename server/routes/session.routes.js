const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, sessionController.createSession);

router.get('/', verifyToken, sessionController.getMySessions);

router.get('/:id', verifyToken, sessionController.getSessionById);

router.post('/:sessionId/message', verifyToken, sessionController.sendMessage);

module.exports = router;
