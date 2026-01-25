import axios from 'axios';

// ✅ Centralized instance create karein
const API = axios.create({
    // VITE_BACKEND_URL aapke .env se aayega (e.g., http://localhost:5000/api/v1)
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// 🛡️ Admin Request Interceptor
// Yeh har outgoing request mein Authorization header add karega
API.interceptors.request.use((config) => {
    // Admin login ke baad jo token save hua tha
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 🚀 Response Interceptor (Optional but helpful)
// Agar token expire ho jaye (401 error), toh admin ko wapas login par bhej dega
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            window.location.href = "/admin/login";
        }
        return Promise.reject(error);
    }
);

export default API;