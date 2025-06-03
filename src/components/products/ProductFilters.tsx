import React from 'react';
import type { Provider, ProductFilters } from '../../types/index';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface ProductFiltersProps {
  filters: ProductFilters;
  providers: Provider[];
  onFiltersChange: (filters: ProductFilters) => void;
  onReset: () => void;
}

export const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({
  filters,
  providers,
  onFiltersChange,
  onReset
}) => {
  const handleFilterChange = (key: keyof ProductFilters, value: string | number | undefined) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <Input
            label="Search"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search products..."
          />
        </div>

        {/* Status */}
        <div>
          <Select
            label="Status"
            value={filters.status || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('status', e.target.value as any)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
          </Select>
        </div>

        {/* Provider */}
        <div>
          <Select
            label="Provider"
            value={filters.provider || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('provider', e.target.value)}
          >
            <option value="">All Providers</option>
            {providers.map((provider) => (
              <option key={provider._id} value={provider._id}>
                {provider.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Sort By */}
        <div>
          <Select
            label="Sort By"
            value={filters.sort || 'desc'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('sort', e.target.value as 'asc' | 'desc')}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </Select>
        </div>

        {/* Min Price */}
        <div>
          <Input
            label="Min Price"
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value) || undefined)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Max Price */}
        <div>
          <Input
            label="Max Price"
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value) || undefined)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Items per page */}
        <div>
          <Select
            label="Items per page"
            value={filters.limit || 10}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('limit', parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </div>
      </div>
    </div>
  );
};