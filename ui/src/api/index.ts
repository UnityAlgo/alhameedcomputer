import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';




const axiosClient = axios.create({
    baseURL: API_URL,
});

axiosClient.interceptors.request.use((config) => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
        const { access } = JSON.parse(tokens);
        if (access) {
            config.headers.Authorization = `Bearer ${access}`;
        }
    }
    return config;
});

export { API_URL, axiosClient };