import useUserHook from "@/hooks/userHook";
import { useUserStore } from "@/store/auth.store";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const ProfileScreen = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const { logoutHook } = useUserHook();
  const handleLogout = () => {
    logoutHook();
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 py-3">
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)}>
          <Text className="mb-4 text-2xl text-center text-gray-800 font-outfit-bold">
            Profile
          </Text>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(200)}
          className="items-center p-6 bg-white shadow-sm rounded-2xl shadow-gray-300"
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d" }}
            className="border-4 border-teal-100 rounded-full size-28"
          />
          <Text className="mt-4 text-xl text-gray-800 font-outfit-bold">
            {user?.name}
          </Text>
          <Text className="mt-1 text-sm text-gray-500 font-outfit">
            {user?.email}
          </Text>
        </Animated.View>

        {/* User Details Section */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          className="mt-8"
        >
          <Text className="mb-4 text-lg text-gray-800 font-outfit-bold">
            User Information
          </Text>
          <View className="p-4 bg-white shadow-sm rounded-2xl shadow-gray-300">
            {/* Role */}
            <View className="flex-row items-center mb-4">
              <View className="items-center justify-center w-12 h-12 rounded-lg bg-teal-50">
                <Feather name="user" size={24} color="#14b8a6" />
              </View>
              <View className="ml-4">
                <Text className="text-xs text-gray-500 font-outfit-medium">
                  Role
                </Text>
                <Text className="text-gray-700 font-outfit-semibold">
                  {user?.role}
                </Text>
              </View>
            </View>
            {/* Standard only for students */}
            {user?.role === "student" && (
              <View className="flex-row items-center mb-4">
                <View className="items-center justify-center w-12 h-12 rounded-lg bg-indigo-50">
                  <MaterialCommunityIcons
                    name="school-outline"
                    size={24}
                    color="#6366f1"
                  />
                </View>
                <View className="ml-4">
                  <Text className="text-xs text-gray-500 font-outfit-medium">
                    Class
                  </Text>
                  <Text className="text-gray-700 font-outfit-semibold">
                    {user?.standard}
                  </Text>
                </View>
              </View>
            )}
            {/* UID */}
            <View className="flex-row items-center">
              <View className="items-center justify-center w-12 h-12 rounded-lg bg-pink-50">
                <Ionicons name="card-outline" size={24} color="#ec4899" />
              </View>
              <View className="ml-4">
                <Text className="text-xs text-gray-500 font-outfit-medium">
                  Unique ID
                </Text>
                <Text className="text-gray-700 font-outfit-semibold">
                  {user?.UID}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Actions Section */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(600)}
          className="mt-8"
        >
          <Text className="mb-4 text-lg text-gray-800 font-outfit-bold">
            Settings
          </Text>
          <View className="overflow-hidden bg-white shadow-sm rounded-2xl shadow-gray-300">
            {/* Fee payment and status section for students only */}
            {user?.role === "student" && (
              <TouchableOpacity className="flex-row items-center justify-between w-full p-4 border-b border-gray-100 active:bg-gray-100">
                <Text className="text-gray-700 font-outfit-medium">
                  Fee Status
                </Text>
                <Feather name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
            <TouchableOpacity className="flex-row items-center justify-between w-full p-4 border-b border-gray-100 active:bg-gray-100">
              <Text className="text-gray-700 font-outfit-medium">
                Edit Profile
              </Text>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between w-full p-4 border-b border-gray-100 active:bg-gray-100">
              <Text className="text-gray-700 font-outfit-medium">
                Notifications
              </Text>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full p-4 active:bg-gray-100"
              onPress={handleLogout}
            >
              <Text className="text-red-500 font-outfit-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
