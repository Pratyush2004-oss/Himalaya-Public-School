import BackHeader from "@/components/shared/BackHeader";
import NotificationList from "@/components/shared/NotificationList";
import React from "react";
import { View } from "react-native";

const index = () => {
  return (
    <View className="flex-1">
      <BackHeader
        title="Notifications"
        backgroundColor="gradient"
        subtitle="Stay updated with the latest school announcements"
      />
      <NotificationList />
    </View>
  );
};

export default index;
