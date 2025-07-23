import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    CalendarDays,
    Clock,
    CheckCircle,
    FileText,
    Star,
    Eye,
} from "lucide-react";
import HeaderComponent from "../components/HeaderComponent";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coaches, setCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState("");

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:8000/api/coaches", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setCoaches(data.map((c) => ({ id: c._id, name: c.fullname })));
            } catch (err) {
                console.error("Error fetching coaches:", err);
            }
        };

        fetchCoaches();

        // Dummy interviews (replace with real API later)
        setTimeout(() => {
            setInterviews([
                // {
                //     id: 1,
                //     position: "Frontend Developer",
                //     date: "2025-07-25",
                //     time: "10:00 AM",
                //     status: "scheduled",
                //     interviewer: "Jane Doe",
                //     feedback: null,
                // },
                // {
                //     id: 2,
                //     position: "UI Designer",
                //     date: "2025-07-15",
                //     time: "02:30 PM",
                //     status: "completed",
                //     interviewer: "Sarah Lee",
                //     feedback: "Great attention to detail. Impressive design portfolio.",
                //     isCompleted: true,
                // },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const completedCount = interviews.filter((i) => i.isCompleted).length;
    console.log(interviews)

    const statusStyles = {
        completed: "bg-green-100 text-green-700",
        scheduled: "bg-blue-100 text-blue-700",
        default: "bg-gray-100 text-gray-700",
    };

    const handleRequestCoach = async () => {
        if (!selectedCoach) return;

        try {
            const selected = coaches.find((c) => c.name === selectedCoach);
            if (!selected) return;

            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:8000/api/coaches/request/${selected.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });



            alert("Coach request sent.");
            window.location.reload();
        } catch (err) {
            console.error("Error sending request:", err);
            alert("Failed to send coach request.");
        }
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
            <HeaderComponent user={user} logout={logout} />

            <div className="p-6 max-w-4xl mx-auto">
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">
                        {user?.fullname}
                    </h1>
                </motion.div>

                <div className="flex justify-center gap-6 mb-8 flex-wrap">
                    <motion.div
                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 max-w-xs flex-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-green-700 font-semibold text-base text-center">
                            ✅ Completed: {completedCount}
                        </div>
                    </motion.div>

                    {/* ✅ مدرب أو طلب مدرب */}
                    <motion.div
                        className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 border border-white/20 max-w-xs flex-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center text-green-700 font-semibold text-base">
                            {user.coachRequestPending ? (
                                <>⏳ Request Pending</>
                            ) : user.coachName ? (
                                <>👤 Coach: {user.coachName}</>
                            ) : (
                                <div className="space-y-2">
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
                                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
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
                    >
                        <div className="text-green-700 font-semibold text-base text-center">
                            Number of interviews: {interviews.length}
                        </div>
                    </motion.div>
                </div>

                {interviews.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg">
                            You have no interviews scheduled yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {interviews.map((interview, index) => (
                            <motion.div
                                key={interview.id}
                                className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/20"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-semibold text-slate-800">
                                        {interview.position}
                                    </h3>
                                    <span
                                        className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${
                                            statusStyles[interview.status] || statusStyles.default
                                        }`}
                                    >
                                        {interview.status}
                                    </span>
                                </div>

                                <div className="text-slate-600 space-y-1 mb-4 text-sm">
                                    <p className="flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4" />
                                        {interview.date}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {interview.time}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Interviewer: {interview.interviewer}
                                    </p>
                                </div>

                                {interview.status === "completed" && interview.feedback && (
                                    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-lg text-sm">
                                        <div className="flex items-center gap-2 text-indigo-700 mb-1 font-medium">
                                            <Star className="w-4 h-4" />
                                            Feedback
                                        </div>
                                        <p className="text-slate-700">{interview.feedback}</p>
                                    </div>
                                )}

                                <div className="mt-4 text-right">
                                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 text-sm">
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
