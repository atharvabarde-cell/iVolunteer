import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    withCredentials: true
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    
    failedQueue = [];
};

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

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Try to refresh the token
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/auth/refresh-access-token`,
                    {},
                    { withCredentials: true }
                );

                if (refreshResponse.status === 200) {
                    console.log('Token refreshed successfully');
                    processQueue(null, 'success');
                    
                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.log('Token refresh failed, logging out user');
                processQueue(refreshError, null);
                
                // Clear all auth data
                localStorage.removeItem('auth-user');
                localStorage.removeItem('auth-token');
                localStorage.removeItem('refresh-token');
                
                // Redirect to auth page
                if (typeof window !== 'undefined') {
                    // Trigger a custom event that the auth context can listen to
                    window.dispatchEvent(new CustomEvent('token-expired'));
                    
                    // Redirect to login page
                    window.location.href = '/auth';
                }
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;