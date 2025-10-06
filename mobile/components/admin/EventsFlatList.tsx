import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";
import { EventType } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import CreateEventModal from "./CreateEventModal";

// Event Item Component
const EventItem: React.FC<{
  item: EventType;
  index: number;
  onDelete: (event: EventType) => void;
  onStatusChange: (event: EventType) => void;
}> = ({ item, index, onDelete, onStatusChange }) => {
  const handleStatusChange = (newStatus: boolean) => {
    Alert.alert(
      "Change Status",
      "Are you sure you want to change the status?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Change",
          onPress: () => onStatusChange(item),
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete the event "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(item),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500)
        .delay(index * 100)
        .springify()}
      layout={Layout.springify()}
      className="mb-5 overflow-hidden bg-white shadow-sm rounded-2xl shadow-gray-300"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-48 rounded-t-2xl"
      />
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 mr-2 text-lg text-gray-800 font-outfit-bold">
            {item.title}
          </Text>
          <View
            className={`px-3 py-1 rounded-full ${
              item.public ? "bg-emerald-100" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-xs font-outfit-medium ${
                item.public ? "text-emerald-700" : "text-gray-600"
              }`}
            >
              {item.public ? "Public" : "Draft"}
            </Text>
          </View>
        </View>
        <Text className="mt-1 text-sm text-gray-600 font-outfit">
          {item.description}
        </Text>

        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600 font-outfit-medium">
              {formatDate(item.date)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleDelete}
            className="p-2 bg-red-50 rounded-xl"
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-100">
        <Text className="text-sm text-gray-700 font-outfit-semibold">
          Publish Event
        </Text>
        <Switch
          value={item.public}
          onValueChange={handleStatusChange}
          trackColor={{ false: "#e5e7eb", true: "#a7f3d0" }}
          thumbColor={item.public ? "#10b981" : "#f9fafb"}
          ios_backgroundColor="#e5e7eb"
        />
      </View>
    </Animated.View>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center py-20"
  >
    <View className="items-center justify-center w-24 h-24 mb-5 bg-gray-100 rounded-3xl">
      <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
    </View>
    <Text className="text-xl text-gray-800 font-outfit-bold">
      No Events Found
    </Text>
    <Text className="mt-1 text-base text-center text-gray-500 font-outfit">
      Create your first event to engage with students and parents.
    </Text>
  </Animated.View>
);

// Header Component
const ListHeader: React.FC<{
  events: EventType[];
  search: string;
  setSearch: (text: string) => void;
}> = ({ events, search, setSearch }) => {
  const publicCount = events.filter((e) => e.public).length;
  const [isDialogOpen, setisDialogOpen] = useState(false);

  return (
    <Animated.View
      entering={FadeInUp.duration(500).springify()}
      className="mb-4"
    >
      {/* Stats Cards */}
      <View className="flex-row justify-between gap-3 mb-5">
        <View className="flex-row items-center justify-between flex-1 px-4 bg-white shadow-sm rounded-2xl shadow-gray-200">
          <View className="gap-1">
            <Text className="mt-2 text-3xl text-gray-800 font-outfit-bold">
              {events.length}
            </Text>
            <Text className="text-sm text-gray-600 font-outfit">
              Total Events
            </Text>
          </View>
          <Ionicons name="list" size={24} color="#14b8a6" />
        </View>
        <View className="flex-row items-center justify-between flex-1 p-4 bg-white shadow-sm rounded-2xl shadow-gray-200">
          <View>
            <Text className="mt-2 text-3xl text-gray-800 font-outfit-bold">
              {publicCount}
            </Text>
            <Text className="text-sm text-gray-600 font-outfit">
              Public Events
            </Text>
          </View>
          <Ionicons name="eye-outline" size={24} color="#6366f1" />
        </View>
      </View>

      {/* Create Event Button */}
      <TouchableOpacity
        onPress={() => setisDialogOpen(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#14b8a6", "#0d9488"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center justify-center p-4 mb-5 rounded-2xl"
          style={{ borderRadius: 20 }}
        >
          <Feather name="plus" size={22} color="white" />
          <Text className="ml-2 text-base text-white font-outfit-semibold">
            Create New Event
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Search Bar */}
      <View className="flex-row items-center px-4 py-3 bg-gray-100 rounded-2xl">
        <Ionicons name="search-outline" size={22} color="#6b7280" />
        <TextInput
          placeholder="Search events by title..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-3 text-sm text-gray-700 font-outfit"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
      <CreateEventModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setisDialogOpen}
      />
    </Animated.View>
  );
};

// Main Component
const EventFlatList: React.FC = () => {
  const { deleteEvent, updateEventStatus } = useAdminStore();
  const { token, eventsList, getEventsList } = useUserStore();
  const [search, setSearch] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleRefresh = async () => {
    setisLoading(true);
    if (token) await getEventsList().finally(() => setisLoading(false));
  };

  const handleDelete = async (event: EventType) => {
    if (token) await deleteEvent(event._id, token);
  };

  const handleStatusChange = async (event: EventType) => {
    if (token) await updateEventStatus(event._id, token);
  };

  const filteredEvents = eventsList.filter((event: EventType) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 px-5 bg-gray-50">
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        ListHeaderComponent={
          <ListHeader
            events={eventsList}
            search={search}
            setSearch={setSearch}
          />
        }
        renderItem={({ item, index }) => (
          <EventItem
            item={item}
            index={index}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={["#14b8a6"]}
            tintColor="#14b8a6"
          />
        }
      />
    </View>
  );
};

export default EventFlatList;
