import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const { token: reduxToken, isAuthenticated } = useSelector((state) => state.auth);
  
  // Check both AuthContext and Redux for authentication
  const isAuthenticatedUser = token || reduxToken || isAuthenticated;

  if (!isAuthenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
