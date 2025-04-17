import axios from 'axios';
import { useAuthStore } from 'stores/auth';
import { useRouterStore } from 'stores/routerStore'; // Import the router store

const API_URL = process.env.VUE_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL, // Set the base URL
  headers: {
    'Content-Type': 'application/json', // Default headers
  },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const routerStore = useRouterStore(); // Access the router store
      routerStore.redirectToLogin();
      window.location.href = '/login'
    }
    return Promise.reject(error);
  }
);

export default apiClient;
