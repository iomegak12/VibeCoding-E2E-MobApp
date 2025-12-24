import { API_CONFIG } from './config';

/**
 * Test backend API connectivity
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api/v1', '')}/health`);
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: 'Backend connected successfully',
        data,
      };
    }
    
    return {
      success: false,
      message: `Backend returned status: ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Cannot connect to backend: ${error.message}`,
      error,
    };
  }
};

/**
 * Get backend base URL for display
 * @returns {string}
 */
export const getBackendUrl = () => {
  return API_CONFIG.BASE_URL;
};
