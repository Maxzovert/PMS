import { useEffect } from 'react';
import { AccessibilityInfo, Image, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenNative from 'expo-splash-screen';
import logo from '../assets/logo/Pms_Icon.png';
import { colors } from '../theme/colors';

const easeOut = Easing.out(Easing.cubic);

/** Hold long enough for the staggered entrance to finish. */
export const SPLASH_ANIMATION_MS = 2200;

/**
 * Clean splash — logo, wordmark, accent bar, tagline.
 * No circle glow / floating stars.
 */
export function SplashScreen({ onFinished }) {
  const logoProgress = useSharedValue(0);
  const titleProgress = useSharedValue(0);
  const barProgress = useSharedValue(0);
  const taglineProgress = useSharedValue(0);

  useEffect(() => {
    SplashScreenNative.hideAsync().catch(() => {});

    let finishedTimer;
    let cancelled = false;

    function finish() {
      if (!cancelled && onFinished) {
        onFinished();
      }
    }

    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) {
        return;
      }

      if (reduce) {
        logoProgress.value = 1;
        titleProgress.value = 1;
        barProgress.value = 1;
        taglineProgress.value = 1;
        finishedTimer = setTimeout(finish, 350);
        return;
      }

      logoProgress.value = withTiming(1, { duration: 520, easing: easeOut });
      titleProgress.value = withDelay(
        280,
        withTiming(1, { duration: 480, easing: easeOut }),
      );
      barProgress.value = withDelay(
        520,
        withTiming(1, { duration: 520, easing: easeOut }),
      );
      taglineProgress.value = withDelay(
        780,
        withTiming(1, { duration: 480, easing: easeOut }),
      );

      finishedTimer = setTimeout(finish, SPLASH_ANIMATION_MS);
    });

    return () => {
      cancelled = true;
      if (finishedTimer) {
        clearTimeout(finishedTimer);
      }
    };
  }, [logoProgress, titleProgress, barProgress, taglineProgress, onFinished]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoProgress.value,
    transform: [
      { translateY: interpolate(logoProgress.value, [0, 1], [16, 0]) },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleProgress.value,
    transform: [
      { translateY: interpolate(titleProgress.value, [0, 1], [14, 0]) },
    ],
  }));

  const barStyle = useAnimatedStyle(() => ({
    opacity: barProgress.value,
    transform: [{ scaleX: interpolate(barProgress.value, [0, 1], [0.15, 1]) }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineProgress.value,
    transform: [
      { translateY: interpolate(taglineProgress.value, [0, 1], [12, 0]) },
    ],
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.secondaryDeep,
      }}
    >
      <StatusBar style="light" />

      {/* Quiet top mint band — static, not animated circle */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: colors.primary,
        }}
      />

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 40,
        }}
      >
        <Animated.View style={[{ alignItems: 'center' }, logoStyle]}>
          <Image
            source={logo}
            style={{ width: 84, height: 84 }}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[{ marginTop: 28, alignItems: 'center' }, titleStyle]}>
          <Text
            style={{
              color: colors.surface,
              fontSize: 34,
              fontWeight: '700',
              letterSpacing: 2,
            }}
          >
            PARKAR
          </Text>
          <Text
            style={{
              marginTop: 10,
              color: 'rgba(246,246,245,0.55)',
              fontSize: 12,
              fontWeight: '600',
              letterSpacing: 2.4,
              textTransform: 'uppercase',
            }}
          >
            Owner portal
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            {
              marginTop: 28,
              height: 3,
              width: 56,
              borderRadius: 2,
              backgroundColor: colors.primary,
            },
            barStyle,
          ]}
        />

        <Animated.View style={[{ marginTop: 28 }, taglineStyle]}>
          <Text
            style={{
              color: 'rgba(246,246,245,0.68)',
              fontSize: 15,
              textAlign: 'center',
              lineHeight: 22,
              maxWidth: 240,
            }}
          >
            Never search for parking again.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
