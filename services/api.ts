import axios from 'axios';
import { getCookie } from '../utils/nextUtils';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

Api.interceptors.request.use(
  async (config) => {
    if (typeof window === 'undefined') {
      const token = await getCookie('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token.value}`;
      }
    } else {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('accessToken='));
      if (token) config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getCookie('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh-tokens`,
            { refreshToken: refreshToken?.value }
          );
          document.cookie = `accessToken=${data.access.token}; path=/`;
          originalRequest.headers.Authorization = `Bearer ${data.access.token}`;
          return Api(originalRequest);
        }
      } catch (err) {
        document.cookie = 'accessToken=; Max-Age=0; path=/';
        document.cookie = 'refreshToken=; Max-Age=0; path=/';
        if (!window.location.href.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default Api;
