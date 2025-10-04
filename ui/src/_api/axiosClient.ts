import axios from "axios";
import { API_URL } from "./index";

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const tokens = localStorage.getItem("tokens");
  if (tokens) {
    const { access } = JSON.parse(tokens);
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
      console.log("Sending access token:", access);
    }
  } else {
    console.log("No tokens found in localStorage");
  }
  return config;
});


export default axiosClient;
