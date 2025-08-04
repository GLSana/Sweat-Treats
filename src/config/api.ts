// API Configuration for development and production
const getApiBaseUrl = () => {
  // In production (Vercel), use relative URLs
  if (window.location.hostname !== 'localhost') {
    return '/api';
  }
  // In development, use localhost
  return 'http://localhost:3001/api';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  analytics: `${API_BASE_URL}/analytics`,
  ingredients: `${API_BASE_URL}/ingredients`,
  cakes: `${API_BASE_URL}/cakes`,
}; 