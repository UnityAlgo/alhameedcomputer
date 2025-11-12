"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

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

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const tokens = localStorage.getItem("tokens") ? JSON.parse(localStorage.getItem("tokens") as string) : null;
        if (!tokens || !tokens?.access || !tokens.refresh) {
            return Promise.reject(error);
        }


        if (error.response.status === 401 && error.response?.data?.code === "token_not_valid") {
            const { refresh } = tokens;
            const response = await axios.post(API_URL + "api/login/refresh", { refresh })

            if (response.status != 200) {
                localStorage.removeItem("tokens");
                window.location.href = "/"
            }

            const updatedTokens = { "access": response.data.access, refresh }
            localStorage.setItem("tokens", JSON.stringify(updatedTokens))

            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return axiosClient(originalRequest);
        }

        return Promise.reject(error);
    }
);



export { API_URL, axiosClient };