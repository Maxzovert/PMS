import { apiGet, apiPatch } from './client';

export function getOwnerProfile(options = {}) {
  return apiGet('/owners/me/profile', options);
}

export function updateOwnerProfile(profile, options = {}) {
  return apiPatch('/owners/me/profile', profile, options);
}
