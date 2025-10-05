import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";
import { AllBatchesForStudentsType } from "@/types";
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
import Animated, { FadeInDown } from "react-native-reanimated";
import AvailableBatchItem from "./AvailableBatchItem";
import JoinBatchModal from "./JoinBatchModal";

// Empty State Component
const EmptyState = () => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center py-16"
  >
    <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-3xl">
      <MaterialCommunityIcons name={"magnify"} size={32} color="#9ca3af" />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      {"No Available Batches"}
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      {"There are no batches available to join at the moment."}
    </Text>
  </Animated.View>
);

// Header Component with Stats and Search
const ListHeader = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="mb-4"
    >
      {/* Search Bar */}
      <View className="flex-row items-center py-1.5 px-4 bg-teal-50 rounded-2xl">
        <Ionicons name="search-outline" size={24} color="#14b8a6" />
        <TextInput
          placeholder={"Search available batches..."}
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

// main component
const AvailableBatchList = () => {
  const [search, setSearch] = useState("");
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedBatchToJoin, setSelectedBatchToJoin] =
    useState<AllBatchesForStudentsType | null>(null);
  const { isLoading, allBatches, getAllBatches, joinBatch } = useBatchStore();
  const { token } = useUserStore();

  //   get the filtered batches
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

  // Handle join batch
  const handleJoinBatch = (batch: AllBatchesForStudentsType) => {
    setSelectedBatchToJoin(batch);
    setJoinModalVisible(true);
  };

  // Handle confirm join
  const handleConfirmJoin = async (batchId: string, joiningCode: string) => {
    if (token) {
      const success = await joinBatch(
        { batchId, batchJoiningCode: joiningCode },
        token
      );
      if (success) {
        // Refresh available batches
        getAllBatches(token);
      }
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (token) {
      getAllBatches(token);
    }
  };

  const renderAvailableBatchItem = ({
    item,
    index,
  }: {
    item: AllBatchesForStudentsType;
    index: number;
  }) => (
    <AvailableBatchItem item={item} index={index} onJoin={handleJoinBatch} />
  );
  return (
    <>
      <FlatList
        data={filteredAvailableBatches()}
        renderItem={renderAvailableBatchItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <ListHeader search={search} setSearch={setSearch} />
        }
        ListEmptyComponent={<EmptyState />}
        removeClippedSubviews={true}
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
    </>
  );
};

export default AvailableBatchList;