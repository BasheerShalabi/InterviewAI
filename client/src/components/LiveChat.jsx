import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Phone, Video, MoreVertical, CheckCheck, Clock, Smile, Paperclip } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

const LiveChat = ({ user, chatPartners = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [showPartnerList, setShowPartnerList] = useState(true);
    const messagesEndRef = useRef(null);
    const chatInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const {
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
    } = useSocket(user);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedPartner]);

    // Focus input when partner is selected
    useEffect(() => {
        if (selectedPartner && chatInputRef.current && !showPartnerList) {
            chatInputRef.current.focus();
        }
    }, [selectedPartner, showPartnerList]);

    // Join chat room when partner is selected
    useEffect(() => {
        if (selectedPartner) {
            joinChat(selectedPartner._id);
            markMessagesAsRead(selectedPartner._id);
            setShowPartnerList(false);
        }
    }, [selectedPartner, joinChat, markMessagesAsRead]);

    // Debug connection status
    useEffect(() => {
        const status = getConnectionStatus();
        console.log('Connection status:', status);
    }, [isConnected, getConnectionStatus]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPartner || !isConnected) return;

        const messageId = sendMessage(selectedPartner._id, newMessage.trim());
        if (messageId) {
            setNewMessage('');
            stopTyping(selectedPartner._id);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        
        if (!selectedPartner || !isConnected) return;
        
        startTyping(selectedPartner._id);
        
        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(selectedPartner._id);
        }, 3000);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        
        return date.toLocaleDateString();
    };

    const getTotalUnreadCount = () => {
        return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
    };

    const handlePartnerSelect = (partner) => {
        setSelectedPartner(partner);
        setShowPartnerList(false);
    };

    const handleBackToList = () => {
        setSelectedPartner(null);
        setShowPartnerList(true);
        setNewMessage('');
    };

    const partnerMessages = selectedPartner ? messages[selectedPartner._id] || [] : [];
    const isPartnerTyping = selectedPartner && typingUsers.has(selectedPartner._id);
    const isPartnerOnline = selectedPartner && onlineUsers.has(selectedPartner._id);

    // Don't render if user is not available
    if (!user) {
        return null;
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 relative z-40"
                title="Open live chat"
            >
                <MessageCircle className="w-6 h-6" />
                {getTotalUnreadCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getTotalUnreadCount() > 9 ? '9+' : getTotalUnreadCount()}
                    </span>
                )}
                {!isConnected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                )}
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-indigo-600 text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                    {selectedPartner && !showPartnerList ? (
                        <>
                            <button
                                onClick={handleBackToList}
                                className="text-white hover:text-indigo-200 transition-colors"
                                title="Back to chat list"
                            >
                                ←
                            </button>
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{selectedPartner.fullname}</h3>
                                <p className="text-xs text-indigo-200">
                                    {isConnected ? (
                                        <>
                                            {isPartnerOnline ? 'Online' : 'Offline'}
                                            {isPartnerTyping && ' • typing...'}
                                        </>
                                    ) : (
                                        'Connecting...'
                                    )}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <MessageCircle className="w-5 h-5" />
                            <h2 className="font-semibold">Live Chat</h2>
                            {!isConnected && (
                                <span className="text-xs bg-red-500/20 px-2 py-1 rounded-full">
                                    Offline
                                </span>
                            )}
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {selectedPartner && !showPartnerList && (
                        <>
                            <button 
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Voice call"
                            >
                                <Phone className="w-4 h-4" />
                            </button>
                            <button 
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="Video call"
                            >
                                <Video className="w-4 h-4" />
                            </button>
                            <button 
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                title="More options"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Close chat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                {showPartnerList ? (
                    /* Partner List */
                    <div className="flex-1 overflow-y-auto">
                        {chatPartners.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No chat partners available</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {user.role === 'coach' ? 'No assigned students' : 'No coach assigned'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-2">
                                {chatPartners.map((partner) => {
                                    const partnerUnreadCount = unreadCounts[partner._id] || 0;
                                    const lastMessage = messages[partner._id]?.slice(-1)[0];
                                    
                                    return (
                                        <div
                                            key={partner._id}
                                            onClick={() => handlePartnerSelect(partner)}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                        >
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                {onlineUsers.has(partner._id) && (
                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-sm text-gray-800 truncate">
                                                        {partner.fullname}
                                                    </h4>
                                                    {lastMessage && (
                                                        <span className="text-xs text-gray-500">
                                                            {formatTime(lastMessage.timestamp)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {lastMessage ? 
                                                            `${lastMessage.senderId === user.id ? 'You: ' : ''}${lastMessage.content}` : 
                                                            'No messages yet'
                                                        }
                                                    </p>
                                                    {partnerUnreadCount > 0 && (
                                                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                            {partnerUnreadCount > 9 ? '9+' : partnerUnreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Chat Messages */
                    <>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {partnerMessages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Start a conversation!</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Send your first message to {selectedPartner?.fullname}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                partnerMessages.map((message) => {
                                    const isOwn = message.senderId === user.id;
                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                                    isOwn
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                <p className="break-words">{message.content}</p>
                                                <div className={`flex items-center gap-1 mt-1 ${
                                                    isOwn ? 'justify-end' : 'justify-start'
                                                }`}>
                                                    <span className={`text-xs ${
                                                        isOwn ? 'text-indigo-200' : 'text-gray-500'
                                                    }`}>
                                                        {formatTime(message.timestamp)}
                                                    </span>
                                                    {isOwn && (
                                                        <div className="text-indigo-200">
                                                            {message.pending ? (
                                                                <Clock className="w-3 h-3" />
                                                            ) : message.read ? (
                                                                <CheckCheck className="w-3 h-3" />
                                                            ) : (
                                                                <div className="w-3 h-3 border border-indigo-200 rounded-full" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            
                            {/* Typing indicator */}
                            {isPartnerTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="border-t border-gray-200 p-3">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                    title="Attach file"
                                >
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <input
                                    ref={chatInputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={!isConnected}
                                    maxLength={1000}
                                />
                                <button
                                    type="button"
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                    title="Add emoji"
                                >
                                    <Smile className="w-4 h-4" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || !isConnected}
                                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    title="Send message"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                            {!isConnected && (
                                <p className="text-xs text-red-500 mt-1 text-center">
                                    Disconnected - trying to reconnect...
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LiveChat;