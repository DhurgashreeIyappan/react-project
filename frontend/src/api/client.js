import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false
});

export const setAuthToken = (token) => {
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common['Authorization'];
  }
};

// Helper to get image URL - extracts base URL from apiBaseUrl (removes /api if present)
export const getImageUrl = (filename) => {
  if (!filename) return '/placeholder-property.svg';
  const baseUrl = apiBaseUrl.replace('/api', '') || 'http://localhost:5000';
  return `${baseUrl}/api/images/${filename}`;
};

export default client;


