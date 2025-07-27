const User = require('../models/user.model');
const Session = require('../models/session.model')

module.exports.getAllUsersData = async (req, res) => {
    try {
        console.log("Admin fetching all users...");

        const users = await User.find({ role: { $ne: 'coach' } })
            .populate('assignedCoachId', 'fullname email')
            .populate('pendingCoachRequest', 'fullname email')
            .select('-password')
            .sort({ createdAt: -1 });

        console.log(`Found ${users.length} users`);

        // Transform data to match frontend expectations
        const transformedUsers = await Promise.all(users.map(async (user) => {
            try {
                const sessions = await Session.find({ userId: user._id }).sort({ createdAt: -1 });
                return {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role,
                    isActive: true,
                    createdAt: user.createdAt,
                    coachId: user.assignedCoachId,
                    requestId: user.pendingCoachRequest,
                    sessions: sessions
                };
            } catch (err) {
                // Don't call res here unless you're inside an Express route and handle it properly
                console.error(`Error processing user ${user._id}:`, err.message);
                return null; // or handle it appropriately
            }
        }));

        res.json(transformedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

module.exports.getAllCoachingRequests = async (req, res) => {
    try {
        const requests = await User.find({ coachingRequest: true, role: 'user' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error("Error fetching coaching requests:", error)
    }
};


module.exports.getAllCoachesData = async (req, res) => {
    try {
        const coaches = await User.find({ role: 'coach' }).select('-password');
        const users = await User.find().select('assignedCoachId _id');
        const sessionsWithCoachFeedback = await Session.find({
            coachFeedback: { $exists: true, $ne: "" }
        }).populate('userId', 'fullname email assignedCoachId');

        const result = coaches.map(coach => {
            // Get users assigned to this coach
            const assignedUsers = users.filter(u => String(u.assignedCoachId) === String(coach._id));

            // Get sessions from these users that have coach feedback
            const feedbackSessions = sessionsWithCoachFeedback.filter(session =>
                assignedUsers.some(u => String(u._id) === String(session.userId._id))
            );

            // Optional: compute averageRating if there's a numeric field in coachFeedback
            const ratings = feedbackSessions
                .map(s => s.coachFeedback?.rating) // adjust to your actual field
                .filter(r => typeof r === 'number');

            const averageRating = ratings.length
                ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2)
                : null;

            return {
                _id: coach._id,
                fullname: coach.fullname,
                email: coach.email,
                role: coach.role,
                assignedCoachId: coach.assignedCoachId,
                pendingCoachRequest: coach.pendingCoachRequest,
                createdAt: coach.createdAt,
                assignedUsers: assignedUsers.map(u => u._id),
                totalFeedbacks: feedbackSessions.length,
                averageRating: averageRating,
                status: "active",
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error fetching coaches." });
    }
}
module.exports.acceptCoachingRequest = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user and update their role to 'coach'
        const user = await User.findByIdAndUpdate(userId, { role: 'coach', coachingRequest: false }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Optionally, you can also clear the pendingCoachRequest field
        await User.findByIdAndUpdate(userId, { pendingCoachRequest: null , assignedCoachId: null }, {
            runValidators: true
        });
        res.json({ message: "Coaching request accepted", user });
    } catch (err) {
        console.error("Error accepting coaching request:", err);
        res.status(500).json({ error: err.message });
    }

}
module.exports.declineCoachingRequest = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user and update their coachingRequest status
        const user = await User.findByIdAndUpdate(userId, { coachingRequest: false, pendingCoachRequest: null }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Coaching request declined", user });
    } catch (err) {
        console.error("Error declining coaching request:", err);
        res.status(500).json({ error: err.message });
    }

}

module.exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.user.id; // From authentication middleware

        // Verify admin permissions
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // Find the user to delete
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Check if user is admin (prevent admin deletion)
        if (userToDelete.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users.'
            });
        }

        // Only allow deletion of users and coaches
        if (!['user', 'coach'].includes(userToDelete.role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user role for deletion.'
            });
        }

        if (userToDelete.role === 'coach') {
            const assignedUsers = await User.find({ coachId: userId });
            
            if (assignedUsers.length > 0) {
                await User.updateMany(
                    { coachId: userId },
                    { $unset: { coachId: "" } }
                );
            }

            await Session.updateMany(
                { coachId: userId },
                { $unset: { coachId: "", coachFeedback: "" } }
            );
        }

        if (userToDelete.role === 'user') {
            await Session.deleteMany({ userId: userId });

            if (userToDelete.coachId) {
                await User.findByIdAndUpdate(
                    userToDelete.coachId,
                    { $pull: { assignedUsers: userId } }
                );
            }
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: `${userToDelete.role.charAt(0).toUpperCase() + userToDelete.role.slice(1)} deleted successfully.`,
            deletedUser: {
                id: userToDelete._id,
                name: userToDelete.fullname,
                email: userToDelete.email,
                role: userToDelete.role
            }
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting user.',
            error: error.message
        });
    }
};
