import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    FileText,
    Code,
    MessageSquare,
    Download,
    Share2
} from 'lucide-react';

export default function ResultsPage() {
    const { id } = useParams();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading interview results
        setTimeout(() => {
            setResults({
                candidate: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    position: 'Senior Frontend Developer'
                },
                interview: {
                    date: '2024-01-15',
                    duration: 60,
                    type: 'Technical Interview',
                    status: 'completed'
                },
                scores: {
                    overall: 85,
                    technical: 88,
                    problemSolving: 82,
                    communication: 87,
                    codeQuality: 90
                },
                cvAnalysis: {
                    match: 92,
                    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
                    experience: '5+ years'
                },
                sections: [
                    {
                        title: 'Technical Skills',
                        score: 88,
                        feedback: 'Strong understanding of React and modern JavaScript. Demonstrated good knowledge of state management and component lifecycle.',
                        details: [
                            { question: 'Explain React hooks', answer: 'Comprehensive', score: 95 },
                            { question: 'Implement a custom hook', answer: 'Good implementation', score: 85 },
                            { question: 'State management patterns', answer: 'Solid understanding', score: 85 }
                        ]
                    },
                    {
                        title: 'Problem Solving',
                        score: 82,
                        feedback: 'Good analytical thinking. Approached problems systematically but could improve on optimization techniques.',
                        details: [
                            { question: 'Algorithm: Two Sum', answer: 'Correct solution', score: 90 },
                            { question: 'System Design: Chat App', answer: 'Basic design', score: 75 },
                            { question: 'Debugging Challenge', answer: 'Identified issues', score: 80 }
                        ]
                    },
                    {
                        title: 'Communication',
                        score: 87,
                        feedback: 'Clear communication throughout the interview. Explained thought process well and asked relevant questions.',
                        details: [
                            { question: 'Explain technical concepts', answer: 'Very clear', score: 90 },
                            { question: 'Ask clarifying questions', answer: 'Good questions', score: 85 },
                            { question: 'Present solutions', answer: 'Well structured', score: 85 }
                        ]
                    }
                ],
                recommendations: [
                    'Strong candidate with solid technical foundation',
                    'Consider for senior-level positions',
                    'May benefit from system design training',
                    'Good cultural fit based on communication style'
                ],
                nextSteps: [
                    'Schedule follow-up technical round',
                    'Arrange team meet and greet',
                    'Prepare offer discussion'
                ]
            });
            setLoading(false);
        }, 1500);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-slate-200 border-t-slate-600 rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-slate-600">Loading interview results...</p>
                </motion.div>
            </div>
        );
    }

    return (
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
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">Interview Results</h1>
                            <div className="flex items-center gap-4 text-slate-600">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{results.candidate.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{results.interview.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <span>{results.interview.type}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </motion.button>
                            <motion.button
                                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Download className="w-4 h-4" />
                                Export PDF
                            </motion.button>
                        </div>
                    </div>

                    {/* Overall Score */}
                    <div className="grid md:grid-cols-5 gap-6">
                        <div className="md:col-span-2">
                            <div className="text-center">
                                <motion.div
                                    className="relative w-32 h-32 mx-auto mb-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                >
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-slate-200"
                                        />
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
                                            animate={{ strokeDasharray: `${(results.scores.overall / 100) * 351.86} 351.86` }}
                                            transition={{ delay: 0.5, duration: 1 }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-slate-800">{results.scores.overall}</span>
                                    </div>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-slate-800">Overall Score</h3>
                                <p className="text-slate-600">Excellent Performance</p>
                            </div>
                        </div>

                        <div className="md:col-span-3 grid grid-cols-2 gap-4">
                            {Object.entries(results.scores).filter(([key]) => key !== 'overall').map(([key, value], index) => (
                                <motion.div
                                    key={key}
                                    className="bg-slate-50/50 rounded-xl p-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className="text-lg font-bold text-slate-800">{value}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <motion.div
                                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${value}%` }}
                                            transition={{ delay: 0.3 + 0.1 * index, duration: 0.8 }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Detailed Sections */}
                    <div className="lg:col-span-2 space-y-6">
                        {results.sections.map((section, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * index }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-slate-800">{section.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-slate-800">{section.score}</span>
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                    </div>
                                </div>

                                <p className="text-slate-600 mb-4">{section.feedback}</p>

                                <div className="space-y-3">
                                    {section.details.map((detail, detailIndex) => (
                                        <div key={detailIndex} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-700">{detail.question}</p>
                                                <p className="text-sm text-slate-600">{detail.answer}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800">{detail.score}</span>
                                                {detail.score >= 85 ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-yellow-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* CV Analysis Summary */}
                        <motion.div
                            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">CV Analysis</h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700">Skills Match</span>
                                        <span className="font-bold text-green-600">{results.cvAnalysis.match}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                            style={{ width: `${results.cvAnalysis.match}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-slate-700 block mb-2">Key Skills</span>
                                    <div className="flex flex-wrap gap-2">
                                        {results.cvAnalysis.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-slate-700 block mb-1">Experience</span>
                                    <span className="text-slate-600">{results.cvAnalysis.experience}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recommendations */}
                        <motion.div
                            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recommendations</h3>
                            <ul className="space-y-2">
                                {results.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2 text-slate-600">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Next Steps */}
                        <motion.div
                            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Next Steps</h3>
                            <ul className="space-y-2">
                                {results.nextSteps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-2 text-slate-600">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}