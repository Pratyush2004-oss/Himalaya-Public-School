import BatchFlatList from "@/components/admin/BatchFlatList";
import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";
import React, { useEffect } from "react";
import { View } from "react-native";

const Batches = () => {
  const { getAllBatches } = useAdminStore();
  const { token } = useUserStore();
  useEffect(() => {
    getAllBatches(token as string);
  }, []);
  return (
    <View className="flex-1">
      <BatchFlatList />
    </View>
  );
};

export default Batches;
