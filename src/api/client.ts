import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.DEV ? '/api' : 'https://test-api.us-east-1.amazonaws.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    const token = await getAccessToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

async function getAccessToken(): Promise<string | undefined> {
    // Implementation for getting access token
    try {
        const session = await fetchAuthSession();

        const accessToken = session.tokens?.accessToken?.toString();

        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return undefined; 
    }
}