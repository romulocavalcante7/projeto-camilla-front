import axios from 'axios';
import { getCookie } from '../utils/nextUtils';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

Api.interceptors.request.use(
  async (config) => {
    const tokenCookie = await getCookie('accessToken');
    if (tokenCookie) {
      const [token] = tokenCookie?.value.split('|');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
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

          const newExpiry = data.access.expires;
          const newTokenCookie = `${data.access.token}|${newExpiry}`;

          document.cookie = `accessToken=${newTokenCookie};`;
          document.cookie = `refreshToken=${data.refresh.token};`;
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
