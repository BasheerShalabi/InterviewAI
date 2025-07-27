import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BotIcon, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({}); // ✅ errors for form fields

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({ ...errors, [e.target.name]: '' }); // clear error on change
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return; // 🔒 prevent submission if invalid

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token);
                console.log("UserToken logged in:", data.token);
                navigate('/dashboard');
            } else {
                const data = await response.json();
                setError(data.message || "Login failed");
            }

            setLoading(false);
        } catch (err) {
            console.error("Login error:", err);
            setError("Server error, please try again");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
                    <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl shadow-lg">
                                <BotIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
                        <p className="text-slate-600">Sign in to your InterviewAI account</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                {error}
                            </motion.div>
                        )}

                        {/* Email Field */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm`}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </motion.div>

                        {/* Password Field */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-slate-300'} rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm`}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white py-3 rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </motion.button>
                    </form>

                    {/* Footer Links */}
                    <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
                        <p className="text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-slate-700 font-semibold hover:text-slate-800 transition-colors duration-300">
                                Sign up
                            </Link>
                        </p>
                    </motion.div>

                    <motion.div className="mt-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
                        <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-300">
                            ← Back to Home
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
