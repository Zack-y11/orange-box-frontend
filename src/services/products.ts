import { api } from './api';
import type { Product, ApiResponse } from '../types/index';

interface CreateProduct {
  name: string;
  price: number;
  description: string;
  provider: string;
  stock: number;
  status?: 'active' | 'inactive';
}

export const productService = {
  // Get all products
  async getAll(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    search?: string;
    provider?: string;
    fields?: string;
  }) {
    const response = await api.get<ApiResponse<Product[]>>('/products', { params });
    return response.data;
  },

  // Get product by ID
  async getById(id: string, params?: {
    fields?: string;
  }) {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`, { params });
    return response.data;
  },

  // Create product
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
}; 