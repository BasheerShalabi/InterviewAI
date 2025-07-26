import React, { useEffect, useRef, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { format } from 'date-fns';

const LiveChat = ({ user, chatPartners }) => {
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [messages, setMessages] = useState({});
    const [newMsg, setNewMsg] = useState('');
    const messagesEndRef = useRef(null);

    const token = localStorage.getItem('session')

    const { sendMessage , onlineMap } = useSocket(user.id, (incomingMsg) => {
        const { from, to } = incomingMsg;

        // Determine who the other person is in this conversation
        const partnerId = from === user.id ? to : from;

        // Append the incoming message to the correct thread
        setMessages(prev => ({
            ...prev,
            [partnerId]: [...(prev[partnerId] || []), incomingMsg]
        }));
    });

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !selectedPartner) return;

        const msg = {
            from: user.id,
            to: selectedPartner._id,
            content: newMsg,
        };

        // Send the message through socket
        sendMessage(msg);

        // Immediately update the UI with the message (local echo)
        setMessages(prev => ({
            ...prev,
            [selectedPartner._id]: [...(prev[selectedPartner._id] || []), {
                ...msg,
                timestamp: new Date().toISOString(), // simulate timestamp
            }]
        }));

        setNewMsg('');
    };

    // Scroll to the latest message when messages or partner change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedPartner]);

    useEffect(() => {
        if (selectedPartner) {
            fetch(`http://localhost:8000/api/chat/${selectedPartner._id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // if using JWT
                }
            })
                .then(res => res.json())
                .then(data => {
                    setMessages(prev => ({
                        ...prev,
                        [selectedPartner._id]: data
                    }));
                })
                .catch(err => console.error('Error loading history:', err));
        }
    }, [selectedPartner]);


    if (!selectedPartner) {
        return (
            <div className="w-full max-w-md p-4 border rounded shadow bg-white">
                <h2 className="text-lg font-semibold mb-3 text-indigo-600">Chat Partners</h2>
                {chatPartners.length === 0 ? (
                    <p className="text-gray-500 text-sm">No partners available</p>
                ) : (
                    <ul className="space-y-2">
                        {chatPartners.map((partner) => {
                            const isOnline = onlineMap[partner._id];
                           return (
                            <li
                                key={partner._id}
                                onClick={() => setSelectedPartner(partner)}
                                className="cursor-pointer p-2 border rounded hover:bg-indigo-50 transition"
                            >
                                <div className="font-medium">{partner.fullname}</div>
                                <div className="text-xs text-gray-500">{partner.email}</div>
                                <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                            </li>
                        )})}
                    </ul>
                )}
            </div>
        );
    }

    const partnerMessages = messages[selectedPartner._id] || [];

    return (
        <div className="w-full max-w-md p-4 border rounded shadow bg-white flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSelectedPartner(null)}
                        className="text-indigo-600 hover:underline text-sm"
                    >
                        ← Back
                    </button>
                    <h2 className="font-semibold text-indigo-700">{selectedPartner.fullname}</h2>
                </div>
            </div>

            <div className="overflow-y-auto border p-3 mb-3 rounded bg-gray-50 h-64">
                {partnerMessages.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center">No messages yet</p>
                ) : (
                    partnerMessages.map((msg, index) => {
                        const isOwn = msg.from === user.id;
                        return (
                            <div key={index} className={`mb-2 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${isOwn ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <p className="text-xs text-right opacity-70 mt-1">
                                        {msg.timestamp ? format(new Date(msg.timestamp), 'p') : 'Now'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default LiveChat;
