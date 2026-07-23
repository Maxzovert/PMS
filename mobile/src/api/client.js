import { ApiError } from './errors';
import { getSessionToken } from '../auth/session';

function getBaseUrl() {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new ApiError(
      'EXPO_PUBLIC_API_BASE_URL is not set. Copy mobile/.env.example to mobile/.env.',
      { code: 'CONFIG_ERROR' },
    );
  }
  return raw.trim().replace(/\/$/, '');
}

function createRequestId() {
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * Low-level request helper. Understands PARKAR success/error envelopes.
 * Uses Bearer token from SecureStore (cookies are unreliable on native).
 *
 * @param {string} path
 * @param {{ method?: string, body?: unknown, headers?: Record<string, string>, signal?: AbortSignal }} [options]
 */
export async function apiRequest(path, options = {}) {
  const baseUrl = getBaseUrl();
  const method = (options.method || 'GET').toUpperCase();
  const requestId = createRequestId();
  const token = await getSessionToken();

  const headers = {
    Accept: 'application/json',
    'X-Request-Id': requestId,
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  /** @type {RequestInit} */
  const init = {
    method,
    headers,
    signal: options.signal,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(options.body);
  }

  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  let response;
  try {
    response = await fetch(url, init);
  } catch (cause) {
    throw new ApiError(
      'Could not reach the API. Is the server running? On Android emulator use http://10.0.2.2:3000; on a device use your LAN IP.',
      { code: 'NETWORK_ERROR', requestId, cause },
    );
  }

  const responseRequestId =
    response.headers.get('X-Request-Id') || requestId;

  let payload;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new ApiError('API returned a non-JSON response.', {
      code: 'INVALID_RESPONSE',
      status: response.status,
      requestId: responseRequestId,
      cause,
    });
  }

  if (payload && payload.success === true) {
    return {
      data: payload.data,
      message: payload.message || 'OK',
      requestId: payload.requestId || responseRequestId,
    };
  }

  if (payload && payload.success === false && payload.error) {
    throw new ApiError(payload.error.message || 'Request failed.', {
      code: payload.error.code || 'API_ERROR',
      status: response.status,
      requestId: payload.error.requestId || responseRequestId,
    });
  }

  throw new ApiError('Unexpected API response shape.', {
    code: 'INVALID_RESPONSE',
    status: response.status,
    requestId: responseRequestId,
  });
}

export function apiGet(path, options = {}) {
  return apiRequest(path, { ...options, method: 'GET' });
}

export function apiPost(path, body, options = {}) {
  return apiRequest(path, { ...options, method: 'POST', body });
}

export function apiPatch(path, body, options = {}) {
  return apiRequest(path, { ...options, method: 'PATCH', body });
}
