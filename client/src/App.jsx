import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import InterviewForm from './pages/InterviewForm';
import ResultPage from './pages/ResultPage';
import AdminDashboard from './pages/AdminDashboard';
import { AlertProvider } from './context/AlertContext';
import AIChatBox from './components/ChatBox';
import UserDashboard from './pages/UserDashboard';
import CoachDashboard from './pages/CoachDashboard';
import ChatBoxPage from './pages/ChatBoxPage';

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/interview" element={<InterviewForm />} />
          <Route path="/results/:id" element={<ResultPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/chat/session/:id" element={<ChatBoxPage />} />
        </Routes>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;