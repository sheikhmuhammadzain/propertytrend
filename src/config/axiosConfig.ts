import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Extend the AxiosRequestConfig to include metadata
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://www.refinedreport.com/backend/",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for tracking
    (config as CustomAxiosRequestConfig).metadata = { startTime: new Date() };

    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const endTime = new Date();
    const startTime = (response.config as CustomAxiosRequestConfig).metadata?.startTime;
    const duration = startTime ? endTime.getTime() - startTime.getTime() : 0;

    // Log response details in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    // You can add loading state management here
    // Example: dispatch loading action to your state management
    // store.dispatch(setLoading(false));

    return response;
  },
  (error: AxiosError) => {
    // Calculate request duration for errors
    const endTime = new Date();
    const startTime = (error.config as CustomAxiosRequestConfig)?.metadata?.startTime;
    const duration = startTime ? endTime.getTime() - startTime.getTime() : 0;

    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        duration: `${duration}ms`,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
          // You can redirect to login page here
          // window.location.href = '/login';
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden');
          break;

        case 404:
          // Not found
          console.error('Resource not found');
          break;

        case 422:
          // Validation error
          console.error('Validation error:', data);
          break;

        case 429:
          // Rate limited
          console.error('Rate limit exceeded');
          break;

        case 500:
          // Server error
          console.error('Server error');
          break;

        default:
          console.error(`HTTP Error ${status}:`, data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received');
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };