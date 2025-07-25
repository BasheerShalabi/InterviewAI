import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import InterviewForm from './pages/InterviewForm';
import ResultPage from './pages/ResultPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CoachDashboard from './pages/CoachDashboard';
import ProtectedRoute from './context/ProtectContext';
import ChatBoxPage from './pages/ChatBoxPage';
import { useAuth } from './context/AuthContext';

function App() {
  const {user , loading}=useAuth()
  return (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user!=null&&(!loading && ( user.role == "user" ? <UserDashboard /> : user.role == "coach" ?  <CoachDashboard /> : <AdminDashboard /> ))}
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
            <ChatBoxPage />
            </ProtectedRoute>
            } />

        </Routes>
  );
}

export default App;