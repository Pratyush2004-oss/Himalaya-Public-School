import { useUserStore } from "@/store/auth.store";
import { EventType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, RefreshControl, Text, View, Image } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

// Event Item Component
const EventItem: React.FC<{ item: EventType; index: number }> = ({
  item,
  index,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500)
        .delay(index * 100)
        .springify()}
      className="mb-5 overflow-hidden bg-white shadow-sm rounded-2xl shadow-gray-300"
    >
      <Image source={{ uri: item.image }} className="w-full h-44" />
      <View className="p-4">
        <Text className="text-lg text-gray-800 font-outfit-bold">
          {item.title}
        </Text>
        <Text className="mt-1 text-sm text-gray-600 font-outfit">
          {item.description}
        </Text>
        <View className="flex-row items-center mt-3">
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text className="ml-2 text-sm text-gray-600 font-outfit-medium">
            {formatDate(item.date)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center pt-24"
  >
    <View className="items-center justify-center w-24 h-24 mb-5 bg-gray-100 rounded-3xl">
      <Ionicons name="notifications-off-outline" size={48} color="#9ca3af" />
    </View>
    <Text className="text-xl text-gray-800 font-outfit-bold">
      No Notifications
    </Text>
    <Text className="mt-1 text-base text-center text-gray-500 font-outfit">
      You're all caught up! New events will appear here.
    </Text>
  </Animated.View>
);

// Header Component
const ListHeader: React.FC = () => (
  <Animated.View entering={FadeInUp.duration(500).springify()} className="pb-4">
    <Text className="text-2xl text-gray-800 font-outfit-bold">
      Notifications & Events
    </Text>
    <Text className="mt-1 text-base text-gray-500 font-outfit">
      Stay updated with the latest school announcements.
    </Text>
  </Animated.View>
);

// Main Component
const NotificationList = () => {
  const { eventsList, getEventsList, token } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!token) return;
    setRefreshing(true);
    await getEventsList().finally(() => setRefreshing(false));
  };

  const filteredList = eventsList.filter((item) => item.public);

  return (
    <FlatList
      data={filteredList}
      keyExtractor={(item) => item._id}
      renderItem={({ item, index }) => <EventItem item={item} index={index} />}
      ListHeaderComponent={<ListHeader />}
      ListEmptyComponent={<EmptyState />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#14b8a6"]}
          tintColor="#14b8a6"
        />
      }
    />
  );
};

export default NotificationList;
