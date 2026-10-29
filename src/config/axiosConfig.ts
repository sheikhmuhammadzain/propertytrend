import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TOKEN_KEY, readStoredToken, emitSessionExpired } from '@/lib/auth-token';

// Extend the AxiosRequestConfig to include metadata
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime: Date;
    /** True if a token (valid or expired) was in storage when the request was built. */
    hadSession?: boolean;
  };
}

// Auth endpoints return 401 for a wrong password; that is not a dead session.
const isAuthRoute = (url: string | undefined): boolean => /^\/?auth\//.test(url || '');

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
    let hadSession = false;
    try {
      hadSession = !!localStorage.getItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }

    // readStoredToken() returns null for an expired token and removes it, so an
    // expired session is never sent to the server as if it were live.
    const token = readStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for tracking
    (config as CustomAxiosRequestConfig).metadata = { startTime: new Date(), hadSession };

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
        case 401: {
          // Unauthorized. If the user had a session and this was not a login
          // attempt, the session is dead (expired, revoked, or secret rotated):
          // clear it and let the app redirect to sign-in.
          const hadSession = (error.config as CustomAxiosRequestConfig)?.metadata?.hadSession;
          if (hadSession && !isAuthRoute(error.config?.url)) {
            emitSessionExpired();
            // The backend's generic 401 text ("Sign up to use the AI-Chatbot")
            // is misleading here; give callers a message that matches what
            // the session-expired toast says.
            error.response.data = { detail: 'Your session has expired. Please sign in again.' };
          }
          break;
        }

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