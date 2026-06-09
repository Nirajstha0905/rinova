import { useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import LoginPage from "./pages/auth/LoginPage";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={isAuthenticated ? <AppRoutes /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;