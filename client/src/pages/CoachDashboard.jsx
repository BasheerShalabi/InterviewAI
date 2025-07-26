import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, User, Users, Clock, Award, X, AlertTriangle, MessageCircle, Star, Send, Eye, Smile, Paperclip, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";
import HeaderComponent from "../components/HeaderComponent";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from 'axios';
import LiveChat from "../components/LiveChat";
import PopUpChat from "../components/PopUpChat";

// LiveChat Component
// const LiveChat = ({ user, chatPartners = [] }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedPartner, setSelectedPartner] = useState(null);
//     const [newMessage, setNewMessage] = useState('');
//     const [showPartnerList, setShowPartnerList] = useState(true);
//     const [messages, setMessages] = useState({});
//     const [onlineUsers, setOnlineUsers] = useState(new Set());
//     const [typingUsers, setTypingUsers] = useState(new Set());
//     const [unreadCounts, setUnreadCounts] = useState({});
//     const [isConnected, setIsConnected] = useState(true);
//     const messagesEndRef = useRef(null);
//     const chatInputRef = useRef(null);
//     const typingTimeoutRef = useRef(null);

//     // Mock socket functions for demo - replace with actual useSocket hook
//     const sendMessage = (recipientId, content) => {
//         const newMsg = {
//             id: Date.now().toString(),
//             senderId: user.id,
//             senderName: user.fullname,
//             recipientId,
//             content,
//             timestamp: new Date(),
//             read: false
//         };

//         setMessages(prev => ({
//             ...prev,
//             [recipientId]: [...(prev[recipientId] || []), newMsg]
//         }));
//     };

//     const joinChat = (partnerId) => {
//         console.log('Joining chat with:', partnerId);
//     };

//     const startTyping = (recipientId) => {
//         console.log('Started typing to:', recipientId);
//     };

//     const stopTyping = (recipientId) => {
//         console.log('Stopped typing to:', recipientId);
//     };

//     const markMessagesAsRead = (partnerId) => {
//         setUnreadCounts(prev => ({
//             ...prev,
//             [partnerId]: 0
//         }));
//     };

//     // Auto-scroll to bottom
//     useEffect(() => {
//         if (messagesEndRef.current) {
//             messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     }, [messages, selectedPartner]);

//     // Focus input when partner is selected
//     useEffect(() => {
//         if (selectedPartner && chatInputRef.current) {
//             chatInputRef.current.focus();
//         }
//     }, [selectedPartner]);

//     // Join chat room when partner is selected
//     useEffect(() => {
//         if (selectedPartner) {
//             joinChat(selectedPartner._id);
//             markMessagesAsRead(selectedPartner._id);
//             setShowPartnerList(false);
//         }
//     }, [selectedPartner]);

//     const handleSendMessage = (e) => {
//         e.preventDefault();
//         if (!newMessage.trim() || !selectedPartner) return;

//         sendMessage(selectedPartner._id, newMessage);
//         setNewMessage('');
//         stopTyping(selectedPartner._id);
//     };

//     const handleTyping = (e) => {
//         setNewMessage(e.target.value);

//         if (!selectedPartner) return;

//         startTyping(selectedPartner._id);

//         // Clear previous timeout
//         if (typingTimeoutRef.current) {
//             clearTimeout(typingTimeoutRef.current);
//         }

//         // Stop typing after 3 seconds of inactivity
//         typingTimeoutRef.current = setTimeout(() => {
//             stopTyping(selectedPartner._id);
//         }, 3000);
//     };

//     const formatTime = (timestamp) => {
//         const date = new Date(timestamp);
//         const now = new Date();
//         const diffInMinutes = Math.floor((now - date) / (1000 * 60));

//         if (diffInMinutes < 1) return 'Just now';
//         if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//         if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

//         return date.toLocaleDateString();
//     };

//     const getTotalUnreadCount = () => {
//         return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
//     };

//     const partnerMessages = selectedPartner ? messages[selectedPartner._id] || [] : [];
//     const isPartnerTyping = selectedPartner && typingUsers.has(selectedPartner._id);
//     const isPartnerOnline = selectedPartner && onlineUsers.has(selectedPartner._id);

