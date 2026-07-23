import './global.css';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenNative from 'expo-splash-screen';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';

SplashScreenNative.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { bootstrapping, isAuthenticated } = useAuth();
  const [animationDone, setAnimationDone] = useState(false);

  const handleSplashFinished = useCallback(() => {
    setAnimationDone(true);
  }, []);

  // Stay on animated splash until BOTH auth bootstrap and entrance animation finish.
  const showSplash = bootstrapping || !animationDone;

  if (showSplash) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondary },
        headerTintColor: colors.surface,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.surface },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Owner profile' }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: colors.secondaryDeep }}>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </View>
    </AuthProvider>
  );
}
