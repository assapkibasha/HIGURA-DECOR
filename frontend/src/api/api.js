import axios  from 'axios';
import { getHiguraAccessToken } from '../context/HiguraAuthContext';

export const API_URL = import.meta.env.VITE_API_URL
// Create an axios instance with a base URL
const api = axios.create({
  baseURL:API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
   
  },
  withCredentials:true
});

api.interceptors.request.use((config) => {
  const token = getHiguraAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example usage
// api.get('/users') will make a request to https://api.example.com/users

export default api;