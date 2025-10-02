import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { ImageBackground, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Circle, Path, Svg } from "react-native-svg";

// School Logo Icon Component
const SchoolLogo = ({ size = 80 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    {/* Mountain peaks representing Himalaya */}
    <Path
      fill="#4F46E5"
      d="M10 70 L25 45 L40 55 L55 35 L70 45 L85 25 L90 70 Z"
    />
    <Path fill="#6366F1" d="M10 70 L30 50 L50 60 L70 40 L90 70 Z" />
    {/* Sun/Knowledge symbol */}
    <Circle cx="50" cy="30" r="12" fill="#FCD34D" />
    <Path
      fill="#FCD34D"
      d="M50 15 L52 20 L50 25 L48 20 Z M65 30 L60 32 L55 30 L60 28 Z M50 45 L48 40 L50 35 L52 40 Z M35 30 L40 28 L45 30 L40 32 Z"
    />
    {/* Book/Education symbol */}
    <Path
      fill="#FFFFFF"
      d="M35 65 L65 65 L65 75 L35 75 Z M40 67 L60 67 L60 69 L40 69 Z M40 71 L55 71 L55 73 L40 73 Z"
    />
  </Svg>
);

// Animated Loading Dots
const LoadingDots = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const animateDots = () => {
      dot1.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        false
      );
      dot2.value = withDelay(
        100,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0, { duration: 400 })
          ),
          -1,
          false
        )
      );
      dot3.value = withDelay(
        200,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0, { duration: 400 })
          ),
          -1,
          false
        )
      );
    };

    animateDots();
  }, []);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot1.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(dot1.value, [0, 1], [0.8, 1.2]) }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot2.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(dot2.value, [0, 1], [0.8, 1.2]) }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot3.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(dot3.value, [0, 1], [0.8, 1.2]) }],
  }));

  return (
    <View className="flex-row items-center justify-center gap-1 mt-8 space-x-2">
      <Animated.View
        style={dot1Style}
        className="w-3 h-3 bg-white rounded-full"
      />
      <Animated.View
        style={dot2Style}
        className="w-3 h-3 bg-white rounded-full"
      />
      <Animated.View
        style={dot3Style}
        className="w-3 h-3 bg-white rounded-full"
      />
    </View>
  );
};

const LoadingScreen = ({ onFinish }: { onFinish?: () => void }) => {
  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const progressWidth = useSharedValue(0);
  const containerOpacity = useSharedValue(0);

  const animConfig = {
    duration: 800,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  };

  useEffect(() => {
    // Start animation sequence
    containerOpacity.value = withTiming(1, { duration: 500 });

    // Logo animation
    logoScale.value = withDelay(300, withTiming(1, animConfig));
    logoRotate.value = withDelay(300, withTiming(360, { duration: 1000 }));

    // Title animation
    titleOpacity.value = withDelay(800, withTiming(1, animConfig));
    titleTranslateY.value = withDelay(800, withTiming(0, animConfig));

    // Subtitle animation
    subtitleOpacity.value = withDelay(1200, withTiming(1, animConfig));
    subtitleTranslateY.value = withDelay(1200, withTiming(0, animConfig));

    // Progress bar animation
    progressWidth.value = withDelay(1600, withTiming(100, { duration: 2000 }));

    // Auto finish after 4 seconds
    if (onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      }}
      className="flex-1"
    >
      <Animated.View style={containerStyle} className="flex-1">
        <BlurView
          intensity={90}
          tint="dark"
          className="items-center justify-center flex-1 px-8"
        >
          {/* Logo Section */}
          <Animated.View style={logoStyle} className="mb-8">
            <View className="items-center justify-center w-32 h-32 rounded-full shadow-2xl bg-white/20">
              <SchoolLogo size={80} />
            </View>
          </Animated.View>

          {/* Title Section */}
          <Animated.View style={titleStyle} className="items-center mb-4">
            <Text className="text-5xl tracking-wide text-center text-white font-outfit-bold">
              Himalaya
            </Text>
            <Text className="text-4xl tracking-wide text-center text-blue-300 font-outfit-bold">
              Public School
            </Text>
          </Animated.View>

          {/* Subtitle Section */}
          <Animated.View style={subtitleStyle} className="items-center mb-12">
            <Text className="text-lg text-center text-gray-300 font-outfit-medium">
              Excellence in Education
            </Text>
            <Text className="mt-1 text-base text-center text-gray-400 font-outfit">
              Nurturing Future Leaders
            </Text>
          </Animated.View>

          {/* Loading Animation */}
          <View className="items-center w-full">
            <LoadingDots />

            {/* Progress Bar */}
            <View className="w-64 h-1 mt-8 rounded-full bg-white/20">
              <Animated.View
                style={progressStyle}
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
              />
            </View>

            <Text className="mt-4 text-sm text-gray-400 font-outfit">
              Loading your portal...
            </Text>
          </View>

          {/* Footer */}
          <View className="absolute items-center bottom-10">
            <Text className="text-xs tracking-wider text-gray-500 font-outfit">
              STUDENT & STAFF PORTAL
            </Text>
            <Text className="mt-1 text-xs text-gray-600">Version 1.0.0</Text>
          </View>
        </BlurView>
      </Animated.View>
    </ImageBackground>
  );
};

export default LoadingScreen;
