const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { verifyToken } = require('../middlewares/auth.middleware');


router.get('/partners',verifyToken, chatController.getChatPartners);

router.get('/:partnerId',verifyToken , chatController.getHistory)

module.exports = router;
