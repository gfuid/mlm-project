import axios from 'axios';

const API = axios.create({
    // .env file se URL uthayega
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
});

// Request Interceptor: Har request ke saath token bhejne ke liye
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;