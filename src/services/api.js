import axios from 'axios';

// Base API URL - update this when you have a backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds (Render free tier cold start can take ~50s)
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 API Response:', response.config.url, response.status);
    }

    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle different error status codes
      const isAuthEndpoint = error.config.url && (error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register'));

      switch (status) {
        case 401:
          if (!isAuthEndpoint) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            window.location.href = '/';
            alert('Session expired. Please login again.');
          }
          break;

        case 403:
          alert('You do not have permission to perform this action.');
          break;

        case 404:
          console.error('Resource not found:', error.config.url);
          break;

        case 500:
          alert('Server error. Please try again later.');
          break;

        default:
          if (data.message) {
            alert(data.message);
          }
      }

      console.error('❌ API Error:', status, data);
    } else if (error.request) {
      // Network error
      console.error('❌ Network Error:', error.message);
      alert('Network error. Please check your internet connection.');
    } else {
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
