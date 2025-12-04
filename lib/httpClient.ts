const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

const API_BASE_URL = (getEnv('VITE_API_URL') || '').replace(/\/$/, '');
const TOKEN_STORAGE_KEY = 'solarlink.auth.token';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  rawUrl?: boolean;
}

type UnauthorizedListener = () => void;

let authToken: string | null = (typeof localStorage !== 'undefined')
  ? localStorage.getItem(TOKEN_STORAGE_KEY)
  : null;

const unauthorizedListeners = new Set<UnauthorizedListener>();

const buildUrl = (path: string, rawUrl?: boolean) => {
  if (rawUrl || path.startsWith('http')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!authToken && typeof localStorage !== 'undefined') {
    authToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  const payload = contentType && contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      unauthorizedListeners.forEach((listener) => listener());
    }

    const errorMessage = typeof payload === 'string'
      ? payload
      : payload?.message || 'Erro ao comunicar com o servidor.';
    throw new Error(errorMessage);
  }

  return payload;
};

const request = async <T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> => {
  const { skipAuth, rawUrl, headers, body, ...rest } = options;
  const mergedHeaders = { ...getDefaultHeaders(), ...headers };

  if (skipAuth) {
    delete mergedHeaders['Authorization'];
  }

  const finalBody = body && typeof body !== 'string' && !(body instanceof FormData)
    ? JSON.stringify(body)
    : body;

  const response = await fetch(buildUrl(path, rawUrl), {
    method,
    headers: mergedHeaders,
    body: finalBody,
    ...rest,
  });

  return handleResponse(response) as Promise<T>;
};

export const setAuthToken = (token: string) => {
  authToken = token;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

export const clearAuthToken = () => {
  authToken = null;
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
  setAuthToken,
  clearAuthToken,
  onUnauthorized: (listener: UnauthorizedListener) => {
    unauthorizedListeners.add(listener);
    return () => unauthorizedListeners.delete(listener);
  },
};

export type ApiResponse<T> = T;
