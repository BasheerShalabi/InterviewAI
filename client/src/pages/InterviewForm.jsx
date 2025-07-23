import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, User, Briefcase, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import FooterComponent from '../components/FooterComponent';

export default function InterviewForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        candidateName: '',
        candidateEmail: '',
        position: '',
        experience: '',
        skills: [],
        cvFile: null,
        interviewType: 'technical',
        duration: '60'
    });
    const [cvAnalysis, setCvAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            cv: file
        });
    };

    const analyzeCv = async () => {
        setLoading(true);


        const res = await axios.post('http://localhost:8000/api/cv/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log(res.data);

        setFormData({
            ...formData,
            raw: res.data.raw,
        });

        setTimeout(() => {
            setCvAnalysis({
                skills: res.data.result.skills,
                experience: res.data.result.experience,
                match: res.data.result.score,
                strengths: res.data.result.strengths,
                recommendations: res.data.result.recommendations
            });
            setLoading(false);
            setStep(3);
        }, 2000);
    };

    const startInterview = () => {
        // Navigate to interview session
        console.log('Starting interview with data:', formData);
    };

    return (
        <>
        
        
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        {[1, 2, 3].map((stepNum) => (
                            <div
                                key={stepNum}
                                className={`flex items-center ${stepNum < 3 ? 'flex-1' : ''}`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= stepNum
                                        ? 'bg-slate-600 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                        }`}
                                >
                                    {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                                </div>
                                {stepNum < 3 && (
                                    <div
                                        className={`flex-1 h-1 mx-4 ${step > stepNum ? 'bg-slate-600' : 'bg-slate-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Candidate Info</span>
                        <span>CV Analysis</span>
                        <span>Interview Setup</span>
                    </div>
                </motion.div>

                {/* Step 1: Candidate Information */}
                {step === 1 && (
                    <motion.div
                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Candidate Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Candidate Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="candidateName"
                                        value={formData.candidateName}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                        placeholder="Enter candidate's full name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="candidateEmail"
                                    value={formData.candidateEmail}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    placeholder="candidate@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Position
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                        placeholder="e.g., Senior Frontend Developer"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Experience Level
                                </label>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    required
                                >
                                    <option value="">Select experience level</option>
                                    <option value="junior">Junior (0-2 years)</option>
                                    <option value="mid">Mid-level (2-5 years)</option>
                                    <option value="senior">Senior (5+ years)</option>
                                    <option value="lead">Lead/Principal (8+ years)</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Upload CV/Resume
                            </label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-slate-400 transition-colors duration-300">
                                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 mb-2">
                                    Drag and drop CV here, or{' '}
                                    <label className="text-slate-700 font-semibold cursor-pointer hover:text-slate-800">
                                        browse files
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                        />
                                    </label>
                                </p>
                                <p className="text-sm text-slate-500">PDF, DOC, DOCX up to 10MB</p>
                                {formData.cv && (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-700 font-medium">{formData.cv.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-8">
                            <motion.button
                                onClick={() => setStep(2)}
                                disabled={!formData.candidateName || !formData.candidateEmail || !formData.position || !formData.cv}
                                className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Analyze CV
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: CV Analysis */}
                {step === 2 && (
                    <motion.div
                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">CV Analysis</h2>

                        {!loading && !cvAnalysis && (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">Ready to Analyze CV</h3>
                                <p className="text-slate-600 mb-6">
                                    Our AI will analyze the uploaded CV and extract key information to help you prepare better interview questions.
                                </p>
                                <motion.button
                                    onClick={analyzeCv}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Analysis
                                </motion.button>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-12">
                                <motion.div
                                    className="w-16 h-16 border-4 border-slate-200 border-t-slate-600 rounded-full mx-auto mb-4"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">Analyzing CV...</h3>
                                <p className="text-slate-600">
                                    Please wait while our AI processes the resume and extracts key insights.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 3: Interview Setup */}
                {step === 3 && cvAnalysis && (
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* CV Analysis Results */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">CV Analysis Results</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-700 mb-2">Skills Match</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-slate-200 rounded-full h-3">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                                                    style={{ width: `${cvAnalysis.match}%` }}
                                                />
                                            </div>
                                            <span className="font-bold text-green-600">{cvAnalysis.match}%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-700 mb-2">Key Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {cvAnalysis.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-700 mb-2">Experience Level</h3>
                                        <p className="text-slate-600">{cvAnalysis.experience}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-700 mb-2">Strengths</h3>
                                        <ul className="space-y-1">
                                            {cvAnalysis.strengths.map((strength, index) => (
                                                <li key={index} className="flex items-center gap-2 text-slate-600">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    {strength}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-700 mb-2">Interview Recommendations</h3>
                                        <ul className="space-y-1">
                                            {cvAnalysis.recommendations.map((rec, index) => (
                                                <li key={index} className="flex items-center gap-2 text-slate-600">
                                                    <ArrowRight className="w-4 h-4 text-blue-500" />
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interview Configuration */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Interview Configuration</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Interview Type
                                    </label>
                                    <select
                                        name="interviewType"
                                        value={formData.interviewType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    >
                                        <option value="technical">Technical Interview</option>
                                        <option value="behavioral">Behavioral Interview</option>
                                        <option value="mixed">Mixed Interview</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Duration (minutes)
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <select
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                        >
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60">60 minutes</option>
                                            <option value="90">90 minutes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <motion.button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Back to Edit
                                </motion.button>

                                <motion.button
                                    onClick={startInterview}
                                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Interview
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>


        </div>
            {/* Footer */}
            <FooterComponent />
        </>
    );
}