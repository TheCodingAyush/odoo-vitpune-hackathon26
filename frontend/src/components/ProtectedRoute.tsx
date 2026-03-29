import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../lib/store";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login preserving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
