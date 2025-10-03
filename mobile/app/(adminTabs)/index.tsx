import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";
import UserFlatList from "@/components/admin/UserFlatList";

const AdminPanel = () => {
  const { token } = useUserStore();
  const { getAllUsers } = useAdminStore();
  useEffect(() => {
    getAllUsers(token as string);
  }, []);
  return (
    <View className="flex-1">
      <UserFlatList />
    </View>
  );
};

export default AdminPanel;
