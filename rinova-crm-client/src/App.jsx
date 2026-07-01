import { useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import LoginPage from "./pages/auth/LoginPage";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

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
    <>
      <div key={location.pathname} className="app-fade-enter">
        <Routes location={location}>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/*" element={isAuthenticated ? <AppRoutes /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            border: "1px solid #e4ebf7",
            borderRadius: "14px",
            boxShadow: "0 18px 40px rgba(27, 39, 74, 0.12)",
            color: "#0f172a",
            fontSize: "14px",
            padding: "14px 16px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
