import { useAdminStore } from "@/store/admin.store";
import { AllBatchesType } from "@/types";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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
  Layout,
} from "react-native-reanimated";
import CreateBatchModal from "./CreateBatchModal";

// Batch Item Component
const BatchItem: React.FC<{
  item: AllBatchesType;
  index: number;
  onPress?: (batch: AllBatchesType) => void;
}> = ({ item, index, onPress }) => {
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
            className={`w-14 h-14 ${getAvatarColors(index)} rounded-2xl items-center justify-center`}
          >
            <Ionicons
              name={getBatchIcon(item.standard) as any}
              size={24}
              color="white"
            />
          </View>

          {/* Batch Info */}
          <View className="flex-1 ml-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-800 font-outfit-semibold">
                {item.name}
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${getStandardBadgeColor(item.standard)} flex-row items-center`}
              >
                <MaterialCommunityIcons name="school" size={12} />
                <Text className={`ml-1 text-xs font-outfit-medium`}>
                  Class {item.standard}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center mr-4">
                <Feather name="user" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  {item.teacher.name}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="key-outline" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  {item.batchJoiningCode}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
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
      No Batches Found
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      There are no batches to display at the moment.
    </Text>
  </Animated.View>
);

// Header Component with Stats and Search
const ListHeader = ({
  batches,
  search,
  setSearch,
  setIsDialogOpen,
}: {
  batches: AllBatchesType[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Calculate batch statistics
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
      .slice(0, 4); // Show top 4 standards
  };

  const standardStats = getStandardStats();
  const totalBatches = batches.length;
  const uniqueTeachers = new Set(batches.map((batch) => batch.teacher.name))
    .size;

  const statsData = [
    {
      count: totalBatches,
      name: "Total Batches",
      icon: "albums-outline",
      color: "bg-teal-400",
    },
    {
      count: uniqueTeachers,
      name: "Teachers",
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
      {/* Stats Cards */}
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

      {/* Search Bar and add button */}
      <View className="flex-row items-center justify-between w-full">
        <View className="flex-row items-center py-1.5 px-4 bg-teal-50 rounded-2xl w-5/6">
          <Ionicons name="search-outline" size={24} color="#14b8a6" />
          <TextInput
            placeholder="Search batches, teachers, or classes..."
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
        {/* add icon */}
        <TouchableOpacity
          className="p-2.5 mx-auto rounded-full bg-teal-50"
          onPress={() => setIsDialogOpen(true)}
        >
          <Feather name="plus" size={24} color="#14b8a6" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Main Component
const BatchFlatList: React.FC = () => {
  const { allBatches: batches } = useAdminStore();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredBatches = (): AllBatchesType[] => {
    if (search) {
      return batches.filter(
        (batch: AllBatchesType) =>
          (batch.name &&
            batch.name.toLowerCase().includes(search.toLowerCase())) ||
          (batch.teacher &&
            batch.teacher.name &&
            batch.teacher.name.toLowerCase().includes(search.toLowerCase())) ||
          (batch.standard &&
            batch.standard.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return batches;
  };

  // Handle batch press
  const handleBatchPress = async (batch: AllBatchesType) => {};

  const renderItem = ({
    item,
    index,
  }: {
    item: AllBatchesType;
    index: number;
  }) => <BatchItem item={item} index={index} onPress={handleBatchPress} />;

  const keyExtractor = (item: AllBatchesType) => item._id;

  const getItemLayout = (_: any, index: number) => ({
    length: 88, // Approximate height of each item
    offset: 88 * index,
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
          <ListHeader
            batches={batches}
            search={search}
            setSearch={setSearch}
            setIsDialogOpen={setIsDialogOpen}
          />
        }
        ListEmptyComponent={<EmptyState />}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        // Pull to refresh functionality
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
      />

      {/* Create Batch Modal */}
      <CreateBatchModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </View>
  );
};

export default BatchFlatList;
