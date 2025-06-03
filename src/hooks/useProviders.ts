import { useState, useEffect, useCallback } from 'react';
import { providerService } from '../services/providers';
import type { Provider, CreateProvider } from '../types/index';

interface UseProvidersReturn {
    providers: Provider[];
    loading: boolean;
    error: string | null;
    createProvider: (data: CreateProvider) => Promise<Provider>;
    updateProvider: (id: string, data: Partial<CreateProvider>) => Promise<Provider>;
    deleteProvider: (id: string) => Promise<void>;
    refreshProviders: () => Promise<void>;
    clearError: () => void;
}

export const useProviders = (): UseProvidersReturn => {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleError = (error: any, defaultMessage: string) => {
        const message = error?.response?.data?.message || error?.message || defaultMessage;
        setError(message);
        console.error(defaultMessage, error);
    };

    const fetchProviders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await providerService.getAll();
            setProviders(response.data || []);
        } catch (err) {
            handleError(err, 'Failed to fetch providers');
        } finally {
            setLoading(false);
        }
    }, []);

    const createProvider = useCallback(async (data: CreateProvider): Promise<Provider> => {
        try {
            setError(null);
            const response = await providerService.create(data);
            const newProvider = response.data;
            setProviders(prev => [newProvider, ...prev]);
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
        } catch (err) {
            handleError(err, 'Failed to delete provider');
            throw err;
        }
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
        createProvider,
        updateProvider,
        deleteProvider,
        refreshProviders,
        clearError
    };
};