import { useAssignmentStore } from "@/store/assignment.store";
import { useUserStore } from "@/store/auth.store";
import { TodaysAssignmentType } from "@/types";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

// --- UI Components ---

// Component for a single homework file
const HomeworkFileItem: React.FC<{ fileUrl: string; index: number }> = ({
  fileUrl,
  index,
}) => {
  const fileName = fileUrl.split("/").pop() || "Attachment";

  const handleViewFile = () => {
    Linking.openURL(fileUrl).catch((err) =>
      Alert.alert("Failed to open URL:", err)
    );
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(400)
        .delay(index * 100)
        .springify()}
      className="flex-row items-center p-3 mt-2 bg-gray-50 rounded-xl"
    >
      <Ionicons name="document-text-outline" size={24} color="#0d9488" />
      <Text
        className="flex-1 mx-3 text-sm text-gray-700 font-outfit"
        numberOfLines={1}
      >
        {fileName}
      </Text>
      <TouchableOpacity
        onPress={handleViewFile}
        className="px-3 py-1 bg-teal-100 rounded-lg"
      >
        <Text className="text-xs text-teal-800 font-outfit-semibold">View</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Component for a batch's assignments
const AssignmentBatchCard: React.FC<{
  item: TodaysAssignmentType;
  index: number;
}> = ({ item, index }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(500)
        .delay(index * 150)
        .springify()}
      className="p-4 mb-4 bg-white shadow-sm rounded-2xl"
    >
      <View className="flex-row items-center mb-2">
        <View className="items-center justify-center w-10 h-10 mr-3 bg-teal-50 rounded-xl">
          <Feather name="book-open" size={20} color="#0d9488" />
        </View>
        <Text className="text-lg text-gray-800 font-outfit-bold">
          {item.batchName}
        </Text>
      </View>
      {item.homework.map((file, idx) => (
        <HomeworkFileItem key={idx} fileUrl={file} index={idx} />
      ))}
    </Animated.View>
  );
};

// Empty State Component
const EmptyState = () => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center py-20"
  >
    <View className="items-center justify-center w-24 h-24 mb-5 bg-gray-100 rounded-3xl">
      <MaterialIcons name="assignment-turned-in" size={40} color="#9ca3af" />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      All Caught Up!
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      You have no new assignments for today.
    </Text>
  </Animated.View>
);

// --- Main Component ---
const TodaysAssignment = () => {
  const { todaysAssignment, getTodaysAssignment, isLoading } =
    useAssignmentStore();
  const { token } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      getTodaysAssignment(token);
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (token) {
      await getTodaysAssignment(token);
    }
    setRefreshing(false);
  };

  if (isLoading && (!todaysAssignment || todaysAssignment.length === 0)) {
    return (
      <View className="items-center justify-center flex-1 pt-10">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 px-5 pt-4"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="mb-1 text-2xl text-gray-800 font-outfit-bold">
        Today's Assignments
      </Text>
      <Text className="mb-6 text-gray-500 font-outfit">
        Here are the assignments uploaded today.
      </Text>

      {todaysAssignment && todaysAssignment.length > 0 ? (
        todaysAssignment.map((item, index) => (
          <AssignmentBatchCard key={item._id} item={item} index={index} />
        ))
      ) : (
        <EmptyState />
      )}
    </ScrollView>
  );
};

export default TodaysAssignment;
