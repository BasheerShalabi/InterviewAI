import React from 'react';
import { Link } from 'react-router-dom';
import { BotIcon, Code, Users, Clock, CheckCircle, Play, ArrowRight, FileText, Upload, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import HeaderComponent from './HeaderComponent';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const { user , logout } = useAuth();
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-xl"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                        scale: [1, 0.9, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <motion.div
                    className="absolute bottom-40 left-1/3 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-cyan-200/30 rounded-full blur-xl"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </div>

            {/* Header */}
           <HeaderComponent user={user} logout={logout}/>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                AI-Powered
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Technical Interviews
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-xl text-slate-600 mb-8 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Conduct fair, efficient technical interviews with real-time AI analysis and automated scoring in a calm, professional environment.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <Link
                                to="/register"
                                className="group bg-gradient-to-r from-slate-600 to-slate-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Start Interview
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                            <button className="group flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                Watch Demo
                            </button>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-3 gap-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <div className="group hover:scale-105 transition-transform duration-300">
                                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">15min</div>
                                <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">Average Setup</div>
                            </div>
                            <div className="group hover:scale-105 transition-transform duration-300">
                                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">95%</div>
                                <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">Accuracy Rate</div>
                            </div>
                            <div className="group hover:scale-105 transition-transform duration-300">
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">25k+</div>
                                <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">CVs Analyzed</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>

                            <div className="relative">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                    <span className="text-slate-500 text-sm ml-4 font-medium">Interview Session</span>
                                    <motion.div
                                        className="ml-auto flex items-center gap-2 text-xs text-slate-400"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        Live Recording
                                    </motion.div>
                                </div>

                                <div className="space-y-3 text-sm font-mono bg-slate-900/90 backdrop-blur-sm rounded-lg p-4 relative overflow-hidden">
                                    <motion.div
                                        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                                        animate={{ x: [-100, 300] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />

                                    <motion.div
                                        className="text-purple-300"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        class <span className="text-blue-300">TreeNode</span><span className="text-white">:</span>
                                    </motion.div>

                                    <motion.div
                                        className="text-white pl-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        def __init__(self, val=0):
                                    </motion.div>

                                    <motion.div
                                        className="text-white pl-8"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9 }}
                                    >
                                        self.val = val
                                    </motion.div>

                                    <motion.div
                                        className="text-white pl-8"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.1 }}
                                    >
                                        self.left = self.right = None
                                    </motion.div>

                                    <motion.div
                                        className="text-teal-300 pl-4"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.5, type: "spring" }}
                                    >
                                        # AI: Great data structure choice!
                                    </motion.div>

                                    <motion.div
                                        className="absolute bottom-2 right-2 text-xs text-slate-400 flex items-center gap-1"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <div className="w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
                                        Typing...
                                    </motion.div>
                                </div>

                                <motion.div
                                    className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200/50 relative overflow-hidden"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 0.6 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        animate={{ x: [-100, 400] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                                    />

                                    <div className="flex items-center gap-2 text-teal-700 text-sm mb-2 font-medium">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </motion.div>
                                        AI Analysis Complete
                                    </div>
                                    <div className="text-xs text-teal-600 space-y-1 relative">
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.2 }}
                                        >
                                            Object-Oriented Design: Excellent ✓
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.4 }}
                                        >
                                            Code Structure: Clean & Readable ✓
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.6 }}
                                        >
                                            Problem Solving: Advanced Level ✓
                                        </motion.div>

                                        <motion.div
                                            className="mt-2 flex items-center gap-2"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.8, type: "spring" }}
                                        >
                                            <div className="text-xs font-medium text-teal-700">Score:</div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star, i) => (
                                                    <motion.div
                                                        key={star}
                                                        className="w-3 h-3 bg-yellow-400 rounded-full"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 2 + i * 0.1, type: "spring" }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-teal-700">95/100</span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white/50 backdrop-blur-sm py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"></div>
                <div className="max-w-6xl mx-auto px-6 relative">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
                                Complete Interview Solution
                            </span>
                        </h2>
                        <p className="text-lg text-slate-600">
                            Everything you need to conduct professional technical interviews
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Code,
                                title: "Live Code Editor",
                                description: "Real-time collaborative coding environment with syntax highlighting and AI-powered suggestions.",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: FileText,
                                title: "CV Analysis",
                                description: "AI-powered resume analysis that extracts skills, experience, and matches candidates to job requirements.",
                                gradient: "from-indigo-500 to-purple-500"
                            },
                            {
                                icon: BotIcon,
                                title: "AI Evaluation",
                                description: "Comprehensive evaluation combining CV analysis with live coding performance and behavioral assessment.",
                                gradient: "from-purple-500 to-pink-500"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-4 group-hover:text-slate-900 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <motion.div
                    className="max-w-4xl mx-auto px-6 text-center relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Hiring Process?
                    </h2>
                    <p className="text-xl text-slate-200 mb-10 leading-relaxed">
                        Combine CV analysis with live interviews for smarter hiring decisions
                    </p>
                    <Link
                        to="/register"
                        className="group bg-white text-slate-700 px-10 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Try CV Analysis Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900/90 backdrop-blur-sm text-white py-12 border-t border-slate-700/50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl shadow-lg">
                                <BotIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold">InterviewAI</span>
                        </motion.div>
                        <motion.div
                            className="text-sm text-slate-400"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            © 2024 InterviewAI. All rights reserved.
                        </motion.div>
                    </div>
                </div>
            </footer>
        </div>
    );
}