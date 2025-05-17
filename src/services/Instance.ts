import axios from 'axios';
import { CookieAttributes } from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        common: {
            'Content-Type': 'application/json',
            // "Accept-Language": "en",
        },
    },
});

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
