import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userId, onMessage) => {
    const socketRef = useRef(null);
    const [onlineMap, setOnlineMap] = useState({});
    const [socket] = useState(io('http://localhost:8000', {
        transports: ['websocket'], // force clean connection
    }))

    useEffect(() => {
        if (!userId) return;

        // const socket = io('http://localhost:8000'); // Adjust if needed
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('🔌 Socket connected:', socket.id);
            socket.emit('register', { userId }); // Register the user
        });

        socket.on('private_message', (message) => {
            console.log('📩 Received message:', message);
            onMessage?.(message);
        });

        socket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
        });

        socketRef.current.on('user_online', ({ userId }) => {
            setOnlineMap(prev => ({ ...prev, [userId]: true }));
        });

        socketRef.current.on('user_offline', ({ userId }) => {
            setOnlineMap(prev => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });
        });


        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId]);

    const sendMessage = ({ from, to, content }) => {
        console.log('📤 Sending message:', { from, to, content });
        socketRef.current?.emit('private_message', { from, to, content });
    };

    return { sendMessage , onlineMap };
};

export default useSocket;
