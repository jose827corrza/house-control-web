import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.DEV ? '/api' : 'https://test-api.us-east-1.amazonaws.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    // const token = localStorage.getItem('authToken');
    const token = "HARDCODED_TOKEN"
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

