// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children , role=false }) => {
  const { user , loading } = useAuth();

  if(!loading){
    if (!user && !role) {
      return <Navigate to="/login" replace />;
    }
    if(user && role){
      return <Navigate to="/dashboard" replace />;
    }

  }


  return children;
};

export default ProtectedRoute;
