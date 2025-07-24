import axios from 'axios';
import { store } from '../store';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  if (store.token) {
    config.headers.Authorization = `Bearer ${store.token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;