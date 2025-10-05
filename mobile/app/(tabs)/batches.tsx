import StudentBatchFlatList from "@/components/students/StudentBatchFlatList";
import TeacherBatchList from "@/components/teachers/TeacherBatchList";
import { useUserStore } from "@/store/auth.store";
import React from "react";
import { View } from "react-native";

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
