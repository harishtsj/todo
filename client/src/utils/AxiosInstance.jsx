import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api", // if backend doesn't server the frontend
    // baseURL: '/api', //backend servers the frontend
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    return config;
});

export default axiosInstance;