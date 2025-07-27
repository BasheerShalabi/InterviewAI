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
    update: () => { },
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
            const currentTime = Date.now() / 1000;

            if (decodedUser.exp && decodedUser.exp < currentTime) {
                console.log("Token expired");
                localStorage.removeItem("session");
                setUser(null);
                showAlert("Session expired. Please log in again.", "warning");
                redirect("/login");
            } else {
                setUser(decodedUser);
                console.log("User logged in:", decodedUser);
            }
        } catch (err) {
            console.error("Invalid token:", err);
            localStorage.removeItem("session");
            setUser(null);
            showAlert("Invalid session token. Please log in again.", "error");
            redirect("/login");
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

    const update = async () => {
        const token = localStorage.getItem("session");
        try{

            const res = await fetch("http://localhost:8000/api/users/update", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }})

            if (!res.ok) {
                throw new Error("Failed to update user");
            }
            const data = await res.json();
            console.log("User updated:", data.token);
            localStorage.setItem("session", data.token);
            const updatedUser = jwtDecode(data.token);
            setUser(updatedUser);
            showAlert("User updated successfully", "success");
        }catch(err){
            console.error("Error updating user:", err);
            showAlert(err, "error");
        }

    }

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
        <AuthContext.Provider value={{ loading, user, logout, login , register , update }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
