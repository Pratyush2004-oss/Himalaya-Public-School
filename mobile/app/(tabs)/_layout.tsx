import TabHeader from "@/components/shared/TabHeader";
import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  const { token, user, eventsList, getEventsList } = useUserStore();
  const { getBatchListForTeacher } = useBatchStore();
  // Load batches on component mount
  useEffect(() => {
    if (token && user?.role === "teacher") {
      getBatchListForTeacher(token);
    }
    if (token && eventsList.length === 0) getEventsList();
  }, [token]);

  return (
    <View className="flex-1">
      <TabHeader />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#2dd4bf",
          tabBarInactiveTintColor: "#9CA3AF",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#E1E8ED",
            height: insets.bottom + 50,
          },
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
            ),
          }}
        />
        {/* batches */}
        <Tabs.Screen
          name="batches"
          options={{
            title: "Batches",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="bar-chart" color={color} size={size} />
            ),
          }}
        />
        {/* assignments */}
        <Tabs.Screen
          name="assignment"
          options={{
            title: "Assignments",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <Feather name="book-open" color={color} size={size} />
            ),
          }}
        />
        {/* profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabLayout;
