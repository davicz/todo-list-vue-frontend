import axios from 'axios';
// Já não precisamos de importar o store aqui

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Intercetor de requisições
apiClient.interceptors.request.use(config => {
  // Lemos o token diretamente do localStorage em cada requisição.
  // Isto é mais fiável e evita problemas de timing.
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
