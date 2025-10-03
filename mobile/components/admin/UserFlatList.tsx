import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";
import { AllUsersType, CountType } from "@/types";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
} from "react-native-reanimated";

// User Item Component
const UserItem: React.FC<{
  item: AllUsersType;
  index: number;
  onPress?: (user: AllUsersType) => void;
}> = ({ item, index, onPress }) => {
  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? "bg-emerald-100" : "bg-orange-100";
  };

  const getStatusIcon = (isVerified: boolean) => {
    return isVerified ? (
      <Feather name="check-circle" size={16} color="#10b981" />
    ) : (
      <Feather name="clock" size={16} color="#f97316" />
    );
  };

  const getStatusText = (isVerified: boolean) => {
    return isVerified ? "Verified" : "Pending";
  };

  const getAvatarColors = (index: number) => {
    const colors = [
      "bg-teal-400",
      "bg-indigo-400",
      "bg-pink-400",
      "bg-emerald-400",
      "bg-orange-400",
      "bg-violet-400",
      "bg-blue-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(500)
        .delay(index * 100)
        .springify()}
      layout={Layout.springify()}
      className="mb-4"
    >
      <View className="p-4 bg-white shadow-sm rounded-2xl shadow-gray-300 active:scale-98">
        <View className="flex-row items-center">
          {/* Avatar */}
          <View
            className={`w-14 h-14 ${getAvatarColors(index)} rounded-2xl items-center justify-center`}
          >
            <Text className="text-lg text-white font-outfit-bold">
              {item.name.charAt(0).toUpperCase() +
                item.name.split(" ")[1].charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* User Info */}
          <View className="flex-1 ml-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-800 font-outfit-semibold">
                {item.name}
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${getStatusColor(item.isVerified)} flex-row items-center`}
              >
                {getStatusIcon(item.isVerified)}
                <Text
                  className={`ml-1 text-xs font-outfit-medium ${
                    item.isVerified ? "text-emerald-700" : "text-orange-700"
                  }`}
                >
                  {getStatusText(item.isVerified)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center mr-4">
                <MaterialCommunityIcons
                  name="school-outline"
                  size={14}
                  color="#6b7280"
                />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  Class - {item.standard ? item.standard : "N/A"}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="card-outline" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  {item.UID}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            className="items-center justify-center w-10 h-10 ml-2 bg-teal-50 rounded-xl"
            onPress={() => onPress?.(item)}
          >
            <Feather name="chevron-right" size={20} color="#14b8a6" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center py-16"
  >
    <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-3xl">
      <Feather name="users" size={32} color="#9ca3af" />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      No Users Found
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      There are no users to display at the moment.
    </Text>
  </Animated.View>
);

// Header Component
const ListHeader = ({
  count,
  search,
  setSearch,
}: {
  count: CountType;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const CountArray = [
    {
      count: count.totalUserCount,
      name: "Users",
      icon: "people-outline",
      color: "bg-teal-400",
    },
    {
      count: count.studentCount,
      name: "Students",
      icon: "school",
      color: "bg-pink-400",
    },
    {
      count: count.teacherCount,
      name: "Teachers",
      icon: "medal-outline",
      color: "bg-indigo-400",
    },
    {
      count: count.verifiedCount,
      name: "Verified",
      icon: "shield",
      color: "bg-emerald-400",
    },
  ];
  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="mb-4"
    >
      <FlatList
        data={CountArray}
        className="mt-2"
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-4 mr-3 bg-teal-50 rounded-2xl min-w-56">
            <View>
              <Text className="text-lg text-teal-800 font-outfit-bold">
                {item.name}
              </Text>
              <Text className="text-sm text-teal-600 font-outfit">
                {item.count} {item.count === 1 ? "user" : "users"}{" "}
                {item.name.toLowerCase()}
              </Text>
            </View>
            <View
              className={`items-center justify-center w-12 h-12 ${item.color} rounded-2xl`}
            >
              <Ionicons name={item.icon as any} size={24} color="white" />
            </View>
          </View>
        )}
      />
      {/* Divider */}
      <View className="h-0.5 my-2 bg-gray-200" />
      {/* Search Icon */}
      <View className="flex-row items-center py-1.5 px-4 bg-teal-50 rounded-2xl">
        <Ionicons name="search-outline" size={24} color="#14b8a6" />
        <TextInput
          placeholder="Search batches, teachers, or classes..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-3 text-sm text-gray-600 font-outfit"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// Main Component
const UserFlatList: React.FC = () => {
  const { users, count, getUserById } = useAdminStore();
  const { token } = useUserStore();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredUsers = () => {
    if (search) {
      return users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.UID.toLowerCase().includes(search.toLowerCase())
      );
    }
    return users;
  };

  // Handle user long press
  const handleUserPress = async (user: AllUsersType) => {
    await getUserById(user._id, token!).then((res) => {
      if (res) router.push("/(adminTabs)/fee");
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: AllUsersType;
    index: number;
  }) => <UserItem item={item} index={index} onPress={handleUserPress} />;

  const keyExtractor = (item: AllUsersType) => item._id;

  const getItemLayout = (_: any, index: number) => ({
    length: 88, // Approximate height of each item
    offset: 88 * index,
    index,
  });

  return (
    <View className="flex-1 px-5">
      <FlatList
        data={filteredUsers()}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <ListHeader count={count} search={search} setSearch={setSearch} />
        }
        ListEmptyComponent={<EmptyState />}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        // Pull to refresh functionality (optional)
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
      />
    </View>
  );
};

export default UserFlatList;
