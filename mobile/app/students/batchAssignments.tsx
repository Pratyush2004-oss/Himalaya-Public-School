import BackHeader from "@/components/shared/BackHeader";
import BatchAssignments from "@/components/students/BatchAssignments";
import React from "react";
import { View } from "react-native";

const batchAssignments = () => {
  return (
    <View className="flex-1">
        <BackHeader title="Batch Assignments" backgroundColor="gradient" />
      <BatchAssignments />
    </View>
  );
};

export default batchAssignments;
