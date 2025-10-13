import StudentBatchFlatList from "@/components/students/StudentBatchFlatList";
import TeacherBatchList from "@/components/teachers/TeacherBatchList";
import { useUserStore } from "@/store/auth.store";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const batches = () => {
  const { type } = useLocalSearchParams();
  const { user } = useUserStore();
  return (
    <View className="flex-1">
      {user?.role === "student" ? (
        <StudentBatchFlatList type={type} />
      ) : (
        <TeacherBatchList />
      )}
    </View>
  );
};

export default batches;
