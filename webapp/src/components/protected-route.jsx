import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children, requiredUserType }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication status
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific user type is required, validate it
  if (requiredUserType && currentUser.userType !== requiredUserType) {
    // Redirect to the appropriate dashboard based on user type
    const redirectPath = `/dashboard/${currentUser.userType}`;
    return <Navigate to={redirectPath} replace />;
  }

  // If authentication passes, render the protected content
  return children;
};

export default ProtectedRoute;
