// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller')
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// GET /api/admin/users - Get all users (admin only)
router.get('/users', verifyToken, requireRole(['admin']), adminController.getAllUsersData);

router.get('/coaches', verifyToken, requireRole(['admin']), adminController.getAllCoachesData)

router.get('/coaching-requests', verifyToken, requireRole(['admin']), adminController.getAllCoachingRequests);

module.exports = router;