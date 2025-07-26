const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

class ChatSocketHandler {
    constructor(server) {
        this.io = socketIo(server, {
            cors: true,
            path: '/api/chat/socket.io'
        });
        
        this.connectedUsers = new Map(); // userId -> socketId
        this.userRoles = new Map(); // userId -> role
        this.chatRooms = new Map(); // roomId -> {coach, user}
        
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        // Authentication middleware
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication error: No token provided'));
                }
                
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Try different User model paths
                let User;
                try {
                    User = require('./models/user.model');
                } catch {
                    try {
                        User = require('./models/User');
                    } catch {
                        console.error('Could not find User model');
                        return next(new Error('Server configuration error'));
                    }
                }
                
                const user = await User.findById(decoded.userId || decoded.id).select('-password');
                
                if (!user) {
                    return next(new Error('User not found'));
                }
                
                socket.userId = user._id.toString();
                socket.userRole = user.role || 'user';
                socket.userName = user.fullname || user.name || user.firstName || 'Unknown';
                
                console.log(`Authenticated socket for: ${socket.userName} (${socket.userRole})`);
                next();
            } catch (err) {
                console.error('Socket auth error:', err);
                next(new Error('Authentication failed'));
            }
        });

        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.userName} (${socket.userRole}) - Socket ID: ${socket.id}`);
            
            // Store connection
            this.connectedUsers.set(socket.userId, socket.id);
            this.userRoles.set(socket.userId, socket.userRole);
            
            // Join user to appropriate rooms
            this.joinUserRooms(socket);
            
            // Notify user is online
            this.notifyUserOnline(socket);
            
            // Handle events
            socket.on('send_message', (data) => this.handleSendMessage(socket, data));
            socket.on('join_chat', (data) => this.handleJoinChat(socket, data));
            socket.on('typing', (data) => this.handleTyping(socket, data));
            socket.on('stop_typing', (data) => this.handleStopTyping(socket, data));
            socket.on('mark_messages_read', (data) => this.handleMarkMessagesRead(socket, data));
            
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.userName}`);
                this.connectedUsers.delete(socket.userId);
                this.userRoles.delete(socket.userId);
                this.notifyUserOffline(socket);
            });
        });
    }

    async joinUserRooms(socket) {
        try {
            let User;
            try {
                User = require('./models/user.model');
            } catch {
                User = require('./models/User');
            }
            
            if (socket.userRole === 'coach') {
                // Get all users assigned to this coach
                const assignedUsers = await User.find({ coachId: socket.userId }).select('_id fullname name');
                console.log(`Coach ${socket.userName} has ${assignedUsers.length} assigned users`);
                
                assignedUsers.forEach(user => {
                    const roomId = this.getRoomId(socket.userId, user._id.toString());
                    socket.join(roomId);
                    console.log(`Coach joined room: ${roomId}`);
                    
                    this.chatRooms.set(roomId, {
                        coach: socket.userId,
                        user: user._id.toString()
                    });
                });
            } else {
                // User - join room with their coach if they have one
                const user = await User.findById(socket.userId).populate('coachId', '_id fullname name');
                if (user && user.coachId) {
                    const coachId = typeof user.coachId === 'object' ? user.coachId._id.toString() : user.coachId.toString();
                    const roomId = this.getRoomId(coachId, socket.userId);
                    socket.join(roomId);
                    console.log(`User joined room: ${roomId}`);
                    
                    this.chatRooms.set(roomId, {
                        coach: coachId,
                        user: socket.userId
                    });
                }
            }
        } catch (error) {
            console.error('Error joining rooms:', error);
        }
    }

    getRoomId(coachId, userId) {
        // Always put coach ID first for consistency
        return `chat_${coachId}_${userId}`;
    }

    notifyUserOnline(socket) {
        // Notify all rooms this user is part of
        socket.rooms.forEach(roomId => {
            if (roomId !== socket.id && roomId.startsWith('chat_')) {
                socket.to(roomId).emit('user_online', {
                    userId: socket.userId,
                    userName: socket.userName
                });
            }
        });
    }

    notifyUserOffline(socket) {
        // Notify all rooms this user was part of
        socket.rooms.forEach(roomId => {
            if (roomId !== socket.id && roomId.startsWith('chat_')) {
                socket.to(roomId).emit('user_offline', {
                    userId: socket.userId
                });
            }
        });
    }

    async handleSendMessage(socket, data) {
        try {
            const { recipientId, content, type = 'text', tempId } = data;
            
            console.log(`Message from ${socket.userName} to ${recipientId}: ${content}`);
            
            if (!recipientId || !content) {
                socket.emit('message_error', { 
                    tempId, 
                    error: 'Missing recipient or content' 
                });
                return;
            }
            
            // Determine room ID based on roles
            let roomId;
            if (socket.userRole === 'coach') {
                roomId = this.getRoomId(socket.userId, recipientId);
            } else {
                roomId = this.getRoomId(recipientId, socket.userId);
            }
            
            console.log(`Sending message to room: ${roomId}`);
            
            // Import ChatMessage model
            const ChatMessage = require('./models/ChatMessage');
            
            // Save message to database
            const message = new ChatMessage({
                senderId: socket.userId,
                recipientId: recipientId,
                content: content.trim(),
                type: type,
                timestamp: new Date(),
                read: false
            });
            
            const savedMessage = await message.save();
            
            // Populate sender info
            await savedMessage.populate('senderId', 'fullname name firstName email');
            
            const messageData = {
                id: savedMessage._id.toString(),
                senderId: savedMessage.senderId._id.toString(),
                senderName: savedMessage.senderId.fullname || savedMessage.senderId.name || savedMessage.senderId.firstName || 'Unknown',
                recipientId: recipientId,
                content: savedMessage.content,
                type: savedMessage.type,
                timestamp: savedMessage.timestamp,
                read: savedMessage.read,
                pending: false
            };
            
            // Emit to room (this will send to both sender and recipient if they're online)
            this.io.to(roomId).emit('receive_message', messageData);
            
            // Send delivery confirmation to sender
            socket.emit('message_sent', {
                tempId: tempId,
                messageId: savedMessage._id.toString(),
                timestamp: savedMessage.timestamp
            });
            
            console.log(`Message sent successfully: ${savedMessage._id}`);
            
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('message_error', { 
                tempId: data.tempId, 
                error: 'Failed to send message: ' + error.message 
            });
        }
    }

    handleJoinChat(socket, data) {
        try {
            const { partnerId } = data;
            console.log(`${socket.userName} joining chat with ${partnerId}`);
            
            let roomId;
            if (socket.userRole === 'coach') {
                roomId = this.getRoomId(socket.userId, partnerId);
            } else {
                roomId = this.getRoomId(partnerId, socket.userId);
            }
            
            socket.join(roomId);
            console.log(`Joined room: ${roomId}`);
            
            // Notify partner that user is online
            socket.to(roomId).emit('user_online', {
                userId: socket.userId,
                userName: socket.userName
            });
        } catch (error) {
            console.error('Error joining chat:', error);
        }
    }

    handleTyping(socket, data) {
        try {
            const { recipientId } = data;
            
            let roomId;
            if (socket.userRole === 'coach') {
                roomId = this.getRoomId(socket.userId, recipientId);
            } else {
                roomId = this.getRoomId(recipientId, socket.userId);
            }
            
            socket.to(roomId).emit('user_typing', {
                userId: socket.userId,
                userName: socket.userName
            });
        } catch (error) {
            console.error('Error handling typing:', error);
        }
    }

    handleStopTyping(socket, data) {
        try {
            const { recipientId } = data;
            
            let roomId;
            if (socket.userRole === 'coach') {
                roomId = this.getRoomId(socket.userId, recipientId);
            } else {
                roomId = this.getRoomId(recipientId, socket.userId);
            }
            
            socket.to(roomId).emit('user_stop_typing', {
                userId: socket.userId
            });
        } catch (error) {
            console.error('Error handling stop typing:', error);
        }
    }

    async handleMarkMessagesRead(socket, data) {
        try {
            const { partnerId } = data;
            
            const ChatMessage = require('./models/ChatMessage');
            
            // Mark all messages from partner as read
            const result = await ChatMessage.updateMany(
                {
                    senderId: partnerId,
                    recipientId: socket.userId,
                    read: false
                },
                { read: true }
            );
            
            console.log(`Marked ${result.modifiedCount} messages as read`);
            
            // Notify partner that messages were read
            const partnerSocketId = this.connectedUsers.get(partnerId);
            if (partnerSocketId) {
                this.io.to(partnerSocketId).emit('messages_read', {
                    readBy: socket.userId
                });
            }
            
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }
}

module.exports = ChatSocketHandler;