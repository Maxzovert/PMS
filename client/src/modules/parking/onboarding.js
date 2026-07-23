export const ONBOARDING_STEPS = [
  { key: 'welcome', label: 'Welcome', index: 0 },
  { key: 'basics', label: 'Basics', index: 1 },
  { key: 'location', label: 'Location', index: 2 },
  { key: 'space', label: 'Space', index: 3 },
  { key: 'pricing', label: 'Pricing', index: 4 },
  { key: 'review', label: 'Review', index: 5 },
];

export const LOCATION_TYPES = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'residential', label: 'Residential' },
  { value: 'mixed', label: 'Mixed use' },
  { value: 'other', label: 'Other' },
];

export const VEHICLE_OPTIONS = [
  { value: 'bike', label: 'Bike' },
  { value: 'car', label: 'Car' },
  { value: 'suv', label: 'SUV' },
  { value: 'commercial', label: 'Commercial' },
];

export function emptyParkingForm() {
  return {
    name: '',
    locationType: '',
    addressLine1: '',
    landmark: '',
    latitude: '',
    longitude: '',
    capacity: '',
    covered: false,
    vehicleTypes: [],
    priceHourly: '',
    priceDaily: '',
    openTime: '08:00',
    closeTime: '22:00',
  };
}

export function locationToForm(location) {
  return {
    name: location?.name || '',
    locationType: location?.locationType || '',
    addressLine1: location?.addressLine1 || '',
    landmark: location?.landmark || '',
    latitude:
      location?.latitude !== null && location?.latitude !== undefined
        ? String(location.latitude)
        : '',
    longitude:
      location?.longitude !== null && location?.longitude !== undefined
        ? String(location.longitude)
        : '',
    capacity:
      location?.capacity !== null && location?.capacity !== undefined
        ? String(location.capacity)
        : '',
    covered: Boolean(location?.covered),
    vehicleTypes: Array.isArray(location?.vehicleTypes)
      ? [...location.vehicleTypes]
      : [],
    priceHourly:
      location?.priceHourly !== null && location?.priceHourly !== undefined
        ? String(location.priceHourly)
        : '',
    priceDaily:
      location?.priceDaily !== null && location?.priceDaily !== undefined
        ? String(location.priceDaily)
        : '',
    openTime: location?.openTime || '08:00',
    closeTime: location?.closeTime || '22:00',
  };
}

/** Build PATCH body for the current step (includes onboardingStep to land on). */
export function buildStepPayload(form, nextStepIndex) {
  const numOrNull = (v) => {
    if (v === '' || v === null || v === undefined) {
      return null;
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    name: form.name,
    locationType: form.locationType || null,
    addressLine1: form.addressLine1,
    landmark: form.landmark,
    latitude: numOrNull(form.latitude),
    longitude: numOrNull(form.longitude),
    capacity: numOrNull(form.capacity),
    covered: Boolean(form.covered),
    vehicleTypes: form.vehicleTypes,
    priceHourly: numOrNull(form.priceHourly),
    priceDaily: numOrNull(form.priceDaily),
    openTime: form.openTime || null,
    closeTime: form.closeTime || null,
    onboardingStep: nextStepIndex,
  };
}
