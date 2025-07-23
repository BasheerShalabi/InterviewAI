const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coach.controller');
const verifyToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');


router.get('/', coachController.getAllCoaches);

router.get('/requests', verifyToken, requireRole(['coach','admin']), coachController.getCoachRequests);

router.post('/respond/:userId',  verifyToken, requireRole(['coach','admin']), coachController.respondToCoachRequest);

router.get('/assigned-users' ,  verifyToken, requireRole(['coach','admin']), coachController.getAssignedUsers);

router.get('/assigned-users/sessions'  ,verifyToken, requireRole(['coach','admin']), coachController.getAssignedUserSessions);

module.exports = router;
