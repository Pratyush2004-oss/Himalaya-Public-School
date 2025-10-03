import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeInDown,
  Layout,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";

interface SearchBoxProps {
  placeholder?: string;
  title?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Enter student UID number",
  title = "Search Student",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { getStudentInfoByUID, isLoading } = useAdminStore();
  const { token } = useUserStore();

  // Animation values
  const inputScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const containerScale = useSharedValue(1);
  const searchIconRotation = useSharedValue(0);

  // Animated styles
  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const searchIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${searchIconRotation.value}deg` }],
  }));

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    inputScale.value = withSpring(1.02, { damping: 15, stiffness: 100 });
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
    inputScale.value = withSpring(1, { damping: 15, stiffness: 100 });
  };

  // Handle search button press
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      // Shake animation for empty input
      containerScale.value = withSequence(
        withTiming(1.02, { duration: 100 }),
        withTiming(0.98, { duration: 100 }),
        withTiming(1.02, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );

      Alert.alert(
        "Invalid Input",
        "Please enter a valid UID number to search.",
        [{ text: "OK" }]
      );
      return;
    }

    // Validate if input is numeric
    if (!/^\d+$/.test(searchValue.trim())) {
      Alert.alert("Invalid Format", "UID should contain only numbers.", [
        { text: "OK" },
      ]);
      return;
    }

    // Search button animation
    buttonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    // Search icon rotation
    searchIconRotation.value = withTiming(360, { duration: 500 }, () => {
      searchIconRotation.value = 0;
    });

    // Dismiss keyboard
    Keyboard.dismiss();

    // Call search function
    await getStudentInfoByUID(searchValue, token as string);
  };

  // Handle clear input
  const handleClear = () => {
    setSearchValue("");
    inputScale.value = withSpring(1.02, { damping: 15, stiffness: 100 }, () => {
      inputScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    });
  };

  // Handle input change
  const handleInputChange = (text: string) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, "");
    setSearchValue(numericText);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      layout={Layout.springify()}
      style={containerAnimatedStyle}
      className="mx-5 mb-6"
    >
      {/* Title */}
      <Text className="mb-3 text-lg text-gray-800 font-outfit-bold">
        {title}
      </Text>

      {/* Search Container */}
      <View className="relative">
        <Animated.View
          style={inputAnimatedStyle}
          className={`flex-row items-center bg-white rounded-2xl shadow-sm shadow-gray-300 ${
            isFocused ? "border-2 border-teal-400" : "border-2 border-gray-200"
          }`}
        >
          {/* Search Icon */}
          <View className="pl-4">
            <Animated.View style={searchIconAnimatedStyle}>
              <Ionicons
                name="search-outline"
                size={20}
                color={isFocused ? "#14b8a6" : "#9ca3af"}
              />
            </Animated.View>
          </View>

          {/* Input Field */}
          <TextInput
            value={searchValue}
            onChangeText={handleInputChange}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={10}
            className="flex-1 px-4 py-4 text-base text-gray-800 font-outfit"
          />

          {/* Clear Button */}
          {searchValue.length > 0 && (
            <TouchableOpacity onPress={handleClear} className="pr-2">
              <View className="items-center justify-center w-6 h-6 bg-gray-200 rounded-full">
                <Feather name="x" size={12} color="#6b7280" />
              </View>
            </TouchableOpacity>
          )}

          {/* Search Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              onPress={handleSearch}
              disabled={isLoading}
              className="mr-2 overflow-hidden rounded-xl"
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View className="px-4 py-2 bg-gray-300">
                  <Feather name="loader" size={16} color="white" />
                </View>
              ) : (
                <LinearGradient
                  colors={["#14b8a6", "#0d9488"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="px-4 py-2"
                >
                  <Feather name="search" size={16} color="white" />
                </LinearGradient>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Helper Text */}
        <View className="flex-row items-center px-2 mt-2">
          <Feather name="info" size={12} color="#6b7280" />
          <Text className="ml-2 text-xs text-gray-600 font-outfit">
            Enter the student's unique identification number
          </Text>
        </View>

        {/* Character Counter */}
        {searchValue.length > 0 && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            className="absolute right-2 -bottom-6"
          >
            <Text className="text-xs text-gray-500 font-outfit">
              {searchValue.length}/10
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Quick Actions (Optional) */}
      <View className="flex-row items-center mt-4 space-x-2">
        <TouchableOpacity
          onPress={() => setSearchValue("12345")}
          className="px-3 py-1 rounded-lg bg-teal-50"
        >
          <Text className="text-xs text-teal-600 font-outfit-medium">
            Demo: 12345
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSearchValue("67890")}
          className="px-3 py-1 rounded-lg bg-indigo-50"
        >
          <Text className="text-xs text-indigo-600 font-outfit-medium">
            Demo: 67890
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default SearchBox;
