import axios from 'axios';

// Primary API URL (Vercel deployment)
const PRODUCTION_API_URL = 'https://api-rest-orange-box.vercel.app/api/v1';
// Fallback API URL (local development)
const DEVELOPMENT_API_URL = 'http://localhost:3000/api/v1';

const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE_URL = isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with fallback logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // If the request failed and we're using production URL, try fallback
    if (error.config?.baseURL === PRODUCTION_API_URL && !error.config?._retried) {
      console.log('Production API failed, trying fallback URL...');
      error.config._retried = true;
      error.config.baseURL = DEVELOPMENT_API_URL;
      return api.request(error.config);
    }
    
    return Promise.reject(error);
  }
);