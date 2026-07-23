import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme/colors';

export function DashboardScreen({ navigation }) {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.root}>
      <Text style={styles.brand}>PARKAR</Text>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.lead}>
        Signed in as {user?.phone || 'owner'}. Parking registration comes next.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>Owner profile</Text>
      </Pressable>

      <Pressable style={styles.ghost} onPress={() => signOut()}>
        <Text style={styles.ghostText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 24,
    paddingTop: 72,
  },
  brand: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 20,
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
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  ghost: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostText: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: '500',
  },
});
