import { useAuth } from "../../hooks/useAuth";
import { type Role } from "../../types";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallbackPath?: string;
}

export default function RoleBasedRoute({
  children,
  allowedRoles,
  fallbackPath = "/unauthorized",
}: RoleBasedRouteProps) {
  const { user } = useAuth();

  // Check if user has one of the allowed roles
  const hasRequiredRole = user?.role && allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    // Redirect to unauthorized page or home based on user role
    const redirectPath = user?.role ? "/unauthorized" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <ProtectedRoute
      requiredRole={hasRequiredRole ? user.role : undefined}
      fallbackPath={fallbackPath}
    >
      {children}
    </ProtectedRoute>
  );
}
