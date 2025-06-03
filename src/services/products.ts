import { api } from './api';
import type { Product, ApiResponse, CreateProduct } from '../types/index';

interface ProductQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: 'active' | 'inactive' | 'discontinued';
  provider?: string;
  minPrice?: number;
  maxPrice?: number;
  fields?: string;
}

interface ProviderProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  fields?: string;
}

export const productService = {
  // Get all products with comprehensive filtering, sorting, and pagination
  async getAll(params?: ProductQueryParams) {
    const response = await api.get<ApiResponse<Product[]>>('/products', { params });
    return response.data;
  },

  // Get product by ID with optional field selection
  async getById(id: string, params?: { fields?: string }) {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`, { params });
    return response.data;
  },

  // Get all products from a specific provider
  async getByProvider(providerId: string, params?: ProviderProductsParams) {
    const response = await api.get<ApiResponse<Product[]>>(`/products/provider/${providerId}`, { params });
    return response.data;
  },

  // Create new product
  async create(product: CreateProduct) {
    const response = await api.post<ApiResponse<Product>>('/products', product);
    return response.data;
  },

  // Update product (partial update using PATCH)
  async update(id: string, product: Partial<CreateProduct>) {
    const response = await api.patch<ApiResponse<Product>>(`/products/${id}`, product);
    return response.data;
  },

  // Replace product (full update using PUT)
  async replace(id: string, product: CreateProduct) {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
    return response.data;
  },

  // Delete product
  async delete(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/products/${id}`);
    return response.data;
  },

  // Utility methods for common operations
  
  // Get products with specific status
  async getByStatus(status: 'active' | 'inactive' | 'discontinued', params?: Omit<ProductQueryParams, 'status'>) {
    return this.getAll({ ...params, status });
  },

  // Search products by name/description
  async search(searchTerm: string, params?: Omit<ProductQueryParams, 'search'>) {
    return this.getAll({ ...params, search: searchTerm });
  },

  // Get products within price range
  async getByPriceRange(minPrice?: number, maxPrice?: number, params?: Omit<ProductQueryParams, 'minPrice' | 'maxPrice'>) {
    return this.getAll({ ...params, minPrice, maxPrice });
  },

  // Get products with low stock (less than specified amount)
  async getLowStock(threshold: number = 10, params?: ProductQueryParams) {
    // Note: This would require backend implementation to filter by stock threshold
    // For now, we'll get all products and filter client-side
    const response = await this.getAll(params);
    if (response.data) {
      response.data = response.data.filter(product => product.stock < threshold);
    }
    return response;
  }
}; 