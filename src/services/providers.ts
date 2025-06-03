import { api } from './api';
import type { Provider, CreateProvider, ApiResponse } from '../types/index';

export const providerService = {
  // Get all providers
  async getAll(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    search?: string;
    name?: string;
    fields?: string;
  }) {
    const response = await api.get<ApiResponse<Provider[]>>('/providers', { params });
    return response.data;
  },

  // Get provider by ID
  async getById(id: string, params?: {
    fields?: string;
  }) {
    const response = await api.get<ApiResponse<Provider>>(`/providers/${id}`, { params });
    return response.data;
  },

  // Create provider
  async create(provider: CreateProvider) {
    const response = await api.post<ApiResponse<Provider>>('/providers', provider);
    return response.data;
  },

  // Update provider (partial update using PATCH)
  async update(id: string, provider: Partial<CreateProvider>) {
    const response = await api.patch<ApiResponse<Provider>>(`/providers/${id}`, provider);
    return response.data;
  },

  // Replace provider (full update using PUT)
  async replace(id: string, provider: CreateProvider) {
    const response = await api.put<ApiResponse<Provider>>(`/providers/${id}`, provider);
    return response.data;
  },

  // Delete provider
  async delete(id: string) {
    const response = await api.delete<ApiResponse<null>>(`/providers/${id}`);
    return response.data;
  },
};