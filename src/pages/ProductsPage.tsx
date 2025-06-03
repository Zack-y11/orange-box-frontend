import React, { useState, useEffect } from 'react';
import { providerService } from '../services/providers';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../components/products/ProductList';
import { ProductForm } from '../components/products/ProductForm';
import { ProductFiltersComponent } from '../components/products/ProductFilters';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import type { Product, CreateProduct, Provider, ProductWithProvider } from '../types/index';

export const ProductsPage: React.FC = () => {
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    createProduct,
    updateProduct,
    replaceProduct,
    deleteProduct,
    getProductById,
    getProductsByProvider,
    updateFilters,
    resetFilters,
    changePage,
    clearError
  } = useProducts();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductWithProvider | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [providerViewMode, setProviderViewMode] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [providerProducts, setProviderProducts] = useState<Product[]>([]);
  const [providerLoading, setProviderLoading] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await providerService.getAll({ limit: 100 });
        setProviders(response.data || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
      }
    };
    fetchProviders();
  }, []);

  const getProductsWithIssues = () => {
    return products.filter(product => {
      return !product.provider || product.provider === null;
    });
  };

  const productsWithIssues = getProductsWithIssues();

  const getMissingProviderIds = (): string[] => {
    if (products.length === 0 || providers.length === 0) return [];
    
    const productProviderIds = [...new Set(products
      .filter(p => p.provider && typeof p.provider === 'string')
      .map(p => p.provider as string)
    )];
    const providerIds = providers.map(p => p._id);
    
    return productProviderIds.filter(id => !providerIds.includes(id));
  };

  const missingProviderIds = getMissingProviderIds();

  const productsWithProviders: ProductWithProvider[] = (providerViewMode ? providerProducts : products).map(product => {
    let providerData: Provider;
    
    if (product.provider && typeof product.provider === 'object') {
      providerData = product.provider as Provider;
    } else if (product.provider && typeof product.provider === 'string') {
      const foundProvider = providers.find(p => p._id === product.provider);
      if (foundProvider) {
        providerData = foundProvider;
      } else {
        providerData = {
          _id: product.provider,
          name: `Unknown Provider (ID: ${product.provider.slice(-8)})`,
          phone: '',
          address: '',
          description: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    } else {
      providerData = {
        _id: 'null',
        name: 'No Provider (Database Issue)',
        phone: '',
        address: '',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    return {
      ...product,
      provider: providerData
    };
  });

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: ProductWithProvider) => {
    const productForEdit: Product = {
      ...product,
      provider: product.provider._id
    };
    setEditingProduct(productForEdit);
    setShowForm(true);
  };

  const handleDelete = (product: ProductWithProvider) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleViewDetails = async (product: ProductWithProvider) => {
    try {
      setDetailLoading(true);
      setShowDetailModal(true);
      
      const fullProduct = await getProductById(product._id!);
      setSelectedProduct(fullProduct);
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleProviderView = async (providerId: string) => {
    if (!providerId) {
      setProviderViewMode(false);
      setProviderProducts([]);
      return;
    }

    try {
      setProviderLoading(true);
      setSelectedProviderId(providerId);
      setProviderViewMode(true);
      
      const response = await getProductsByProvider(providerId, {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        order: 'desc'
      });
      
      setProviderProducts(response);
    } catch (err) {
      console.error('Error fetching provider products:', err);
    } finally {
      setProviderLoading(false);
    }
  };

  const handleFormSubmit = async (data: CreateProduct, isFullUpdate: boolean = false) => {
    try {
      setIsSubmitting(true);
      
      if (editingProduct) {
        if (isFullUpdate) {
          await replaceProduct(editingProduct._id!, data);
        } else {
          await updateProduct(editingProduct._id!, data);
        }
      } else {
        await createProduct(data);
      }
      
      setShowForm(false);
      setEditingProduct(null);
      
      if (providerViewMode && selectedProviderId) {
        handleProviderView(selectedProviderId);
      }
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete._id!);
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      if (providerViewMode && selectedProviderId) {
        handleProviderView(selectedProviderId);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleErrorDismiss = () => {
    clearError();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            {providerViewMode 
              ? `Products from ${providers.find(p => p._id === selectedProviderId)?.name || 'Selected Provider'}`
              : 'Manage your product catalog'
            }
          </p>
        </div>
        <div className="flex gap-3">
          {providerViewMode && (
            <Button
              variant="outline"
              onClick={() => handleProviderView('')}
            >
              ← Back to All Products
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleCreate}
          >
            Add New Product
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            View by Provider:
          </label>
          <Select
            value={selectedProviderId}
            onChange={(e) => handleProviderView(e.target.value)}
            className="min-w-[200px]"
          >
            <option value="">All Providers</option>
            {providers.map((provider) => (
              <option key={provider._id} value={provider._id}>
                {provider.name}
              </option>
            ))}
          </Select>
          {providerViewMode && (
            <span className="text-sm text-gray-500">
              ({providerProducts.length} products)
            </span>
          )}
        </div>
      </div>

      {productsWithIssues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Database Provider Issues
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {productsWithIssues.length} product(s) have null/invalid provider references in the database.
                </p>
                <div className="mt-2">
                  <p className="font-medium">Products affected:</p>
                  <ul className="list-disc list-inside mt-1">
                    {productsWithIssues.slice(0, 3).map(product => (
                      <li key={product._id}>{product.name}</li>
                    ))}
                    {productsWithIssues.length > 3 && (
                      <li>...and {productsWithIssues.length - 3} more</li>
                    )}
                  </ul>
                  <p className="mt-2 font-medium">Solutions:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Edit these products and assign valid providers</li>
                    <li>Check database for orphaned products</li>
                    <li>Run data cleanup scripts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {missingProviderIds.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Missing Provider References
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Some products reference providers that don't exist in the providers database. 
                  Missing provider IDs: {missingProviderIds.map(id => id.slice(-8)).join(', ')}
                </p>
                <div className="mt-2">
                  <p className="font-medium">Possible solutions:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Create missing providers in the Providers page</li>
                    <li>Update products to use existing provider IDs</li>
                    <li>Check if these providers were deleted</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex justify-between items-start">
            <div className="text-red-800">
              <p className="text-sm font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={handleErrorDismiss}
              className="text-red-400 hover:text-red-600 ml-4"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {!providerViewMode && (
        <ProductFiltersComponent
          filters={filters}
          providers={providers}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />
      )}

      <ProductList
        products={productsWithProviders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleViewDetails}
        isLoading={loading || providerLoading}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={changePage}
      />

      <Modal
        isOpen={showForm}
        onClose={handleFormCancel}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
      >
        <ProductForm
          product={editingProduct || undefined}
          providers={providers}
          onSubmit={(data) => handleFormSubmit(data, false)}
          onCancel={handleFormCancel}
          isLoading={isSubmitting}
        />
        
        {editingProduct && (
          <div className="px-6 pb-6">
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">
                Or perform a complete replacement (all fields required):
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  const formData = editingProduct as CreateProduct;
                  handleFormSubmit(formData, true);
                }}
                disabled={isSubmitting}
                className="w-full"
              >
                Full Replace (PUT) - All Fields Required
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Product Details"
      >
        <div className="p-6">
          {detailLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading product details...</p>
            </div>
          ) : selectedProduct ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                <p className="text-gray-600">{selectedProduct.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-lg">${selectedProduct.price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Stock</label>
                  <p className="text-lg">{selectedProduct.stock}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className={`text-sm px-2 py-1 rounded inline-block ${
                    selectedProduct.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedProduct.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedProduct.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider</label>
                  <p>{providers.find(p => p._id === selectedProduct.provider)?.name || 'Unknown'}</p>
                </div>
              </div>
              
              {selectedProduct.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm">{new Date(selectedProduct.createdAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No product data available</p>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="danger"
              onClick={confirmDelete}
              className="flex-1"
            >
              Delete Product
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
