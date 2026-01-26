import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 🔐 Request Interceptor - Attach token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token attached to request');
        } else {
            console.warn('⚠️ No token found - request may fail');
        }

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// 🛡️ Response Interceptor - Handle 401 globally
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            console.error(`❌ API Error [${status}]:`, data.message || 'Unknown error');

            // ✅ CRITICAL: Handle 401 Unauthorized (Token expired/invalid)
            if (status === 401) {
                console.error('❌ 401 Unauthorized - Token expired or invalid');

                // Clear invalid credentials
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Show toast notification
                toast.error('Session expired - please login again', {
                    duration: 3000,
                    id: 'session-expired' // Prevent duplicate toasts
                });

                // Redirect to login after a short delay
                setTimeout(() => {
                    // Only redirect if not already on login page
                    if (!window.location.pathname.includes('/login')) {
                        console.log('🔄 Redirecting to login page...');
                        window.location.href = '/login';
                    }
                }, 1000);
            }

            // Handle 403 Forbidden (Insufficient permissions)
            if (status === 403) {
                console.error('❌ 403 Forbidden - Access denied');
                toast.error('Access denied - insufficient permissions');
            }

            // Handle 500 Server Error
            if (status === 500) {
                console.error('❌ 500 Server Error');
                toast.error('Server error - please try again later');
            }

        } else if (error.request) {
            // Request made but no response received
            console.error('❌ No response from server');
            toast.error('Unable to connect to server');
        } else {
            // Error setting up request
            console.error('❌ Request setup error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default API;


//  if (user) {
//             const token = JSON.parse(user)?.token;
// API.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default API;