//     if (!isOpen) {
//         return (
//             <button
//                 onClick={() => setIsOpen(true)}
//                 className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 relative"
//                 title="Open live chat"
//             >
//                 <MessageCircle className="w-6 h-6" />
//                 {getTotalUnreadCount() > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                         {getTotalUnreadCount() > 9 ? '9+' : getTotalUnreadCount()}
//                     </span>
//                 )}
//                 {!isConnected && (
//                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
//                 )}
//             </button>
//         );
//     }

//     return (
//         <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-indigo-600 text-white rounded-t-2xl">
//                 <div className="flex items-center gap-3">
//                     {selectedPartner && !showPartnerList ? (
//                         <>
//                             <button
//                                 onClick={() => {
//                                     setSelectedPartner(null);
//                                     setShowPartnerList(true);
//                                 }}
//                                 className="text-white hover:text-indigo-200"
//                             >
//                                 ←
//                             </button>
//                             <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                                 <User className="w-4 h-4" />
//                             </div>
//                             <div>
//                                 <h3 className="font-semibold text-sm">{selectedPartner.fullname}</h3>
//                                 <p className="text-xs text-indigo-200">
//                                     {isPartnerOnline ? 'Online' : 'Offline'}
//                                     {isPartnerTyping && ' • typing...'}
//                                 </p>
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             <MessageCircle className="w-5 h-5" />
//                             <h2 className="font-semibold">Live Chat</h2>
//                         </>
//                     )}
//                 </div>
//                 <div className="flex items-center gap-2">
//                     {selectedPartner && !showPartnerList && (
//                         <>
//                             <button className="p-1 hover:bg-white/20 rounded">
//                                 <Phone className="w-4 h-4" />
//                             </button>
//                             <button className="p-1 hover:bg-white/20 rounded">
//                                 <Video className="w-4 h-4" />
//                             </button>
//                             <button className="p-1 hover:bg-white/20 rounded">
//                                 <MoreVertical className="w-4 h-4" />
//                             </button>
//                         </>
//                     )}
//                     <button
//                         onClick={() => setIsOpen(false)}
//                         className="p-1 hover:bg-white/20 rounded"
//                     >
//                         <X className="w-4 h-4" />
//                     </button>
//                 </div>
//             </div>

//             {/* Content */}
//             <div className="flex-1 flex flex-col">
//                 {showPartnerList ? (
//                     /* Partner List */
//                     <div className="flex-1 overflow-y-auto">
//                         {chatPartners.length === 0 ? (
//                             <div className="flex items-center justify-center h-full text-gray-500">
//                                 <div className="text-center">
//                                     <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                                     <p className="text-sm">No students assigned yet</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="p-2">
//                                 {chatPartners.map((partner) => {
//                                     const partnerUnreadCount = unreadCounts[partner._id] || 0;
//                                     const lastMessage = messages[partner._id]?.slice(-1)[0];

//                                     return (
//                                         <div
//                                             key={partner._id}
//                                             onClick={() => setSelectedPartner(partner)}
//                                             className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
//                                         >
//                                             <div className="relative">
//                                                 <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                                                     <User className="w-5 h-5 text-indigo-600" />
//                                                 </div>
//                                                 {onlineUsers.has(partner._id) && (
//                                                     <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                                                 )}
//                                             </div>
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="flex items-center justify-between">
//                                                     <h4 className="font-medium text-sm text-gray-800 truncate">
//                                                         {partner.fullname}
//                                                     </h4>
//                                                     {lastMessage && (
//                                                         <span className="text-xs text-gray-500">
//                                                             {formatTime(lastMessage.timestamp)}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                                 <div className="flex items-center justify-between">
//                                                     <p className="text-xs text-gray-500 truncate">
//                                                         {lastMessage ? 
//                                                             `${lastMessage.senderName === user.fullname ? 'You: ' : ''}${lastMessage.content}` : 
//                                                             'No messages yet'
//                                                         }
//                                                     </p>
//                                                     {partnerUnreadCount > 0 && (
//                                                         <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                                                             {partnerUnreadCount > 9 ? '9+' : partnerUnreadCount}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     /* Chat Messages */
//                     <>
//                         <div className="flex-1 overflow-y-auto p-3 space-y-3">
//                             {partnerMessages.length === 0 ? (
//                                 <div className="flex items-center justify-center h-full text-gray-500">
//                                     <div className="text-center">
//                                         <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                                         <p className="text-sm">Start a conversation!</p>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 partnerMessages.map((message) => {
//                                     const isOwn = message.senderId === user.id;
//                                     return (
//                                         <div
//                                             key={message.id}
//                                             className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
//                                         >
//                                             <div
//                                                 className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
//                                                     isOwn
//                                                         ? 'bg-indigo-600 text-white'
//                                                         : 'bg-gray-100 text-gray-800'
//                                                 }`}
//                                             >
//                                                 <p>{message.content}</p>
//                                                 <div className={`flex items-center gap-1 mt-1 ${
//                                                     isOwn ? 'justify-end' : 'justify-start'
//                                                 }`}>
//                                                     <span className={`text-xs ${
//                                                         isOwn ? 'text-indigo-200' : 'text-gray-500'
//                                                     }`}>
//                                                         {formatTime(message.timestamp)}
//                                                     </span>
//                                                     {isOwn && (
//                                                         <div className="text-indigo-200">
//                                                             {message.pending ? (
//                                                                 <Clock className="w-3 h-3" />
//                                                             ) : message.read ? (
//                                                                 <CheckCheck className="w-3 h-3" />
//                                                             ) : (
//                                                                 <div className="w-3 h-3 border border-indigo-200 rounded-full" />
//                                                             )}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>

