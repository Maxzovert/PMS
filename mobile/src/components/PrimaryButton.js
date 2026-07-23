import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export function PrimaryButton({
  label,
  onPress,
  busy = false,
  disabled = false,
}) {
  const isDisabled = busy || disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      style={{
        minHeight: 54,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#34B17F',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        opacity: isDisabled ? 0.75 : 1,
      }}
    >
      {busy ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function GhostButton({ label, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={{
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          color: colors.secondary,
          fontSize: 15,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function OutlineButton({ label, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={{
        minHeight: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: colors.secondary,
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 16,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          color: colors.secondary,
          fontSize: 16,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
