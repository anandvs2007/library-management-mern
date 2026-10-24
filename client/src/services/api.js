import axios from 'axios';

// The one place that sets the API address. Change it with VITE_API_URL, never in components.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default api;
