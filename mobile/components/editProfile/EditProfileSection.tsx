import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import Animated, { FadeInDown } from "react-native-reanimated";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useUserStore } from "@/store/auth.store";
import { BusList, StandardsList } from "@/assets/constants";
import { UpdateProfileInputType } from "@/types";

const EditProfileSection = () => {
  const { user } = useUserStore();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for Student
  const [form, setForm] = useState<UpdateProfileInputType>({
    email: user?.email || "",
    standard: user?.standard || "",
    pickUp: user?.bus?.pickUp || "",
    useBus: user?.bus?.useBus || false,
    parentsName: user?.parents?.name || "",
    parentsPhone: user?.parents?.phone || "",
  });

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate student form
  const validateform = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.standard) {
      newErrors.standard = "Please select your class";
    }

    if (!form.parentsName?.trim()) {
      newErrors.parentsName = "Parent's name is required";
    }

    if (!form.parentsPhone) {
      newErrors.parentsPhone = "Parent's phone is required";
    } else if (!/^\d{10}$/.test(form.parentsPhone)) {
      newErrors.parentsPhone = "Phone must be 10 digits";
    }

    if (form.useBus && !form.pickUp?.trim()) {
      newErrors.pickUp = "Pickup point is required when using bus";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate teacher form
  const validateTeacherForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit for student
  const handleStudentSubmit = async () => {
    if (!validateform()) return;

    setIsLoading(true);
    try {
      // TODO: Add your update profile API call here
      // await updateProfile(form);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit for teacher
  const handleTeacherSubmit = async () => {
    if (!validateTeacherForm()) return;

    setIsLoading(true);
    try {
      // TODO: Add your update profile API call here
      // await updateProfile(teacherForm);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
    >
      <View className="p-5">
        {/* Header Card */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          className="mb-6 overflow-hidden bg-white shadow-sm rounded-3xl"
        >
          <LinearGradient
            colors={["#14b8a6", "#0d9488"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-6 py-8"
          >
            <View className="flex-row items-center">
              <View className="items-center justify-center w-16 h-16 mr-4 bg-white/20 rounded-2xl">
                <Feather name="user" size={28} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl text-white font-outfit-bold">
                  {user?.name}
                </Text>
                <Text className="text-sm capitalize font-outfit text-white/90">
                  {user?.role}
                </Text>
                <Text className="text-xs font-outfit text-white/70">
                  UID: {user?.UID}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Change Password Button */}
        <Animated.View entering={FadeInDown.delay(200)} className="mb-6">
          <TouchableOpacity
            onPress={() => setShowPasswordDialog(true)}
            className="flex-row items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-2xl"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 mr-3 bg-teal-50 rounded-xl">
                <MaterialCommunityIcons
                  name="shield-lock"
                  size={20}
                  color="#14b8a6"
                />
              </View>
              <Text className="text-base text-gray-800 font-outfit-semibold">
                Change Password
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </Animated.View>

        {/* Student Form */}
        {user?.role === "student" && (
          <View>
            {/* Email Input */}
            <Animated.View entering={FadeInDown.delay(300)} className="mb-6">
              <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                Email Address
              </Text>
              <View className="relative">
                <View className="absolute z-10 left-4 top-4">
                  <Feather name="mail" size={20} color="#14b8a6" />
                </View>
                <TextInput
                  value={form.email}
                  onChangeText={(text) => {
                    setForm({ ...form, email: text });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`pl-12 pr-4 py-4 border-2 rounded-2xl font-outfit text-gray-800 bg-white ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </View>
              {errors.email && (
                <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                  {errors.email}
                </Text>
              )}
            </Animated.View>

            {/* Standard Picker */}
            <Animated.View entering={FadeInDown.delay(300)} className="mb-6">
              <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                Class/Standard
              </Text>
              <View
                className={`border-2 rounded-2xl bg-white ${
                  errors.standard ? "border-red-300" : "border-gray-200"
                }`}
              >
                <View className="flex-row items-center px-4 py-2">
                  <MaterialCommunityIcons
                    name="school"
                    size={20}
                    color="#14b8a6"
                  />
                  <View className="flex-1 ml-2">
                    <Picker
                      selectedValue={form.standard}
                      onValueChange={(value) => {
                        setForm({ ...form, standard: value });
                        if (errors.standard)
                          setErrors({ ...errors, standard: "" });
                      }}
                      style={{ color: "#374151" }}
                    >
                      <Picker.Item label="Select your class" value="" />
                      {StandardsList.map((standard) => (
                        <Picker.Item
                          key={standard.value}
                          label={`${standard.name} Grade`}
                          value={standard.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
              {errors.standard && (
                <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                  {errors.standard}
                </Text>
              )}
            </Animated.View>

            {/* Parent's Name */}
            <Animated.View entering={FadeInDown.delay(400)} className="mb-6">
              <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                Parent's Name
              </Text>
              <View className="relative">
                <View className="absolute z-10 left-4 top-4">
                  <MaterialCommunityIcons
                    name="account-supervisor"
                    size={20}
                    color="#14b8a6"
                  />
                </View>
                <TextInput
                  value={form.parentsName}
                  onChangeText={(text) => {
                    setForm({ ...form, parentsName: text });
                    if (errors.parentsName)
                      setErrors({ ...errors, parentsName: "" });
                  }}
                  placeholder="Enter parent's name"
                  placeholderTextColor="#9ca3af"
                  className={`pl-12 pr-4 py-4 border-2 rounded-2xl font-outfit text-gray-800 bg-white ${
                    errors.parentsName ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </View>
              {errors.parentsName && (
                <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                  {errors.parentsName}
                </Text>
              )}
            </Animated.View>

            {/* Parent's Phone */}
            <Animated.View entering={FadeInDown.delay(400)} className="mb-6">
              <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                Parent's Phone Number
              </Text>
              <View className="relative">
                <View className="absolute z-10 left-4 top-4">
                  <Feather name="phone" size={20} color="#14b8a6" />
                </View>
                <TextInput
                  value={form.parentsPhone}
                  onChangeText={(text) => {
                    setForm({ ...form, parentsPhone: text });
                    if (errors.parentsPhone)
                      setErrors({ ...errors, parentsPhone: "" });
                  }}
                  placeholder="Enter 10-digit phone number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  maxLength={10}
                  className={`pl-12 pr-4 py-4 border-2 rounded-2xl font-outfit text-gray-800 bg-white ${
                    errors.parentsPhone ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </View>
              {errors.parentsPhone && (
                <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                  {errors.parentsPhone}
                </Text>
              )}
            </Animated.View>

            {/* Bus Toggle */}
            <Animated.View entering={FadeInDown.delay(400)} className="mb-6">
              <View className="flex-row items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-2xl">
                <View className="flex-row items-center flex-1">
                  <MaterialCommunityIcons
                    name="bus-school"
                    size={24}
                    color="#14b8a6"
                  />
                  <Text className="ml-3 text-base text-gray-800 font-outfit-semibold">
                    Use School Bus
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setForm({
                      ...form,
                      useBus: !form.useBus,
                    });
                    if (!form.useBus) {
                      setForm({
                        ...form,
                        useBus: true,
                        pickUp: "",
                      });
                    }
                  }}
                  className={`w-14 h-8 rounded-full p-1 ${
                    form.useBus ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  <View
                    className={`w-6 h-6 bg-white rounded-full ${
                      form.useBus ? "ml-auto" : ""
                    }`}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Pickup Point (Conditional) */}
            {form.useBus && (
              <Animated.View entering={FadeInDown.delay(400)} className="mb-6">
                <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                  Bus Pickup Point
                </Text>
                <View
                  className={`border-2 rounded-2xl bg-white ${
                    errors.standard ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center px-4 py-2">
                    <MaterialCommunityIcons
                      name="school"
                      size={20}
                      color="#14b8a6"
                    />
                    <View className="flex-1 ml-2">
                      <Picker
                        selectedValue={form.pickUp}
                        onValueChange={(value) => {
                          setForm({ ...form, pickUp: value });
                          if (errors.pickUp)
                            setErrors({ ...errors, standard: "" });
                        }}
                        style={{ color: "#374151" }}
                      >
                        <Picker.Item
                          label="Select your Pickup Point"
                          value=""
                        />
                        {BusList.map((bus) => (
                          <Picker.Item key={bus} label={`${bus}`} value={bus} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>

                {errors.pickUp && (
                  <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                    {errors.pickUp}
                  </Text>
                )}
              </Animated.View>
            )}

            {/* Save Button */}
            <Animated.View entering={FadeInDown.delay(500)} className="mb-4">
              <TouchableOpacity
                onPress={handleStudentSubmit}
                disabled={isLoading}
                className="overflow-hidden rounded-2xl"
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <View className="px-6 py-4 bg-gray-300">
                    <View className="flex-row items-center justify-center">
                      <Feather name="loader" size={20} color="white" />
                      <Text className="ml-2 text-white font-outfit-bold">
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
                      <Feather name="save" size={20} color="white" />
                      <Text className="ml-2 text-white font-outfit-bold">
                        Save Changes
                      </Text>
                    </View>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* Teacher Form */}
        {user?.role === "teacher" && (
          <View>
            {/* Email Input */}
            <Animated.View entering={FadeInDown.delay(300)} className="mb-6">
              <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                Email Address
              </Text>
              <View className="relative">
                <View className="absolute z-10 left-4 top-4">
                  <Feather name="mail" size={20} color="#14b8a6" />
                </View>
                <TextInput
                  value={form.email}
                  onChangeText={(text) => {
                    setForm({ ...form, email: text });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`pl-12 pr-4 py-4 border-2 rounded-2xl font-outfit text-gray-800 bg-white ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  }`}
                />
              </View>
              {errors.email && (
                <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                  {errors.email}
                </Text>
              )}
            </Animated.View>

            {/* Save Button */}
            <Animated.View entering={FadeInDown.delay(400)} className="mb-4">
              <TouchableOpacity
                onPress={handleTeacherSubmit}
                disabled={isLoading}
                className="overflow-hidden rounded-2xl"
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <View className="px-6 py-4 bg-gray-300">
                    <View className="flex-row items-center justify-center">
                      <Feather name="loader" size={20} color="white" />
                      <Text className="ml-2 text-white font-outfit-bold">
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
                      <Feather name="save" size={20} color="white" />
                      <Text className="ml-2 text-white font-outfit-bold">
                        Save Changes
                      </Text>
                    </View>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        isDialogOpen={showPasswordDialog}
        setIsDialogOpen={setShowPasswordDialog}
      />
    </ScrollView>
  );
};

export default EditProfileSection;
