import axios from 'axios';

/**
 * JavaScript OOP Implementation: ApiService Class
 * Wraps Axios with custom headers, interceptors, and error handling.
 */
class ApiService {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to append JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle unauthenticated (401/403) errors
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.warn('Unauthorized access, logging out user...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Optional: redirect to login
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
        }
        
        // Extract error message
        const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan atau server.';
        const customError = new Error(errorMessage);
        customError.status = error.response?.status;
        customError.originalError = error;
        
        return Promise.reject(customError);
      }
    );
  }

  // HTTP GET
  async get(url, params = {}) {
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // HTTP POST
  async post(url, data = {}) {
    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // HTTP PUT
  async put(url, data = {}) {
    try {
      const response = await this.client.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // HTTP DELETE
  async delete(url) {
    try {
      const response = await this.client.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Instance initialization pointing to backend port 5000
const apiServiceInstance = new ApiService('http://localhost:5000');

export default apiServiceInstance;
export { ApiService };
