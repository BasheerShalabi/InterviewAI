import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userId, onMessage , onOnlineUpdate) => {
    const socketRef = useRef(null);
    const [onlineMap, setOnlineMap] = useState({});
    const [socket] = useState(io(':8000', {
        transports: ['websocket'], 
    }))

    useEffect(() => {
        if (!userId) return;

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('🔌 Socket connected:', socket.id);
            socket.emit('register', { userId });
            socketRef.current.emit('get_online_users');
        });

        socket.on('private_message', (message) => {
            console.log('📩 Received message:', message);
            onMessage?.(message);
        });

        socketRef.current.on('online_users', (ids) => {
            onOnlineUpdate(prev => {
                const map = {};
                ids.forEach(id => {
                    map[id] = true;
                });
                return map;
            });
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
