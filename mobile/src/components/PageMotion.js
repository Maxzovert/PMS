import { View } from 'react-native';

/**
 * Lightweight layout wrapper for staggered sections.
 * No opacity-zero entrance (that hid buttons when Reanimated failed to run).
 */
export function PageMotion({ brand, title, body, form, decor, style, children }) {
  return (
    <View style={style}>
      {decor}
      {brand}
      {title}
      {body}
      {form}
      {children}
    </View>
  );
}
