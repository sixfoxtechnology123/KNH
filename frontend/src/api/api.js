import axios from 'axios';

export const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5009'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT authorization headers to all calls
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('employeeToken') ||
      sessionStorage.getItem('token') ||
      sessionStorage.getItem('employeeToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authorization expiration securely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear storage and redirect to login if token is invalid/expired
      localStorage.clear();
      sessionStorage.clear();
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);