//                         {/* Message Input */}
//                         <div className="border-t border-gray-200 p-3">
//                             <form onSubmit={handleSendMessage} className="flex items-center gap-2">
//                                 <input
//                                     ref={chatInputRef}
//                                     type="text"
//                                     value={newMessage}
//                                     onChange={handleTyping}
//                                     placeholder="Type a message..."
//                                     className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     disabled={!isConnected}
//                                 />
//                                 <button
//                                     type="submit"
//                                     disabled={!newMessage.trim() || !isConnected}
//                                     className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                                 >
//                                     <Send className="w-4 h-4" />
//                                 </button>
//                             </form>
//                             {!isConnected && (
//                                 <p className="text-xs text-red-500 mt-1 text-center">
//                                     Disconnected - trying to reconnect...
//                                 </p>
//                             )}
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

export default function CoachDashboard() {
    const { user, logout } = useAuth();
    const [requests, setRequests] = useState(null);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [completedInterviews, setCompletedInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removeConfirmation, setRemoveConfirmation] = useState(null);
    const [removingUser, setRemovingUser] = useState(null);
    const [feedbackModal, setFeedbackModal] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackRating, setFeedbackRating] = useState(0);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [activeTab, setActiveTab] = useState("requests");
    const [chatPartners, setChatPartners] = useState([]);

    const getToken = () => {
        try {
            return localStorage.getItem("session") || localStorage.getItem("token") || localStorage.getItem("authToken");
        } catch (error) {
            console.warn("Error accessing localStorage:", error);
            return null;
        }
    };

    // Fetch chat partners
    useEffect(() => {
        const fetchChatPartners = async () => {
            const token = getToken();
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8000/api/chat/partners', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data)
                setChatPartners(response.data);
            } catch (error) {
                console.error('Error fetching chat partners:', error);
                // Fallback to assigned users if chat API is not available
                setChatPartners(assignedUsers.map(user => ({
                    _id: user._id,
                    fullname: user.fullname || user.name,
                    email: user.email
                })));
            }
        };

        if (user) {
            fetchChatPartners();
        }
    }, [user, assignedUsers]);

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();

            if (!token) {
                setError("No authentication token found. Please log in again.");
                setLoading(false);
                return;
            }

            if (!user) {
                console.warn("User not available from auth context");
            }

            try {
                setError(null);
                console.log("Fetching data with token:", token.substring(0, 20) + "...");

                // Fetch requests
                console.log("Fetching coaching requests...");
                const resRequests = await fetch("http://localhost:8000/api/coaches/requests", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!resRequests.ok) {
                    throw new Error(`Failed to fetch requests: ${resRequests.status} ${resRequests.statusText}`);
                }

                const dataRequests = await resRequests.json();
                console.log("Requests data:", dataRequests);
                setRequests(Array.isArray(dataRequests) ? dataRequests : []);

                // Fetch assigned users
                console.log("Fetching assigned users...");
                const resUsers = await fetch("http://localhost:8000/api/coaches/assigned-users", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!resUsers.ok) {
                    throw new Error(`Failed to fetch assigned users: ${resUsers.status} ${resUsers.statusText}`);
                }

                const dataUsers = await resUsers.json();
                console.log("Assigned users data:", dataUsers);
                setAssignedUsers(Array.isArray(dataUsers) ? dataUsers : []);

                // Fetch completed interviews for feedback
                console.log("Fetching user sessions...");
                const resInterviews = await fetch("http://localhost:8000/api/coaches/assigned-users/sessions", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!resInterviews.ok) {
                    console.warn(`Failed to fetch interviews: ${resInterviews.status} ${resInterviews.statusText}`);
                    setCompletedInterviews([]);
                } else {
                    const dataInterviews = await resInterviews.json();
                    console.log("Interviews data:", dataInterviews);

                    const transformedInterviews = Array.isArray(dataInterviews)
                        ? dataInterviews
                            .filter(session => session.isComplete)
                            .map(session => ({
                                _id: session._id,
                                interviewId: session._id,
                                userName: session.user?.fullname || session.userName || "Unknown User",
                                userId: session.user?._id || session.userId,
                                interviewType: session.type || "General",
                                completedAt: session.updatedAt || session.createdAt,
                                hasFeedback: session.coachFeedback ? true : false,
                                feedback: session.coachFeedback?.feedback || "",
                                rating: session.coachFeedback?.rating || 0,
                                createdAt: session.coachFeedback?.createdAt || null
                            }))
                        : [];

                    setCompletedInterviews(transformedInterviews);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Failed to load dashboard data");
                setRequests([]);
                setAssignedUsers([]);
                setCompletedInterviews([]);
            } finally {
                setLoading(false);
            }
        };

        if (user || loading) {
            fetchData();
        } else {
            setLoading(false);
            setError("User authentication required");
        }
    }, [user]);

    const handleAccept = async (userId) => {
        const token = getToken();
        if (!token) {
            alert("Authentication token not found. Please log in again.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/coaches/respond/${userId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ accept: true }),
            });

            if (!response.ok) {
                throw new Error(`Failed to accept request: ${response.status} ${response.statusText}`);
            }

            setRequests((prev) => prev.filter((r) => r._id !== userId));

            // Refresh assigned users
            const resUsers = await fetch("http://localhost:8000/api/coaches/assigned-users", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (resUsers.ok) {
                const dataUsers = await resUsers.json();
                setAssignedUsers(Array.isArray(dataUsers) ? dataUsers : []);
            }
        } catch (err) {
            console.error("Error accepting request:", err);
            alert(`Failed to accept request: ${err.message}`);
        }
    };

    const handleRemoveUser = async (userId) => {
        const token = getToken();
        if (!token) {
            alert("Authentication token not found. Please log in again.");
            return;
        }

        setRemovingUser(userId);
        try {
            const response = await fetch(`http://localhost:8000/api/coaches/remove-user/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to remove user: ${response.status} ${response.statusText}`);
            }

            setAssignedUsers((prev) => prev.filter((user) => user._id !== userId));
            setRemoveConfirmation(null);
            alert("User removed successfully!");
        } catch (err) {
            console.error("Error removing user:", err);
            alert(`Failed to remove user: ${err.message}`);
        } finally {
            setRemovingUser(null);
        }
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackText.trim() || feedbackRating === 0) {
            alert("Please provide both feedback text and rating.");
            return;
        }

        const token = getToken();
        if (!token) {
            alert("Authentication token not found. Please log in again.");
            return;
        }

        setSubmittingFeedback(true);
        try {
            const response = await fetch(`http://localhost:8000/api/sessions/${feedbackModal.interviewId}/coach-feedback`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    feedback: feedbackText,
                    rating: feedbackRating,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to submit feedback: ${response.status} ${response.statusText}`);
            }

            setCompletedInterviews(prev =>
                prev.map(interview =>
                    interview.interviewId === feedbackModal.interviewId
                        ? {
                            ...interview,
                            hasFeedback: true,
                            feedback: feedbackText,
                            rating: feedbackRating,
                            createdAt: new Date().toISOString()
                        }
                        : interview
                )
            );
            setFeedbackModal(null);
            setFeedbackText("");
            setFeedbackRating(0);
            alert("Feedback submitted successfully!");
        } catch (err) {
            console.error("Error submitting feedback:", err);
            alert(`Failed to submit feedback: ${err.message}`);
        } finally {
            setSubmittingFeedback(false);
        }
    };

    const openFeedbackModal = (interview) => {
        setFeedbackModal(interview);
        setFeedbackText(interview.feedback || "");
        setFeedbackRating(interview.rating || 0);
    };

    const closeFeedbackModal = () => {
        setFeedbackModal(null);
        setFeedbackText("");
        setFeedbackRating(0);
    };

    const confirmRemoval = (user) => {
        setRemoveConfirmation(user);
    };

    const cancelRemoval = () => {
        setRemoveConfirmation(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
                <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div
                        className="w-16 h-16 border-4 border-slate-300 border-t-indigo-600 rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-slate-600">Loading your dashboard...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
                <motion.div
                    className="text-center max-w-md mx-auto p-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Unable to Load Dashboard</h2>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Retry
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
                <motion.div
                    className="text-center max-w-md mx-auto p-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <User className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Authentication Required</h2>
                    <p className="text-slate-600 mb-4">Please log in to access your coach dashboard.</p>
                    <button
                        onClick={() => logout && logout()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Go to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    return (<>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 relative">
            <HeaderComponent user={user} logout={logout} />

            <div className="p-6 max-w-6xl mx-auto">
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">
                        Welcome Coach {user?.fullname || user?.name || "Coach"}
                    </h1>
                    {user?.email && (
                        <p className="text-slate-600">{user.email}</p>
                    )}
                </motion.div>

                {/* Stats Cards */}
                <div className="flex justify-center gap-6 mb-8 flex-wrap">
                    <motion.div
                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 max-w-xs flex-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="text-center">
                            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-green-700 font-semibold text-base">
                                Users Coached
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mt-1">
                                {assignedUsers.length}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 max-w-xs flex-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-center">
                            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                            <div className="text-orange-700 font-semibold text-base">
                                Pending Requests
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mt-1">
                                {requests.length}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 max-w-xs flex-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="text-center">
                            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-blue-700 font-semibold text-base">
                                Interviews to Review
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mt-1">
                                {completedInterviews.filter(interview => !interview.hasFeedback).length}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 max-w-xs flex-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="text-center">
                            <Award className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                            <div className="text-indigo-700 font-semibold text-base">
                                Total Feedback Given
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mt-1">
                                {completedInterviews.filter(interview => interview.hasFeedback).length}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Progress Banner */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Coaching Progress</h3>
                                <p className="text-indigo-100">
                                    You are currently coaching{" "}
                                    <span className="font-bold text-white">{assignedUsers.length}</span> user{assignedUsers.length !== 1 ? 's' : ''}.
                                    {requests.length > 0 && (
                                        <span> You have <span className="font-bold text-white">{requests.length}</span> pending request{requests.length !== 1 ? 's' : ''} waiting for your response.</span>
                                    )}
                                    {completedInterviews.filter(interview => !interview.hasFeedback).length > 0 && (
                                        <span> There are <span className="font-bold text-white">{completedInterviews.filter(interview => !interview.hasFeedback).length}</span> completed interview{completedInterviews.filter(interview => !interview.hasFeedback).length !== 1 ? 's' : ''} awaiting your feedback.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="flex gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === "requests"
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-600 hover:bg-white/80"
                                }`}
                        >
                            Pending Requests ({requests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === "users"
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-600 hover:bg-white/80"
                                }`}
                        >
                            Assigned Users ({assignedUsers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("interviews")}
                            className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === "interviews"
                                ? "bg-indigo-600 text-white shadow-md"
                                : "text-slate-600 hover:bg-white/80"
                                }`}
                        >
                            Interview Feedback ({completedInterviews.length})
                        </button>
                    </div>
                </div>

                {/* Pending Requests Tab */}
                {activeTab === "requests" && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Pending Coaching Requests</h2>
                        {requests.length === 0 ? (
                            <div className="text-center py-20">
                                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg">
                                    No pending coaching requests at the moment.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {requests.map((req, index) => (
                                    <motion.div
                                        key={req._id}
                                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-xl font-semibold text-slate-800">
                                                {req.fullname || req.name || "Unknown User"}
                                            </h3>
                                            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                                Pending
                                            </span>
                                        </div>
                                        <div className="text-slate-600 text-sm mb-4 space-y-1">
                                            <p className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Email: {req.email || "Not provided"}
                                            </p>
                                            {req.createdAt && (
                                                <p className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Requested: {new Date(req.createdAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mt-4 text-right">
                                            <button
                                                onClick={() => handleAccept(req._id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 text-sm"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Accept Request
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Assigned Users Tab */}
                {activeTab === "users" && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Users Assigned to You</h2>
                        {assignedUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <User className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg">No users assigned to you yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {assignedUsers.map((userItem, index) => (
                                    <motion.div
                                        key={userItem._id}
                                        className="bg-white/80 backdrop-blur-xl shadow-md rounded-lg p-4 border border-white/20 flex items-center gap-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <User className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800">{userItem.fullname || userItem.name || "Unknown User"}</p>
                                            <p className="text-sm text-slate-600">{userItem.email || "No email provided"}</p>
                                            <p className="text-xs text-slate-500">
                                                Interviews completed: {completedInterviews.filter(interview => interview.userId === userItem._id).length}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => confirmRemoval(userItem)}
                                                disabled={removingUser === userItem._id}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm disabled:bg-red-300 disabled:cursor-not-allowed"
                                            >
                                                {removingUser === userItem._id ? (
                                                    <>
                                                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Removing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="w-4 h-4" />
                                                        <span>Remove</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Interview Feedback Tab */}
                {activeTab === "interviews" && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-700">Completed Interviews</h2>
                        {completedInterviews.length === 0 ? (
                            <div className="text-center py-20">
                                <MessageCircle className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 text-lg">
                                    No completed interviews to review at the moment.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {completedInterviews.map((interview, index) => (
                                    <motion.div
                                        key={interview._id}
                                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-slate-800">
                                                    {interview.userName}
                                                </h3>
                                                <p className="text-sm text-slate-600">
                                                    Interview Type: {interview.interviewType}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    Completed: {new Date(interview.completedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {interview.hasFeedback ? (
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Feedback Given
                                                    </span>
                                                ) : (
                                                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
                                                        Awaiting Feedback
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {interview.hasFeedback && (
                                            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < interview.rating
                                                                    ? "text-yellow-400 fill-current"
                                                                    : "text-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-slate-600">
                                                        ({interview.rating}/5)
                                                    </span>
                                                </div>
                                                <p className="text-slate-700 text-sm">
                                                    {interview.feedback}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-3">
                                            <div className="mt-4 text-right">
                                                <Link to={`/chat/session/${interview._id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 text-sm">
                                                    <Eye className="w-4 h-4" />
                                                    View Details
                                                </Link>
                                            </div>

                                            {interview.hasFeedback ? (
                                                <button
                                                    onClick={() => openFeedbackModal(interview)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors duration-200 text-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Edit Feedback
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => openFeedbackModal(interview)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 text-sm"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    Give Feedback
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* Remove User Confirmation Modal */}
            {removeConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Confirm Removal</h3>
                        </div>

                        <p className="text-slate-600 mb-6">
                            Are you sure you want to remove <span className="font-semibold text-slate-800">{removeConfirmation.fullname || removeConfirmation.name || "this user"}</span> from your coaching list?
                            This action cannot be undone and they will need to send a new request to be coached by you again.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelRemoval}
                                className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRemoveUser(removeConfirmation._id)}
                                disabled={removingUser === removeConfirmation._id}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
                            >
                                {removingUser === removeConfirmation._id ? "Removing..." : "Remove User"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Feedback Modal */}
            {feedbackModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <MessageCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Interview Feedback</h3>
                                <p className="text-sm text-slate-600">{feedbackModal.userName}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Rating (1-5 stars)
                                </label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFeedbackRating(star)}
                                            className="p-1 hover:scale-110 transition-transform duration-200"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= feedbackRating
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300 hover:text-yellow-200"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Feedback Comments
                                </label>
                                <textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    placeholder="Provide detailed feedback about the interview performance, areas of improvement, and strengths..."
                                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={closeFeedbackModal}
                                className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={submittingFeedback || !feedbackText.trim() || feedbackRating === 0}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                                {submittingFeedback ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>{feedbackModal.hasFeedback ? "Update Feedback" : "Submit Feedback"}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Live Chat Component */}
        </div>
            <PopUpChat user={user} chatPartners={chatPartners} />
        </>
    );
}