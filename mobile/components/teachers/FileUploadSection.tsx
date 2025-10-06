import { CreateAssignmentInputType } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerAsset } from "expo-document-picker";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  Layout,
} from "react-native-reanimated";

// --- Helper Functions ---
const getFileIcon = (mimeType?: string): keyof typeof Ionicons.glyphMap => {
  if (!mimeType) return "document-outline";
  if (mimeType.startsWith("image/")) return "image-outline";
  if (mimeType === "application/pdf") return "document-text-outline";
  if (mimeType.includes("word")) return "document-text-outline";
  return "document-outline";
};

const formatFileSize = (sizeInBytes?: number): string => {
  if (!sizeInBytes) return "0 KB";
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const size = (sizeInBytes / Math.pow(1024, i)).toFixed(2);
  return `${size} ${["B", "KB", "MB", "GB", "TB"][i]}`;
};

// --- UI Components ---
export const FileItem: React.FC<{
  file: DocumentPickerAsset;
  index: number;
  onDelete: (file: DocumentPickerAsset) => void;
}> = ({ file, index, onDelete }) => {
  return (
    <Animated.View
      entering={FadeInRight.duration(400)
        .delay(index * 100)
        .springify()}
      layout={Layout.springify()}
      className="flex-row items-center p-3 mb-3 bg-white shadow-sm rounded-2xl"
    >
      <View className="items-center justify-center w-12 h-12 mr-4 bg-teal-50 rounded-xl">
        <Ionicons name={getFileIcon(file.mimeType)} size={24} color="#14b8a6" />
      </View>
      <View className="flex-1">
        <Text
          className="text-sm text-gray-800 font-outfit-medium"
          numberOfLines={1}
        >
          {file.name}
        </Text>
        <Text className="mt-1 text-xs text-gray-500 font-outfit">
          {formatFileSize(file.size)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(file)} className="p-2 ml-2">
        <Feather name="x" size={20} color="#ef4444" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Main File Upload Component
const FileUploadSection = ({
  input,
  setInput,
}: {
  input: CreateAssignmentInputType;
  setInput: React.Dispatch<React.SetStateAction<CreateAssignmentInputType>>;
}) => {
  const onFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "image/*",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        setInput((prev) => ({
          ...prev,
          files: [...prev.files, ...result.assets],
        }));
      }
    } catch (error) {
      Alert.alert("Error picking document ");
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(200).springify()}
      className="px-5 my-2"
    >
      <Text className="mb-2 text-base text-gray-700 font-outfit-semibold">
        Attach Files
      </Text>
      <TouchableOpacity
        className="items-center justify-center p-8 border-2 border-teal-300 border-dashed bg-teal-50 rounded-2xl"
        onPress={onFilePick}
        activeOpacity={0.7}
      >
        <Feather name="upload-cloud" size={40} color="#14b8a6" />
        <Text className="mt-3 text-base text-teal-800 font-outfit-semibold">
          Tap to Upload Files
        </Text>
        <Text className="mt-1 text-sm text-teal-600 font-outfit">
          PDF, DOC, or Images
        </Text>
      </TouchableOpacity>

      {input.files.length > 0 && (
        <View className="mt-6">
          <Text className="mb-3 text-base text-gray-700 font-outfit-semibold">
            Selected Files ({input.files.length})
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default FileUploadSection;
