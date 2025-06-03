import React from 'react';

interface FilterProps {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  order: 'asc' | 'desc';
  fields: string;
}

interface ProviderFiltersProps {
  filters: FilterProps;
  onFiltersChange: (filters: Partial<FilterProps>) => void;
  disabled?: boolean;
}

export const ProviderFilters: React.FC<ProviderFiltersProps> = ({
  filters,
  onFiltersChange,
  disabled = false
}) => {
  const handleInputChange = (field: keyof FilterProps, value: any) => {
    onFiltersChange({ [field]: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      sortBy: 'createdAt',
      order: 'desc',
      page: 1
    });
  };

  const hasActiveFilters = filters.search !== '';

  return (
    <div className="provider-filters">
      <div className="filters-row">
        {/* Search Input */}
        <div className="filter-group">
          <label htmlFor="search">Search Providers</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              id="search"
              placeholder="Search by name or description..."
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              disabled={disabled}
              className="search-input"
            />
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
            disabled={disabled}
          >
            <option value="createdAt">Created Date</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="updatedAt">Updated Date</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label htmlFor="order">Order</label>
          <select
            id="order"
            value={filters.order}
            onChange={(e) => handleInputChange('order', e.target.value as 'asc' | 'desc')}
            disabled={disabled}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Items Per Page */}
        <div className="filter-group">
          <label htmlFor="limit">Per Page</label>
          <select
            id="limit"
            value={filters.limit}
            onChange={(e) => handleInputChange('limit', parseInt(e.target.value))}
            disabled={disabled}
          >
            <option value={6}>6 items</option>
            <option value={12}>12 items</option>
            <option value={24}>24 items</option>
            <option value={48}>48 items</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Row */}
      <div className="filters-row advanced-filters">
        {/* Field Selection */}
        <div className="filter-group">
          <label htmlFor="fields">Select Fields</label>
          <select
            id="fields"
            value={filters.fields}
            onChange={(e) => handleInputChange('fields', e.target.value)}
            disabled={disabled}
          >
            <option value="">All Fields</option>
            <option value="name,email,phone">Basic Info (Name, Email, Phone)</option>
            <option value="name,email,phone,address">Contact Info</option>
            <option value="name,description">Name & Description</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="filter-group">
            <button
              type="button"
              onClick={handleClearFilters}
              disabled={disabled}
              className="btn btn-secondary btn-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {filters.search && (
            <span className="filter-tag">
              Search: "{filters.search}"
              <button 
                onClick={() => handleInputChange('search', '')}
                disabled={disabled}
                className="filter-tag-remove"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}; 