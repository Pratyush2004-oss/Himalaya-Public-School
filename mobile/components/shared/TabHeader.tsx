import { useUserStore } from "@/store/auth.store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const TabHeader = () => {
  const { user, isAdmin } = useUserStore();
  const router = useRouter();
  return (
    <Animated.View
      entering={FadeInUp.duration(500).springify()}
      className={"px-5 py-3 border-b border-gray-200 bg-gray-200/50"}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 space-x-3">
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="text-xl text-gray-800 font-outfit-medium">
            {user?.name}
          </Text>
        </View>
        <View className="flex-row items-center gap-3 space-x-4">
          {isAdmin && (
            <TouchableOpacity
              className="p-2 rounded-full bg-gray-300/50"
              onPress={() => router.push("/admin")}
            >
              <Feather name="grid" size={24} color="rgb(31 41 55)" />
            </TouchableOpacity>
          )}
          <TouchableOpacity className="p-2 rounded-full bg-gray-300/50">
            <Feather name="search" size={24} color="rgb(31 41 55)" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 rounded-full bg-gray-300/50">
            <Feather name="bell" size={24} color="rgb(31 41 55)" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default TabHeader;
