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

  async getTableData(
    city: string, 
    year: string, 
    month?: string, 
    quarter?: string, 
    period_type: string = 'monthly'
  ): Promise<ApiResponse<any>> {
    let url = `get-tables-new_updated?city=${city}&year=${year}&period_type=${period_type}`;
    if (period_type === 'monthly' && month) {
      url += `&month=${month}`;
    } else if (period_type === 'quarterly' && quarter) {
      url += `&quarter=${quarter}`;
    }
    return await this.callApi<any>('GET', url);
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

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return await this.callApi<{ message: string }>(
      'POST',
      'auth/forgot-password',
      { email }
    );
  }

  async resetPassword(token: string, new_password: string): Promise<ApiResponse<{ message: string }>> {
    return await this.callApi<{ message: string }>(
      'POST',
      'auth/reset-password',
      { token, new_password }
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

  // ---------------- Blog ----------------
  async getBlogPosts(params?: { limit?: number; offset?: number; tag?: string }): Promise<ApiResponse<any>> {
    const search = new URLSearchParams();
    if (params?.limit != null) search.set('limit', String(params.limit));
    if (params?.offset != null) search.set('offset', String(params.offset));
    if (params?.tag) search.set('tag', params.tag);
    const qs = search.toString();
    return await this.callApi<any>('GET', `blog${qs ? `?${qs}` : ''}`);
  }

  async getBlogPost(slug: string): Promise<ApiResponse<any>> {
    return await this.callApi<any>('GET', `blog/${encodeURIComponent(slug)}`);
  }

  async adminGetBlogPosts(): Promise<ApiResponse<any>> {
    return await this.callApi<any>('GET', 'blog/admin/all');
  }

  async adminGetBlogPost(id: number): Promise<ApiResponse<any>> {
    return await this.callApi<any>('GET', `blog/admin/${id}`);
  }

  async createBlogPost(data: any): Promise<ApiResponse<any>> {
    return await this.callApi<any>('POST', 'blog', data);
  }

  async updateBlogPost(id: number, data: any): Promise<ApiResponse<any>> {
    return await this.callApi<any>('PUT', `blog/${id}`, data);
  }

  async deleteBlogPost(id: number): Promise<ApiResponse<any>> {
    return await this.callApi<any>('DELETE', `blog/${id}`);
  }
}

export const apiService = new ApiService();
