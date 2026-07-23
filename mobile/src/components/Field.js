import { Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  editable = true,
  maxLength,
  autoComplete,
  autoCapitalize = 'sentences',
  secureTextEntry,
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: colors.secondary,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        editable={editable}
        maxLength={maxLength}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 1,
          borderColor: 'rgba(135,141,149,0.45)',
          backgroundColor: colors.white,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 16,
          color: colors.secondaryDeep,
        }}
      />
    </View>
  );
}
