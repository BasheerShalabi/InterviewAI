const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Make sure this matches your User model name exactly
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Make sure this matches your User model name exactly
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    },
    edited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    roomId: {
        type: String,
        sparse: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
chatMessageSchema.index({ senderId: 1, recipientId: 1, timestamp: -1 });
chatMessageSchema.index({ recipientId: 1, read: 1 });
chatMessageSchema.index({ timestamp: -1 });
chatMessageSchema.index({ roomId: 1, timestamp: -1 });

// Static method to get conversation between two users
chatMessageSchema.statics.getConversation = function(userId1, userId2, options = {}) {
    const { page = 1, limit = 50, before } = options;
    
    let query = {
        $or: [
            { senderId: userId1, recipientId: userId2 },
            { senderId: userId2, recipientId: userId1 }
        ]
    };
    
    if (before) {
        query.timestamp = { $lt: new Date(before) };
    }
    
    return this.find(query)
        .populate('senderId', 'fullname name email')
        .populate('recipientId', 'fullname name email')
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
};

// Static method to get unread count for a user
chatMessageSchema.statics.getUnreadCount = function(userId) {
    return this.countDocuments({
        recipientId: userId,
        read: false
    });
};

// Static method to mark all messages from a sender as read
chatMessageSchema.statics.markConversationAsRead = function(senderId, recipientId) {
    return this.updateMany(
        {
            senderId: senderId,
            recipientId: recipientId,
            read: false
        },
        { read: true }
    );
};

// Pre-save middleware
chatMessageSchema.pre('save', function(next) {
    if (this.isModified('content') && !this.isNew) {
        this.edited = true;
        this.editedAt = new Date();
    }
    next();
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);