const express = require('express');
const router = express.Router();

const coachController = require('../controllers/coach.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

router.get('/', coachController.getAllCoaches);

router.get('/requests', verifyToken, requireRole(['coach', 'admin']), coachController.getCoachRequests);

router.post('/respond/:userId', verifyToken, requireRole(['coach', 'admin']), coachController.respondToCoachRequest);

router.get('/assigned-users', verifyToken, requireRole(['coach', 'admin']), coachController.getAssignedUsers);

router.get('/assigned-users/sessions', verifyToken, requireRole(['coach', 'admin']), coachController.getAssignedUserSessions);
router.patch('/assigned-users/remove/:userId', verifyToken, requireRole(['coach', 'admin']), coachController.removeUser);

module.exports = router;
