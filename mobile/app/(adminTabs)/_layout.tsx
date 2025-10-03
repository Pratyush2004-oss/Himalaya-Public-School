import BackHeader from "@/components/shared/BackHeader";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AdminLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1">
      <BackHeader
        title="Admin Panel"
        subtitle="Manage School Records"
        backgroundColor="gradient"
      />
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
        {/* Events */}
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <Feather name="award" color={color} size={size} />
            ),
          }}
        />
        {/* Fee */}
        <Tabs.Screen
          name="fee"
          options={{
            title: "Fee",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <Feather name="dollar-sign" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default AdminLayout;
