import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/products';
import type { Product, ProductFilters, CreateProduct } from '../types';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ProductFilters;
  createProduct: (data: CreateProduct) => Promise<Product>;
  updateProduct: (id: string, data: Partial<CreateProduct>) => Promise<Product>;
  replaceProduct: (id: string, data: CreateProduct) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string, fields?: string) => Promise<Product>;
  getProductsByProvider: (providerId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    fields?: string;
  }) => Promise<Product[]>;
  updateFilters: (newFilters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  changePage: (page: number) => void;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export const useProducts = (initialFilters: Partial<ProductFilters> = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    sort: 'desc',
    ...initialFilters
  });

  const handleError = (error: any, defaultMessage: string) => {
    const message = error?.response?.data?.message || error?.message || defaultMessage;
    setError(message);
    console.error(defaultMessage, error);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getAll(filters);
      setProducts(response.data || []);

      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      handleError(err, 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createProduct = useCallback(async (data: CreateProduct): Promise<Product> => {
    try {
      setError(null);
      const response = await productService.create(data);
      const newProduct = response.data;
      setProducts(prev => [newProduct, ...prev]);
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        totalItems: prev.totalItems + 1
      }));
      
      return newProduct;
    } catch (err) {
      handleError(err, 'Failed to create product');
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<CreateProduct>): Promise<Product> => {
    try {
      setError(null);
      const response = await productService.update(id, data);
      const updatedProduct = response.data;
      setProducts(prev => 
        prev.map(product => 
          product._id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      handleError(err, 'Failed to update product');
      throw err;
    }
  }, []);

  const replaceProduct = useCallback(async (id: string, data: CreateProduct): Promise<Product> => {
    try {
      setError(null);
      const response = await productService.replace(id, data);
      const updatedProduct = response.data;
      setProducts(prev => 
        prev.map(product => 
          product._id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      handleError(err, 'Failed to replace product');
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await productService.delete(id);
      setProducts(prev => prev.filter(product => product._id !== id));
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        totalItems: prev.totalItems - 1
      }));
    } catch (err) {
      handleError(err, 'Failed to delete product');
      throw err;
    }
  }, []);

  const getProductById = useCallback(async (id: string, fields?: string): Promise<Product> => {
    try {
      setError(null);
      const response = await productService.getById(id, { fields });
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to fetch product');
      throw err;
    }
  }, []);

  const getProductsByProvider = useCallback(async (
    providerId: string, 
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      order?: 'asc' | 'desc';
      fields?: string;
    }
  ): Promise<Product[]> => {
    try {
      setError(null);
      const response = await productService.getByProvider(providerId, params);
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to fetch products by provider');
      throw err;
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset to first page when filters change
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      sort: 'desc',
      ...initialFilters
    });
  }, [initialFilters]);

  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    await fetchProducts();
  }, [fetchProducts]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    createProduct,
    updateProduct,
    replaceProduct,
    deleteProduct,
    getProductById,
    getProductsByProvider,
    updateFilters,
    resetFilters,
    changePage,
    refresh,
    clearError
  };
}; 