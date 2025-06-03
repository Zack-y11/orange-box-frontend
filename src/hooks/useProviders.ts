import { useState, useEffect, useCallback } from 'react';
import { providerService } from '../services/providers';
import type { Provider, CreateProvider, ProviderFilters } from '../types/index';

interface UseProvidersReturn {
    providers: Provider[];
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    filters: ProviderFilters;
    createProvider: (data: CreateProvider) => Promise<Provider>;
    updateProvider: (id: string, data: Partial<CreateProvider>) => Promise<Provider>;
    deleteProvider: (id: string) => Promise<void>;
    updateFilters: (newFilters: Partial<ProviderFilters>) => void;
    resetFilters: () => void;
    changePage: (page: number) => void;
    refreshProviders: () => Promise<void>;
    clearError: () => void;
}

export const useProviders = (initialFilters: Partial<ProviderFilters> = {}): UseProvidersReturn => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 5
    });

    const [filters, setFilters] = useState<ProviderFilters>({
        page: 1,
        limit: 5,
        sortBy: 'createdAt',
        order: 'desc',
        ...initialFilters
    });

    const handleError = (error: any, defaultMessage: string) => {
        const message = error?.response?.data?.message || error?.message || defaultMessage;
        setError(message);
        console.error(defaultMessage, error);
    };

    const fetchProviders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await providerService.getAll(filters);
            setProviders(response.data || []);
            
            if (response.pagination) {
                setPagination(response.pagination);
            }
        } catch (err) {
            handleError(err, 'Failed to fetch providers');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const createProvider = useCallback(async (data: CreateProvider): Promise<Provider> => {
        try {
            setError(null);
            const response = await providerService.create(data);
            const newProvider = response.data;
            setProviders(prev => [newProvider, ...prev]);
            
            setPagination(prev => ({
                ...prev,
                totalItems: prev.totalItems + 1
            }));
            
            return newProvider;
        } catch (err) {
            handleError(err, 'Failed to create provider');
            throw err;
        }
    }, []);

    const updateProvider = useCallback(async (id: string, data: Partial<CreateProvider>): Promise<Provider> => {
        try {
            setError(null);
            const response = await providerService.update(id, data);
            const updatedProvider = response.data;
            setProviders(prev => 
                prev.map(provider => 
                    provider._id === id ? updatedProvider : provider
                )
            );
            return updatedProvider;
        } catch (err) {
            handleError(err, 'Failed to update provider');
            throw err;
        }
    }, []);

    const deleteProvider = useCallback(async (id: string): Promise<void> => {
        try {
            setError(null);
            await providerService.delete(id);
            setProviders(prev => prev.filter(provider => provider._id !== id));
            
            setPagination(prev => ({
                ...prev,
                totalItems: prev.totalItems - 1
            }));
        } catch (err) {
            handleError(err, 'Failed to delete provider');
            throw err;
        }
    }, []);

    const updateFilters = useCallback((newFilters: Partial<ProviderFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            page: 1,
            limit: 5,
            sortBy: 'createdAt',
            order: 'desc',
            ...initialFilters
        });
    }, [initialFilters]);

    const changePage = useCallback((page: number) => {
        setFilters(prev => ({ ...prev, page }));
    }, []);

    const refreshProviders = useCallback(async (): Promise<void> => {
        await fetchProviders();
    }, [fetchProviders]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    useEffect(() => {
        fetchProviders();
    }, [fetchProviders]);

    return {
        providers,
        loading,
        error,
        pagination,
        filters,
        createProvider,
        updateProvider,
        deleteProvider,
        updateFilters,
        resetFilters,
        changePage,
        refreshProviders,
        clearError
    };
};