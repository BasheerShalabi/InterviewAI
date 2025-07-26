import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import LiveChat from "../components/LiveChat";

import {
    CalendarDays,
    Clock,
    CheckCircle,
    FileText,
    ClipboardPenLine,
    Star,
    Eye,
    MessageCircle,
    X,
    User,
    Award,
    TrendingUp,
} from "lucide-react";
import HeaderComponent from "../components/HeaderComponent";
import { useAuth } from "../context/AuthContext";
import FooterComponent from "../components/FooterComponent";
import { Link } from "react-router-dom";
import PopUpChat from "../components/PopUpChat";

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coaches, setCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState("");
    const [coachRequested, setCoachRequested] = useState(
        user?.coachRequestPending || false
    );
    const [currentCoach, setCurrentCoach] = useState("");
    const [feedbackModal, setFeedbackModal] = useState(null);
    const [coachFeedback, setCoachFeedback] = useState([]);
    const [chatPartners, setChatPartners] = useState([]);
    const token = localStorage.getItem("session");
    const [count, setCount] = useState(0);

    const fetchUserData = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedUser = res.data;

            setCoachRequested(updatedUser?.coachRequestPending || false);

            return updatedUser;
        } catch (err) {
            console.error("Error fetching user data:", err);
            return user;
        }
    };

    const fetchCoachFeedback = async () => {
        // Extract coach feedback from interviews data
        const feedbackArray = interviews
            .filter((interview) => interview.coachFeedback) // Only interviews with coach feedback
            .map((interview) => ({
                interviewId: interview._id,
                feedback: interview.coachFeedback.feedback || "",
                rating: interview.coachFeedback.rating || 0,
                createdAt: interview.coachFeedback.createdAt || interview.updatedAt,
                interviewType: interview.type || "General",
            }));

        setCoachFeedback(feedbackArray);
        console.log("Coach feedback extracted:", feedbackArray);
    };

    const fetchCoaches = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/coaches", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data;
            setCoaches(data.map((c) => ({ id: c._id, name: c.fullname })));
        } catch (err) {
            console.error("Error fetching coaches:", err);
        }
    };

        // Fetch chat partners (coach if assigned)
        const fetchChatPartners = async () => {
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8000/api/chat/partners', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setChatPartners(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching chat partners:', error);
                // Fallback: if user has a coach, add them as chat partner
                if (user?.coachId) {
                    const coachName = getCurrentCoachName();
                    if (coachName) {
                        setChatPartners([{
                            _id: typeof user.coachId === 'object' ? user.coachId._id : user.coachId,
                            fullname: coachName,
                            email: typeof user.coachId === 'object' ? user.coachId.email : ''
                        }]);
                    }
                }
            }
        }


useEffect(() => {
    console.log("User data:", user);
    if (coaches.length === 0) {
        fetchCoaches();
    }
    if (interviews.length === 0) {
        fetchData();
    }
    if (user) {
        fetchChatPartners();
    }
}, [user]);

// Extract coach feedback whenever interviews data changes
useEffect(() => {
    if (interviews.length > 0) {
        fetchCoachFeedback();
    }
}, [interviews]);

// Refetch chat partners when coach assignment changes
useEffect(() => {
    if (user?.coachId && chatPartners.length === 0) {
        fetchChatPartners();
    }
}, [user?.coachId]);

const getCurrentCoachName = () => {
    if (!user || !user.coachId) return "";

    if (typeof user.coachId === "object" && user.coachId.fullname) {
        return user.coachId.fullname;
    }

    if (coaches.length > 0) {
        const userCoachId =
            typeof user.coachId === "object" ? user.coachId._id : user.coachId;
        const coachObj = coaches.find((c) => c.id === userCoachId);
        return coachObj ? coachObj.name : "";
    }

    return currentCoach;
};

