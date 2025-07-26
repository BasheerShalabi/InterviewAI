import React, { useState } from 'react';
import LiveChat from './LiveChat';

const PopUpChat = ({ user, chatPartners }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Box */}
            {isOpen && (
                <div className="mb-2 w-80 max-h-[80vh] bg-white border rounded-lg shadow-lg overflow-hidden">
                    <LiveChat user={user} chatPartners={chatPartners} />
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-indigo-700"
            >
                {isOpen ? 'Close ✖' : 'Chat 💬'}
            </button>
        </div>
    );
};

export default PopUpChat;
