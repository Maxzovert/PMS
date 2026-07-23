import { apiGet, apiPost, apiPatch } from './client';

export function listParkingLocations(options = {}) {
  return apiGet('/parking/locations', options);
}

export function createParkingLocation(options = {}) {
  return apiPost('/parking/locations', {}, options);
}

export function getParkingLocation(id, options = {}) {
  return apiGet(`/parking/locations/${id}`, options);
}

export function updateParkingLocation(id, body, options = {}) {
  return apiPatch(`/parking/locations/${id}`, body, options);
}

export function submitParkingLocation(id, options = {}) {
  return apiPost(`/parking/locations/${id}/submit`, {}, options);
}
