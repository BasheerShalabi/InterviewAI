
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    User,
    Clock,
    FileText,
    Download,
    Share2,
    TrendingUp,
    Eye
} from 'lucide-react';
import FooterComponent from '../components/FooterComponent';
import { useAlert } from '../context/AlertContext';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import HeaderComponent from '../components/HeaderComponent';

export default function ResultsPage() {
    const { id } = useParams();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("session");
    const redirect = useNavigate()
    const { showAlert } = useAlert()
    const { user, logout } = useAuth()
    const [userName, setUserName] = useState("Anonymous Candidate")
    const [sessionId, setSessionId] = useState(0)

    const exportFeedbackPDF = (data) => {
        const doc = new jsPDF();
        let y = 10;

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Interview Feedback Report", 10, y);
        y += 10;

        doc.setFontSize(12);
        doc.setFont("Helvetica", "normal");
        doc.text(`Overall Score: ${data.overallScore}`, 10, y);
        y += 10;

        doc.setFont("Helvetica", "bold");
        doc.text("Question Feedback:", 10, y);
        y += 6;
        doc.setFont("Helvetica", "normal");
        data.feedback.forEach(item => {
            const feedbackLine = `Q${item.questionNumber}: ${item.content}`;
            const lines = doc.splitTextToSize(feedbackLine, 180);
            doc.text(lines, 10, y);
            y += lines.length * 6;
        });

        y += 4;
        doc.setFont("Helvetica", "bold");
        doc.text("Final Review", 10, y);
        y += 6;
        doc.setFont("Helvetica", "normal");
        doc.text(`Summary: ${data.finalReview.summary}`, 10, y);
        y += 10;

        doc.setFont("Helvetica", "bold");
        doc.text("Strengths:", 10, y);
        y += 6;
        doc.setFont("Helvetica", "normal");
        data.finalReview.strengths.forEach(s => {
            doc.text(`• ${s}`, 14, y);
            y += 6;
        });

        doc.setFont("Helvetica", "bold");
        doc.text("Weaknesses:", 10, y);
        y += 6;
        doc.setFont("Helvetica", "normal");
        data.finalReview.weaknesses.forEach(w => {
            doc.text(`• ${w}`, 14, y);
            y += 6;
        });

        doc.setFont("Helvetica", "bold");
        doc.text("Category Scores:", 10, y);
        y += 4;

        autoTable(doc, {
            startY: y,
            head: [["Clarity", "Confidence", "Relevance"]],
            body: [[
                data.finalReview.scores.clarity,
                data.finalReview.scores.confidence,
                data.finalReview.scores.relevance
            ]],
            theme: "striped",
            styles: { fontSize: 11 },
            headStyles: { fillColor: [100, 100, 255] },
            margin: { left: 10, right: 10 }
        });

        y = doc.lastAutoTable.finalY + 10;

        doc.setFont("Helvetica", "bold");
        doc.text("Suggestions:", 10, y);
        y += 6;
        doc.setFont("Helvetica", "normal");
        const suggestionLines = doc.splitTextToSize(data.finalReview.suggestions, 180);
        doc.text(suggestionLines, 10, y);

        doc.save("interview-feedback.pdf");
    };



    const fetchSession = async () => {
        setLoading(true)
        try {
            const res = await axios({
                method: 'get', url: `/api/sessions/${id}`,
                headers: { Authorization: `Bearer ${token}` }
            })

            const session = res.data;
            console.log("Session fetched:", session);
            setUserName(session.userName)
            setSessionId(session._id)
            showAlert("Feedback loaded successfully", "success");
            if (session.inProgress || !session.isComplete) {
                showAlert("Redirecting ...", "info");
                redirect(`/chat/session/${id}`);
            } else {
                setResults({
                    feedback: session.feedback,
                    overallScore: session.overallScore,
                    finalReview: session.finalReview,
                    date: session.createdAt
                })
            }
        } catch (err) {
            console.error("Error fetching session:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSession();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div
                        className="w-16 h-16 border-4 border-slate-200 border-t-slate-600 rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-slate-600">Loading interview feedback...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <HeaderComponent user={user} logout={logout} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">Interview Review</h1>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{userName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{results.date.split("T")[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <span>AI-Assisted Feedback</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => exportFeedbackPDF(results)}
                                >
                                    <Download className="w-4 h-4" />
                                    Export PDF
                                </motion.button>

                                <Link to={`/chat/session/${sessionId}`} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-300">
                                    <Eye className="w-4 h-4" />
                                    Back to Interview
                                </Link>

                            </div>
                        </div>

                        {/* Performance Overview */}
                        <div className="grid md:grid-cols-5 gap-6">
                            {/* Overall Score */}
                            <div className="md:col-span-2">
                                <div className="text-center">
                                    <motion.div
                                        className="relative w-32 h-32 mx-auto mb-4"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                    >
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-200" />
                                            <motion.circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeLinecap="round"
                                                className="text-green-500"
                                                initial={{ strokeDasharray: "0 351.86" }}
                                                animate={{ strokeDasharray: `${(results.overallScore / 10) * 351.86} 351.86` }}
                                                transition={{ delay: 0.5, duration: 1 }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-slate-800">{results.overallScore}/10</span>
                                        </div>
                                    </motion.div>
                                    <h3 className="text-xl font-semibold text-slate-800">Overall Score</h3>
                                </div>
                            </div>

                            {/* Category Scores */}
                            <div className="md:col-span-3 grid grid-cols-2 gap-4">
                                {Object.entries(results.finalReview.scores).map(([key, value], index) => (
                                    <motion.div
                                        key={key}
                                        className="bg-slate-50/50 rounded-xl p-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-700 capitalize">{key}</span>
                                            <span className="text-lg font-bold text-slate-800">{value}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <motion.div
                                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${parseInt(value) * 10}%` }}
                                                transition={{ delay: 0.3 + 0.1 * index, duration: 0.8 }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Question Feedback */}
                        <div className="lg:col-span-2 space-y-6">
                            {results.feedback.map((fb, i) => (
                                <motion.div
                                    key={i}
                                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 * i }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-slate-800">Question {fb.questionNumber}</h3>
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                    </div>
                                    <p className="text-slate-600">{fb.content}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            {/* Summary Card */}
                            <motion.div
                                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">Summary</h3>
                                <p className="text-slate-600 text-sm">{results.finalReview.summary}</p>
                            </motion.div>

                            {/* Strengths & Weaknesses Card */}
                            <motion.div
                                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Strengths & Weaknesses</h3>

                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-slate-700 mb-1">Strengths</h4>
                                    <ul className="list-disc list-inside text-green-700 text-sm">
                                        {results.finalReview.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-slate-700 mb-1">Weaknesses</h4>
                                    <ul className="list-disc list-inside text-yellow-700 text-sm">
                                        {results.finalReview.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Suggestions Card */}
                            <motion.div
                                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">Suggestions for Improvement</h3>
                                <p className="text-slate-600 text-sm">{results.finalReview.suggestions}</p>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
            <FooterComponent />
        </>
    );
}
