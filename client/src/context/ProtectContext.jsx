// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user , loading } = useAuth();

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
