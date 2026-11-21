import axios from 'axios';
import { environment } from '../../environments/environment';

export const giphyApi = axios.create({
  baseURL: environment.giphyApiUrl,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

giphyApi.interceptors.request.use((config) => {
  config.params = { api_key: environment.giphyApiKey, ...config.params };
  return config;
});

giphyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    return Promise.reject(new Error(httpErrorMessage(error.response?.status, error.code)));
  },
);

export function httpErrorMessage(status?: number, code?: string): string {
  if (status === 401 || status === 403) return 'API key inválida o sin permisos. Revisa tu .env';
  if (status === 414) return 'La búsqueda es demasiado larga';
  if (status === 429) return 'Demasiadas peticiones, espera un momento e intenta de nuevo';
  if (status && status >= 500) return 'Error del servidor de Giphy, intenta más tarde';
  if (code === 'ECONNABORTED') return 'La petición tardó demasiado (timeout)';
  if (!status) return 'Sin conexión o error de CORS';
  return `Error HTTP ${status}`;
}
