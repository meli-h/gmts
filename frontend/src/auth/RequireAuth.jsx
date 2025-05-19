import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequireAuth = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth; 