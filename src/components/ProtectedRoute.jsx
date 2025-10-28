import { Navigate } from 'react-router-dom';
import { getCookie } from '../services/api';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken') || getCookie('accessToken');
    return !!accessToken; // Returns true if token exists, false otherwise
  };

  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;