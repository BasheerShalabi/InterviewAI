import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAlert } from './AlertContext';

// Create the context with a default value (will be overridden)
const AuthContext = createContext({
    user: null,
    login: () => { },
    logout: () => { },
    register: () => { },
    loading: true,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const redirect = useNavigate();
    const {showAlert} = useAlert();

    useEffect(() => {
        const token = localStorage.getItem("session");
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
                console.log("User logged in:", decodedUser);
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("session");
        showAlert("Logged out successfully", "info");
        setUser(null);
        redirect('/');
    };

    const login = (token) => {
        localStorage.setItem("session", token);
        try {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
            showAlert("Logged in successfully", "success");
            console.log("UserToken logged in:", decodedUser);
        } catch (err) {
            console.error("Invalid token:", err);
            showAlert(err, "error");
        }
    };

    const register = async (fullname, email, password) => {
        try {
            const response = await fetch("http://localhost:8000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fullname, email, password }),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            const data = await response.json();
            console.log(data)
            login(data.token);
            return { success: true };
        } catch (error) {
            console.error("Registration error:", error);
            showAlert(err, "error");
            return { success: false, error: error.message };
        }
    }

    return (
        <AuthContext.Provider value={{ loading, user, logout, login , register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
