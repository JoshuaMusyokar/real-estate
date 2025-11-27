import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export default function RoleBasedRoute({
  children,
  allowedRoles,
  fallbackPath = "/unauthorized",
}: RoleBasedRouteProps) {
  const { user } = useAuth();

  // Check if user has one of the allowed roles
  const hasRequiredRole = user?.role && allowedRoles.includes(user.role.name);

  if (!hasRequiredRole) {
    // Redirect to unauthorized page or home based on user role
    const redirectPath = user?.role ? "/unauthorized" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <ProtectedRoute
      requiredRole={hasRequiredRole ? user.role.name : undefined}
      fallbackPath={fallbackPath}
    >
      {children}
    </ProtectedRoute>
  );
}
