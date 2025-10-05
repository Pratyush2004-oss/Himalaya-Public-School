import BatchStudentList from "@/components/teachers/BatchStudentsFlatList";
import { useBatchStore } from "@/store/batch.store";
import { useUserStore } from "@/store/auth.store";
import { BatchForTeacherType, removeStudentFromBatchInputType } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import BackHeader from "@/components/shared/BackHeader";

// --- UI Components ---

// Batch Header Component
const BatchHeader: React.FC<{ batch: BatchForTeacherType }> = ({ batch }) => {
  const onCopy = (code: string) => {
    Clipboard.setString(code);
    Alert.alert("Copied!", "Batch joining code has been copied to clipboard.");
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="p-5 m-5 mb-0 bg-white shadow-sm rounded-2xl"
    >
      {/* Batch Name and Standard */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-2xl text-gray-800 font-outfit-bold">
            {batch.name}
          </Text>
          <Text className="mt-1 text-base text-gray-500 font-outfit">
            Class {batch.standard}
          </Text>
        </View>
        <View className="flex-row items-center p-2 px-3 ml-2 bg-teal-50 rounded-xl">
          <Feather name="users" size={16} color="#14b8a6" />
          <Text className="ml-2 text-base text-teal-800 font-outfit-semibold">
            {batch.studentCount}
          </Text>
        </View>
      </View>

      {/* Batch Joining Code */}
      {batch.batchJoiningCode && (
        <View className="p-4 mt-4 bg-gray-50 rounded-2xl">
          <Text className="mb-2 text-sm text-gray-500 font-outfit">
            Batch Joining Code
          </Text>
          <View className="flex-row items-center justify-between">
            <Text
              className="text-lg tracking-widest text-gray-800 font-outfit-bold"
              selectable
            >
              {batch.batchJoiningCode}
            </Text>
            <TouchableOpacity
              onPress={() => onCopy(batch.batchJoiningCode!)}
              className="items-center justify-center w-10 h-10 bg-teal-100 rounded-xl"
            >
              <Ionicons name="copy-outline" size={20} color="#0d9488" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

// --- Main Screen Component ---
const BatchDetails = () => {
  const {
    getBatchStudents,
    selectedBatch,
    isLoading,
    batchStudentList,
    removeStudentFromBatch,
  } = useBatchStore();
  const { token } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = () => {
    if (token && selectedBatch) {
      getBatchStudents(token);
    }
  };
  const [input] = useState<removeStudentFromBatchInputType>({
    batchId: selectedBatch?._id as string,
    studentId: "",
  });

  useEffect(() => {
    fetchData();
  }, [token, selectedBatch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    fetchData();
    setIsRefreshing(false);
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (token && selectedBatch) {
      await removeStudentFromBatch({ ...input, studentId }, token as string);
    }
  };

  if (!selectedBatch) {
    return (
      <>
        <BackHeader title="Batch Details" backgroundColor="gradient" />
        <View className="items-center justify-center flex-1">
          <Text className="text-gray-500 font-outfit">No batch selected.</Text>
        </View>
      </>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <BackHeader title="Batch Details" backgroundColor="gradient" />
      {/* Batch Details Header */}
      <BatchHeader batch={selectedBatch} />

      {/* Student List */}
      {isLoading && !isRefreshing ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#14b8a6" />
        </View>
      ) : (
        <BatchStudentList
          batchStudentList={batchStudentList}
          onRemoveStudent={handleRemoveStudent}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      )}
    </View>
  );
};

export default BatchDetails;
