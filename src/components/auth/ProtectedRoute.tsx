import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { type Role } from "../../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = "/signin",
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to unauthorized page or home based on user role
    const redirectPath = user?.role ? "/unauthorized" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
