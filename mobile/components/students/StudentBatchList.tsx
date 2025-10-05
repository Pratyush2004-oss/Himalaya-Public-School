import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";
import { BatchForStudentType } from "@/types";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import StudentBatchItem from "./StudentBatchItem";

// Empty State Component
const EmptyState = () => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center py-16"
  >
    <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-3xl">
      <MaterialCommunityIcons
        name={"google-classroom"}
        size={32}
        color="#9ca3af"
      />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      {"No Batches Joined"}
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      {"You haven't joined any batches yet. Explore available batches to join."}
    </Text>
  </Animated.View>
);

// Header Component with Stats and Search
const ListHeader = ({
  batches,
  search,
  setSearch,
}: {
  batches: BatchForStudentType[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  // Calculate batch statistics for my batches
  const getStandardStats = () => {
    const standardGroups = batches.reduce(
      (acc, batch) => {
        const standard = batch.standard;
        acc[standard] = (acc[standard] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(standardGroups)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .slice(0, 4);
  };

  const standardStats = getStandardStats();
  const totalBatches = batches.length;
  const totalStudents = batches.reduce(
    (sum, batch) => sum + batch.studentCount,
    0
  );

  const statsData = [
    {
      count: totalBatches,
      name: "Joined Batches",
      icon: "albums-outline",
      color: "bg-teal-400",
    },
    {
      count: totalStudents,
      name: "Classmates",
      icon: "people-outline",
      color: "bg-indigo-400",
    },
    {
      count: standardStats.length,
      name: "Standards",
      icon: "school-outline",
      color: "bg-pink-400",
    },
    {
      count: batches.filter((b) => parseInt(b.standard) >= 9).length,
      name: "Senior Classes",
      icon: "trophy-outline",
      color: "bg-emerald-400",
    },
  ];

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="mb-4"
    >
      {/* Stats Cards - Only show for my batches */}
      {batches.length > 0 && (
        <>
          <FlatList
            data={statsData}
            className="mt-2"
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View className="flex-row items-center justify-between p-4 mr-3 bg-teal-50 rounded-2xl min-w-52">
                <View>
                  <Text className="text-lg text-teal-800 font-outfit-bold">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-teal-600 font-outfit">
                    {item.count} {item.count === 1 ? "item" : "items"}
                  </Text>
                </View>
                <View
                  className={`items-center justify-center w-12 h-12 ${item.color} rounded-2xl`}
                >
                  <Ionicons name={item.icon as any} size={24} color="white" />
                </View>
              </View>
            )}
          />

          {/* Standard Distribution */}
          {standardStats.length > 0 && (
            <View className="p-4 mt-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
              <Text className="mb-3 text-base text-indigo-800 font-outfit-semibold">
                Class Distribution
              </Text>
              <View className="flex-row flex-wrap">
                {standardStats.map(([standard, count]) => (
                  <View
                    key={standard}
                    className="flex-row items-center px-3 py-2 mb-2 mr-2 bg-white/70 rounded-xl"
                  >
                    <MaterialCommunityIcons
                      name="school"
                      size={16}
                      color="#6366f1"
                    />
                    <Text className="ml-2 text-sm text-indigo-700 font-outfit-medium">
                      Class {standard}: {count}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Divider */}
          <View className="h-0.5 my-4 bg-gray-200" />
        </>
      )}

      {/* Search Bar */}
      <View className="flex-row items-center py-1.5 px-4 bg-teal-50 rounded-2xl">
        <Ionicons name="search-outline" size={24} color="#14b8a6" />
        <TextInput
          placeholder={"Search your batches, teachers..."}
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
      </View>
    </Animated.View>
  );
};

const StudentBatchList = () => {
  const [search, setSearch] = useState("");
  const { token } = useUserStore();
  const {
    getBatchListForStudent,
    batchListForStudents,
    leaveBatch,
    isLoading,
  } = useBatchStore();

  //   get the batc list for students
  const filteredMyBatches = (): BatchForStudentType[] => {
    if (search) {
      return batchListForStudents.filter(
        (batch: BatchForStudentType) =>
          (batch.name &&
            batch.name.toLowerCase().includes(search.toLowerCase())) ||
          (batch.teacher &&
            batch.teacher.name &&
            batch.teacher.name.toLowerCase().includes(search.toLowerCase())) ||
          (batch.standard &&
            batch.standard.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return batchListForStudents;
  };

  // Handle batch press
  const handleMyBatchPress = async (batch: BatchForStudentType) => {
    // Navigate to batch details or implement specific functionality
    console.log("Pressed batch:", batch.name);
  };

  // Handle leave batch
  const handleLeaveBatch = async (batch: BatchForStudentType) => {
    Alert.alert(
      "Leave Batch",
      `Are you sure you want to leave "${batch.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            if (token) {
              await leaveBatch(batch._id, token);
            }
          },
        },
      ]
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    if (token) {
      getBatchListForStudent(token);
    }
  };

  const renderMyBatchItem = ({
    item,
    index,
  }: {
    item: BatchForStudentType;
    index: number;
  }) => (
    <StudentBatchItem
      item={item}
      index={index}
      onPress={handleMyBatchPress}
      onLeave={handleLeaveBatch}
    />
  );
  return (
    <FlatList
      data={filteredMyBatches()}
      renderItem={renderMyBatchItem}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListHeaderComponent={
        <ListHeader
          batches={batchListForStudents}
          search={search}
          setSearch={setSearch}
        />
      }
      ListEmptyComponent={<EmptyState />}
      removeClippedSubviews={true}
      // Pull to refresh functionality
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }
    />
  );
};

// get filtered batches
export default StudentBatchList;