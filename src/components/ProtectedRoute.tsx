import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

const ProtectedRoute = () => {
  const user = useAuth();
  if (!user.user) return <Navigate to="/login" />;
  return <Outlet />;
};

export default ProtectedRoute;
