import { useBatchStore } from "@/store/batch.store";
import { useUserStore } from "@/store/auth.store";
import { Add_To_BatchInputType, StudentType } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// --- UI Components ---

// Student Item for Selection
const StudentSelectItem: React.FC<{
  item: StudentType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ item, isSelected, onSelect }) => (
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
        UID: {item.UID}
      </Text>
    </View>
  </TouchableOpacity>
);

// Empty State Component
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <View className="items-center justify-center flex-1 py-16">
    <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-3xl">
      <Feather name="users" size={32} color="#9ca3af" />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      No Students Found
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      {message}
    </Text>
  </View>
);

// --- Main Modal Component ---
const AddStudentsToBatchModal: React.FC<{
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}> = ({ modalVisible, setModalVisible }) => {
  const { token } = useUserStore();
  const {
    allStudentsForBatch,
    selectedBatch,
    addStudentsToBatch,
    getAllStudentsForBatch,
  } = useBatchStore();

  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    if (modalVisible && token) {
      // Fetch all students if not already present
      getAllStudentsForBatch(token).finally(() => setisLoading(false));
    }
  }, [modalVisible, token]);

  // Memoize the list of available students to prevent recalculation on every render
  const [input, setInput] = useState<Add_To_BatchInputType>({
    batchId: selectedBatch?._id as string,
    studentIds: [],
  });

  const handleSelectStudent = (studentId: string) => {
    if (input.studentIds.includes(studentId)) {
      setInput((prevInput) => ({
        ...prevInput,
        studentIds: prevInput.studentIds.filter((id) => id !== studentId),
      }));
    } else {
      setInput((prevInput) => ({
        ...prevInput,
        studentIds: [...prevInput.studentIds, studentId],
      }));
    }
  };

  // get filtered students
  const filteredStudents = () => {
    if (search) {
      return allStudentsForBatch.filter(
        (student) =>
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.UID.toLowerCase().includes(search.toLowerCase())
      );
    }
    return allStudentsForBatch;
  };

  // close modal
  const closeModal = () => {
    setSearch("");
    setInput({ batchId: selectedBatch?._id as string, studentIds: [] });
    setModalVisible(false);
  };

  // handle add students
  const handleAddStudents = async () => {
    if (!token || input.studentIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await addStudentsToBatch(input, token);
      closeModal();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  // handle refresh
  const refreshData = () => {
    setisLoading(true);
    getAllStudentsForBatch(token as string).finally(() => setisLoading(false));
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between p-5 border-b border-gray-200">
          <Text className="text-xl text-gray-800 font-outfit-bold">
            Add Students to Batch
          </Text>
          <TouchableOpacity onPress={closeModal}>
            <Ionicons name="close" size={28} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.duration(400).springify()}
          className="p-5 pt-3"
        >
          <View className="flex-row items-center py-1.5 px-4 bg-white border border-gray-200 rounded-2xl">
            <Ionicons name="search-outline" size={24} color="#14b8a6" />
            <TextInput
              placeholder="Search by name or email..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-3 text-sm text-gray-600 font-outfit"
            />
          </View>
        </Animated.View>

        {/* Student List */}
        {isLoading &&
        allStudentsForBatch &&
        allStudentsForBatch.length === 0 ? (
          <ActivityIndicator size="large" color="#14b8a6" className="my-auto" />
        ) : (
          <FlatList
            data={filteredStudents()}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <StudentSelectItem
                item={item}
                isSelected={input.studentIds.includes(item._id)}
                onSelect={() => handleSelectStudent(item._id)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
            }
            ListEmptyComponent={
              <EmptyState message="All students are already in this batch or your search found no results." />
            }
          />
        )}

        {/* Footer Button */}
        <View className="p-5 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleAddStudents}
            disabled={input.studentIds.length === 0 || isSubmitting}
            className={`flex-row items-center justify-center p-4 rounded-2xl ${
              input.studentIds.length === 0 || isSubmitting
                ? "bg-teal-200"
                : "bg-teal-500"
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base text-white font-outfit-semibold">
                Add {input.studentIds.length} Student(s)
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddStudentsToBatchModal;
