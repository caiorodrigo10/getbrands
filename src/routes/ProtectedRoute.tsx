import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requiresAdmin = false }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiresAdmin && user.role !== 'admin') {
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
};