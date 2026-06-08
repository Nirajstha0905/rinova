import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (Credentials) => {
    const response = await axios.post(
        `${API_URL}/login`, Credentials
    );

    return response.data;
};