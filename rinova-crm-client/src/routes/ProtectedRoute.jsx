import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const normalizeRole = (role = "") =>
  role.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

export default function ProtectedRoute({ children, requiredRoles = null }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    requiredRoles &&
    !requiredRoles
      .map((role) => normalizeRole(role))
      .includes(normalizeRole(user?.roles?.name || user?.role))
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
