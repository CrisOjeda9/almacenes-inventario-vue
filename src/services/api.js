// src/services/api.js
import axios from 'axios';

// Configuración base de la API
const api = axios.create({
  baseURL: 'http://192.168.10.31:3000/api', // Cambia a la IP de tu servidor
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la API:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout: La solicitud tardó demasiado');
    } else if (error.response) {
      console.error('Error del servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;