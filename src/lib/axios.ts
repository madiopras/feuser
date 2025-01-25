import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  maxContentLength: 10 * 1024 * 1024, // 10MB
  maxBodyLength: 10 * 1024 * 1024, // 10MB
  maxRedirects: 5,
  validateStatus: (status) => status >= 200 && status < 500,
});

// Interceptor untuk menangani response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 413) {
      console.error('Payload too large');
    }
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani request
axiosInstance.interceptors.request.use(
  (config) => {
    // Tambahkan timestamp untuk mencegah caching
    config.params = {
      ...config.params,
      _t: new Date().getTime(),
    };
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance; 