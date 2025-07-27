const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io');
const Message = require('./models/message.model');


const app = express();
const PORT = process.env.PORT;

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./config/mongoose.config');

app.use('/api/users', require('./routes/user.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/coaches', require('./routes/coach.routes'));
app.use('/api/cv', require('./routes/cv.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/chat', require('./routes/chat.routes'))


server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Socket.IO chat server initialized');
});
const io = new Server(server, {
    cors: true
});

// === Socket.IO logic ===
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', ({ userId }) => {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        io.emit('user_online', { userId });
        console.log(`User ${userId} is online`);
    });

    socket.on('get_online_users', () => {
        const onlineIds = Array.from(onlineUsers.keys());
        socket.emit('online_users', onlineIds);
    });

    socket.on('private_message', async ({ from, to, content }) => {
        const message = new Message({ from, to, content });
        await message.save();

        const targetSocketId = onlineUsers.get(to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('private_message', {
                from,
                to,
                content,
                timestamp: message.timestamp,
                id: message._id,
            });

        }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
            io.emit('user_offline', { userId: socket.userId });
        }
    });
});