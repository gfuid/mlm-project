import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 🔐 Request interceptor - Add token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Token attached to request:', config.url);
        } else {
            console.log('⚠️ No token found for request:', config.url);
        }
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// 🔐 Response interceptor - Handle auth errors
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('❌ API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });

        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('🚫 Auth error - clearing storage and redirecting');
            localStorage.clear();

            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/admin/login';
            }
        }

        return Promise.reject(error);
    }
);

export default API;