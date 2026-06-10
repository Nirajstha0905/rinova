/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
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

const normalizeRoleName = (roleName = "") =>
  roleName.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

const normalizeUser = (user) => {
  if (!user) return null;

  const roleName = user.roles?.name || user.role || user.role_name || "";

  return {
    ...user,
    roles: user.roles || (roleName ? { name: roleName } : undefined),
    full_name: user.full_name || user.name || buildFullName(user) || user.email || "User",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const saveUser = useCallback((nextUser) => {
    const normalized = normalizeUser(nextUser);
    setUser(normalized);

    if (normalized) {
      localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    }

    return normalized;
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const profile = await authApi.getMe();
      return saveUser(profile);
    } catch (err) {
      removeSession();
      setUser(null);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [saveUser]);

  useEffect(() => {
    const request = Promise.resolve().then(refreshUser);

    return () => {
      request.catch(() => {});
    };
  }, [refreshUser]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem(SESSION_KEY, data.token);

      const profile = await authApi.getMe().catch(() => data.user);
      saveUser(profile);

      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
      throw new Error(errorMsg, { cause: err });
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

  const userRole = user?.roles?.name || user?.role || "";

  const isRole = (roleName) => {
    if (!userRole) return false;
    return normalizeRoleName(userRole) === normalizeRoleName(roleName);
  };

  const hasAnyRole = (roles = []) =>
    roles.some((roleName) => normalizeRoleName(roleName) === normalizeRoleName(userRole));

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        error,
        login,
        logout,
        refreshUser,
        isRole,
        hasAnyRole,
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
