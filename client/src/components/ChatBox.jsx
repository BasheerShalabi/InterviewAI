import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Eye, Send } from "lucide-react"; // icon for send button
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useAlert } from "../context/AlertContext";
import { Link } from "react-router-dom";

export default function AIChatBox() {
    const [session , setSession] = useState({})
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const textareaRef = useRef();
    const { id } = useParams()
    const { user } = useAuth()
    const token = localStorage.getItem("session");
    const { showAlert } = useAlert()
    const [sessionFlag, setSessionFlag] = useState(false);
    const [isFirstMessage, setIsFirstMessage] = useState(false);
    const [sending, setSending] = useState(false);
    const redirect = useNavigate()

    const fetchSession = async () => {
        setSending(true)
        try {
            const res = await axios({
                method: 'get', url: `/api/sessions/${id}`,
                headers: { Authorization: `Bearer ${token}` }
            })

            const session = res.data;
            setSession(session)
            setMessages(session.messages);
            console.log("Session fetched:", session);
            showAlert("Session loaded successfully", "success");
            setSessionFlag(true);
            console.log("Session in progress:", session.inProgress);
            setIsFirstMessage(session.inProgress);
            if (!session.inProgress && !session.isComplete) {
                initalizeSession();
            }

        } catch (err) {
            console.error("Error fetching session:", err);
        } finally {
            setSending(false);
        }
    }

    const initalizeSession = async () => {
        setSending(true)
        try {
            const res = await axios({
                method: 'post', url: `/api/sessions/${id}/message`,
                headers: { Authorization: `Bearer ${token}` }, data: { content: "start" }
            })


            const message = res.data;
            console.log("AI Response:", message);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: message.content },
            ]);
            console.log("Session initialized:", message);
            showAlert("Session initalized successfully", "success");
            setIsFirstMessage(true);

        } catch (err) {
            console.error("Error fetching session:", err);
        } finally {
            setSending(false);
        }
        console.log(isFirstMessage);
    }

    useEffect(() => {
        if (!sessionFlag) {
            fetchSession();
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        setSending(true);
        setMessages((prev) => [
            ...prev,
            { role: "user", content: input },
        ]);

        try {
            const res = await axios({
                method: 'post', url: `/api/sessions/${id}/message`,
                headers: { Authorization: `Bearer ${token}` }, data: { content: input }
            })

            const message = res.data;
            console.log("AI Response:", message);
            if (message.done) {
                showAlert("Interview Finished , redirecting", "info");
                setTimeout(() => {
                    redirect(`/results/${id}`);
                }, 1000);
            }
            if (!message.content) {
                throw new Error("AI model did not return any content.");
            }

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: message.content },
            ]);
            if (!isFirstMessage) {
                showAlert("Session initialized successfully", "success");
            } else {
                showAlert("Message sent", "success");
            }
            setIsFirstMessage(true);
            setInput("");

        } catch (err) {
            if (!isFirstMessage) {
                console.error("Error fetching session:", err);
            } else {
                console.error("Error sending message:", err);
            }

            setMessages((prev) => prev.slice(0, -1));

            if (err.response?.status === 400 || err.message.includes("tokens")) {
                showAlert("Your message may be too long. Try shortening it.", "error");
            } else {
                showAlert("Something went wrong. Please try again.", "error");
            }
        } finally {
            setSending(false);
        }
    };

    const conversation = messages.map((msg, i) => (
        <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === "assistant" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-[70%] mb-4 px-5 py-3 rounded-2xl whitespace-pre-wrap break-words
                        ${msg.role === "assistant" ? "bg-indigo-100 text-indigo-900 self-start" : "bg-slate-300 text-slate-900 self-end"}`}
        >
            {msg.content}
        </motion.div>
    ))

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 flex flex-col max-w-5xl mx-auto my-5 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
            <motion.h1
                className="text-4xl font-bold text-slate-800 mb-8 select-none"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                AI Chat Assistant
            </motion.h1>

            {/* Messages container */}
            <motion.div
                className="flex-1 flex flex-col max-h-[800px] overflow-y-auto scrollbar-none bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-inner border border-white/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ scrollbarWidth: "thin" }}
            >
                {conversation}
                {sending && (
                    <div className="flex items-center gap-2 mt-4">
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]"></div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <span className="text-gray-500 text-sm ml-2">Sending ...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </motion.div>

            {/* Input box */}

            <motion.div
                className="mt-6 flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {!session.isComplete ? 
                
                (<>
                <textarea
                    rows={1}
                    ref={textareaRef}
                    placeholder="Type your message..."
                    className="flex-grow rounded-2xl border border-slate-300 px-6 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-sm bg-white/70 max-h-48 overflow-y-hidden resize-none scrollbar-none" value={input}
                    disabled={sending || session.isComplete}
                    onChange={(e) => {
                        setInput(e.target.value)
                        if (textareaRef.current) {
                            textareaRef.current.style.height = "auto";
                            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
                        }
                    }}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                />
                <motion.button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending || session.isComplete}
                    className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 p-3 text-white shadow-lg hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Send message"
                >
                    <Send size={20} />
                </motion.button>
                </>
            ):(
                <div className="mt-4 text-right">
                    <Link to={`/results/${session._id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 text-sm">
                        <Eye className="w-4 h-4" />
                            View Results
                    </Link>
                </div>
                )
            }
            </motion.div>
        </div>
    );
}
