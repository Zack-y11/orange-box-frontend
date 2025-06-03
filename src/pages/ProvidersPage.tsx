import React, { useState } from 'react';
import { useProviders } from '../hooks/useProviders';
import { ProviderList } from '../components/providers/ProviderList';
import { ProviderForm } from '../components/providers/ProviderForm';
import { ProviderFiltersComponent } from '../components/providers/ProviderFilters';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import type { Provider, CreateProvider } from '../types/index';

export const ProvidersPage: React.FC = () => {
  const {
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
  } = useProviders();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirmProvider, setDeleteConfirmProvider] = useState<Provider | null>(null);

  const handleAddProvider = () => {
    setSelectedProvider(null);
    setIsModalOpen(true);
  };

  const handleEditProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleDeleteProvider = (provider: Provider) => {
    setDeleteConfirmProvider(provider);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmProvider) return;

    try {
      await deleteProvider(deleteConfirmProvider._id);
      setDeleteConfirmProvider(null);
    } catch (error) {
      console.error('Failed to delete provider:', error);
    }
  };

  const handleFormSubmit = async (data: CreateProvider) => {
    setFormLoading(true);
    try {
      if (selectedProvider) {
        await updateProvider(selectedProvider._id, data);
      } else {
        await createProvider(data);
      }
      setIsModalOpen(false);
      setSelectedProvider(null);
    } catch (error) {
      console.error('Failed to save provider:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  const handleErrorDismiss = () => {
    clearError();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 mx-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={handleErrorDismiss}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <ProviderFiltersComponent
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />

        {/* Provider List */}
        <ProviderList
          providers={providers}
          loading={loading}
          onAdd={handleAddProvider}
          onEdit={handleEditProvider}
          onDelete={handleDeleteProvider}
          onRefresh={refreshProviders}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={changePage}
        />
      </div>

      {/* Provider Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProvider ? 'Edit Provider' : 'Add New Provider'}
        size="md"
      >
        <ProviderForm
          provider={selectedProvider || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmProvider}
        onClose={() => setDeleteConfirmProvider(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmProvider(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="text-gray-600">
          Are you sure you want to delete <strong>{deleteConfirmProvider?.name}</strong>?
          This action cannot be undone.
        </div>
      </Modal>
    </div>
  );
}; 