import axios from 'axios';
import { API_CONFIG } from '../constants/config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token when JWT is implemented
    // const token = await AsyncStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error status
      console.error('[API Error Response]', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login (when auth is implemented)
          console.log('Unauthorized access');
          break;
        case 404:
          console.log('Resource not found');
          break;
        case 409:
          console.log('Conflict - resource already exists');
          break;
        case 422:
          console.log('Validation error');
          break;
        case 500:
          console.log('Server error');
          break;
        default:
          console.log('API error:', error.response.status);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('[API No Response]', error.request);
      console.log('Network error - no response from server');
    } else {
      // Error setting up the request
      console.error('[API Request Setup Error]', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
