import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getOwnerProfile, updateOwnerProfile, ApiError } from '../api';
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
  { key: 'email', label: 'Email', keyboardType: 'email-address' },
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
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.lead}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Owner profile</Text>
        <Text style={styles.lead}>
          Personal and business details. KYC and bank details come later.
        </Text>
        <Text style={styles.meta}>
          Phone: {phone || '—'} · Status: {status}
        </Text>

        {FIELDS.map((field) => (
          <View key={field.key} style={styles.field}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={form[field.key]}
              onChangeText={(value) => updateField(field.key, value)}
              keyboardType={field.keyboardType || 'default'}
              autoCapitalize={
                field.key === 'email' ? 'none' : 'sentences'
              }
              editable={!saving}
              placeholderTextColor={colors.textMuted}
            />
          </View>
        ))}

        <Pressable
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Save profile</Text>
          )}
        </Pressable>

        {message ? <Text style={styles.note}>{message}</Text> : null}
        {error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.secondaryDeep,
    marginBottom: 8,
  },
  lead: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 20,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.secondaryDeep,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    marginTop: 16,
    fontSize: 14,
    color: colors.primary,
  },
  error: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.errorSoft,
    color: colors.error,
    fontSize: 14,
  },
});
