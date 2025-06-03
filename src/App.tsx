import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProvidersPage } from './pages/ProvidersPage';
import { ProductsPage } from './pages/ProductsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Orange Box</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/providers"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`
                    }
                  >
                    Providers
                  </NavLink>
                  <NavLink
                    to="/products"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`
                    }
                  >
                    Products
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
