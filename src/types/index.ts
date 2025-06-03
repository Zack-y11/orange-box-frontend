// Provider interfaces
export interface Provider {
    _id: string;
    name: string;
    email?: string;
    phone: string;
    address: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProvider {
    name: string;
    email?: string;
    phone: string;
    address: string;
    description: string;
}

// Product interfaces
export interface Product {
    _id?: string;
    name: string;
    price: number;
    description: string;
    provider: string;
    stock: number;
    status: 'active' | 'inactive' | 'discontinued';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateProduct {
    name: string;
    price: number;
    description: string;
    provider: string;
    stock: number;
    status?: 'active' | 'inactive';
}

export interface ProductWithProvider extends Omit<Product, 'provider'>{
    provider: Provider
}

export interface ProductFilters {
    search?: string;
    status?: 'active' | 'inactive' | 'discontinued';
    provider?: string;
    minPrice?: number;
    maxPrice?: number;
    stock?: number;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

// Provider filters interface
export interface ProviderFilters {
    search?: string;
    name?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

// API Response interface
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

