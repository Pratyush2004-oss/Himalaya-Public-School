import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

const BackHeader = () => {
  const router = useRouter();
  return (
    <Pressable
      className="flex-row items-center justify-start gap-3 px-4 py-2 bg-gray-200 border-b border-white"
      onPress={() => router.back()}
    >
      <Ionicons name="arrow-back-circle-outline" size={30} color="black" />
      <Text className="text-xl font-bold">Back</Text>
    </Pressable>
  );
};

export default BackHeader;