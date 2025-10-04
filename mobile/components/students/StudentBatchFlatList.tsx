import { BatchForStudentType, AllBatchesForStudentsType } from "@/types";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
} from "react-native-reanimated";
import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";

// Student Batch Item Component
const StudentBatchItem: React.FC<{
  item: BatchForStudentType;
  index: number;
  onPress?: (batch: BatchForStudentType) => void;
  onLeave?: (batch: BatchForStudentType) => void;
}> = ({ item, index, onPress, onLeave }) => {
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

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center">
                <Feather name="user" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  {item.teacher.name}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  {item.studentCount} students
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center ml-2">
            <TouchableOpacity
              className="items-center justify-center w-10 h-10 mr-2 bg-red-50 rounded-xl"
              onPress={() => onLeave?.(item)}
            >
              <Feather name="log-out" size={18} color="#ef4444" />
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center w-10 h-10 bg-teal-50 rounded-xl"
              onPress={() => onPress?.(item)}
            >
              <Feather name="chevron-right" size={20} color="#14b8a6" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Available Batch Item Component (for joining)
const AvailableBatchItem: React.FC<{
  item: AllBatchesForStudentsType;
  index: number;
  onJoin?: (batch: AllBatchesForStudentsType) => void;
}> = ({ item, index, onJoin }) => {
  const getAvatarColors = (index: number) => {
    const colors = [
      "bg-emerald-400",
      "bg-blue-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-indigo-400",
      "bg-teal-400",
      "bg-orange-400",
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
      <View className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl shadow-gray-300">
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
              <Feather name="user" size={14} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                {item.teacher.name}
              </Text>
            </View>
          </View>

          {/* Join Button */}
          <TouchableOpacity
            className="items-center justify-center px-4 py-2 ml-2 bg-teal-500 rounded-xl"
            onPress={() => onJoin?.(item)}
          >
            <Text className="text-sm text-white font-outfit-semibold">Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Empty State Component
const EmptyState: React.FC<{ isMyBatches: boolean }> = ({ isMyBatches }) => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center py-16"
  >
    <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-3xl">
      <MaterialCommunityIcons
        name={isMyBatches ? "google-classroom" : "magnify"}
        size={32}
        color="#9ca3af"
      />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      {isMyBatches ? "No Batches Joined" : "No Available Batches"}
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      {isMyBatches
        ? "You haven't joined any batches yet. Explore available batches to join."
        : "There are no batches available to join at the moment."}
    </Text>
  </Animated.View>
);

// Join Batch Modal Component
const JoinBatchModal: React.FC<{
  visible: boolean;
  batch: AllBatchesForStudentsType | null;
  onClose: () => void;
  onJoin: (batchId: string, joiningCode: string) => void;
}> = ({ visible, batch, onClose, onJoin }) => {
  const [joiningCode, setJoiningCode] = useState("");

  const handleJoin = () => {
    if (!batch || !joiningCode.trim()) {
      Alert.alert("Error", "Please enter the batch joining code");
      return;
    }
    onJoin(batch._id, joiningCode.trim());
    setJoiningCode("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="items-center justify-center flex-1 px-6 bg-black/50">
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          className="w-full p-6 bg-white rounded-2xl"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg text-gray-800 font-outfit-semibold">
              Join Batch
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {batch && (
            <View className="p-4 mb-6 bg-teal-50 rounded-xl">
              <Text className="text-base text-teal-800 font-outfit-semibold">
                {batch.name}
              </Text>
              <Text className="mt-1 text-sm text-teal-600 font-outfit">
                Class {batch.standard} • {batch.teacher.name}
              </Text>
            </View>
          )}

          <View className="mb-6">
            <Text className="mb-2 text-sm text-gray-700 font-outfit-medium">
              Batch Joining Code
            </Text>
            <TextInput
              value={joiningCode}
              onChangeText={setJoiningCode}
              placeholder="Enter batch joining code"
              className="p-4 text-gray-800 bg-gray-50 rounded-xl font-outfit"
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
            />
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={onClose}
              className="items-center flex-1 p-4 bg-gray-100 rounded-xl"
            >
              <Text className="text-gray-700 font-outfit-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleJoin}
              className="items-center flex-1 p-4 bg-teal-500 rounded-xl"
            >
              <Text className="text-white font-outfit-semibold">Join Batch</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Header Component with Stats and Search
const ListHeader = ({
  batches,
  search,
  setSearch,
  activeTab,
  setActiveTab,
}: {
  batches: BatchForStudentType[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  activeTab: "my-batches" | "available";
  setActiveTab: React.Dispatch<React.SetStateAction<"my-batches" | "available">>;
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
  const totalStudents = batches.reduce((sum, batch) => sum + batch.studentCount, 0);

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
      {/* Tab Selector */}
      <View className="flex-row p-1 mb-4 bg-gray-100 rounded-2xl">
        <TouchableOpacity
          onPress={() => setActiveTab("my-batches")}
          className={`flex-1 py-3 rounded-xl items-center ${
            activeTab === "my-batches" ? "bg-white shadow-sm" : ""
          }`}
        >
          <Text
            className={`font-outfit-semibold ${
              activeTab === "my-batches" ? "text-teal-600" : "text-gray-500"
            }`}
          >
            My Batches
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("available")}
          className={`flex-1 py-3 rounded-xl items-center ${
            activeTab === "available" ? "bg-white shadow-sm" : ""
          }`}
        >
          <Text
            className={`font-outfit-semibold ${
              activeTab === "available" ? "text-teal-600" : "text-gray-500"
            }`}
          >
            Available Batches
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards - Only show for my batches */}
      {activeTab === "my-batches" && batches.length > 0 && (
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
          placeholder={
            activeTab === "my-batches"
              ? "Search your batches, teachers..."
              : "Search available batches..."
          }
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

// Main Component
const StudentBatchFlatList: React.FC = () => {
  const { token } = useUserStore();
  const {
    batchListForStudents,
    allBatches,
    getBatchListForStudent,
    getAllBatches,
    joinBatch,
    leaveBatch,
    isLoading,
  } = useBatchStore();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"my-batches" | "available">("my-batches");
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedBatchToJoin, setSelectedBatchToJoin] = useState<AllBatchesForStudentsType | null>(null);

  // Load data on component mount
  useEffect(() => {
    if (token) {
      getBatchListForStudent(token);
      getAllBatches(token);
    }
  }, [token]);

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

  const filteredAvailableBatches = (): AllBatchesForStudentsType[] => {
    if (search) {
      return allBatches.filter(
        (batch: AllBatchesForStudentsType) =>
          (batch.name &&
            batch.name.toLowerCase().includes(search.toLowerCase())) ||
          (batch.teacher &&
            batch.teacher.name &&
            batch.teacher.name.toLowerCase().includes(search.toLowerCase())) ||
          (batch.standard &&
            batch.standard.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return allBatches;
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

  // Handle join batch
  const handleJoinBatch = (batch: AllBatchesForStudentsType) => {
    setSelectedBatchToJoin(batch);
    setJoinModalVisible(true);
  };

  const handleConfirmJoin = async (batchId: string, joiningCode: string) => {
    if (token) {
      const success = await joinBatch({ batchId, batchJoiningCode: joiningCode }, token);
      if (success) {
        // Refresh available batches
        getAllBatches(token);
      }
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (token) {
      getBatchListForStudent(token);
      getAllBatches(token);
    }
  };

  const renderMyBatchItem = ({
  item,
  index,
}: {
  item: AllBatchesForStudentsType;
  index: number;
}) => (
  <StudentBatchItem
    item={item}
    index={index}
    onPress={handleMyBatchPress}
    onLeave={handleLeaveBatch}
  />
);

const renderAvailableBatchItem = ({
  item,
  index,
}: {
  item: AllBatchesForStudentsType;
  index: number;
}) => (
  <AvailableBatchItem
    item={item}
    index={index}
    onJoin={handleJoinBatch}
  />
);

  const keyExtractor = (item: BatchForStudentType | AllBatchesForStudentsType) => item._id;

  return (
    <View className="flex-1 px-5">
      <FlatList
        data={activeTab === "my-batches" ? filteredMyBatches() : filteredAvailableBatches()}
        renderItem={activeTab === "my-batches" ? renderMyBatchItem : renderAvailableBatchItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <ListHeader
            batches={batchListForStudents}
            search={search}
            setSearch={setSearch}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        }
        ListEmptyComponent={<EmptyState isMyBatches={activeTab === "my-batches"} />}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        // Pull to refresh functionality
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      />

      {/* Join Batch Modal */}
      <JoinBatchModal
        visible={joinModalVisible}
        batch={selectedBatchToJoin}
        onClose={() => {
          setJoinModalVisible(false);
          setSelectedBatchToJoin(null);
        }}
        onJoin={handleConfirmJoin}
      />
    </View>
  );
};

export default StudentBatchFlatList;