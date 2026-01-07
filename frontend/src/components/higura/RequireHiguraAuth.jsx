import { Navigate, useLocation } from 'react-router-dom';
import { useHiguraAuth } from '../../context/HiguraAuthContext';

export default function RequireHiguraAuth({ children }) {
  const { isAuthenticated } = useHiguraAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
