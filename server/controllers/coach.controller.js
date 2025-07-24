const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Session = require('../models/session.model'); // تأكد من استيراد موديل الجلسات

module.exports.getAllCoaches = async (req, res) => {
    try {
        const coaches = await User.find({ role: 'coach' }).select('-password');
        res.json(coaches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error fetching coaches." });
    }
};

module.exports.requestCoach = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const coach = await User.findById(req.params.coachId);

        if (!coach || coach.role !== 'coach')
            return res.status(404).json({ message: "Coach not found." });

        if (user.assignedCoachId)
            return res.status(400).json({ message: "You already have a coach assigned." });

        if (user.pendingCoachRequest)
            return res.status(400).json({ message: "You already have a pending request." });

        // user.pendingCoachRequest = coach._id;

        await User.findByIdAndUpdate(user._id, {pendingCoachRequest:coach._id}, {
            runValidators: true
        });        

        // إعادة إصدار توكن محدث مع معلومات جديدة (إن أردت تحديثها في الواجهة)
        const token = jwt.sign(
            { id: user._id, role: user.role, fullname: user.fullname },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: "Coach request sent.", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while sending coach request." });
    }
};

module.exports.getCoachRequests = async (req, res) => {
    try {
        const users = await User.find({ pendingCoachRequest: req.user.id })
            .select('fullname email role');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error fetching requests." });
    }
};

module.exports.respondToCoachRequest = async (req, res) => {
    try {
        const { accept } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user || String(user.pendingCoachRequest) !== String(req.user.id))
            return res.status(404).json({ message: "No pending request from this user." });

        if (accept) {
            await User.findByIdAndUpdate(user._id, {pendingCoachRequest:null, assignedCoachId:req.user.id}, {
                runValidators: true
            });        
            return res.json({ message: "Request accepted." });
        } else {
            await User.findByIdAndUpdate(user._id, {pendingCoachRequest:null}, {
                runValidators: true
            });        
            return res.json({ message: "Request declined." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error responding to request." });
    }
};

module.exports.getAssignedUsers = async (req, res) => {
    try {
        const users = await User.find({ assignedCoachId: req.user.id }).select('fullname email');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error fetching assigned users." });
    }
};

module.exports.getAssignedUserSessions = async (req, res) => {
    try {
        const users = await User.find({ assignedCoachId: req.user.id }).select('_id');
        const userIds = users.map(u => u._id);

        const sessions = await Session.find({ userId: { $in: userIds } });
        res.json(sessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error fetching sessions." });
    }
};
