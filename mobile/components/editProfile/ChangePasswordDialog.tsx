import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ChangePasswordDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const overlayOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);
  const modalTranslateY = useSharedValue(50);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isDialogOpen) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowPasswords({ current: false, new: false, confirm: false });
      // Animate in
      overlayOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      modalTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    } else {
      // Animate out
      overlayOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.8, { duration: 200 });
      modalTranslateY.value = withTiming(50, { duration: 200 });
    }
  }, [isDialogOpen]);

  // Animated styles
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: modalScale.value },
      { translateY: modalTranslateY.value },
    ],
  }));

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Add your password change API call here
      // await changePassword(formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Password changed successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      Alert.alert("Error", "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close modal
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Modal
      visible={isDialogOpen}
      transparent={true}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[overlayAnimatedStyle]}
        className="flex-1 bg-black/50"
      >
        <BlurView intensity={20} tint="dark" className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="justify-center flex-1 px-5"
          >
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              style={modalAnimatedStyle}
              className="overflow-hidden bg-white shadow-2xl rounded-3xl"
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                  colors={["#14b8a6", "#0d9488"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="px-6 py-8"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="items-center justify-center w-12 h-12 mr-3 bg-white/20 rounded-2xl">
                        <MaterialCommunityIcons
                          name="shield-lock"
                          size={24}
                          color="white"
                        />
                      </View>
                      <View>
                        <Text className="text-2xl text-white font-outfit-bold">
                          Change Password
                        </Text>
                        <Text className="text-sm font-outfit text-white/80">
                          Update your security credentials
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={handleClose}
                      className="items-center justify-center w-10 h-10 bg-white/20 rounded-xl"
                    >
                      <Feather name="x" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>

                {/* Form Content */}
                <View className="p-6">
                  {/* Current Password Input */}
                  <Animated.View
                    entering={SlideInDown.delay(100)}
                    className="mb-6"
                  >
                    <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                      Current Password
                    </Text>
                    <View className="relative">
                      <View className="absolute z-10 left-4 top-4">
                        <Feather name="lock" size={20} color="#14b8a6" />
                      </View>
                      <TextInput
                        value={formData.currentPassword}
                        onChangeText={(text) => {
                          setFormData({ ...formData, currentPassword: text });
                          if (errors.currentPassword)
                            setErrors({ ...errors, currentPassword: "" });
                        }}
                        placeholder="Enter current password"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showPasswords.current}
                        className={`pl-12 pr-14 py-4 border-2 rounded-2xl font-outfit text-gray-800 ${
                          errors.currentPassword
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        } focus:border-teal-400 focus:bg-white`}
                      />
                      <TouchableOpacity
                        onPress={() => togglePasswordVisibility("current")}
                        className="absolute z-10 right-4 top-4"
                      >
                        <Feather
                          name={showPasswords.current ? "eye" : "eye-off"}
                          size={20}
                          color="#6b7280"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.currentPassword && (
                      <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                        {errors.currentPassword}
                      </Text>
                    )}
                  </Animated.View>

                  {/* New Password Input */}
                  <Animated.View
                    entering={SlideInDown.delay(200)}
                    className="mb-6"
                  >
                    <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                      New Password
                    </Text>
                    <View className="relative">
                      <View className="absolute z-10 left-4 top-4">
                        <Feather name="key" size={20} color="#14b8a6" />
                      </View>
                      <TextInput
                        value={formData.newPassword}
                        onChangeText={(text) => {
                          setFormData({ ...formData, newPassword: text });
                          if (errors.newPassword)
                            setErrors({ ...errors, newPassword: "" });
                        }}
                        placeholder="Enter new password"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showPasswords.new}
                        className={`pl-12 pr-14 py-4 border-2 rounded-2xl font-outfit text-gray-800 ${
                          errors.newPassword
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        } focus:border-teal-400 focus:bg-white`}
                      />
                      <TouchableOpacity
                        onPress={() => togglePasswordVisibility("new")}
                        className="absolute z-10 right-4 top-4"
                      >
                        <Feather
                          name={showPasswords.new ? "eye" : "eye-off"}
                          size={20}
                          color="#6b7280"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.newPassword && (
                      <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                        {errors.newPassword}
                      </Text>
                    )}
                    {formData.newPassword.length > 0 && (
                      <View className="flex-row items-center mt-2 ml-1">
                        <View
                          className={`w-2 h-2 rounded-full mr-2 ${
                            formData.newPassword.length >= 6
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <Text className="text-xs text-gray-600 font-outfit">
                          At least 6 characters
                        </Text>
                      </View>
                    )}
                  </Animated.View>

                  {/* Confirm Password Input */}
                  <Animated.View
                    entering={SlideInDown.delay(300)}
                    className="mb-8"
                  >
                    <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                      Confirm New Password
                    </Text>
                    <View className="relative">
                      <View className="absolute z-10 left-4 top-4">
                        <Feather
                          name="check-circle"
                          size={20}
                          color="#14b8a6"
                        />
                      </View>
                      <TextInput
                        value={formData.confirmPassword}
                        onChangeText={(text) => {
                          setFormData({ ...formData, confirmPassword: text });
                          if (errors.confirmPassword)
                            setErrors({ ...errors, confirmPassword: "" });
                        }}
                        placeholder="Confirm new password"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showPasswords.confirm}
                        className={`pl-12 pr-14 py-4 border-2 rounded-2xl font-outfit text-gray-800 ${
                          errors.confirmPassword
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        } focus:border-teal-400 focus:bg-white`}
                      />
                      <TouchableOpacity
                        onPress={() => togglePasswordVisibility("confirm")}
                        className="absolute z-10 right-4 top-4"
                      >
                        <Feather
                          name={showPasswords.confirm ? "eye" : "eye-off"}
                          size={20}
                          color="#6b7280"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && (
                      <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                        {errors.confirmPassword}
                      </Text>
                    )}
                    {formData.confirmPassword.length > 0 &&
                      formData.newPassword === formData.confirmPassword && (
                        <View className="flex-row items-center mt-2 ml-1">
                          <Feather name="check" size={14} color="#10b981" />
                          <Text className="ml-1 text-xs text-green-600 font-outfit">
                            Passwords match
                          </Text>
                        </View>
                      )}
                  </Animated.View>

                  {/* Action Buttons */}
                  <Animated.View
                    entering={SlideInDown.delay(400)}
                    className="flex-row gap-3"
                  >
                    <TouchableOpacity
                      onPress={handleClose}
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-2xl"
                      activeOpacity={0.8}
                    >
                      <Text className="text-center text-gray-700 font-outfit-semibold">
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 overflow-hidden rounded-2xl"
                      activeOpacity={0.8}
                    >
                      {isLoading ? (
                        <View className="px-6 py-3 bg-gray-300">
                          <View className="flex-row items-center justify-center">
                            <Feather name="loader" size={16} color="white" />
                            <Text className="ml-2 text-white font-outfit-semibold">
                              Updating...
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <LinearGradient
                          colors={["#14b8a6", "#0d9488"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="px-6 py-4"
                        >
                          <View className="flex-row items-center justify-center">
                            <Feather name="shield" size={16} color="white" />
                            <Text className="ml-2 text-white font-outfit-semibold">
                              Update Password
                            </Text>
                          </View>
                        </LinearGradient>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </BlurView>
      </Animated.View>
    </Modal>
  );
};

export default ChangePasswordDialog;
