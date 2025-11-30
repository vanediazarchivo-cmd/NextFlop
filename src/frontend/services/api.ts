// src/frontend/services/api.ts

// URL base del backend (Kong como API Gateway)
const API_URL =
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== ""
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8000";

// Nombre de la clave donde guardaremos el token en localStorage
const TOKEN_KEY = "nextflop_token";

export interface ApiError extends Error {
  status: number;
  info?: unknown;
}

/**
 * Devuelve el token JWT almacenado en localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Guarda el token
 */
export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Elimina el token
 */
export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Manejo de respuestas HTTP
 */
async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!res.ok) {
    const error: ApiError = new Error("API request failed") as ApiError;
    error.status = res.status;
    error.info = isJson ? await res.json() : await res.text();
    throw error;
  }

  if (res.status === 204 || !isJson) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

/**
 * Requests sin autenticación
 */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // 👉 Se asegura que los paths siempre empiecen con "/"
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Aseguramos que todas las llamadas al Gateway usen el prefijo /api.
  // Esto centraliza el prefijo en un solo punto y evita inconsistencias con rutas en Kong.
  const url = `${API_URL}/api${normalizedPath}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  return handleResponse<T>(res);
}

/**
 * Requests con autenticación (Bearer token)
 */
export async function apiAuthFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_URL}/api${normalizedPath}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  return handleResponse<T>(res);
}
