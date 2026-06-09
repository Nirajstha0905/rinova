import api from "../services/axios";

const unwrapData = (response) => response.data?.data ?? response.data;

const toAuthError = (error, fallbackMessage) => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message, { cause: error });
  }
  if (error.response?.status === 401) {
    return new Error("Invalid email or password", { cause: error });
  }
  if (error.response?.status === 400) {
    return new Error("Email and password are required", { cause: error });
  }
  if (!error.response) {
    return new Error(
      "Cannot connect to server. Make sure the server is running at http://localhost:5000",
      { cause: error }
    );
  }
  return new Error(error.message || fallbackMessage, { cause: error });
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return unwrapData(response);
  } catch (error) {
    throw toAuthError(error, "Login failed");
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return unwrapData(response);
  } catch (error) {
    throw toAuthError(error, "Registration failed");
  }
};

export const getMe = async () => {
  try {
    const response = await api.get("/auth/me");
    return unwrapData(response);
  } catch (error) {
    throw toAuthError(error, "Failed to load user");
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

/* Dummy data for testing (comment out above to use dummy data)
export const login = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const users = {
    "admin@rinova.com": { id: "1", full_name: "Admin User", email: "admin@rinova.com", roles: { id: "1", name: "admin" }, password: "Admin@123" },
    "staff@rinova.com": { id: "2", full_name: "Staff User", email: "staff@rinova.com", roles: { id: "2", name: "staff" }, password: "Staff@123" },
    "agent@rinova.com": { id: "3", full_name: "Agent User", email: "agent@rinova.com", roles: { id: "3", name: "agent" }, password: "Agent@123" },
  };

  const user = users[email];
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  return {
    user: { ...user, password: undefined },
    token: "dummy-jwt-token-" + Date.now(),
  };
};
*/
