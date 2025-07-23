import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alertData, setAlertData] = useState(null);

    const showAlert = (message, type = "info", duration = 3000) => {
        setAlertData({ message, type, duration });
        setTimeout(() => setAlertData(null), duration);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alertData && (
                <div
                    style={{ animationDuration: `${alertData.duration}ms` }}
                    className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg transition-all animate-fade z-50 
            ${alertData.type === "success"
                            ? "bg-green-500 text-white"
                            : alertData.type === "error"
                                ? "bg-red-500 text-white"
                                : alertData.type === "info"
                                    ? "bg-blue-500 text-white"
                                    : "bg-yellow-500 text-black"
                        }`}
                >
                    <span>{alertData.message}</span>
                    <button onClick={() => setAlertData(null)} className="text-white"></button>
                </div>
            )}
        </AlertContext.Provider>
    );
};
