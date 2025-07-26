import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (user) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState({});
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [unreadCounts, setUnreadCounts] = useState({});

    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem('session') || localStorage.getItem('token');
        if (!token) {
            console.warn('No token found for socket connection');
            return;
        }

        console.log('Initializing socket connection for user:', user.fullname || user.name);

        // Initialize socket connection
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
        socketRef.current = io(socketUrl, {
            path: '/api/chat/socket.io',
            auth: {
                token: token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            timeout: 20000
        });

        const socket = socketRef.current;

        // Connection events
        socket.on('connect', () => {
            console.log('Connected to chat server - Socket ID:', socket.id);
            setIsConnected(true);
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from chat server:', reason);
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            setIsConnected(false);
        });

        // Message events
        socket.on('receive_message', (message) => {
            console.log('Received message:', message);
            const partnerId = message.senderId === (user.id || user._id) ? message.recipientId : message.senderId;
            
            setMessages(prev => ({
                ...prev,
                [partnerId]: [...(prev[partnerId] || []), message]
            }));
            
            // Update unread count if message is not from current user
            if (message.senderId !== (user.id || user._id)) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1
                }));
            }
        });

        socket.on('message_sent', (data) => {
            console.log('Message sent confirmation:', data);
            // Update the temporary message with the real message ID
            if (data.tempId && data.messageId) {
                setMessages(prev => {
                    const newMessages = { ...prev };
                    Object.keys(newMessages).forEach(partnerId => {
                        newMessages[partnerId] = newMessages[partnerId].map(msg => 
                            msg.id === data.tempId 
                                ? { ...msg, id: data.messageId, pending: false, timestamp: data.timestamp }
                                : msg
                        );
                    });
                    return newMessages;
                });
            }
        });

        socket.on('message_error', (data) => {
            console.error('Message error:', data);
            // Remove failed message from UI
            if (data.tempId) {
                setMessages(prev => {
                    const newMessages = { ...prev };
                    Object.keys(newMessages).forEach(partnerId => {
                        newMessages[partnerId] = newMessages[partnerId].filter(msg => 
                            msg.id !== data.tempId
                        );
                    });
                    return newMessages;
                });
            }
        });

        // Typing events
        socket.on('user_typing', (data) => {
            console.log('User typing:', data);
            setTypingUsers(prev => new Set([...prev, data.userId]));
        });

        socket.on('user_stop_typing', (data) => {
            console.log('User stopped typing:', data);
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
        });

        // Online status events
        socket.on('user_online', (data) => {
            console.log('User online:', data);
            setOnlineUsers(prev => new Set([...prev, data.userId]));
        });

        socket.on('user_offline', (data) => {
            console.log('User offline:', data);
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
        });

        socket.on('messages_read', (data) => {
            console.log('Messages read by:', data.readBy);
            // Update message read status in UI
            setMessages(prev => {
                const newMessages = { ...prev };
                Object.keys(newMessages).forEach(partnerId => {
                    if (partnerId === data.readBy) {
                        newMessages[partnerId] = newMessages[partnerId].map(msg => 
                            msg.senderId === (user.id || user._id) ? { ...msg, read: true } : msg
                        );
                    }
                });
                return newMessages;
            });
        });

        // Load chat history
        const loadChatHistory = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const response = await fetch(`${apiUrl}/api/chat/partners`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const partners = await response.json();
                    console.log('Found chat partners:', partners);
                    
                    // Load recent messages for each partner
                    for (const partner of partners) {
                        try {
                            const messagesResponse = await fetch(`${apiUrl}/api/chat/messages/${partner._id}?limit=20`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            });
                            
                            if (messagesResponse.ok) {
                                const { messages: chatHistory } = await messagesResponse.json();
                                
                                setMessages(prev => ({
                                    ...prev,
                                    [partner._id]: chatHistory.map(msg => ({
                                        id: msg._id,
                                        senderId: msg.senderId._id || msg.senderId,
                                        senderName: msg.senderId.fullname || msg.senderId.name || 'Unknown',
                                        recipientId: msg.recipientId._id || msg.recipientId,
                                        content: msg.content,
                                        type: msg.type || 'text',
                                        timestamp: msg.timestamp,
                                        read: msg.read,
                                        pending: false
                                    }))
                                }));
                                
                                // Set unread counts
                                setUnreadCounts(prev => ({
                                    ...prev,
                                    [partner._id]: partner.unreadCount || 0
                                }));
                            }
                        } catch (error) {
                            console.error(`Error loading messages for partner ${partner._id}:`, error);
                        }
                    }
                } else {
                    console.error('Failed to fetch chat partners:', response.status);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        };

        // Load chat history after connection is established
        if (socket.connected) {
            loadChatHistory();
        } else {
            socket.on('connect', loadChatHistory);
        }

        // Cleanup
        return () => {
            console.log('Cleaning up socket connection');
            socket.disconnect();
        };
    }, [user]);

    const sendMessage = (recipientId, content, type = 'text') => {
        if (!socketRef.current || !isConnected) {
            console.warn('Socket not connected, cannot send message');
            return null;
        }

        if (!recipientId || !content.trim()) {
            console.warn('Invalid message data:', { recipientId, content });
            return null;
        }

        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('Sending message:', { recipientId, content, type, tempId });
        
        socketRef.current.emit('send_message', {
            recipientId,
            content: content.trim(),
            type,
            tempId
        });

        // Optimistically add message to local state
        const tempMessage = {
            id: tempId,
            senderId: user.id || user._id,
            senderName: user.fullname || user.name || 'You',
            recipientId,
            content: content.trim(),
            type,
            timestamp: new Date(),
            read: false,
            pending: true
        };

        setMessages(prev => ({
            ...prev,
            [recipientId]: [...(prev[recipientId] || []), tempMessage]
        }));

        return tempId;
    };

    const joinChat = (partnerId) => {
        if (!socketRef.current || !isConnected) {
            console.warn('Socket not connected, cannot join chat');
            return;
        }
        
        console.log('Joining chat with partner:', partnerId);
        socketRef.current.emit('join_chat', { partnerId });
    };

    const startTyping = (recipientId) => {
        if (!socketRef.current || !isConnected) return;
        
        console.log('Started typing to:', recipientId);
        socketRef.current.emit('typing', { recipientId });
    };

    const stopTyping = (recipientId) => {
        if (!socketRef.current || !isConnected) return;
        
        console.log('Stopped typing to:', recipientId);
        socketRef.current.emit('stop_typing', { recipientId });
    };

    const markMessagesAsRead = (partnerId) => {
        if (!socketRef.current || !isConnected) return;
        
        console.log('Marking messages as read for partner:', partnerId);
        socketRef.current.emit('mark_messages_read', { partnerId });
        
        // Update local unread count immediately
        setUnreadCounts(prev => ({
            ...prev,
            [partnerId]: 0
        }));

        // Update message read status locally for messages from this partner
        setMessages(prev => {
            const newMessages = { ...prev };
            if (newMessages[partnerId]) {
                newMessages[partnerId] = newMessages[partnerId].map(msg => 
                    msg.senderId === partnerId ? { ...msg, read: true } : msg
                );
            }
            return newMessages;
        });
    };

    const getConnectionStatus = () => {
        return {
            isConnected,
            socketId: socketRef.current?.id,
            transport: socketRef.current?.io?.engine?.transport?.name
        };
    };

    return {
        isConnected,
        messages,
        onlineUsers,
        typingUsers,
        unreadCounts,
        sendMessage,
        joinChat,
        startTyping,
        stopTyping,
        markMessagesAsRead,
        getConnectionStatus
    };
};