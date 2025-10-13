import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect } from "react";
import { View } from "react-native";
import AvailableBatchList from "./AvailableBatchList";
import StudentBatchList from "./StudentBatchList";

const Tab = createMaterialTopTabNavigator();

// Main Component
type StudentBatchFlatListProps = { type: string | string[] };

const StudentBatchFlatList: React.FC<StudentBatchFlatListProps> = ({
  type,
}) => {
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
    <View className="flex-1 pt-4">
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#0d9488", // teal-600
          tabBarInactiveTintColor: "#6b7280", // gray-500
          tabBarLabelStyle: {
            fontFamily: "Outfit-SemiBold",
            fontSize: 14,
            textTransform: "capitalize",
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#0d9488", // teal-600
            height: 3,
            borderRadius: 3,
          },
          tabBarStyle: {
            backgroundColor: "transparent",
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
            marginBottom: 16,
            marginHorizontal: 20,
          },
          // This ensures the swipe gesture doesn't interfere with horizontal FlatLists
          swipeEnabled: true,
        }}
      >
        {type === "Available" ? (
          <>
            <Tab.Screen name="Available" component={AvailableBatchList} />
            <Tab.Screen name="My Batches" component={StudentBatchList} />
          </>
        ) : (
          <>
            <Tab.Screen name="My Batches" component={StudentBatchList} />
            <Tab.Screen name="Available" component={AvailableBatchList} />
          </>
        )}
      </Tab.Navigator>
    </View>
  );
};

export default StudentBatchFlatList;
