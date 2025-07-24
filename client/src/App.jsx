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
import ProtectedRoute from './context/ProtectContext';

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
            } />
          <Route path="/coach" element={
            <ProtectedRoute>
            <CoachDashboard />
            </ProtectedRoute>
            } />
          <Route path="/interview" element={
            <ProtectedRoute>
            <InterviewForm />
            </ProtectedRoute>
            } />
          <Route path="/results/:id" element={
            <ProtectedRoute>
            <ResultPage />
            </ProtectedRoute>
            } />
          <Route path="/admin" element={
            <ProtectedRoute>
            <AdminDashboard />
            </ProtectedRoute>
            } />
          <Route path="/chat/session/:id" element={
            <ProtectedRoute>
            <AIChatBox />
            </ProtectedRoute>
            } />
        </Routes>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;