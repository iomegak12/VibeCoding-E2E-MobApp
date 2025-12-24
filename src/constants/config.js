// API Configuration
import { Platform } from 'react-native';

// For Android Emulator: use 10.0.2.2 instead of localhost
// For iOS Simulator: localhost works fine
// For Physical Device: use your computer's IP address
const getApiBaseUrl = () => {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    // Development mode
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api/v1';
    }
    return 'http://localhost:8000/api/v1';
  }
  // Production mode - replace with your production URL
  return 'https://your-production-api.com/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_SKIP: 0,
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'TrueStock',
  VERSION: '1.0.0',
  BUILD: 1,
};
