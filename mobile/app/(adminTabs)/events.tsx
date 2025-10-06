import { View, Text } from "react-native";
import React from "react";
import EventFlatList from "@/components/admin/EventsFlatList";

const Events = () => {
  return (
    <View className="flex-1">
      <EventFlatList />
    </View>
  );
};

export default Events;
