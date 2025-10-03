import SearchBox from "@/components/admin/SearchBox";
import StudentFeeDetails from "@/components/admin/StudentFeeDetails";
import React from "react";
import { View } from "react-native";

const FeeScreen = () => {
  return (
    <View className="flex-1">
      <SearchBox  />
      <StudentFeeDetails />
    </View>
  );
};

export default FeeScreen;
