import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: You do not have permission');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', data.message || error.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  // Add other auth methods as needed
  // logout: async () => {
  //   const response = await api.post('/auth/logout');
  //   return response.data;
  // },
};

export const bedsAPI = {
  getAllBeds: async () => {
    const response = await api.get('/beds');
    return response.data;
  },
  
  updateBedStatus: async (id, status) => {
    const response = await api.patch(`/beds/${id}/status`, { status });
    return response.data;
  },
  
  // Add other bed methods as needed
  // getBedById: async (id) => {
  //   const response = await api.get(`/beds/${id}`);
  //   return response.data;
  // },
};

export default api;
