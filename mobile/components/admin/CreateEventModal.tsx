import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";
import { CreateEventInputType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface CreateEventModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const { createEvent } = useAdminStore();
  const { token } = useUserStore();

  const [input, setInput] = useState<CreateEventInputType>({
    title: "",
    description: "",
    date: new Date(),
    image: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const overlayOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);
  const modalTranslateY = useSharedValue(50);

  const resetForm = () => {
    setInput({
      title: "",
      description: "",
      date: new Date(),
      image: "",
    });
    setErrors({});
    setisLoading(false);
  };
  useEffect(() => {
    if (isDialogOpen) {
      overlayOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 15, stiffness: 120 });
      modalTranslateY.value = withSpring(0, { damping: 15, stiffness: 120 });
      // Reset form on open
      resetForm();
    } else {
      overlayOpacity.value = withTiming(0, { duration: 300 });
      modalScale.value = withTiming(0.8, { duration: 200 });
      modalTranslateY.value = withTiming(50, { duration: 200 });
    }
  }, [isDialogOpen]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: modalScale.value },
      { translateY: modalTranslateY.value },
    ],
  }));

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleImagePick = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need camera roll permission to make this work!"
          );
          return;
        }
      }

      // launch Image Library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
        base64: true,
      });
      if (!result.canceled) {
        setInput({ ...input, image: result.assets[0].uri });
        if (errors.image) setErrors({ ...errors, image: "" });
      }
    } catch (error) {
      Alert.alert("Error picking image");
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setInput({ ...input, date: selectedDate });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!input.title.trim()) newErrors.title = "Title is required.";
    if (!input.description.trim())
      newErrors.description = "Description is required.";
    if (!input.image) newErrors.image = "An event image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (token) {
      setisLoading(true);
      await createEvent(input, token).then(() => {
        setisLoading(false);
        handleClose();
      });
    }
  };

  return (
    <Modal visible={isDialogOpen} transparent animationType="none">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Animated.View
          style={overlayAnimatedStyle}
          className="absolute inset-0 bg-black/60"
        >
          <TouchableOpacity
            onPress={handleClose}
            className="absolute inset-0"
          />
        </Animated.View>

        <View className="items-center justify-center flex-1 px-4">
          <Animated.View
            style={modalAnimatedStyle}
            className="w-full max-w-md max-h-[90%] bg-gray-50 rounded-3xl shadow-xl overflow-hidden"
          >
            <LinearGradient
              colors={["#14b8a6", "#0d9488"]}
              className="px-6 py-5"
            >
              <Text className="text-xl text-white font-outfit-bold">
                Create New Event
              </Text>
              <Text className="text-sm text-white/80 font-outfit">
                Fill in the details to schedule a new event.
              </Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {/* Image Picker */}
              <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                <Text className="mb-2 text-sm text-gray-600 font-outfit-medium">
                  Event Image
                </Text>
                <TouchableOpacity
                  onPress={handleImagePick}
                  className={`items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl ${
                    errors.image ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  {input.image ? (
                    <Image
                      source={{ uri: input.image }}
                      className="w-full h-full rounded-2xl"
                    />
                  ) : (
                    <View className="items-center">
                      <Ionicons
                        name="image-outline"
                        size={32}
                        color={errors.image ? "#f87171" : "#9ca3af"}
                      />
                      <Text
                        className={`mt-2 text-sm font-outfit ${
                          errors.image ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        Tap to select an image
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {errors.image && (
                  <Text className="mt-1 text-xs text-red-500 font-outfit">
                    {errors.image}
                  </Text>
                )}
              </Animated.View>

              {/* Title Input */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(200)}
                className="mt-4"
              >
                <Text className="mb-2 text-sm text-gray-600 font-outfit-medium">
                  Event Title
                </Text>
                <TextInput
                  placeholder="e.g., Annual Sports Day"
                  value={input.title}
                  onChangeText={(text) => setInput({ ...input, title: text })}
                  className={`p-3 bg-white border rounded-xl font-outfit ${
                    errors.title ? "border-red-400" : "border-gray-300"
                  }`}
                />
              </Animated.View>

              {/* Description Input */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(300)}
                className="mt-4"
              >
                <Text className="mb-2 text-sm text-gray-600 font-outfit-medium">
                  Description
                </Text>
                <TextInput
                  placeholder="Describe the event..."
                  value={input.description}
                  onChangeText={(text) =>
                    setInput({ ...input, description: text })
                  }
                  multiline
                  numberOfLines={4}
                  className={`p-3 bg-white border rounded-xl font-outfit h-24 text-start ${
                    errors.description ? "border-red-400" : "border-gray-300"
                  }`}
                  textAlignVertical="top"
                />
              </Animated.View>

              {/* Date Picker */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(400)}
                className="mt-4"
              >
                <Text className="mb-2 text-sm text-gray-600 font-outfit-medium">
                  Event Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center justify-between p-3 bg-white border border-gray-300 rounded-xl"
                >
                  <Text className="font-outfit">
                    {input.date.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                </TouchableOpacity>
              </Animated.View>

              {showDatePicker && (
                <DateTimePicker
                  value={input.date}
                  minimumDate={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}

              {/* Action Buttons */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(500)}
                className="flex-row mt-6 space-x-3"
              >
                <TouchableOpacity
                  onPress={handleClose}
                  className="flex-1 p-3 bg-gray-200 rounded-xl"
                >
                  <Text className="text-center text-gray-700 font-outfit-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 overflow-hidden rounded-xl"
                >
                  <LinearGradient
                    colors={
                      isLoading
                        ? ["#9ca3af", "#6b7280"]
                        : ["#14b8a6", "#0d9488"]
                    }
                    className="items-center justify-center p-3"
                  >
                    {isLoading ? (
                      <Text className="text-white font-outfit-semibold">
                        Creating...
                      </Text>
                    ) : (
                      <Text className="text-white font-outfit-semibold">
                        Create Event
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateEventModal;
