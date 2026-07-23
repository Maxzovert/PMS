import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { requestOtp, verifyOtp, ApiError } from '../api';
import { useAuth } from '../auth/AuthContext';
import logo from '../assets/logo/Pms_Icon.png';

const C = {
  primary: '#34B17F',
  secondary: '#0E3B35',
  secondaryDeep: '#042C21',
  surface: '#F6F6F5',
  white: '#FFFFFF',
  muted: '#878D95',
  errorSoft: '#FDDFE0',
  border: 'rgba(135,141,149,0.35)',
};

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
        `Code sent to ${result.data?.phone || phone}. Dev: check server log or use DEV_OTP_FIXED.`,
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
    <View style={{ flex: 1, backgroundColor: C.surface }}>
      <StatusBar style="light" />

      <View style={{ backgroundColor: C.secondary }}>
        <SafeAreaView edges={['top']}>
          <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={logo}
                style={{ width: 44, height: 44, marginRight: 12 }}
                resizeMode="contain"
              />
              <View>
                <Text
                  style={{
                    color: C.white,
                    fontSize: 22,
                    fontWeight: '700',
                    letterSpacing: 1,
                  }}
                >
                  PARKAR
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    color: 'rgba(246,246,245,0.65)',
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                  }}
                >
                  Owner portal
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 18,
                height: 3,
                width: 40,
                borderRadius: 2,
                backgroundColor: C.primary,
              }}
            />
          </View>
        </SafeAreaView>
      </View>

      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 28,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: '700',
                color: C.secondaryDeep,
              }}
            >
              {step === 'phone' ? 'Sign in' : 'Verify code'}
            </Text>
            <Text
              style={{
                marginTop: 8,
                marginBottom: 24,
                fontSize: 15,
                lineHeight: 22,
                color: C.muted,
              }}
            >
              {step === 'phone'
                ? 'Enter your mobile number to receive a one-time password.'
                : `Enter the 6-digit code sent to ${phone.trim() || 'your number'}.`}
            </Text>

            <View
              style={{
                backgroundColor: C.white,
                borderRadius: 18,
                padding: 20,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Text
                style={{
                  marginBottom: 16,
                  fontSize: 12,
                  fontWeight: '600',
                  color: C.muted,
                }}
              >
                Step {step === 'phone' ? '1' : '2'} of 2
              </Text>

              {step === 'phone' ? (
                <View>
                  <Text
                    style={{
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: '600',
                      color: C.secondary,
                    }}
                  >
                    Mobile number
                  </Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+9198XXXXXXXX"
                    placeholderTextColor={C.muted}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    editable={!busy}
                    style={{
                      borderWidth: 1,
                      borderColor: C.border,
                      backgroundColor: C.white,
                      borderRadius: 14,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: C.secondaryDeep,
                      marginBottom: 16,
                    }}
                  />

                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={busy}
                    onPress={handleRequestOtp}
                    style={{
                      backgroundColor: C.primary,
                      borderRadius: 14,
                      minHeight: 54,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: busy ? 0.75 : 1,
                    }}
                  >
                    {busy ? (
                      <ActivityIndicator color={C.white} />
                    ) : (
                      <Text
                        style={{
                          color: C.white,
                          fontSize: 16,
                          fontWeight: '700',
                        }}
                      >
                        Continue
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: '600',
                      color: C.secondary,
                    }}
                  >
                    OTP code
                  </Text>
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="6-digit code"
                    placeholderTextColor={C.muted}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoComplete="one-time-code"
                    editable={!busy}
                    style={{
                      borderWidth: 1,
                      borderColor: C.border,
                      backgroundColor: C.white,
                      borderRadius: 14,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      letterSpacing: 4,
                      color: C.secondaryDeep,
                      marginBottom: 16,
                    }}
                  />

                  <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={busy}
                    onPress={handleVerifyOtp}
                    style={{
                      backgroundColor: C.primary,
                      borderRadius: 14,
                      minHeight: 54,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                      opacity: busy ? 0.75 : 1,
                    }}
                  >
                    {busy ? (
                      <ActivityIndicator color={C.white} />
                    ) : (
                      <Text
                        style={{
                          color: C.white,
                          fontSize: 16,
                          fontWeight: '700',
                        }}
                      >
                        Sign in
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={busy}
                    onPress={() => {
                      setStep('phone');
                      setCode('');
                      setError(null);
                      setInfo(null);
                    }}
                    style={{
                      minHeight: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: C.secondary,
                        fontSize: 15,
                        fontWeight: '600',
                      }}
                    >
                      Change number
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {info ? (
                <Text
                  style={{
                    marginTop: 14,
                    fontSize: 13,
                    lineHeight: 18,
                    color: C.muted,
                  }}
                >
                  {info}
                </Text>
              ) : null}
              {error ? (
                <Text
                  accessibilityRole="alert"
                  style={{
                    marginTop: 14,
                    fontSize: 13,
                    lineHeight: 18,
                    color: C.secondaryDeep,
                    backgroundColor: C.errorSoft,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                >
                  {error}
                </Text>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
