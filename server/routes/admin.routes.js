// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access token required" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
};

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
    console.log("Checking admin access for user:", req.user);
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: "Admin access required" });
    }
};

// GET /api/admin/users - Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        console.log("Admin fetching all users...");
        
        const users = await User.find({})
            .populate('assignedCoachId', 'fullname email')
            .populate('pendingCoachRequest', 'fullname email')
            .select('-password')
            .sort({ createdAt: -1 });
        
        console.log(`Found ${users.length} users`);
        
        // Transform data to match frontend expectations
        const transformedUsers = users.map(user => ({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            isActive: true, // You might want to add this field to your schema
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            coachId: user.assignedCoachId,
            requestId: user.pendingCoachRequest,
            lastLoginAt: user.lastLoginAt || user.updatedAt,
            // Add any other fields your frontend expects
        }));
        
        res.json(transformedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// GET /api/admin/sessions - Get all interview sessions (admin only)
router.get('/sessions', authenticateToken, requireAdmin, async (req, res) => {
    try {
        console.log("Admin fetching all sessions...");
        
        // You'll need to replace this with your actual Session model
        // const Session = require('../models/session.model');
        // const sessions = await Session.find({})
        //     .populate('user', 'fullname email')
        //     .populate('coach', 'fullname email')
        //     .sort({ createdAt: -1 });
        
        // For now, returning empty array - replace with actual implementation
        const sessions = [];
        
        res.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
});

// GET /api/admin/coach-requests - Get all coach requests (admin only)
router.get('/coach-requests', authenticateToken, requireAdmin, async (req, res) => {
    try {
        console.log("Admin fetching coach requests...");
        
        const requests = await User.find({ 
            pendingCoachRequest: { $ne: null } 
        })
        .populate('pendingCoachRequest', 'fullname email')
        .select('fullname email pendingCoachRequest createdAt');
        
        res.json(requests);
    } catch (error) {
        console.error("Error fetching coach requests:", error);
        res.status(500).json({ error: "Failed to fetch coach requests" });
    }
});

module.exports = router;