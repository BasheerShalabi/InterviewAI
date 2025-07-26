const User = require('../models/user.model');
const Message = require('../models/message.model')

module.exports.getChatPartners = async (req, res) => {
    try {
        const currentUser = req.user;

        const user = await User.findById(currentUser.id);

        let partners = [];

        if (user.role === 'coach') {
            partners = await User.find({ assignedCoachId: user.id });
        } else {
            partners = await User.find({ _id: user.assignedCoachId });
        }

        res.json(partners);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to load chat partners' });
    }
};

module.exports.getHistory = async (req, res) => {
    const userId = req.user.id;
    const partnerId = req.params.partnerId;

    try {
        const messages = await Message.find({
            $or: [
                { from: userId, to: partnerId },
                { from: partnerId, to: userId }
            ]
        }).sort('timestamp');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}
