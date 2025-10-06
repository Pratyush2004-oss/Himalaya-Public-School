import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";
import { AllUsersType, FeeType } from "@/types";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  Layout,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Fee Item Component
const FeeItem: React.FC<{
  isLoading: boolean;
  item: FeeType;
  index: number;
  onVerify?: (fee: FeeType) => void;
}> = ({ item, index, onVerify, isLoading }) => {
  const cardScale = useSharedValue(1);

  const getStatusColor = (paid: boolean) => {
    return paid
      ? "bg-emerald-100 text-emerald-700"
      : "bg-orange-100 text-orange-700";
  };

  const getStatusIcon = (paid: boolean) => {
    return paid ? (
      <Feather name="check-circle" size={16} color="#10b981" />
    ) : (
      <Feather name="clock" size={16} color="#f97316" />
    );
  };

  const getPaymentModeIcon = (mode: string) => {
    switch (mode && mode.toLowerCase()) {
      case "online":
        return <MaterialIcons name="payment" size={16} color="#6366f1" />;
      case "cash":
        return <MaterialIcons name="money" size={16} color="#059669" />;
      case "cheque":
        return <MaterialIcons name="receipt" size={16} color="#dc2626" />;
      default:
        return <MaterialIcons name="payment" size={16} color="#6b7280" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handlePress = () => {
    cardScale.value = withSpring(0.98, { duration: 100 }, () => {
      cardScale.value = withSpring(1);
    });
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(500)
        .delay(index * 100)
        .springify()}
      layout={Layout.springify()}
      className="mb-4"
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={handlePress}
          className="p-4 bg-white shadow-sm rounded-2xl shadow-gray-300"
          activeOpacity={0.9}
        >
          {/* Header Row */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="items-center justify-center w-12 h-12 mr-3 bg-teal-100 rounded-2xl">
                <MaterialIcons name="receipt-long" size={24} color="#14b8a6" />
              </View>
              <View>
                <Text className="text-lg text-gray-800 font-outfit-bold">
                  {formatAmount(item.amount)}
                </Text>
                <Text className="text-sm text-gray-600 font-outfit">
                  Fee Payment
                </Text>
              </View>
            </View>

            <View
              className={`px-3 py-1 rounded-full ${getStatusColor(item.paid)} flex-row items-center`}
            >
              {getStatusIcon(item.paid)}
              <Text className="ml-1 text-xs font-outfit-medium">
                {item.paid ? "Paid" : "Pending"}
              </Text>
            </View>
          </View>

          {/* Payment Details */}
          <View className="space-y-2">
            {/* Payment Mode */}
            <View className="flex-row items-center">
              {getPaymentModeIcon(item.mode)}
              <Text className="ml-2 text-sm text-gray-600 font-outfit-medium">
                Payment Mode:
              </Text>
              <Text className="ml-1 text-sm text-gray-800 capitalize font-outfit-semibold">
                {item.mode ? item.mode : "Unpaid"}
              </Text>
              <Text className="ml-auto text-sm text-gray-600 font-outfit-medium">
                <Ionicons name="time-outline" size={12} color="#6b7280" />
                Month:
              </Text>
              <Text className="ml-1 text-sm capitalize text-emerald-600 font-outfit-semibold">
                {item.month}
              </Text>
            </View>

            {/* Transaction Details */}
            {item.paid && item.transactionDetail && (
              <>
                <View className="flex-row items-center">
                  <Feather name="hash" size={14} color="#6b7280" />
                  <Text className="ml-2 text-sm text-gray-600 font-outfit">
                    Order ID:
                  </Text>
                  <Text className="ml-1 text-sm text-gray-800 font-outfit-medium">
                    {item.transactionDetail.order_id}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Feather name="credit-card" size={14} color="#6b7280" />
                  <Text className="ml-2 text-sm text-gray-600 font-outfit">
                    Payment ID:
                  </Text>
                  <Text className="ml-1 text-sm text-gray-800 font-outfit-medium">
                    {item.transactionDetail.payment_id}
                  </Text>
                </View>
              </>
            )}

            {/* Payment Date */}
            {item.paid && item.paidAt && (
              <View className="flex-row items-center">
                <Feather name="calendar" size={14} color="#6b7280" />
                <Text className="ml-2 text-sm text-gray-600 font-outfit">
                  Paid on:
                </Text>
                <Text className="ml-1 text-sm text-gray-800 font-outfit-medium">
                  {formatDate(item.paidAt)}
                </Text>
              </View>
            )}
          </View>

          {/* Action Button for Pending Payments */}
          {!item.paid && onVerify && (
            <View className="pt-3 mt-4 border-t border-gray-100">
              <TouchableOpacity
                onPress={() => onVerify(item)}
                className="flex-row items-center justify-center px-4 py-2 bg-teal-50 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#14b8a6" />
                ) : (
                  <>
                    <Feather name="check" size={16} color="#14b8a6" />
                    <Text className="ml-2 text-sm text-teal-600 font-outfit-semibold">
                      Mark as Paid
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Student Info Card Component
const StudentInfoCard: React.FC<{ user: AllUsersType }> = ({ user }) => {
  const getAvatarColor = () => {
    const colors = [
      "bg-red-400",
      "bg-indigo-400",
      "bg-pink-400",
      "bg-teal-400",
      "bg-orange-400",
      "bg-violet-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(600).springify()}
      className="mb-6"
    >
      <LinearGradient
        colors={["#14b8a6", "#2dd4bf"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{ borderRadius: 20 }}
        className="p-6"
      >
        <View className="flex-row items-center">
          <View
            className={`w-16 h-16 ${getAvatarColor()} rounded-2xl items-center justify-center mr-4`}
          >
            <Text className="text-xl text-white font-outfit-bold">
              {user.name.charAt(0).toUpperCase()}
              {user.name.split(" ")[1]
                ? user.name.split(" ")[1].charAt(0).toUpperCase()
                : ""}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="mb-1 text-xl text-white font-outfit-bold">
              {user.name}
            </Text>
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="school" size={16} color="white" />
              <Text className="ml-2 text-sm font-outfit-bold text-white/90">
                Class: {user.standard ? user.standard : "N/A"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={16} color="white" />
              <Text className="ml-2 text-sm font-outfit-semibold text-white/90">
                UID: {user.UID}
              </Text>
            </View>
          </View>

          <View
            className={`px-3 py-1 rounded-full ${
              user.isVerified ? "bg-white/20" : "bg-orange-400/70"
            } flex-row items-center rounded-2xl`}
          >
            <Feather
              name={user.isVerified ? "check-circle" : "clock"}
              size={14}
              color="white"
            />
            <Text className="ml-1 text-xs text-white font-outfit-medium">
              {user.isVerified ? "Verified" : "Pending"}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Fee Summary Component
const FeeSummary: React.FC<{ feeDetails: FeeType[] }> = ({ feeDetails }) => {
  const totalAmount = feeDetails.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount = feeDetails
    .filter((fee) => fee.paid)
    .reduce((sum, fee) => sum + fee.amount, 0);
  const pendingAmount = totalAmount - paidAmount;
  const paidCount = feeDetails.filter((fee) => fee.paid).length;
  const pendingCount = feeDetails.length - paidCount;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const summaryData = [
    {
      title: "Total Amount",
      value: formatAmount(totalAmount),
      icon: "dollar-sign",
      color: "bg-blue-400",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "Paid Amount",
      value: formatAmount(paidAmount),
      icon: "check-circle",
      color: "bg-emerald-400",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Pending Amount",
      value: formatAmount(pendingAmount),
      icon: "clock",
      color: "bg-orange-400",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
    },
    {
      title: "Transactions",
      value: `${paidCount}/${feeDetails.length}`,
      icon: "list",
      color: "bg-purple-400",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <Animated.View
      entering={FadeInDown.duration(600).delay(200).springify()}
      className="mb-6"
    >
      <Text className="mb-4 text-lg text-gray-800 font-outfit-bold">
        Fee Summary
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {summaryData.map((item, index) => (
          <Animated.View
            key={item.title}
            entering={SlideInLeft.duration(400)
              .delay(index * 100)
              .springify()}
            className={`w-[48%] p-4 ${item.bgColor} rounded-2xl mb-3`}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className={`text-sm font-outfit ${item.textColor}`}>
                  {item.title}
                </Text>
                <Text
                  className={`text-lg font-outfit-bold ${item.textColor} mt-1`}
                >
                  {item.value}
                </Text>
              </View>
              <View
                className={`w-10 h-10 ${item.color} rounded-xl items-center justify-center`}
              >
                <Feather name={item.icon as any} size={20} color="white" />
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

// Empty State Component
const EmptyFeeState: React.FC = () => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center py-16"
  >
    <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-3xl">
      <MaterialIcons name="receipt-long" size={32} color="#9ca3af" />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      No Fee Records Found
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      This student has no fee transactions yet.
    </Text>
  </Animated.View>
);

// Main Component
const StudentFeeDetails: React.FC = () => {
  const { selectedStudent, verifyFeeStatus, isLoading, getUserById } =
    useAdminStore();
  const { token } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleVerifyFee = async (fee: FeeType) => {
    Alert.alert(
      "Verify Payment",
      "Are you sure you want to mark this fee as paid?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Verify",
          onPress: async () => {
            try {
              // Call API to verify fee
              await verifyFeeStatus(fee._id, token!);
            } catch (error) {
              console.error("Error verifying fee:", error);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh student data
    if (selectedStudent && selectedStudent.user && selectedStudent.user._id)
      await getUserById(selectedStudent.user._id, token!);
    setRefreshing(false);
  };

  if (!selectedStudent) {
    return (
      <View className="items-center justify-center flex-1 px-5">
        <Text className="text-lg text-gray-800 font-outfit-semibold">
          No student selected
        </Text>
        <Text className="mt-2 text-sm text-gray-600 font-outfit">
          Please select a student to view fee details
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View className="p-5">
        {/* Student Info Card */}
        <StudentInfoCard user={selectedStudent.user} />

        {/* Fee Summary */}
        {selectedStudent.feeDetails.length > 0 && (
          <FeeSummary feeDetails={selectedStudent.feeDetails} />
        )}

        {/* Fee Transactions List */}
        <View>
          <Text className="mb-4 text-lg text-gray-800 font-outfit-bold">
            Fee Transactions
          </Text>

          {selectedStudent.feeDetails.length === 0 ? (
            <EmptyFeeState />
          ) : (
            selectedStudent.feeDetails.map((fee, index) => (
              <FeeItem
                key={`${fee.student}-${index}`}
                item={fee}
                index={index}
                onVerify={handleVerifyFee}
                isLoading={isLoading}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default StudentFeeDetails;
