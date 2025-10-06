import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";
import { BatchForTeacherType } from "@/types";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  Layout,
} from "react-native-reanimated";

// Batch Item Component for Teachers
const TeacherBatchItem: React.FC<{
  item: BatchForTeacherType;
  index: number;
  onPress?: (batch: BatchForTeacherType) => void;
  onDelete?: (batch: BatchForTeacherType) => void;
  onChangeCode?: (batch: BatchForTeacherType) => void;
}> = ({ item, index, onPress, onDelete, onChangeCode }) => {
  const getAvatarColors = (index: number) => {
    const colors = [
      "bg-teal-400",
      "bg-indigo-400",
      "bg-pink-400",
      "bg-emerald-400",
      "bg-orange-400",
      "bg-violet-400",
      "bg-blue-400",
    ];
    return colors[index % colors.length];
  };

  const getBatchIcon = (standard: string) => {
    const standardNum = parseInt(standard);
    if (standardNum <= 5) return "book-outline";
    if (standardNum <= 8) return "library-outline";
    if (standardNum <= 10) return "school-outline";
    return "trophy-outline";
  };

  const getStandardBadgeColor = (standard: string) => {
    const standardNum = parseInt(standard);
    if (standardNum <= 5) return "bg-blue-100 text-blue-700";
    if (standardNum <= 8) return "bg-purple-100 text-purple-700";
    if (standardNum <= 10) return "bg-green-100 text-green-700";
    return "bg-orange-100 text-orange-700";
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Batch",
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete?.(item),
        },
      ]
    );
  };

  const handleChangeCodePress = () => {
    Alert.alert(
      "Change Joining Code",
      `Generate a new joining code for "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Change Code",
          onPress: () => onChangeCode?.(item),
        },
      ]
    );
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(500)
        .delay(index * 100)
        .springify()}
      layout={Layout.springify()}
      className="mb-4"
    >
      <TouchableOpacity
        onPress={() => onPress?.(item)}
        className="p-4 bg-white shadow-sm rounded-2xl shadow-gray-300 active:scale-98"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center">
          {/* Batch Avatar */}
          <View
            className={`w-16 h-16 ${getAvatarColors(index)} rounded-2xl items-center justify-center`}
          >
            <Ionicons
              name={getBatchIcon(item.standard) as any}
              size={26}
              color="white"
            />
          </View>

          {/* Batch Info */}
          <View className="flex-1 ml-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-800 font-outfit-bold">
                {item.name}
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${getStandardBadgeColor(item.standard)} flex-row items-center`}
              >
                <MaterialCommunityIcons name="school" size={12} />
                <Text className="ml-1 text-xs font-outfit-medium">
                  Class: {item.standard}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  {item.studentCount} students
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="key-outline" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  {item.batchJoiningCode || "No Code"}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center gap-2 mt-3">
              <TouchableOpacity
                className="flex-row items-center px-3 py-1.5 bg-teal-50 rounded-lg"
                onPress={handleChangeCodePress}
              >
                <Ionicons name="refresh-outline" size={14} color="#14b8a6" />
                <Text className="ml-1 text-xs text-teal-700 font-outfit-medium">
                  Change Code
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center px-3 py-1.5 bg-red-50 rounded-lg"
                onPress={handleDeletePress}
              >
                <Ionicons name="trash-outline" size={14} color="#ef4444" />
                <Text className="ml-1 text-xs text-red-700 font-outfit-medium">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Action Button */}
          <TouchableOpacity
            className="items-center justify-center w-10 h-10 ml-2 bg-teal-50 rounded-xl"
            onPress={() => onPress?.(item)}
          >
            <Feather name="chevron-right" size={20} color="#14b8a6" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center py-16"
  >
    <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-3xl">
      <MaterialCommunityIcons
        name="google-classroom"
        size={32}
        color="#9ca3af"
      />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      No Batches Created
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      You haven't created any batches yet. Contact admin to create your first
      batch.
    </Text>
  </Animated.View>
);

// Quick Actions Component
const QuickActions: React.FC<{
  onCreateBatch: () => void;
  onViewAllStudents: () => void;
}> = ({ onViewAllStudents }) => {
  const actionItems = [
    {
      title: "Create Assignment",
      subtitle: "Add new homework",
      icon: "document-text-outline",
      color: "bg-indigo-400",
      bgColor: "bg-indigo-50",
      onPress: () => Alert.alert("Feature", "Assignment creation coming soon!"),
    },
    {
      title: "View All Students",
      subtitle: "Manage students",
      icon: "people-outline",
      color: "bg-emerald-400",
      bgColor: "bg-emerald-50",
      onPress: onViewAllStudents,
    },
    {
      title: "Announcements",
      subtitle: "Send updates",
      icon: "megaphone-outline",
      color: "bg-orange-400",
      bgColor: "bg-orange-50",
      onPress: () => Alert.alert("Feature", "Announcements coming soon!"),
    },
  ];

  return (
    <Animated.View
      entering={FadeInUp.duration(500).delay(200).springify()}
      className="mb-4"
    >
      <Text className="mb-3 text-lg text-gray-800 font-outfit-bold">
        Quick Actions
      </Text>
      <FlatList
        data={actionItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInRight.duration(400)
              .delay(index * 100)
              .springify()}
          >
            <TouchableOpacity
              onPress={item.onPress}
              className={`p-4 mr-3 ${item.bgColor} rounded-2xl w-44 active:scale-95`}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base text-gray-800 font-outfit-semibold">
                    {item.title}
                  </Text>
                  <Text className="mt-1 text-sm text-gray-600 font-outfit">
                    {item.subtitle}
                  </Text>
                </View>
                <View
                  className={`w-10 h-10 ${item.color} rounded-xl items-center justify-center`}
                >
                  <Ionicons name={item.icon as any} size={20} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </Animated.View>
  );
};