const sendRequest = async () => {
    try {
        const response = await fetch(
            "http://localhost:8000/api/users/send-request",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error sending request:", error);
        alert("Failed to send request. Please try again.");
    }
};

const fetchData = async () => {
    try {
        const res = await fetch("http://localhost:8000/api/sessions", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        console.log("Fetched sessions:", data);
        setCount(data.filter((i) => i.isComplete).length);
        setInterviews(data);
    } catch (err) {
        console.error("Failed to fetch sessions:", err);
    } finally {
        setLoading(false);
    }
};

const statusStyles = {
    completed: "bg-green-100 text-green-700",
    inprogress: "bg-blue-100 text-blue-700",
};

const handleRequestCoach = async () => {
    if (!selectedCoach) return;

    try {
        const selected = coaches.find((c) => c.name === selectedCoach);
        if (!selected) return;

        await fetch(`http://localhost:8000/api/users/request/${selected.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        setCoachRequested(true);
        setSelectedCoach("");
    } catch (err) {
        console.error("Error sending request:", err);
        alert("Failed to send coach request.");
        setCoachRequested(false);
    }
};

const openFeedbackModal = (feedback) => {
    setFeedbackModal(feedback);
};

const closeFeedbackModal = () => {
    setFeedbackModal(null);
};

const getAverageRating = () => {
    if (coachFeedback.length === 0) return 0;
    const validRatings = coachFeedback.filter(
        (feedback) => feedback.rating > 0
    );
    if (validRatings.length === 0) return 0;

    const total = validRatings.reduce(
        (sum, feedback) => sum + feedback.rating,
        0
    );
    return (total / validRatings.length).toFixed(1);
};

const getFeedbackForInterview = (interviewId) => {
    return coachFeedback.find(
        (feedback) => feedback.interviewId === interviewId
    );
};

const renderedData = interviews.map((session, index) => {
    const sessionFeedback = getFeedbackForInterview(session._id);

    return (
        <motion.div
            key={index}
            className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-slate-800">
                    {session.type} Interview
                </h3>
                <div className="flex items-center gap-2">
                    <span
                        className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${session.isComplete
                                ? statusStyles.completed
                                : statusStyles.inprogress
                            }`}
                    >
                        {session.isComplete ? "Completed" : "In Progress"}
                    </span>
                    {sessionFeedback && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Coach Feedback
                        </span>
                    )}
                </div>
            </div>

            <div className="text-slate-600 space-y-1 mb-4 text-sm">
                <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {session.createdAt.split("T")[0]}
                </p>
                <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {session.createdAt.split("T")[1].split(".")[0]}
                </p>
                <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Coach: {getCurrentCoachName() || "Not assigned"}
                </p>
            </div>

            {/* Original AI Feedback */}
            {session.isComplete && session.feedback.length !== 0 && (
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-lg text-sm mb-4">
                    <div className="flex items-center gap-2 text-indigo-700 mb-1 font-medium">
                        <Star className="w-4 h-4" />
                        AI Feedback
                    </div>
                    {session.feedback.map((e, idx) => {
                        return (
                            <p key={idx} className="text-slate-700">
                                {e.questionNumber}: {e.content};
                            </p>
                        );
                    })}
                </div>
            )}

            {/* Coach Feedback Display */}
            {sessionFeedback && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg text-sm mb-4">
                    <div className="flex items-center gap-2 text-green-700 mb-2 font-medium">
                        <User className="w-4 h-4" />
                        Coach Feedback
                        <div className="flex items-center ml-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < sessionFeedback.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                />
                            ))}
                            <span className="ml-1 text-sm">
                                ({sessionFeedback.rating}/5)
                            </span>
                        </div>
                    </div>
                    <p className="text-slate-700">{sessionFeedback.feedback}</p>
                    <div className="mt-2">
                        <button
                            onClick={() => openFeedbackModal(sessionFeedback)}
                            className="text-green-600 hover:text-green-800 text-xs font-medium"
                        >
                            View Full Feedback
                        </button>
                    </div>
                </div>
            )}

            {session.inProgress && !session.isComplete ? (
                <div className="mt-4 text-right">
                    <Link
                        to={`/chat/session/${session._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 text-sm"
                    >
                        <ClipboardPenLine className="w-4 h-4" />
                        Resume Interview
                    </Link>
                </div>
            ) : (
                <div className="mt-4 text-right">
                    <Link
                        to={`/chat/session/${session._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 text-sm"
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                    </Link>
                </div>
            )}
        </motion.div>
    );
});

