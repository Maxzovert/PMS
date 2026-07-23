import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  getParkingLocation,
  updateParkingLocation,
  submitParkingLocation,
  ApiError,
} from '../api';
import { Field } from '../components/Field';
import { DecorWave } from '../components/DecorWave';
import {
  ONBOARDING_STEPS,
  LOCATION_TYPES,
  VEHICLE_OPTIONS,
  emptyParkingForm,
  locationToForm,
  buildStepPayload,
} from '../parking/onboarding';
import findParking from '../assets/decor/states/find-parking-anywhere.png';
import { colors } from '../theme/colors';

export function ParkingOnboardingScreen({ navigation, route }) {
  const id = route.params?.id;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyParkingForm());
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) {
      setError('Missing parking id.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getParkingLocation(id);
      const location = result.data?.location;
      if (!location) {
        setError('Parking not found.');
        return;
      }
      if (location.status !== 'draft') {
        navigation.replace('ParkingList');
        return;
      }
      setForm(locationToForm(location));
      setStatus(location.status);
      setStep(Math.min(5, Math.max(0, location.onboardingStep || 0)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load draft.');
    } finally {
      setLoading(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    load();
  }, [load]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleVehicle(value) {
    setForm((prev) => {
      const has = prev.vehicleTypes.includes(value);
      return {
        ...prev,
        vehicleTypes: has
          ? prev.vehicleTypes.filter((v) => v !== value)
          : [...prev.vehicleTypes, value],
      };
    });
  }

  async function saveAndGo(nextStep) {
    setBusy(true);
    setError(null);
    try {
      const payload = buildStepPayload(form, nextStep);
      const result = await updateParkingLocation(id, payload);
      const location = result.data?.location;
      setForm(locationToForm(location));
      setStatus(location.status);
      setStep(nextStep);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      await updateParkingLocation(id, buildStepPayload(form, 5));
      await submitParkingLocation(id);
      navigation.replace('ParkingList');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit.');
      setBusy(false);
    }
  }

  const progress = ((step + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: colors.secondary }}>
        <SafeAreaView edges={['top']}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('ParkingList')}>
              <Text style={{ color: colors.surface, fontSize: 14 }}>
                ← All parkings
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: 'rgba(246,246,245,0.7)',
                fontSize: 12,
                textTransform: 'uppercase',
              }}
            >
              {status}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.textMuted }}>
                Step {step + 1} of {ONBOARDING_STEPS.length}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>
                {ONBOARDING_STEPS[step]?.label}
              </Text>
            </View>
            <View
              style={{
                height: 8,
                borderRadius: 999,
                backgroundColor: colors.surfaceMuted,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: colors.primary,
                  borderRadius: 999,
                }}
              />
            </View>
          </View>

          {step === 0 ? (
            <View>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  color: colors.secondaryDeep,
                }}
              >
                Let’s list your parking
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  lineHeight: 22,
                  color: colors.textMuted,
                }}
              >
                A short guided setup. Save and come back — nothing goes live
                until you submit for review.
              </Text>
              <View style={{ marginTop: 16, marginBottom: 8 }}>
                <DecorWave kind="light" width={100} height={14} opacity={0.4} />
              </View>
              <Image
                source={findParking}
                style={{
                  width: '100%',
                  height: 160,
                  marginVertical: 16,
                }}
                resizeMode="contain"
              />
              <Cta
                label={busy ? 'Saving…' : 'Begin setup'}
                busy={busy}
                onPress={() => saveAndGo(1)}
              />
            </View>
          ) : null}

          {step === 1 ? (
            <View style={{ gap: 16 }}>
              <StepTitle
                title="Basics"
                body="Give your location a clear name drivers will recognize."
              />
              <Field
                label="Parking name"
                value={form.name}
                onChangeText={(v) => updateField('name', v)}
                placeholder="e.g. Green Lane Covered Lot"
                editable={!busy}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: colors.secondary,
                }}
              >
                Location type
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {LOCATION_TYPES.map((t) => {
                  const active = form.locationType === t.value;
                  return (
                    <Chip
                      key={t.value}
                      label={t.label}
                      active={active}
                      disabled={busy}
                      onPress={() => updateField('locationType', t.value)}
                    />
                  );
                })}
              </View>
              <StepNav
                busy={busy}
                onBack={() => setStep(0)}
                onNext={() => saveAndGo(2)}
              />
            </View>
          ) : null}

          {step === 2 ? (
            <View style={{ gap: 16 }}>
              <StepTitle
                title="Location"
                body="Address and optional coordinates (map pin comes later)."
              />
              <Field
                label="Address"
                value={form.addressLine1}
                onChangeText={(v) => updateField('addressLine1', v)}
                editable={!busy}
              />
              <Field
                label="Landmark"
                value={form.landmark}
                onChangeText={(v) => updateField('landmark', v)}
                editable={!busy}
              />
              <Field
                label="Latitude"
                value={form.latitude}
                onChangeText={(v) => updateField('latitude', v)}
                keyboardType="decimal-pad"
                placeholder="28.61"
                editable={!busy}
              />
              <Field
                label="Longitude"
                value={form.longitude}
                onChangeText={(v) => updateField('longitude', v)}
                keyboardType="decimal-pad"
                placeholder="77.20"
                editable={!busy}
              />
              <StepNav
                busy={busy}
                onBack={() => setStep(1)}
                onNext={() => saveAndGo(3)}
              />
            </View>
          ) : null}

          {step === 3 ? (
            <View style={{ gap: 16 }}>
              <StepTitle
                title="Space & vehicles"
                body="How many spots, and what fits."
              />
              <Field
                label="Capacity (spots)"
                value={form.capacity}
                onChangeText={(v) => updateField('capacity', v)}
                keyboardType="number-pad"
                editable={!busy}
              />
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={busy}
                onPress={() => updateField('covered', !form.covered)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: form.covered
                      ? colors.primary
                      : colors.border,
                    backgroundColor: form.covered
                      ? colors.primary
                      : 'transparent',
                  }}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: colors.secondary,
                  }}
                >
                  Covered parking
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: colors.secondary,
                }}
              >
                Vehicle types
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {VEHICLE_OPTIONS.map((opt) => (
                  <Chip
                    key={opt.value}
                    label={opt.label}
                    active={form.vehicleTypes.includes(opt.value)}
                    disabled={busy}
                    onPress={() => toggleVehicle(opt.value)}
                  />
                ))}
              </View>
              <StepNav
                busy={busy}
                onBack={() => setStep(2)}
                onNext={() => saveAndGo(4)}
              />
            </View>
          ) : null}

          {step === 4 ? (
            <View style={{ gap: 16 }}>
              <StepTitle
                title="Pricing & hours"
                body="Set simple rates and daily open hours."
              />
              <Field
                label="Hourly (₹)"
                value={form.priceHourly}
                onChangeText={(v) => updateField('priceHourly', v)}
                keyboardType="decimal-pad"
                editable={!busy}
              />
              <Field
                label="Daily (₹)"
                value={form.priceDaily}
                onChangeText={(v) => updateField('priceDaily', v)}
                keyboardType="decimal-pad"
                editable={!busy}
              />
              <Field
                label="Opens (HH:MM)"
                value={form.openTime}
                onChangeText={(v) => updateField('openTime', v)}
                placeholder="08:00"
                editable={!busy}
              />
              <Field
                label="Closes (HH:MM)"
                value={form.closeTime}
                onChangeText={(v) => updateField('closeTime', v)}
                placeholder="22:00"
                editable={!busy}
              />
              <StepNav
                busy={busy}
                onBack={() => setStep(3)}
                onNext={() => saveAndGo(5)}
              />
            </View>
          ) : null}

          {step === 5 ? (
            <View style={{ gap: 16 }}>
              <StepTitle
                title="Review & submit"
                body="Confirm details. Submitting sends this listing for review."
              />
              <View
                style={{
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(135,141,149,0.25)',
                  backgroundColor: colors.surfaceMuted,
                  padding: 16,
                  gap: 10,
                }}
              >
                <Row label="Name" value={form.name || '—'} />
                <Row label="Type" value={form.locationType || '—'} />
                <Row label="Address" value={form.addressLine1 || '—'} />
                <Row label="Landmark" value={form.landmark || '—'} />
                <Row
                  label="Coords"
                  value={
                    form.latitude || form.longitude
                      ? `${form.latitude || '—'}, ${form.longitude || '—'}`
                      : '—'
                  }
                />
                <Row label="Capacity" value={form.capacity || '—'} />
                <Row label="Covered" value={form.covered ? 'Yes' : 'No'} />
                <Row
                  label="Vehicles"
                  value={
                    form.vehicleTypes.length
                      ? form.vehicleTypes.join(', ')
                      : '—'
                  }
                />
                <Row
                  label="Hourly"
                  value={form.priceHourly ? `₹${form.priceHourly}` : '—'}
                />
                <Row
                  label="Daily"
                  value={form.priceDaily ? `₹${form.priceDaily}` : '—'}
                />
                <Row
                  label="Hours"
                  value={`${form.openTime || '—'} – ${form.closeTime || '—'}`}
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                <OutlineCta
                  label="Back"
                  disabled={busy}
                  onPress={() => setStep(4)}
                />
                <View style={{ flex: 1 }}>
                  <Cta
                    label={busy ? 'Submitting…' : 'Submit for review'}
                    busy={busy}
                    onPress={handleSubmit}
                  />
                </View>
              </View>
            </View>
          ) : null}

          {error ? (
            <Text
              style={{
                marginTop: 16,
                backgroundColor: colors.errorSoft,
                color: colors.secondaryDeep,
                padding: 12,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {error}
            </Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

function StepTitle({ title, body }) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: '700',
          color: colors.secondaryDeep,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 15,
          lineHeight: 22,
          color: colors.textMuted,
        }}
      >
        {body}
      </Text>
    </View>
  );
}

function Chip({ label, active, onPress, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={{
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: active ? colors.primary : colors.surfaceMuted,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: active ? colors.white : colors.secondary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Cta({ label, onPress, busy }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={busy}
      onPress={onPress}
      style={{
        backgroundColor: '#34B17F',
        borderRadius: 14,
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: busy ? 0.75 : 1,
      }}
    >
      {busy ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function OutlineCta({ label, onPress, disabled }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={{
        borderRadius: 14,
        minHeight: 52,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.secondary,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={{ color: colors.secondary, fontSize: 15, fontWeight: '600' }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function StepNav({ busy, onBack, onNext }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
      <OutlineCta label="Back" disabled={busy} onPress={onBack} />
      <View style={{ flex: 1 }}>
        <Cta
          label={busy ? 'Saving…' : 'Continue'}
          busy={busy}
          onPress={onNext}
        />
      </View>
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Text style={{ width: 88, fontSize: 13, color: colors.textMuted }}>
        {label}
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: 13,
          fontWeight: '600',
          color: colors.secondary,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
