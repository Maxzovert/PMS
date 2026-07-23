import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../auth/AuthContext';
import { DecorWave } from '../components/DecorWave';
import { PrimaryButton } from '../components/PrimaryButton';
import { PageMotion } from '../components/PageMotion';
import logo from '../assets/logo/Pms_Icon.png';
import NoResult from '../assets/decor/states/no-result-found.svg';
import { colors } from '../theme/colors';

export function DashboardScreen({ navigation }) {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: colors.secondary, paddingBottom: 16 }}>
        <SafeAreaView edges={['top']}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Image
                source={logo}
                style={{ width: 36, height: 36 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: colors.surface,
                  fontSize: 17,
                  fontWeight: '700',
                }}
              >
                PARKAR
              </Text>
            </View>
            <Pressable
              onPress={() => signOut()}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'rgba(246,246,245,0.28)',
              }}
            >
              <Text
                style={{ color: colors.surface, fontSize: 13, fontWeight: '500' }}
              >
                Sign out
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <PageMotion
          style={{ flex: 1 }}
          title={
            <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  color: colors.secondaryDeep,
                }}
              >
                Dashboard
              </Text>
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 15,
                  lineHeight: 22,
                  color: colors.textMuted,
                }}
              >
                Signed in as {user?.phone || 'owner'}
              </Text>
            </View>
          }
          form={
            <View style={{ paddingHorizontal: 24, paddingTop: 28, gap: 28 }}>
              <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                <NoResult width={160} height={140} />
                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.secondary,
                    textAlign: 'center',
                  }}
                >
                  Ready to list parking
                </Text>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    lineHeight: 20,
                    color: colors.textMuted,
                    textAlign: 'center',
                    maxWidth: 280,
                  }}
                >
                  Guided onboarding walks you through basics, location, space,
                  and pricing — then submit for review.
                </Text>
                <View style={{ marginTop: 14 }}>
                  <DecorWave
                    kind="light"
                    width={100}
                    height={14}
                    opacity={0.35}
                  />
                </View>
              </View>

              <PrimaryButton
                label="My parkings"
                onPress={() => navigation.navigate('ParkingList')}
              />
              <PrimaryButton
                label="Owner profile"
                onPress={() => navigation.navigate('Profile')}
              />
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
