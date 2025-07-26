const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, sessionController.createSession);

router.get('/', verifyToken, sessionController.getMySessions);

router.get('/all', verifyToken, requireRole(['admin']), sessionController.getAllSessions);

router.get('/:id', verifyToken, sessionController.getSessionById);

router.post('/:sessionId/message', verifyToken, sessionController.sendMessage);

router.patch('/:id/coach-feedback' , verifyToken , requireRole(["coach" , "admin"]) , sessionController.updateCoachFeedback)

module.exports = router;
