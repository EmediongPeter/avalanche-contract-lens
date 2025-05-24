import axios from 'axios';
import { toast } from 'sonner';

// Logger function to handle API request/response logging
const logApiActivity = (type: string, data: any) => {
  const timestamp = new Date().toISOString();
  const prefix = `[API ${type}] [${timestamp}]`;
  
  console.group(prefix);
  console.log('Data:', data);
  console.groupEnd();
  
  // You could also implement more sophisticated logging here
  // such as sending logs to a monitoring service
};

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details
    const logData = {
      url: config.url,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      params: config.params,
      data: config.data
    };
    
    logApiActivity('REQUEST', logData);
    return config;
  },
  (error) => {
    logApiActivity('REQUEST_ERROR', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    const logData = {
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    };
    
    logApiActivity('RESPONSE_SUCCESS', logData);
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle specific HTTP errors
    if (response) {
      switch (response.status) {
        case 400:
          toast.error('Bad request: ' + (response.data.detail || 'Please check your input'));
          break;
        case 401:
          toast.error('Session expired. Please sign in again.');
          // Could redirect to login page here
          break;
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error('An error occurred. Please try again.');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    
    // Log error response
    const logData = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data,
      error: error.message
    };
    
    logApiActivity('RESPONSE_ERROR', logData);
    return Promise.reject(error);
  }
);

export default apiClient;
