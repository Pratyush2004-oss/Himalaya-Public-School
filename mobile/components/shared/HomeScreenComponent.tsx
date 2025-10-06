import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import EventsFlatList from "./EventsFlatList";
// TypeScript type for Quick Access items
type QuickAccessItem = {
  name: string;
  icon: React.ReactNode;
  color: string;
};

// Data for the Quick Access grid
const quickAccessItems: QuickAccessItem[] = [
  {
    name: "Timetable",
    icon: <Ionicons name="calendar-outline" size={24} color="#6366f1" />,
    color: "bg-indigo-100",
  },
  {
    name: "Grades",
    icon: (
      <MaterialCommunityIcons name="school-outline" size={24} color="#ec4899" />
    ),
    color: "bg-pink-100",
  },
  {
    name: "Timesheet",
    icon: <Ionicons name="time-outline" size={24} color="#10b981" />,
    color: "bg-emerald-100",
  },
  {
    name: "Library",
    icon: <Ionicons name="library-outline" size={24} color="#f97316" />,
    color: "bg-orange-100",
  },
  {
    name: "Fee Due",
    icon: <MaterialIcons name="payment" size={24} color="#3b82f6" />,
    color: "bg-blue-100",
  },
  {
    name: "Organizer",
    icon: <Feather name="grid" size={24} color="#8b5cf6" />,
    color: "bg-violet-100",
  },
];

const HomeScreenComponent = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="p-5">
        {/* Today's Focus Card */}
        <Animated.View entering={FadeInUp.duration(500).delay(200).springify()}>
          <View className="p-5 bg-teal-400 shadow-lg rounded-2xl shadow-teal-300">
            <Text className="text-sm font-outfit-medium text-white/90">
              Today's Focus
            </Text>
            <Text className="mt-2 text-xl text-white font-outfit-bold">
              Physics Quiz - 2 Days Left
            </Text>
            <Text className="mt-1 text-xs text-white/80">
              Unplastered Prop 80 Sub Req...
            </Text>
            <View className="flex-row items-end justify-between mt-4">
              <TouchableOpacity className="px-6 py-2 rounded-lg bg-white/90">
                <Text className="text-teal-500 font-outfit-bold">Try Now</Text>
              </TouchableOpacity>
              <Ionicons
                name="book-outline"
                size={32}
                color="rgba(255,255,255,0.5)"
              />
            </View>
          </View>
        </Animated.View>

        {/* Quick Access Section */}
        <Animated.View entering={FadeInUp.duration(500).delay(400).springify()}>
          <View className="mt-8">
            <Text className="text-lg text-gray-800 font-outfit-bold">
              Quick Access
            </Text>
            <View className="flex-row flex-wrap justify-between mt-4">
              {quickAccessItems.map((item, index) => (
                <Animated.View
                  key={index}
                  className="w-[30%] items-center mb-4"
                  entering={FadeInUp.duration(500)
                    .delay(500 + index * 100)
                    .springify()}
                >
                  <TouchableOpacity
                    className={`w-16 h-16 ${item.color} rounded-2xl items-center justify-center`}
                  >
                    {item.icon}
                  </TouchableOpacity>
                  <Text className="mt-2 text-xs text-gray-600 font-outfit-medium">
                    {item.name}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Recent Updates Section */}
        <EventsFlatList />
        <Animated.View
          entering={FadeInDown.duration(500).delay(600).springify()}
        >
          <View className="mt-6">
            <Text className="text-lg text-gray-800 font-outfit-bold">
              Recent Updates
            </Text>
            <View className="relative items-center justify-center h-48 mt-4 overflow-hidden bg-teal-50/70 rounded-2xl">
              {/* Decorative background elements */}
              <View className="absolute w-40 h-40 rounded-full bg-teal-100/50 -top-10 -left-10" />
              <View className="absolute w-40 h-40 rounded-full bg-teal-100/50 -bottom-10 -right-10" />

              {/* Central Icon */}
              <View className="items-center justify-center w-16 h-16 bg-teal-200/80 rounded-2xl">
                <Feather name="award" size={30} color="#14b8a6" />
              </View>
              {/* Surrounding Icons (simplified representation) */}
              <View className="absolute items-center justify-center w-10 h-10 rounded-lg top-5 left-10 bg-white/70 backdrop-blur-sm">
                <Feather name="book-open" size={20} color="#14b8a6" />
              </View>
              <View className="absolute items-center justify-center w-10 h-10 rounded-lg top-10 right-8 bg-white/70 backdrop-blur-sm">
                <Feather name="clipboard" size={20} color="#14b8a6" />
              </View>
              <View className="absolute items-center justify-center w-10 h-10 rounded-lg bottom-5 right-12 bg-white/70 backdrop-blur-sm">
                <Feather name="lock" size={20} color="#14b8a6" />
              </View>
              <View className="absolute items-center justify-center w-10 h-10 rounded-lg bottom-10 left-8 bg-white/70 backdrop-blur-sm">
                <Feather name="user-check" size={20} color="#14b8a6" />
              </View>

              <Text className="absolute text-xs font-outfit-medium bottom-4 text-teal-700/80">
                Progress analytics updated
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default HomeScreenComponent;
