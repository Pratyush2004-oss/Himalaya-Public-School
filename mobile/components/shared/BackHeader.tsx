import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from "react-native-reanimated";

interface BackHeaderProps {
  title: string;
  subtitle?: string;
  showRightAction?: boolean;
  onRightAction?: () => void;
  rightIcon?: string;
  backgroundColor?: "default" | "teal" | "gradient";
}

const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  subtitle,
  showRightAction = false,
  onRightAction,
  rightIcon = "more-vertical",
  backgroundColor = "default",
}) => {
  const router = useRouter();

  // Animation values
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);
  const iconRotation = useSharedValue(0);
  const titleScale = useSharedValue(0.95);
  const rightButtonScale = useSharedValue(1);

  // Initialize animations
  useEffect(() => {
    titleScale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const rightButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rightButtonScale.value }],
  }));

  // Handle back button press with animation
  const handleBackPress = () => {
    buttonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    iconRotation.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    // Navigate back after animation
    setTimeout(() => {
      router.back();
    }, 150);
  };

  // Handle right action press
  const handleRightAction = () => {
    if (!onRightAction) return;

    rightButtonScale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    setTimeout(() => {
      onRightAction();
    }, 100);
  };

  // Get background style based on type
  const getBackgroundComponent = () => {
    switch (backgroundColor) {
      case "teal":
        return <View className="bg-teal-500">{renderContent()}</View>;
      case "gradient":
        return (
          <LinearGradient
            colors={["#14b8a6", "#2dd4bf"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {renderContent()}
          </LinearGradient>
        );
      default:
        return <View className="bg-white shadow-sm">{renderContent()}</View>;
    }
  };

  const getTextColor = () => {
    return backgroundColor === "default" ? "text-gray-800" : "text-white";
  };

  const getIconColor = () => {
    return backgroundColor === "default" ? "#374151" : "white";
  };

  const renderContent = () => (
    <View className="flex-row items-center justify-between px-4 py-2">
      {/* Back Button */}
      <Animated.View entering={SlideInLeft.duration(400).springify()}>
        <Pressable onPress={handleBackPress} className="flex-row items-center">
          <Animated.View
            style={buttonAnimatedStyle}
            className="p-2 mr-3 bg-white/10 rounded-xl"
          >
            <Animated.View style={iconAnimatedStyle}>
              <Ionicons name="arrow-back" size={24} color={getIconColor()} />
            </Animated.View>
          </Animated.View>

          {/* Title Section */}
          <Animated.View style={titleAnimatedStyle}>
            <Text className={`text-xl font-outfit-bold ${getTextColor()}`}>
              {title}
            </Text>
            {subtitle && (
              <Text
                className={`text-sm font-outfit ${backgroundColor === "default" ? "text-gray-600" : "text-white/80"}`}
              >
                {subtitle}
              </Text>
            )}
          </Animated.View>
        </Pressable>
      </Animated.View>

      {/* Right Action Button */}
      {showRightAction && (
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Pressable
            onPress={handleRightAction}
            className="p-2 bg-white/10 rounded-xl"
          >
            <Animated.View style={rightButtonAnimatedStyle}>
              <Feather
                name={rightIcon as any}
                size={20}
                color={getIconColor()}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );

  return (
    <>
      {getBackgroundComponent()}
      {/* Bottom border/shadow */}
      <View className="h-px bg-gray-200" />
    </>
  );
};

export default BackHeader;
