import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export default function PublicRoute({
  children,
  fallbackPath = "/",
}: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
