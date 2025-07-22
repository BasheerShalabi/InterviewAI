const User = require('../models/User');

module.exports.getAllCoaches = async (req, res) => {
    try {
        const coaches = await User.find({ role: 'coach' }).select('-password');
        res.json(coaches);
    } catch (err) {
        res.status(500).json({ error: "Server error fetching coaches." });
    }
};

module.exports.requestCoach = async (req, res) => {
    const user = await User.findById(req.user.id);
    const coach = await User.findById(req.params.coachId);

    if (!coach || coach.role !== 'coach')
        return res.status(404).json({ message: "Coach not found." });

    if (user.assignedCoachId)
        return res.status(400).json({ message: "You already have a coach assigned." });

    if (user.pendingCoachRequest)
        return res.status(400).json({ message: "You already have a pending request." });

    user.pendingCoachRequest = coach._id;
    await user.save();

    res.json({ message: "Coach request sent." });
};

module.exports.getCoachRequests = async (req, res) => {
    const users = await User.find({ pendingCoachRequest: req.user.id })
        .select('fullname email role');

    res.json(users);
};

module.exports.respondToCoachRequest = async (req, res) => {
    const { accept } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user || String(user.pendingCoachRequest) !== String(req.user.id))
        return res.status(404).json({ message: "No pending request from this user." });

    if (accept) {
        user.assignedCoachId = req.user.id;
        user.pendingCoachRequest = null;
        await user.save();
        return res.json({ message: "Request accepted." });
    } else {
        user.pendingCoachRequest = null;
        await user.save();
        return res.json({ message: "Request declined." });
    }
};

module.exports.getAssignedUsers = async (req, res) => {
    const users = await User.find({ assignedCoachId: req.user.id })
        .select('fullname email');

    res.json(users);
};


module.exports.getAssignedUserSessions = async (req, res) => {
    const users = await User.find({ assignedCoachId: req.user.id }).select('_id');
    const userIds = users.map(u => u._id);

    const sessions = await Session.find({ userId: { $in: userIds } });
    res.json(sessions);
};
