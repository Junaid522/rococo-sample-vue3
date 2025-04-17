import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Create Axios instance with the base URL
const api = axios.create({ baseURL: 'https://api.example.com' });

export default defineBoot(({ app }) => {
  // This ensures that the API instance is available globally
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

});

export { api };
