import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Download,
    Eye,
    Calendar
} from 'lucide-react';

export default function AdminDashboard() {
    const [interviews, setInterviews] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        // Simulate loading dashboard data
        setTimeout(() => {
            setStats({
                totalInterviews: 156,
                completedInterviews: 142,
                averageScore: 78,
                topPerformers: 23
            });

            setInterviews([
                {
                    id: 1,
                    candidateName: 'John Doe',
                    position: 'Senior Frontend Developer',
                    date: '2024-01-15',
                    status: 'completed',
                    score: 85,
                    interviewer: 'Sarah Johnson'
                },
                {
                    id: 2,
                    candidateName: 'Jane Smith',
                    position: 'Backend Developer',
                    date: '2024-01-14',
                    status: 'completed',
                    score: 92,
                    interviewer: 'Mike Chen'
                },
                {
                    id: 3,
                    candidateName: 'Alex Wilson',
                    position: 'Full Stack Developer',
                    date: '2024-01-13',
                    status: 'in-progress',
                    score: null,
                    interviewer: 'Lisa Brown'
                },
                {
                    id: 4,
                    candidateName: 'Emily Davis',
                    position: 'UI/UX Designer',
                    date: '2024-01-12',
                    status: 'scheduled',
                    score: null,
                    interviewer: 'Tom Anderson'
                },
                {
                    id: 5,
                    candidateName: 'David Miller',
                    position: 'DevOps Engineer',
                    date: '2024-01-11',
                    status: 'completed',
                    score: 76,
                    interviewer: 'Sarah Johnson'
                }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    const filteredInterviews = interviews.filter(interview => {
        const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || interview.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'in-progress':
                return 'bg-blue-100 text-blue-700';
            case 'scheduled':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

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
                    <p className="text-slate-600">Loading dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
            <>

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
                    <p className="text-slate-600">Monitor and manage all interview activities</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: 'Total Interviews',
                            value: stats.totalInterviews,
                            icon: FileText,
                            color: 'from-blue-500 to-blue-600',
                            change: '+12%'
                        },
                        {
                            title: 'Completed',
                            value: stats.completedInterviews,
                            icon: CheckCircle,
                            color: 'from-green-500 to-green-600',
                            change: '+8%'
                        },
                        {
                            title: 'Average Score',
                            value: `${stats.averageScore}%`,
                            icon: TrendingUp,
                            color: 'from-purple-500 to-purple-600',
                            change: '+3%'
                        },
                        {
                            title: 'Top Performers',
                            value: stats.topPerformers,
                            icon: Users,
                            color: 'from-orange-500 to-orange-600',
                            change: '+15%'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                            <p className="text-slate-600 text-sm">{stat.title}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Interviews Table */}
                <motion.div
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {/* Table Header */}
                    <div className="p-6 border-b border-slate-200/50">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-slate-800">Recent Interviews</h2>
                            <div className="flex gap-3">
                                <motion.button
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Download className="w-4 h-4" />
                                    Export
                                </motion.button>
                                <motion.button
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Schedule New
                                </motion.button>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search candidates or positions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Candidate</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Position</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Score</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Interviewer</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/50">
                                {filteredInterviews.map((interview, index) => (
                                    <motion.tr
                                        key={interview.id}
                                        className="hover:bg-slate-50/50 transition-colors duration-200"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{interview.candidateName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-600">{interview.position}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-600">{interview.date}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(interview.status)}`}>
                                                {interview.status.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {interview.score ? (
                                                <span className={`font-semibold ${getScoreColor(interview.score)}`}>
                                                    {interview.score}%
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-600">{interview.interviewer}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <motion.button
                                                    className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                                {interview.status === 'completed' && (
                                                    <motion.button
                                                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </motion.button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredInterviews.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600">No interviews found matching your criteria</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
        {/* Footer */}
        <FooterComponent />
    </>
    );
}