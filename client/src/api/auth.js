import { apiGet, apiPost } from './client';

export function requestOtp(phone, options = {}) {
  return apiPost('/auth/request-otp', { phone }, options);
}

export function verifyOtp(phone, code, options = {}) {
  return apiPost('/auth/verify-otp', { phone, code }, options);
}

export function logout(options = {}) {
  return apiPost('/auth/logout', {}, options);
}

export function getMe(options = {}) {
  return apiGet('/auth/me', options);
}
