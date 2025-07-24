import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, User } from "lucide-react";
import HeaderComponent from "../components/HeaderComponent";
import { useAuth } from "../context/AuthContext";

export default function CoachDashboard() {
    const { user, logout } = useAuth();
    const [requests, setRequests] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);  // جديد
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("session");

                // جلب طلبات الكوتش
                const resRequests = await fetch("http://localhost:8000/api/coaches/requests", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dataRequests = await resRequests.json();
                setRequests(Array.isArray(dataRequests) ? dataRequests : []);

                // جلب المستخدمين المعينين لهذا الكوتش
                const resUsers = await fetch("http://localhost:8000/api/coaches/assigned-users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dataUsers = await resUsers.json();
                setAssignedUsers(Array.isArray(dataUsers) ? dataUsers : []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setRequests([]);
                setAssignedUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAccept = async (userId) => {
        try {
            const token = localStorage.getItem("session");
            await fetch(`http://localhost:8000/api/coaches/respond/${userId}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` ,"Content-Type": "application/json",},
                body: JSON.stringify({ accept: true }),
            });
            // إزالة الطلب المقبول من قائمة الطلبات
            setRequests((prev) => prev.filter((r) => r._id !== userId));
            // إعادة جلب المستخدمين المعينين بعد قبول الطلب
            const resUsers = await fetch("http://localhost:8000/api/coaches/assigned-users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const dataUsers = await resUsers.json();
            setAssignedUsers(Array.isArray(dataUsers) ? dataUsers : []);
        } catch (err) {
            console.error("Error accepting request:", err);
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

                {/* ترحيب الكوتش */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">
                        Welcome Coach {user?.fullname}
                    </h1>
                </motion.div>

                {/* طلبات الكوتش */}
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
                                            {req.fullname}
                                        </h3>
                                    </div>
                                    <div className="text-slate-600 text-sm mb-4 space-y-1">
                                        <p className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Email: {req.email}
                                        </p>
                                    </div>
                                    <div className="mt-4 text-right">
                                        <button
                                            onClick={() => handleAccept(req._id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Accept Request
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* قائمة المستخدمين الذين اختاروا الكوتش */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-slate-700">Users Assigned to You</h2>
                    {assignedUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <User className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600 text-lg">
                                No users assigned to you yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {assignedUsers.map((userItem) => (
                                <motion.div
                                    key={userItem._id}
                                    className="bg-white/80 backdrop-blur-xl shadow-md rounded-lg p-4 border border-white/20 flex items-center gap-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <User className="w-6 h-6 text-indigo-600" />
                                    <div>
                                        <p className="font-semibold text-slate-800">{userItem.fullname}</p>
                                        <p className="text-sm text-slate-600">{userItem.email}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
