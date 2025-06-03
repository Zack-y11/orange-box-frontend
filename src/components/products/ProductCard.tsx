import React from 'react';
import type { Product, Provider } from '../../types/index';
import { Button } from '../ui/Button';

type ProductWithProvider = Omit<Product, 'provider'> & { provider: Provider };

interface ProductCardProps {
  product: ProductWithProvider;
  onEdit: (product: ProductWithProvider) => void;
  onDelete: (product: ProductWithProvider) => void;
  onView?: (product: ProductWithProvider) => void
}

// Placeholder component - to be implemented later
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onView
}) => {
  const getStatusColor = (status: string) => {
    switch(status){
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'discontinued': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  };

  const formatPrice = (price: number)=>{
    return new Intl.NumberFormat('en-US',{
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  const formatDate = (date: Date | string)=>{
    return new Date(date).toLocaleDateString('en-US',{
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return(
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
              {product.status}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {/* Stock */}
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Stock: {product.stock}
          </span>
        </div>

        {/* Provider */}
        {product.provider && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{typeof product.provider === 'string' ? product.provider : product.provider.name }</span>
          </div>
        )}
      </div>
      {/* Timestamps */}
      {product.createdAt && (
        <div className="text-xs text-gray-500 mb-4">
          <div>Created: {formatDate(product.createdAt)}</div>
          {product.updatedAt && <div>Updated: {formatDate(product.updatedAt)}</div>}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(product)}
            className="flex-1"
          >
            View
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(product)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(product)}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}; 