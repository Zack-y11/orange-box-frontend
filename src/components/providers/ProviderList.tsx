import React, { useState } from 'react';
import type { Provider } from '../../types';
import { ProviderCard } from './ProviderCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProviderListProps {
  providers: Provider[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
  onRefresh?: () => void;
}

export const ProviderList: React.FC<ProviderListProps> = ({
  providers,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (provider.email && provider.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         provider.phone.includes(searchTerm);
    
    return matchesSearch;
  });

  if (loading && providers.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading providers..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Providers</h2>
          <p className="text-gray-600">Manage your supplier network</p>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          )}
          <Button onClick={onAdd}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Provider
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search providers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{providers.length}</div>
          <div className="text-sm text-gray-600">Total Providers</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{filteredProviders.length}</div>
          <div className="text-sm text-gray-600">Filtered Results</div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && providers.length > 0 && (
        <div className="text-center py-4">
          <LoadingSpinner size="sm" text="Updating..." />
        </div>
      )}

      {/* Provider Cards */}
      {filteredProviders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No providers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Get started by creating your first provider.'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Button onClick={onAdd}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Provider
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider._id}
              provider={provider}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 