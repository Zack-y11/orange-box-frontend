import React, { useState, useEffect } from 'react';
import type { Provider, CreateProvider } from '../../types/index';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ProviderFormProps {
  provider?: Provider;
  onSubmit: (data: CreateProvider) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ProviderForm: React.FC<ProviderFormProps> = ({
  provider,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateProvider>({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<CreateProvider>>({});

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        address: provider.address,
        description: provider.description
      });
    }
  }, [provider]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProvider> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (field: keyof CreateProvider) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        type="text"
        value={formData.name}
        onChange={handleChange('name')}
        error={errors.name}
        placeholder="Enter provider name"
        disabled={loading}
        required
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        placeholder="Enter email address (optional)"
        disabled={loading}
      />

      <Input
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange('phone')}
        error={errors.phone}
        placeholder="Enter phone number"
        disabled={loading}
        required
      />

      <Input
        label="Address"
        type="text"
        value={formData.address}
        onChange={handleChange('address')}
        error={errors.address}
        placeholder="Enter full address"
        disabled={loading}
        required
      />

      <Input
        label="Description"
        type="text"
        value={formData.description}
        onChange={handleChange('description')}
        error={errors.description}
        placeholder="Enter provider description"
        disabled={loading}
        required
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {provider ? 'Update Provider' : 'Create Provider'}
        </Button>
      </div>
    </form>
  );
}; 