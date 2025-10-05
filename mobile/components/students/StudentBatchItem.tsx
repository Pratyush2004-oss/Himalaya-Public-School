import { BatchForStudentType } from "@/types";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight, Layout } from "react-native-reanimated";

// Student Batch Item Component
const StudentBatchItem: React.FC<{
  item: BatchForStudentType;
  index: number;
  onPress?: (batch: BatchForStudentType) => void;
  onLeave?: (batch: BatchForStudentType) => void;
}> = ({ item, index, onPress, onLeave }) => {
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

  const getBatchIcon = (standard: string) => {
    const standardNum = parseInt(standard);
    if (standardNum <= 5) return "book-outline";
    if (standardNum <= 8) return "library-outline";
    if (standardNum <= 10) return "school-outline";
    return "trophy-outline";
  };

  const getStandardBadgeColor = (standard: string) => {
    const standardNum = parseInt(standard);
    if (standardNum <= 5) return "bg-blue-100 text-blue-700";
    if (standardNum <= 8) return "bg-purple-100 text-purple-700";
    if (standardNum <= 10) return "bg-green-100 text-green-700";
    return "bg-orange-100 text-orange-700";
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(500)
        .delay(index * 100)
        .springify()}
      layout={Layout.springify()}
      className="mb-4"
    >
      <TouchableOpacity
        onPress={() => onPress?.(item)}
        className="p-4 bg-white shadow-sm rounded-2xl shadow-gray-300 active:scale-98"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center">
          {/* Batch Avatar */}
          <View
            className={`w-14 h-14 ${getAvatarColors(index)} rounded-2xl items-center justify-center`}
          >
            <Ionicons
              name={getBatchIcon(item.standard) as any}
              size={24}
              color="white"
            />
          </View>

          {/* Batch Info */}
          <View className="flex-1 ml-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-800 font-outfit-semibold">
                {item.name}
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${getStandardBadgeColor(item.standard)} flex-row items-center`}
              >
                <MaterialCommunityIcons name="school" size={12} />
                <Text className={`ml-1 text-xs font-outfit-medium`}>
                  Class {item.standard}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center">
                <Feather name="user" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  {item.teacher.name}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={14} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-outfit-medium">
                  {item.studentCount} students
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center ml-2">
            <TouchableOpacity
              className="items-center justify-center w-10 h-10 mr-2 bg-red-50 rounded-xl"
              onPress={() => onLeave?.(item)}
            >
              <Feather name="log-out" size={18} color="#ef4444" />
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center w-10 h-10 bg-teal-50 rounded-xl"
              onPress={() => onPress?.(item)}
            >
              <Feather name="chevron-right" size={20} color="#14b8a6" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default StudentBatchItem;