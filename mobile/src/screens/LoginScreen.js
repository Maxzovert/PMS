import { useState } from 'react';
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
import { requestOtp, verifyOtp, ApiError } from '../api';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme/colors';

export function LoginScreen() {
  const { completeLogin } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  async function handleRequestOtp() {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await requestOtp(phone.trim());
      setStep('otp');
      setInfo(
        `Code sent to ${result.data?.phone || phone}. In local/dev, check the server log for the mock OTP (or use DEV_OTP_FIXED).`,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not request a code.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp() {
    setBusy(true);
    setError(null);
    try {
      const result = await verifyOtp(phone.trim(), code.trim());
      await completeLogin(
        result.data?.user || null,
        result.data?.sessionToken || null,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not verify the code.',
      );
    } finally {
      setBusy(false);
    }
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
        <Text style={styles.brand}>PARKAR</Text>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.lead}>
          Enter your mobile number to receive a one-time code. SMS is mocked in
          development until a provider is configured.
        </Text>

        {step === 'phone' ? (
          <View style={styles.form}>
            <Text style={styles.label}>Mobile number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+9198XXXXXXXX"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              autoComplete="tel"
              editable={!busy}
            />
            <Pressable
              style={[styles.button, busy && styles.buttonDisabled]}
              onPress={handleRequestOtp}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Verification code</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="6-digit code"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              editable={!busy}
            />
            <Pressable
              style={[styles.button, busy && styles.buttonDisabled]}
              onPress={handleVerifyOtp}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Verify & sign in</Text>
              )}
            </Pressable>
            <Pressable
              style={styles.ghost}
              disabled={busy}
              onPress={() => {
                setStep('phone');
                setCode('');
                setError(null);
                setInfo(null);
              }}
            >
              <Text style={styles.ghostText}>Use a different number</Text>
            </Pressable>
          </View>
        )}

        {info ? <Text style={styles.note}>{info}</Text> : null}
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
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 72,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 1,
    marginBottom: 24,
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
    marginBottom: 28,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
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
  ghost: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostText: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: '500',
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondary,
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
