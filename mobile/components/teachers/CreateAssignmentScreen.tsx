import { useAssignmentStore } from "@/store/assignment.store";
import { useUserStore } from "@/store/auth.store";
import { CreateAssignmentInputType } from "@/types";
import { Feather } from "@expo/vector-icons";
import { DocumentPickerAsset } from "expo-document-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import BatchPicker from "./BatchPicker";
import FileUploadSection, { FileItem } from "./FileUploadSection";

const CreateAssignmentScreen = () => {
  const [input, setInput] = useState<CreateAssignmentInputType>({
    batchIds: [],
    files: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useUserStore();
  const { createAssignment } = useAssignmentStore();

  const handleUpload = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      await createAssignment(input, token);
      setInput({ batchIds: [], files: [] });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteFile = (file: DocumentPickerAsset) => {
    setInput((prev) => ({
      ...prev,
      files: prev.files.filter(
        (f) =>
          "uri" in f && typeof f.uri === "string"
            ? f.uri !== file.uri
            : true
      ),
    }));
  };

  const isButtonDisabled =
    isLoading || input.batchIds.length === 0 || input.files.length === 0;

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={input.files.filter(
          (item): item is DocumentPickerAsset =>
            "uri" in item && typeof item.uri === "string"
        )}
        keyExtractor={(item) => item.uri}
        renderItem={({ item, index }) => (
          <View className="px-5">
            <FileItem file={item} index={index} onDelete={onDeleteFile} />
          </View>
        )}
        ListHeaderComponent={
          <>
            {/* --- Header --- */}
            <Animated.View
              entering={FadeInDown.duration(400).springify()}
              className="p-5"
            >
              <Text className="text-2xl text-gray-800 font-outfit-bold">
                New Assignment
              </Text>
              <Text className="mt-1 text-gray-500 font-outfit">
                Select batches and upload assignment files.
              </Text>
            </Animated.View>

            {/* --- Form Sections --- */}
            <BatchPicker setInput={setInput} input={input} />
            <FileUploadSection setInput={setInput} input={input} />
          </>
        }
        ListFooterComponent={<View className="h-5" />} // Add some padding at the bottom
        showsVerticalScrollIndicator={false}
      />

      {/* --- Submission Button --- */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(300).springify()}
        className="p-5 bg-white border-t border-gray-100"
      >
        <TouchableOpacity
          className={`flex-row items-center justify-center p-4 rounded-2xl ${
            isButtonDisabled ? "bg-teal-200" : "bg-teal-500"
          }`}
          disabled={isButtonDisabled}
          onPress={handleUpload}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Feather name="check-circle" size={18} color="white" />
              <Text className="ml-2 text-base text-white font-outfit-semibold">
                Create Assignment
              </Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default CreateAssignmentScreen;