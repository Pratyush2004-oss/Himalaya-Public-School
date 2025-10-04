import { View, Text } from "react-native";
import React from "react";
import { useUserStore } from "@/store/auth.store";
import StudentBatchFlatList from "@/components/students/StudentBatchFlatList";
import TeacherBatchList from "@/components/teachers/TeacherBatchList";

const batches = () => {
  const { user } = useUserStore();
  return (
    <View className="flex-1">
      {user?.role === "student" ? (
        <StudentBatchFlatList />
      ) : (
        <TeacherBatchList />
      )}
    </View>
  );
};

export default batches;
