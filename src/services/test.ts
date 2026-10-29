import ApiUtil, { ApiResponse } from '../utils/apiMiddleware';

// House interface
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

// Create house request interface
export interface CreateHouseRequest {
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images?: string[];
}

// Update house request interface
export interface UpdateHouseRequest extends Partial<CreateHouseRequest> {
  id: string;
}

// House filter interface
export interface HouseFilters {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'area';
  sortOrder?: 'asc' | 'desc';
}

// House Service Class
export class HouseService {
  private baseUrl = '/houses';

  // Generic API call method that accepts variables
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

  // Get all houses with filters
  async getHouses(filters?: HouseFilters): Promise<ApiResponse<House[]>> {
    return await this.callApi<House[]>(
      'GET',
      this.baseUrl,
      undefined,
      filters
    );
  }

  // Get house by ID
  async getHouseById(id: string): Promise<ApiResponse<House>> {
    return await this.callApi<House>(
      'GET',
      `${this.baseUrl}/${id}`
    );
  }

  // Create new house
  async createHouse(houseData: CreateHouseRequest): Promise<ApiResponse<House>> {
    return await this.callApi<House>(
      'POST',
      this.baseUrl,
      houseData
    );
  }

  // Update house
  async updateHouse(updateData: UpdateHouseRequest): Promise<ApiResponse<House>> {
    const { id, ...data } = updateData;
    return await this.callApi<House>(
      'PUT',
      `${this.baseUrl}/${id}`,
      data
    );
  }

  // Patch house (partial update)
  async patchHouse(id: string, patchData: Partial<CreateHouseRequest>): Promise<ApiResponse<House>> {
    return await this.callApi<House>(
      'PATCH',
      `${this.baseUrl}/${id}`,
      patchData
    );
  }

  // Delete house
  async deleteHouse(id: string): Promise<ApiResponse<void>> {
    return await this.callApi<void>(
      'DELETE',
      `${this.baseUrl}/${id}`
    );
  }

  // Search houses by location
  async searchHousesByLocation(location: string, filters?: Omit<HouseFilters, 'location'>): Promise<ApiResponse<House[]>> {
    return await this.callApi<House[]>(
      'GET',
      `${this.baseUrl}/search`,
      undefined,
      { location, ...filters }
    );
  }

  // Get houses by price range
  async getHousesByPriceRange(minPrice: number, maxPrice: number, filters?: Omit<HouseFilters, 'minPrice' | 'maxPrice'>): Promise<ApiResponse<House[]>> {
    return await this.callApi<House[]>(
      'GET',
      `${this.baseUrl}/price-range`,
      undefined,
      { minPrice, maxPrice, ...filters }
    );
  }

  // Upload house images
  async uploadHouseImages(id: string, images: File[]): Promise<ApiResponse<{ imageUrls: string[] }>> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    return await this.callApi<{ imageUrls: string[] }>(
      'POST',
      `${this.baseUrl}/${id}/images`,
      formData,
      undefined,
      {
        'Content-Type': 'multipart/form-data'
      }
    );
  }

  // Get user's favorite houses
  async getFavoriteHouses(): Promise<ApiResponse<House[]>> {
    return await this.callApi<House[]>(
      'GET',
      `${this.baseUrl}/favorites`
    );
  }

  // Add house to favorites
  async addToFavorites(id: string): Promise<ApiResponse<void>> {
    return await this.callApi<void>(
      'POST',
      `${this.baseUrl}/${id}/favorite`
    );
  }

  // Remove house from favorites
  async removeFromFavorites(id: string): Promise<ApiResponse<void>> {
    return await this.callApi<void>(
      'DELETE',
      `${this.baseUrl}/${id}/favorite`
    );
  }

  // Get houses by user (for property owners)
  async getUserHouses(): Promise<ApiResponse<House[]>> {
    return await this.callApi<House[]>(
      'GET',
      `${this.baseUrl}/my-houses`
    );
  }

  // Get similar houses
  async getSimilarHouses(id: string, limit: number = 5): Promise<ApiResponse<House[]>> {
    return await this.callApi<House[]>(
      'GET',
      `${this.baseUrl}/${id}/similar`,
      undefined,
      { limit }
    );
  }

  // Get house statistics
  async getHouseStats(): Promise<ApiResponse<{
    totalHouses: number;
    averagePrice: number;
    totalViews: number;
    popularLocations: string[];
  }>> {
    return await this.callApi<{
      totalHouses: number;
      averagePrice: number;
      totalViews: number;
      popularLocations: string[];
    }>(
      'GET',
      `${this.baseUrl}/stats`
    );
  }
}

// Export singleton instance
export const houseService = new HouseService();

// Export individual functions for convenience
export const {
  getHouses,
  getHouseById,
  createHouse,
  updateHouse,
  patchHouse,
  deleteHouse,
  searchHousesByLocation,
  getHousesByPriceRange,
  uploadHouseImages,
  getFavoriteHouses,
  addToFavorites,
  removeFromFavorites,
  getUserHouses,
  getSimilarHouses,
  getHouseStats
} = houseService;
