import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("rinova-session");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes("/auth/login");

        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem("rinova-session");
            localStorage.removeItem("rinova-user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
