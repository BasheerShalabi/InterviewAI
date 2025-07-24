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

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/interview" element={<InterviewForm />} />
          <Route path="/results/:id" element={<ResultPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/chat/session/:id" element={<AIChatBox />} />
        </Routes>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;