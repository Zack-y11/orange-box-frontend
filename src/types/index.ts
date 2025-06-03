// Provider interfaces
export interface Provider {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    status: 'active' | 'inactive' | 'discontinued';
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProvider {
    name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    status?: 'active' | 'inactive';
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

