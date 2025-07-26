const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// CORS configuration
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./config/mongoose.config');

const ChatSocketHandler = require('./utils/socketHandler');
const chatHandler = new ChatSocketHandler(server);

app.use('/api/users', require('./routes/user.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/coaches', require('./routes/coach.routes'));
app.use('/api/cv', require('./routes/cv.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.use('/api/chat', require('./routes/chat'));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Socket.IO chat server initialized');
});