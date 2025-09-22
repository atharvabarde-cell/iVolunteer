import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    withCredentials: true
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('auth-token');
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;