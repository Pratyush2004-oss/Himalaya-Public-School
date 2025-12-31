import { View } from "react-native";
import React from "react";
import TabHeader from "@/components/shared/TabHeader";
import EditProfileSection from "@/components/editProfile/EditProfileSection";

const EditProfilePage = () => {
  return (
    <View className="flex-1">
      <TabHeader />
      <EditProfileSection />
    </View>
  );
};

export default EditProfilePage;