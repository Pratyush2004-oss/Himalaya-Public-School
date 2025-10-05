import { StudentType } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
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
import AddStudentsToBatchModal from "./AddStudentsToBatchModal";

// --- UI Components ---

// Student Item Component
const StudentItem: React.FC<{
  item: StudentType;
  index: number;
  onRemove: (studentId: string) => void;
}> = ({ item, index, onRemove }) => {
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

  const handleRemovePress = () => {
    Alert.alert(
      "Remove Student",
      `Are you sure you want to remove ${item.name} from this batch?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onRemove(item._id),
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
      className="p-4 mb-4 bg-white shadow-sm rounded-2xl"
    >
      <View className="flex-row items-center">
        {/* Avatar */}
        <View
          className={`w-14 h-14 ${getAvatarColors(
            index
          )} rounded-2xl items-center justify-center`}
        >
          <Text className="text-lg text-white font-outfit-bold">
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Student Info */}
        <View className="flex-1 ml-4">
          <Text className="text-base text-gray-800 font-outfit-semibold">
            {item.name}
          </Text>
          <Text className="mt-1 text-sm text-gray-500 font-outfit">
            {item.email}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="card-outline" size={14} color="#6b7280" />
            <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
              {item.UID}
            </Text>
          </View>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          className="items-center justify-center w-10 h-10 ml-2 bg-red-50 rounded-xl"
          onPress={handleRemovePress}
        >
          <Feather name="trash-2" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
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
      <Feather name="user-x" size={32} color="#9ca3af" />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      No Students Found
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      There are no students in this batch yet.
    </Text>
  </Animated.View>
);

// Header Component
const ListHeader = ({
  studentCount,
  search,
  setSearch,
}: {
  studentCount: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [openDialog, setopenDialog] = useState(false);
  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="mb-4"
    >
      <View className="flex-row items-center justify-between px-5">
        <Text className="mb-4 text-lg text-gray-800 font-outfit-bold">
          {studentCount} {studentCount === 1 ? "Student" : "Students"} in Batch
        </Text>
        <Pressable
          className="mb-4 bg-teal-400 rounded-full p-0.5"
          onPress={() => setopenDialog(true)}
        >
          <Ionicons name="add-circle-outline" size={30} color="white" />
        </Pressable>
      </View>
      <View className="flex-row items-center py-1.5 px-4 bg-teal-50 rounded-2xl">
        <Ionicons name="search-outline" size={24} color="#14b8a6" />
        <TextInput
          placeholder="Search by name or UID..."
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

      {openDialog && (
        <AddStudentsToBatchModal
          modalVisible={openDialog}
          setModalVisible={setopenDialog}
        />
      )}
    </Animated.View>
  );
};

// Main Component
const BatchStudentList: React.FC<{
  batchStudentList: StudentType[];
  onRemoveStudent: (studentId: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}> = ({ batchStudentList, onRemoveStudent, onRefresh, isRefreshing }) => {
  const [search, setSearch] = useState("");

  const filteredStudents = () => {
    if (search) {
      return batchStudentList.filter(
        (student) =>
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.UID.toLowerCase().includes(search.toLowerCase())
      );
    }
    return batchStudentList;
  };

  return (
    <View className="flex-1 px-5 pt-4">
      <FlatList
        data={filteredStudents()}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => (
          <StudentItem item={item} index={index} onRemove={onRemoveStudent} />
        )}
        ListHeaderComponent={
          <ListHeader
            studentCount={batchStudentList.length}
            search={search}
            setSearch={setSearch}
          />
        }
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default BatchStudentList;
