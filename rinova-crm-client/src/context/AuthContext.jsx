/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import * as authApi from "../api/authApi";

const AuthContext = createContext();
const SESSION_KEY = "rinova-session";
const USER_KEY = "rinova-user";

const removeSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
};

const buildFullName = (user) =>
  [user?.first_name, user?.middle_name, user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    full_name: user.full_name || buildFullName(user) || user.email || "User",
  };
};

const getStoredUser = () => {
  const token = localStorage.getItem(SESSION_KEY);
  if (!token) return null;

  try {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) return normalizeUser(JSON.parse(storedUser));

    const decoded = jwtDecode(token);
    return normalizeUser({
      id: decoded.id,
      role_id: decoded.role_id,
      organization_id: decoded.organization_id,
    });
  } catch {
    removeSession();
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      const nextUser = normalizeUser(data.user);

      localStorage.setItem(SESSION_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
      throw new Error(errorMsg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      removeSession();
      setUser(null);
      setLoading(false);
    }
  };

  const isRole = (roleName) => {
    if (!user?.roles?.name) return false;
    return user.roles.name.toLowerCase() === roleName.toLowerCase();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
