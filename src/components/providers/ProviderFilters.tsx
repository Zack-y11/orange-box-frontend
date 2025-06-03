import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { ProviderFilters } from '../../types/index';

interface ProviderFiltersComponentProps {
  filters: ProviderFilters;
  onFiltersChange: (filters: Partial<ProviderFilters>) => void;
  onReset: () => void;
}

export const ProviderFiltersComponent: React.FC<ProviderFiltersComponentProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value || undefined });
  };

  const handleNameChange = (value: string) => {
    onFiltersChange({ name: value || undefined });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, order] = value.split(':');
    onFiltersChange({ 
      sortBy: sortBy || 'createdAt', 
      order: (order as 'asc' | 'desc') || 'desc' 
    });
  };

  const handleLimitChange = (value: string) => {
    const limit = parseInt(value);
    onFiltersChange({ limit, page: 1 });
  };

  const sortValue = `${filters.sortBy || 'createdAt'}:${filters.order || 'desc'}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <Input
            type="text"
            placeholder="Search providers..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Name Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider Name
          </label>
          <Input
            type="text"
            placeholder="Filter by name..."
            value={filters.name || ''}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <Select
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="name:asc">Name A-Z</option>
            <option value="name:desc">Name Z-A</option>
          </Select>
        </div>

        {/* Items per page */}
        <div className="min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items per page
          </label>
          <Select
            value={filters.limit?.toString() || '5'}
            onChange={(e) => handleLimitChange(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onReset}
            className="mb-0"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.name) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: {filters.search}
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.name && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Name: {filters.name}
                <button
                  onClick={() => handleNameChange('')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 