import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AvailableBatchList from "./AvailableBatchList";
import StudentBatchList from "./StudentBatchList";

// Main Component
const StudentBatchFlatList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"my-batches" | "available">(
    "my-batches"
  );
  const { token } = useUserStore();
  const { getAllBatches, getBatchListForStudent } = useBatchStore();

  // Load data on component mount
  useEffect(() => {
    if (token) {
      getBatchListForStudent(token);
      getAllBatches(token);
    }
  }, [token]);
  return (
    <View className="flex-1 px-5 pt-4">
      <View className="flex-row p-1 mb-4 bg-gray-100 rounded-2xl">
        <TouchableOpacity
          onPress={() => setActiveTab("my-batches")}
          className={`flex-1 py-3 rounded-xl items-center ${
            activeTab === "my-batches" ? "bg-white shadow-sm" : ""
          }`}
        >
          <Text
            className={`font-outfit-semibold ${
              activeTab === "my-batches" ? "text-teal-600" : "text-gray-500"
            }`}
          >
            My Batches
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("available")}
          className={`flex-1 py-3 rounded-xl items-center ${
            activeTab === "available" ? "bg-white shadow-sm" : ""
          }`}
        >
          <Text
            className={`font-outfit-semibold ${
              activeTab === "available" ? "text-teal-600" : "text-gray-500"
            }`}
          >
            Available Batches
          </Text>
        </TouchableOpacity>
      </View>

      {
        // Conditional Rendering
        activeTab === "my-batches" ? (
          <StudentBatchList />
        ) : (
          <AvailableBatchList />
        )
      }
    </View>
  );
};

export default StudentBatchFlatList;