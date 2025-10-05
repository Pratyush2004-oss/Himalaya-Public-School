import { AllBatchesForStudentsType } from "@/types";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const JoinBatchModal: React.FC<{
  visible: boolean;
  batch: AllBatchesForStudentsType | null;
  onClose: () => void;
  onJoin: (batchId: string, joiningCode: string) => void;
}> = ({ visible, batch, onClose, onJoin }) => {
  const [joiningCode, setJoiningCode] = useState("");

  const handleJoin = () => {
    if (!batch || !joiningCode.trim()) {
      Alert.alert("Error", "Please enter the batch joining code");
      return;
    }
    onJoin(batch._id, joiningCode.trim());
    setJoiningCode("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="items-center justify-center flex-1 px-6 bg-black/50">
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          className="w-full p-6 bg-white rounded-2xl"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg text-gray-800 font-outfit-semibold">
              Join Batch
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {batch && (
            <View className="p-4 mb-6 bg-teal-50 rounded-xl">
              <Text className="text-base text-teal-800 font-outfit-semibold">
                {batch.name}
              </Text>
              <Text className="mt-1 text-sm text-teal-600 font-outfit">
                Class {batch.standard} • {batch.teacher.name}
              </Text>
            </View>
          )}

          <View className="mb-6">
            <Text className="mb-2 text-sm text-gray-700 font-outfit-medium">
              Batch Joining Code
            </Text>
            <TextInput
              value={joiningCode}
              onChangeText={setJoiningCode}
              placeholder="Enter batch joining code"
              className="p-4 text-gray-800 bg-gray-50 rounded-xl font-outfit"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="items-center flex-1 p-4 bg-gray-100 rounded-xl"
            >
              <Text className="text-gray-700 font-outfit-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleJoin}
              className="items-center flex-1 p-4 bg-teal-500 rounded-xl"
            >
              <Text className="text-white font-outfit-semibold">
                Join Batch
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default JoinBatchModal;