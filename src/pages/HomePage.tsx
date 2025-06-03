import React from 'react';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Orange Box Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your providers and products efficiently
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Providers Management</h3>
            <p className="text-gray-600 mb-4">
              Manage your supplier network with full CRUD operations
            </p>
            <Button 
              onClick={() => window.location.href = '/providers'}
              className="w-full"
            >
              Go to Providers
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-purple-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Products Management</h3>
            <p className="text-gray-600 mb-4">
              Manage your product catalog and inventory
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              disabled
            >
              Coming Soon
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Built with React, TypeScript, and Tailwind CSS
        </div>
      </div>
    </div>
  );
}; 