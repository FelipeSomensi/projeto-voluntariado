import { Navigate } from 'react-router-dom';
import { getUser } from '../services/auth';

function ProtectedRoute({ children, adminOnly = false }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/events" replace />;
  }

  return children;
}

export default ProtectedRoute;