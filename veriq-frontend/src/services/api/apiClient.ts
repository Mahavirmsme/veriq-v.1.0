import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      success: false,
      message: error.message || 'Network error or backend unreachable',
      error: { code: 'NETWORK_ERROR', details: error.message },
      timestamp: new Date().toISOString(),
    });
  }
);
