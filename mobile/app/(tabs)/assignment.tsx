import { View, Text } from "react-native";
import React from "react";
import TodaysAssignment from "@/components/students/TodaysAssignment";
import CreateAssignmentScreen from "@/components/teachers/CreateAssignmentScreen";
import { useUserStore } from "@/store/auth.store";
const Assignment = () => {
  const { user } = useUserStore();
  return user && (
    <View className="flex-1">
      {user.role === "student" ? (
        <TodaysAssignment />
      ) : (
        <CreateAssignmentScreen />
      )}
    </View>
  );
};

export default Assignment;