// Header Component with Stats and Search
const ListHeader = ({
  batches,
  search,
  setSearch,
}: {
  batches: BatchForTeacherType[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  // Calculate batch statistics
  const totalStudents = batches
    ? batches.reduce((sum, batch) => sum + batch.studentCount, 0)
    : 0;
  const activeClasses = batches
    ? new Set(batches.map((batch) => batch.standard)).size
    : 0;
  const batchesWithCode = batches ? batches.length : 0;
  const statsData = [
    {
      count: batches.length,
      name: "My Batches",
      icon: "albums-outline",
      gradient: ["#14b8a6", "#0d9488"],
    },
    {
      count: totalStudents,
      name: "Total Students",
      icon: "people-outline",
      gradient: ["#6366f1", "#4f46e5"],
    },
    {
      count: activeClasses,
      name: "Classes",
      icon: "school-outline",
      gradient: ["#ec4899", "#db2777"],
    },
    {
      count: batchesWithCode,
      name: "Active Codes",
      icon: "key-outline",
      gradient: ["#10b981", "#059669"],
    },
  ];

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="mb-4"
    >
      {/* Welcome Section */}
      <Animated.View entering={FadeInUp.duration(500).springify()}>
        <LinearGradient
          style={{ borderRadius: 20 }}
          colors={["#14b8a6", "#0d9488"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="p-5 mb-4"
        >
          <Text className="text-xl text-white font-outfit-bold">
            Welcome Back, Teacher! 👋
          </Text>
          <Text className="mt-1 text-sm text-white/90 font-outfit">
            Manage your classes and track student progress
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Stats Cards */}
      <FlatList
        data={statsData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        className="mb-4"
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInRight.duration(500)
              .delay(index * 100)
              .springify()}
          >
            <LinearGradient
              style={{ borderRadius: 20 }}
              colors={item.gradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-4 mr-3 rounded-2xl min-w-36"
            >
              <View className="items-center">
                <Ionicons name={item.icon as any} size={24} color="white" />
                <Text className="mt-2 text-2xl text-white font-outfit-bold">
                  {item.count}
                </Text>
                <Text className="text-xs text-center text-white/90 font-outfit">
                  {item.name}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}
      />

      {/* Search Bar */}
      <Animated.View
        entering={FadeInUp.duration(500).delay(400).springify()}
        className="flex-row items-center px-4 py-3 bg-teal-50 rounded-2xl"
      >
        <Ionicons name="search-outline" size={24} color="#14b8a6" />
        <TextInput
          placeholder="Search your batches..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-3 text-sm text-gray-600 font-outfit"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
};

// Main Component
const TeacherBatchList: React.FC = () => {
  const {
    batchListForTeacher: batches,
    getBatchListForTeacher,
    deleteBatch,
    changeBatchJoiningCode,
    setSelectedBatch,
    isLoading,
  } = useBatchStore();
  const { token } = useUserStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filteredBatches = (): BatchForTeacherType[] => {
    if (search) {
      return batches.filter(
        (batch: BatchForTeacherType) =>
          (batch.name &&
            batch.name.toLowerCase().includes(search.toLowerCase())) ||
          (batch.standard &&
            batch.standard.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return batches;
  };

  // Handle batch press - navigate to batch details
  const handleBatchPress = async (batch: BatchForTeacherType) => {
    setSelectedBatch(batch);
    // Navigate to batch details screen
    router.push("/teachers/BatchDetails");
  };

  // Handle delete batch
  const handleDeleteBatch = async (batch: BatchForTeacherType) => {
    if (token) {
      await deleteBatch(batch._id, token);
    }
  };

  // Handle change joining code
  const handleChangeCode = async (batch: BatchForTeacherType) => {
    if (token) {
      await changeBatchJoiningCode(batch._id, token);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (token) {
      setRefreshing(true);
      await getBatchListForTeacher(token);
      setRefreshing(false);
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: BatchForTeacherType;
    index: number;
  }) => (
    <TeacherBatchItem
      item={item}
      index={index}
      onPress={handleBatchPress}
      onDelete={handleDeleteBatch}
      onChangeCode={handleChangeCode}
    />
  );

  const keyExtractor = (item: BatchForTeacherType) => item._id;

  const getItemLayout = (_: any, index: number) => ({
    length: 120, // Approximate height of each item
    offset: 120 * index,
    index,
  });

  return (
    <View className="flex-1 px-5">
      <FlatList
        data={filteredBatches()}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <ListHeader batches={batches} search={search} setSearch={setSearch} />
        }
        ListEmptyComponent={<EmptyState />}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={8}
        initialNumToRender={6}
        // Pull to refresh functionality
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={handleRefresh}
            colors={["#14b8a6"]}
            tintColor="#14b8a6"
          />
        }
      />
    </View>
  );
};

export default TeacherBatchList;
