import BackHeader from "@/components/shared/BackHeader";
import { useUserStore } from "@/store/auth.store";
import { useFeeStore } from "@/store/fee.store";
import { FeeType } from "@/types";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
  SlideInLeft,
} from "react-native-reanimated";

// --- Helper Functions ---
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// --- UI Components ---

// Fee Summary Component
const FeeSummary: React.FC<{ feeDetails: FeeType[] }> = ({ feeDetails }) => {
  const totalAmount =
    feeDetails && feeDetails.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount =
    feeDetails &&
    feeDetails
      .filter((fee) => fee.paid)
      .reduce((sum, fee) => sum + fee.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  const summaryData = [
    {
      title: "Total Fees",
      value: formatAmount(totalAmount),
      icon: "dollar-sign",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "Paid Amount",
      value: formatAmount(paidAmount),
      icon: "check-circle",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Pending Dues",
      value: formatAmount(pendingAmount),
      icon: "clock",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="mb-6"
    >
      <Text className="mb-4 text-lg text-gray-800 font-outfit-bold">
        Fee Summary
      </Text>
      <View className="flex-row justify-between">
        {summaryData &&
          summaryData.length > 0 &&
          summaryData.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={SlideInLeft.duration(400)
                .delay(index * 150)
                .springify()}
              className={`w-[32%] p-4 ${item.bgColor} rounded-2xl items-center`}
            >
              <Feather
                name={item.icon as any}
                size={24}
                className={item.textColor}
              />
              <Text className={`text-sm font-outfit mt-2 ${item.textColor}`}>
                {item.title}
              </Text>
              <Text
                className={`text-lg font-outfit-bold ${item.textColor} mt-1`}
              >
                {item.value}
              </Text>
            </Animated.View>
          ))}
      </View>
    </Animated.View>
  );
};

// Fee Item Component
const FeeItem: React.FC<{
  item: FeeType;
  index: number;
  onPay?: (fee: FeeType) => void;
}> = ({ item, index, onPay }) => {
  const getStatusColor = (paid: boolean) =>
    paid ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700";
  const getStatusIcon = (paid: boolean) =>
    paid ? (
      <Feather name="check-circle" size={16} color="#10b981" />
    ) : (
      <Feather name="clock" size={16} color="#f97316" />
    );

  return (
    <Animated.View
      entering={FadeInRight.duration(500)
        .delay(index * 100)
        .springify()}
      className="p-4 mb-4 bg-white shadow-sm rounded-2xl"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-lg text-gray-800 font-outfit-bold">
            {formatAmount(item.amount)}
          </Text>
          <Text className="text-sm text-gray-500 capitalize font-outfit">
            Fee for {item.month}
          </Text>
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

      {item.paid ? (
        <View className="space-y-2">
          <View className="flex-row items-center">
            <Ionicons name="card-outline" size={14} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600 font-outfit">
              Mode:
            </Text>
            <Text className="ml-1 text-sm text-gray-800 capitalize font-outfit-medium">
              {item.mode}
            </Text>
          </View>
          {item.mode === "online" && item.transactionDetail && (
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
          <View className="flex-row items-center">
            <Feather name="calendar" size={14} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600 font-outfit">
              Paid on:
            </Text>
            <Text className="ml-1 text-sm text-gray-800 font-outfit-medium">
              {formatDate(item.paidAt)}
            </Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => onPay?.(item)}
          className="flex-row items-center justify-center p-3 mt-2 bg-teal-500 rounded-xl"
        >
          <Feather name="credit-card" size={16} color="white" />
          <Text className="ml-2 text-sm text-white font-outfit-semibold">
            Pay Now
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// Empty State Component
const EmptyFeeState = () => (
  <Animated.View
    entering={FadeInDown.duration(500).springify()}
    className="items-center justify-center py-16"
  >
    <View className="items-center justify-center w-20 h-20 mb-4 bg-gray-100 rounded-3xl">
      <MaterialIcons name="receipt-long" size={32} color="#9ca3af" />
    </View>
    <Text className="text-lg text-gray-800 font-outfit-semibold">
      All Cleared!
    </Text>
    <Text className="mt-1 text-sm text-center text-gray-500 font-outfit">
      You have no pending fee records at the moment.
    </Text>
  </Animated.View>
);

// --- Main Screen Component ---
const FeeDetailsScreen = () => {
  const { token } = useUserStore();
  const { FeesList, isLoading, getAllFeeDetailsOfUser } = useFeeStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      getAllFeeDetailsOfUser(token);
    }
  }, [token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (token) {
      await getAllFeeDetailsOfUser(token);
    }
    setRefreshing(false);
  };

  const handlePayFee = (fee: FeeType) => {
    // Implement your payment gateway logic here
    Alert.alert(`Redirecting to pay for ${fee.month} fee...`);
  };

  if (isLoading && FeesList && FeesList.length === 0) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#14b8a6" />
      </View>
    );
  }

  return (
    <>
      <BackHeader
        title="Fee Details"
        subtitle="Your Fee Summary"
        backgroundColor="gradient"
      />
      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="p-5">
          <Text className="text-2xl text-gray-800 font-outfit-bold">
            My Fees
          </Text>
          <Text className="mb-6 text-gray-500 font-outfit">
            Review your fee summary and transaction history.
          </Text>

          {FeesList && FeesList.length > 0 && (
            <FeeSummary feeDetails={FeesList} />
          )}

          <Text className="my-4 text-lg text-gray-800 font-outfit-bold">
            Transaction History
          </Text>

          {FeesList && FeesList.length === 0 ? (
            <EmptyFeeState />
          ) : (
            FeesList &&
            FeesList.map((fee, index) => (
              <FeeItem
                key={fee._id}
                item={fee}
                index={index}
                onPay={handlePayFee}
              />
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default FeeDetailsScreen;