if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100">
            <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
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

return (
    <>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 relative">
            <HeaderComponent user={user} logout={logout} />

            <div className="p-6 max-w-4xl mx-auto ">
                <motion.div
                    className="mb-8 flex items-center justify-between"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">
                        {user?.fullname}
                    </h1>
                    <button
                        onClick={sendRequest}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                    >
                        Request to be a Coach
                    </button>
                </motion.div>

                {/* Enhanced Stats Cards */}
                <div className="flex justify-center gap-6 mb-8 flex-wrap">
                    <motion.div
                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 max-w-xs flex-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-green-700 font-semibold text-base">
                                Completed Interviews
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mt-1">
                                {count}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 max-w-xs flex-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="text-center">
                            {coachRequested || user?.requestId != null ? (
                                <>
                                    <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                    <div className="text-orange-700 font-semibold text-base">
                                        Coach Request
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm">Pending</span>
                                    </div>
                                </>
                            ) : user?.coachId != null ? (
                                <>
                                    <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <div className="text-green-700 font-semibold text-base">
                                        Your Coach
                                    </div>
                                    <div className="text-sm font-medium text-slate-800 mt-1">
                                        {getCurrentCoachName() || "Loading..."}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <User className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                    <div className="text-slate-700 font-semibold text-base mb-2">
                                        Request Coach
                                    </div>
                                    <select
                                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                        value={selectedCoach}
                                        onChange={(e) => setSelectedCoach(e.target.value)}
                                    >
                                        <option value="">Select a coach</option>
                                        {coaches.map((coach) => (
                                            <option key={coach.id} value={coach.name}>
                                                {coach.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleRequestCoach}
                                        disabled={!selectedCoach}
                                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Request Coach
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 max-w-xs flex-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-center">
                            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-purple-700 font-semibold text-base">
                                Average Rating
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mt-1 flex items-center justify-center gap-1">
                                {getAverageRating()}
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            </div>
                            <div className="text-xs text-slate-600">
                                From {coachFeedback.length} feedback
                                {coachFeedback.length !== 1 ? "s" : ""}
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
                            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-blue-700 font-semibold text-base">
                                Total Interviews
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mt-1">
                                {interviews.length}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Coach Feedback Summary */}
                {coachFeedback.length > 0 && (
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-3 rounded-full">
                                    <User className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">
                                        Coach Progress Report
                                    </h3>
                                    <p className="text-green-100">
                                        Your coach has provided feedback on{" "}
                                        <span className="font-bold text-white">
                                            {coachFeedback.length}
                                        </span>{" "}
                                        interview{coachFeedback.length !== 1 ? "s" : ""}
                                        with an average rating of{" "}
                                        <span className="font-bold text-white">
                                            {getAverageRating()}/5
                                        </span>{" "}
                                        stars.
                                        {getCurrentCoachName() && (
                                            <span>
                                                {" "}
                                                Keep up the great work with Coach{" "}
                                                {getCurrentCoachName()}!
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {interviews.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg">
                            You have no interviews scheduled yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">{renderedData}</div>
                )}
            </div>

            {/* Detailed Feedback Modal */}
            {feedbackModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 p-2 rounded-full">
                                <User className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Coach Feedback Details
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Feedback from {getCurrentCoachName()}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Rating
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-6 h-6 ${i < feedbackModal.rating
                                                        ? "text-yellow-400 fill-current"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-lg font-semibold text-slate-700">
                                        {feedbackModal.rating}/5
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Detailed Comments
                                </label>
                                <div className="bg-slate-50 p-4 rounded-lg border">
                                    <p className="text-slate-700 leading-relaxed">
                                        {feedbackModal.feedback}
                                    </p>
                                </div>
                            </div>

                            {feedbackModal.createdAt && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Feedback Date
                                    </label>
                                    <p className="text-sm text-slate-600">
                                        {new Date(feedbackModal.createdAt).toLocaleDateString()}{" "}
                                        at{" "}
                                        {new Date(feedbackModal.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={closeFeedbackModal}
                                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}


        </div>
        <FooterComponent />
        <PopUpChat user={user} chatPartners={chatPartners} />
    </>
);
}
