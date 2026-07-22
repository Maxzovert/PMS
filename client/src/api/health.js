import { apiGet } from './client';

/**
 * GET /health — foundation smoke check.
 * @param {{ signal?: AbortSignal }} [options]
 */
export function getHealth(options = {}) {
  return apiGet('/health', options);
}
