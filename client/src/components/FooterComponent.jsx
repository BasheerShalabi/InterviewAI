import React from 'react'
import { Link } from 'react-router-dom';
import { BotIcon } from 'lucide-react';
import { motion } from 'framer-motion';
const FooterComponent = () => {
  return (
    <div>
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
  )
}

export default FooterComponent
