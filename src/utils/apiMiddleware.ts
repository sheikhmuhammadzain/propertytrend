import api, { AxiosRequestConfig, AxiosResponse, AxiosError } from '../config/axiosConfig';

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: any;
}

// Error response interface
interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

// Create standardized API response
export const createApiResponse = <T = any>(
  success: boolean, 
  data: T | null = null, 
  message: string = '', 
  errors: any = null
): ApiResponse<T> => ({
  success,
  data,
  message,
  errors,
});

// API Utility class with TypeScript support
export default class ApiUtil {
  constructor() {}

  static async sendAsync<T = any>(requestObject: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await api(requestObject);
      return createApiResponse<T>(true, response.data, 'Success');
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as ErrorResponse;
      const errorMessage = 
        errorData?.message || 
        axiosError.message || 
        'An error occurred';
      
      return createApiResponse<T>(
        false, 
        null, 
        errorMessage, 
        axiosError.response?.data
      );
    }
  }

  // Convenience methods for common HTTP operations
  // static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  //   return this.sendAsync<T>({ method: 'GET', url, ...config });
  // }

  // static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  //   return this.sendAsync<T>({ method: 'POST', url, data, ...config });
  // }

  // static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  //   return this.sendAsync<T>({ method: 'PUT', url, data, ...config });
  // }

  // static async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  //   return this.sendAsync<T>({ method: 'PATCH', url, data, ...config });
  // }

  // static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  //   return this.sendAsync<T>({ method: 'DELETE', url, ...config });
  // }

  // Legacy method for backward compatibility
  static async SendAsync<T = any>(requestObject: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.sendAsync<T>(requestObject);
  }
}