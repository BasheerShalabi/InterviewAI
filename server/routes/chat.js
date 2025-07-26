const express = require('express');
const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');
        
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { 
            id: decoded.userId || decoded.id, 
            role: decoded.role || 'user' 
        };
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// Get chat history between user and coach
router.get('/messages/:partnerId', auth, async (req, res) => {
    try {
        const { partnerId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        
        console.log(`Fetching messages between ${req.user.id} and ${partnerId}`);
        
        const ChatMessage = require('../models/ChatMessage');
        
        const messages = await ChatMessage.find({
            $or: [
                { senderId: req.user.id, recipientId: partnerId },
                { senderId: partnerId, recipientId: req.user.id }
            ]
        })
        .populate('senderId', 'fullname name email')
        .populate('recipientId', 'fullname name email')
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
        
        console.log(`Found ${messages.length} messages`);
        
        res.json({
            messages: messages.reverse(), // Reverse to show chronological order
            hasMore: messages.length === parseInt(limit)
        });
        
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Get unread message count
router.get('/unread-count', auth, async (req, res) => {
    try {
        const ChatMessage = require('../models/ChatMessage');
        
        const unreadCount = await ChatMessage.countDocuments({
            recipientId: req.user.id,
            read: false
        });
        
        res.json({ unreadCount });
        
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});

// Get chat partners for coach or user
router.get('/partners', auth, async (req, res) => {
    try {
        let partners = [];
        
        // Try to import User model with different possible paths
        let User;
        try {
            User = require('../models/user.model');
        } catch {
            try {
                User = require('../models/User');
            } catch {
                console.error('Could not find User model');
                return res.status(500).json({ error: 'User model not found' });
            }
        }
        
        console.log(`Fetching chat partners for ${req.user.role}: ${req.user.id}`);
        
        if (req.user.role === 'coach') {
            // Get all assigned users
            partners = await User.find({ coachId: req.user.id })
                .select('_id fullname name email role')
                .lean();
            console.log(`Coach has ${partners.length} assigned users`);
        } else {
            // Get coach if assigned
            const user = await User.findById(req.user.id).populate('coachId', '_id fullname name email role');
            if (user && user.coachId) {
                partners = [user.coachId];
                console.log(`User has coach: ${user.coachId.fullname || user.coachId.name}`);
            } else {
                console.log('User has no assigned coach');
            }
        }
        
        // Get last message and unread count for each partner
        const ChatMessage = require('../models/ChatMessage');
        
        const partnersWithChatInfo = await Promise.all(
            partners.map(async (partner) => {
                try {
                    const lastMessage = await ChatMessage.findOne({
                        $or: [
                            { senderId: req.user.id, recipientId: partner._id },
                            { senderId: partner._id, recipientId: req.user.id }
                        ]
                    })
                    .sort({ timestamp: -1 })
                    .populate('senderId', 'fullname name');
                    
                    const unreadCount = await ChatMessage.countDocuments({
                        senderId: partner._id,
                        recipientId: req.user.id,
                        read: false
                    });
                    
                    return {
                        _id: partner._id,
                        fullname: partner.fullname || partner.name,
                        name: partner.name || partner.fullname,
                        email: partner.email,
                        role: partner.role || 'user',
                        lastMessage,
                        unreadCount
                    };
                } catch (error) {
                    console.error(`Error processing partner ${partner._id}:`, error);
                    return {
                        _id: partner._id,
                        fullname: partner.fullname || partner.name,
                        name: partner.name || partner.fullname,
                        email: partner.email,
                        role: partner.role || 'user',
                        lastMessage: null,
                        unreadCount: 0
                    };
                }
            })
        );
        
        res.json(partnersWithChatInfo);
        
    } catch (error) {
        console.error('Error fetching chat partners:', error);
        res.status(500).json({ error: 'Failed to fetch chat partners' });
    }
});

// Send a message (REST endpoint as fallback)
router.post('/send', auth, async (req, res) => {
    try {
        const { recipientId, content, type = 'text' } = req.body;
        
        if (!recipientId || !content) {
            return res.status(400).json({ error: 'Recipient ID and content are required' });
        }
        
        const ChatMessage = require('../models/ChatMessage');
        
        const message = new ChatMessage({
            senderId: req.user.id,
            recipientId,
            content: content.trim(),
            type,
            timestamp: new Date(),
            read: false
        });
        
        const savedMessage = await message.save();
        await savedMessage.populate('senderId', 'fullname name email');
        await savedMessage.populate('recipientId', 'fullname name email');
        
        res.status(201).json({
            message: 'Message sent successfully',
            data: savedMessage
        });
        
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Mark messages as read
router.patch('/messages/:partnerId/read', auth, async (req, res) => {
    try {
        const { partnerId } = req.params;
        
        const ChatMessage = require('../models/ChatMessage');
        
        const result = await ChatMessage.updateMany(
            {
                senderId: partnerId,
                recipientId: req.user.id,
                read: false
            },
            { read: true }
        );
        
        res.json({
            message: 'Messages marked as read',
            modifiedCount: result.modifiedCount
        });
        
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Failed to mark messages as read' });
    }
});

module.exports = router;