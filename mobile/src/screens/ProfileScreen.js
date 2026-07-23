import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { getOwnerProfile, updateOwnerProfile, ApiError } from '../api';
import { Field } from '../components/Field';
import { PrimaryButton } from '../components/PrimaryButton';
import { PageMotion } from '../components/PageMotion';
import { colors } from '../theme/colors';

const EMPTY = {
  fullName: '',
  email: '',
  businessName: '',
  businessType: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
};

function profileToForm(profile) {
  return {
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    businessName: profile?.businessName || '',
    businessType: profile?.businessType || '',
    addressLine1: profile?.addressLine1 || '',
    addressLine2: profile?.addressLine2 || '',
    city: profile?.city || '',
    state: profile?.state || '',
    pincode: profile?.pincode || '',
  };
}

const FIELDS = [
  { key: 'fullName', label: 'Full name' },
  { key: 'email', label: 'Email', keyboardType: 'email-address', autoCapitalize: 'none' },
  { key: 'businessName', label: 'Business name' },
  { key: 'businessType', label: 'Business type' },
  { key: 'addressLine1', label: 'Address line 1' },
  { key: 'addressLine2', label: 'Address line 2' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'pincode', label: 'Pincode', keyboardType: 'number-pad' },
];

export function ProfileScreen() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('draft');
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getOwnerProfile({ signal: controller.signal })
      .then((result) => {
        const profile = result.data?.profile;
        setPhone(profile?.phone || '');
        setStatus(profile?.profileStatus || 'draft');
        setForm(profileToForm(profile));
      })
      .catch((err) => {
        if (err?.name === 'AbortError') {
          return;
        }
        setError(
          err instanceof ApiError ? err.message : 'Could not load profile.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const result = await updateOwnerProfile(form);
      const profile = result.data?.profile;
      setPhone(profile?.phone || phone);
      setStatus(profile?.profileStatus || status);
      setForm(profileToForm(profile));
      setMessage(result.message || 'Profile saved');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not save profile.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface,
          gap: 12,
        }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={{ color: colors.textMuted }}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PageMotion
          title={
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: colors.secondaryDeep,
              }}
            >
              Owner profile
            </Text>
          }
          body={
            <View>
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 15,
                  lineHeight: 22,
                  color: colors.textMuted,
                }}
              >
                Personal and business details.
              </Text>
              <View
                style={{
                  marginTop: 16,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.surfaceMuted,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ fontSize: 13, color: colors.secondary }}>
                    {phone || 'No phone'}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.surfaceMuted,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: colors.secondary,
                      textTransform: 'capitalize',
                    }}
                  >
                    {status}
                  </Text>
                </View>
              </View>
            </View>
          }
          form={
            <View style={{ marginTop: 28, gap: 16 }}>
              {FIELDS.map((field) => (
                <Field
                  key={field.key}
                  label={field.label}
                  value={form[field.key]}
                  onChangeText={(value) => updateField(field.key, value)}
                  keyboardType={field.keyboardType || 'default'}
                  autoCapitalize={field.autoCapitalize || 'sentences'}
                  editable={!saving}
                />
              ))}

              <View style={{ marginTop: 8 }}>
                <PrimaryButton
                  label={saving ? 'Saving…' : 'Save profile'}
                  onPress={handleSave}
                  busy={saving}
                />
              </View>

              {message ? (
                <Text style={{ fontSize: 14, color: colors.primary }}>
                  {message}
                </Text>
              ) : null}
              {error ? (
                <Text
                  accessibilityRole="alert"
                  style={{
                    fontSize: 13,
                    lineHeight: 19,
                    color: colors.secondaryDeep,
                    backgroundColor: colors.errorSoft,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderRadius: 12,
                  }}
                >
                  {error}
                </Text>
              ) : null}
            </View>
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
