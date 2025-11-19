import ApiUtil, { ApiResponse } from '../utils/apiMiddleware';

export interface House {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export class ApiService {
  async callApi<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    params?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return await ApiUtil.sendAsync<T>({
      method,
      url,
      data,
      params,
      headers
    });
  }

  async getAllLocations(): Promise<ApiResponse<any>> {
    return await this.callApi<any>(
      'GET',
      'ALL-Cities'
    );
  }

  async getChartData(url: string): Promise<ApiResponse<any>> {
    return await this.callApi<any>(
      'GET',
      url
    );
  }

  async getTableData(city: string, year: string, month: string): Promise<ApiResponse<any>> {
    return await this.callApi<any>(
      'GET',
      `get-tables?city=${city}&year=${year}&month=${month}`
    );
  }

  async chatResponse(query: string): Promise<ApiResponse<any>> {
    return await this.callApi<any>(
      'GET',
      `Chat-bot?query=${query}`
    );
  }

  async signup(data: any): Promise<ApiResponse<any>> {
    return await this.callApi<any>(
      'POST',
      'auth/signup',
      {
        "user_full_name": data.fullName,
        "user_email": data.email,
        "user_password": data.password
      }
    );
  }

  async signin(data: any): Promise<ApiResponse<any>> {
    return await this.callApi<any>(
      'POST',
      'auth/signin',
      data
    );
  }

  async activateAccount(token: any): Promise<ApiResponse<any>> {
    return await this.callApi<any>(
      'GET',
      `auth/activate?token=${token}`,
    );
  }

  async getUsers(): Promise<ApiResponse<any>> {
    return await this.callApi<any>(
      'GET',
      'users'
    );
  }
}

export const apiService = new ApiService();
