import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  listParkingLocations,
  createParkingLocation,
  ApiError,
} from '../api';
import findParking from '../assets/decor/states/find-parking-anywhere.png';
import logo from '../assets/logo/Pms_Icon.png';
import { colors } from '../theme/colors';

export function ParkingListScreen({ navigation }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const result = await listParkingLocations();
      setLocations(result.data?.locations || []);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load parkings.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      load();
    });
    return unsub;
  }, [navigation, load]);

  async function startOnboarding() {
    setBusy(true);
    setError(null);
    try {
      const result = await createParkingLocation();
      const id = result.data?.location?.id;
      navigation.navigate('ParkingOnboarding', { id });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not start onboarding.',
      );
    } finally {
      setBusy(false);
    }
  }

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={logo}
                style={{ width: 36, height: 36, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text
                style={{ color: colors.surface, fontSize: 17, fontWeight: '700' }}
              >
                Parking
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={{ color: colors.surface, fontSize: 14 }}>Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={colors.primary}
            />
          }
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: '700',
              color: colors.secondaryDeep,
            }}
          >
            Your parkings
          </Text>
          <Text
            style={{
              marginTop: 8,
              marginBottom: 20,
              fontSize: 15,
              lineHeight: 22,
              color: colors.textMuted,
            }}
          >
            Guided onboarding — save drafts and submit when ready.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={busy}
            onPress={startOnboarding}
            style={{
              backgroundColor: '#34B17F',
              borderRadius: 14,
              minHeight: 52,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              opacity: busy ? 0.75 : 1,
            }}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                {locations.length ? 'Add another parking' : 'Start onboarding'}
              </Text>
            )}
          </TouchableOpacity>

          {locations.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 12 }}>
              <Image
                source={findParking}
                style={{ width: 220, height: 160 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.secondary,
                  textAlign: 'center',
                }}
              >
                Add your first parking
              </Text>
            </View>
          ) : (
            locations.map((loc) => (
              <View
                key={loc.id}
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(135,141,149,0.25)',
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '700',
                    color: colors.secondary,
                  }}
                >
                  {loc.name || 'Untitled draft'}
                </Text>
                <Text
                  style={{ marginTop: 6, fontSize: 13, color: colors.textMuted }}
                >
                  {loc.status.replace('_', ' ')}
                  {loc.status === 'draft' ? ` · step ${loc.onboardingStep}/5` : ''}
                </Text>
                {loc.status === 'draft' ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate('ParkingOnboarding', { id: loc.id })
                    }
                    style={{
                      marginTop: 12,
                      alignSelf: 'flex-start',
                      backgroundColor: colors.secondary,
                      borderRadius: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.surface,
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      Continue
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))
          )}

          {error ? (
            <Text
              style={{
                marginTop: 12,
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
