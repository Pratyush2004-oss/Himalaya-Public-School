import { useBatchStore } from "@/store/batch.store";
import { BatchForTeacherType, CreateAssignmentInputType } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Modal Item for selecting a batch
const BatchSelectItem: React.FC<{
  item: BatchForTeacherType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ item, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(item._id)}
      className="flex-row items-center p-4 mb-3 bg-white border border-gray-100 rounded-2xl"
      activeOpacity={0.7}
    >
      <View
        className={`w-6 h-6 rounded-lg items-center justify-center mr-4 ${
          isSelected ? "bg-teal-500" : "bg-gray-200"
        }`}
      >
        {isSelected && <Feather name="check" size={16} color="white" />}
      </View>
      <View className="flex-1">
        <Text className="text-base text-gray-800 font-outfit-semibold">
          {item.name}
        </Text>
        <Text className="mt-1 text-sm text-gray-500 font-outfit">
          Class {item.standard}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Main Component
const BatchPicker = ({
  input,
  setInput,
}: {
  input: CreateAssignmentInputType;
  setInput: React.Dispatch<React.SetStateAction<CreateAssignmentInputType>>;
}) => {
  const { batchListForTeacher } = useBatchStore();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectBatch = (itemValue: string) => {
    if (input.batchIds.includes(itemValue)) {
      setInput({
        ...input,
        batchIds: input.batchIds.filter((id) => id !== itemValue),
      });
    } else {
      setInput({
        ...input,
        batchIds: [...input.batchIds, itemValue],
      });
    }
  };

  const handleRemove = (itemValue: string) => {
    setInput({
      ...input,
      batchIds: input.batchIds.filter((id) => id !== itemValue),
    });
  };

  const selectedBatches = batchListForTeacher.filter((batch) =>
    input.batchIds.includes(batch._id)
  );

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="mt-5"
    >
      {/* --- Main Input Trigger --- */}
      <View className="px-5">
        <Text className="mb-2 text-base text-gray-700 font-outfit-semibold">
          Select Batches
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-2xl"
          activeOpacity={0.7}
        >
          <Text
            className={`font-outfit ${
              selectedBatches.length > 0 ? "text-gray-800" : "text-gray-400"
            }`}
          >
            {selectedBatches.length > 0
              ? `${selectedBatches.length} batch(es) selected`
              : "Tap to select batches"}
          </Text>
          <Feather name="chevron-down" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* --- Selected Batches List --- */}
      {selectedBatches.length > 0 && (
        <FlatList
          className="py-4"
          horizontal
          showsHorizontalScrollIndicator={false}
          data={selectedBatches}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInRight.duration(300).delay(index * 50)}
              layout={Layout.springify()}
              className="flex-row items-center p-3 mr-3 bg-teal-50 rounded-xl"
            >
              <Text className="mr-3 text-sm text-teal-800 font-outfit-medium">
                {item.name}
              </Text>
              <Pressable onPress={() => handleRemove(item._id)}>
                <Ionicons name="close-circle" size={20} color="#14b8a6" />
              </Pressable>
            </Animated.View>
          )}
        />
      )}

      {/* --- Selection Modal --- */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-row items-center justify-between p-5 border-b border-gray-200">
            <Text className="text-xl text-gray-800 font-outfit-bold">
              Select Batches
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="#374151" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={batchListForTeacher}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 20 }}
            renderItem={({ item }) => (
              <BatchSelectItem
                item={item}
                isSelected={input.batchIds.includes(item._id)}
                onSelect={handleSelectBatch}
              />
            )}
            ListEmptyComponent={
              <View className="items-center justify-center flex-1 mt-20">
                <Text className="text-gray-500 font-outfit">
                  No batches available.
                </Text>
              </View>
            }
          />
          <View className="p-5 border-t border-gray-200">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="items-center justify-center p-4 bg-teal-500 rounded-2xl"
            >
              <Text className="text-base text-white font-outfit-semibold">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </Animated.View>
  );
};

export default BatchPicker;
