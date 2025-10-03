import { StandardsList } from "@/assets/constants";
import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";
import { CreateBatchInputType } from "@/types";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface CreateBatchModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const { allTeachers, getAllTeachers, createBatch, isLoading } =
    useAdminStore();
  const { token } = useUserStore();

  useEffect(() => {
    allTeachers.length === 0 && getAllTeachers(token as string);
  }, []);
  // Form state
  const [formData, setFormData] = useState<CreateBatchInputType>({
    name: "",
    teacher: "",
    standard: "",
  });

  // Validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Animation values
  const overlayOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);
  const modalTranslateY = useSharedValue(50);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isDialogOpen) {
      setFormData({ name: "", teacher: "", standard: "" });
      setErrors({});
      // Animate in
      overlayOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      modalTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    } else {
      // Animate out
      overlayOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withTiming(0.8, { duration: 200 });
      modalTranslateY.value = withTiming(50, { duration: 200 });
    }
  }, [isDialogOpen]);

  // Animated styles
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: modalScale.value },
      { translateY: modalTranslateY.value },
    ],
  }));

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Batch name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Batch name must be at least 3 characters";
    }

    if (!formData.teacher) {
      newErrors.teacher = "Please select a teacher";
    }

    if (!formData.standard) {
      newErrors.standard = "Please select a standard";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const res = await createBatch(formData, token as string);

      if (res) {
        setIsDialogOpen(false);
      }

      
    } catch (error) {
      Alert.alert("Error", "Failed to create batch. Please try again.");
    }
  };

  // Handle close modal
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  // Get standard icon and color
  const getStandardStyle = (value: string) => {
    const standardNum = parseInt(value);
    if (standardNum <= 5) return { icon: "book-outline", color: "bg-blue-400" };
    if (standardNum <= 8)
      return { icon: "library-outline", color: "bg-purple-400" };
    if (standardNum <= 10)
      return { icon: "school-outline", color: "bg-green-400" };
    return { icon: "trophy-outline", color: "bg-orange-400" };
  };

  return (
    <Modal
      visible={isDialogOpen}
      transparent={true}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[overlayAnimatedStyle]}
        className="flex-1 bg-black/50"
      >
        <BlurView intensity={20} tint="dark" className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="justify-center flex-1 px-5"
          >
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
              style={modalAnimatedStyle}
              className="overflow-hidden bg-white shadow-2xl rounded-3xl"
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                  colors={["#14b8a6", "#0d9488"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="px-6 py-8"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="items-center justify-center w-12 h-12 mr-3 bg-white/20 rounded-2xl">
                        <MaterialCommunityIcons
                          name="google-classroom"
                          size={24}
                          color="white"
                        />
                      </View>
                      <View>
                        <Text className="text-2xl text-white font-outfit-bold">
                          Create Batch
                        </Text>
                        <Text className="text-sm font-outfit text-white/80">
                          Set up a new class batch
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={handleClose}
                      className="items-center justify-center w-10 h-10 bg-white/20 rounded-xl"
                    >
                      <Feather name="x" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>

                {/* Form Content */}
                <View className="p-6">
                  {/* Batch Name Input */}
                  <Animated.View
                    entering={SlideInDown.delay(100)}
                    className="mb-6"
                  >
                    <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                      Batch Name
                    </Text>
                    <View className="relative">
                      <View className="absolute z-10 left-4 top-4">
                        <Feather name="edit-3" size={20} color="#14b8a6" />
                      </View>
                      <TextInput
                        value={formData.name}
                        onChangeText={(text) => {
                          setFormData({ ...formData, name: text });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        placeholder="Enter batch name (e.g., Math Advanced)"
                        placeholderTextColor="#9ca3af"
                        className={`pl-12 pr-4 py-4 border-2 rounded-2xl font-outfit text-gray-800 ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        } focus:border-teal-400 focus:bg-white`}
                      />
                    </View>
                    {errors.name && (
                      <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                        {errors.name}
                      </Text>
                    )}
                  </Animated.View>

                  {/* Teacher Picker */}
                  <Animated.View
                    entering={SlideInDown.delay(200)}
                    className="mb-6"
                  >
                    <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                      Assign Teacher
                    </Text>
                    <View
                      className={`border-2 rounded-2xl ${
                        errors.teacher
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <View className="flex-row items-center px-4 py-2">
                        <Feather name="user" size={20} color="#14b8a6" />
                        <View className="flex-1 ml-2">
                          <Picker
                            selectedValue={formData.teacher}
                            onValueChange={(value) => {
                              setFormData({ ...formData, teacher: value });
                              if (errors.teacher)
                                setErrors({ ...errors, teacher: "" });
                            }}
                            style={{
                              color: "#374151",
                              fontFamily: "Outfit-Regular",
                            }}
                            dropdownIconColor="#14b8a6"
                          >
                            <Picker.Item
                              label="Select a teacher"
                              value=""
                              style={{ fontFamily: "Outfit-Regular" }}
                            />
                            {allTeachers.map((teacher) => (
                              <Picker.Item
                                key={teacher._id}
                                label={teacher.name}
                                value={teacher._id}
                                style={{ fontFamily: "Outfit-Regular" }}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    </View>
                    {errors.teacher && (
                      <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                        {errors.teacher}
                      </Text>
                    )}
                  </Animated.View>

                  {/* Standard Picker */}
                  <Animated.View
                    entering={SlideInDown.delay(300)}
                    className="mb-8"
                  >
                    <Text className="mb-2 text-base text-gray-800 font-outfit-semibold">
                      Class Standard
                    </Text>
                    <View
                      className={`border-2 rounded-2xl ${
                        errors.standard
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <View className="flex-row items-center px-4 py-2">
                        <MaterialCommunityIcons
                          name="school"
                          size={20}
                          color="#14b8a6"
                        />
                        <View className="flex-1 ml-2">
                          <Picker
                            selectedValue={formData.standard}
                            onValueChange={(value) => {
                              setFormData({ ...formData, standard: value });
                              if (errors.standard)
                                setErrors({ ...errors, standard: "" });
                            }}
                            style={{
                              color: "#374151",
                              fontFamily: "Outfit-Regular",
                            }}
                            dropdownIconColor="#14b8a6"
                          >
                            <Picker.Item
                              label="Select class standard"
                              value=""
                              style={{ fontFamily: "Outfit-Regular" }}
                            />
                            {StandardsList.map((standard) => (
                              <Picker.Item
                                key={standard.value}
                                label={`${standard.name} Grade`}
                                value={standard.value}
                                style={{ fontFamily: "Outfit-Regular" }}
                              />
                            ))}
                          </Picker>
                        </View>
                        {formData.standard && (
                          <View
                            className={`w-8 h-8 ${getStandardStyle(formData.standard).color} rounded-xl items-center justify-center ml-2`}
                          >
                            <Ionicons
                              name={
                                getStandardStyle(formData.standard).icon as any
                              }
                              size={16}
                              color="white"
                            />
                          </View>
                        )}
                      </View>
                    </View>
                    {errors.standard && (
                      <Text className="mt-1 ml-1 text-sm text-red-500 font-outfit">
                        {errors.standard}
                      </Text>
                    )}
                  </Animated.View>

                  {/* Action Buttons */}
                  <Animated.View
                    entering={SlideInDown.delay(400)}
                    className="flex-row gap-3"
                  >
                    <TouchableOpacity
                      onPress={handleClose}
                      className="px-6 py-3 border-2 border-gray-200 rounded-2xl w-[45%]"
                      activeOpacity={0.8}
                    >
                      <Text className="text-center text-gray-700 font-outfit-semibold">
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={isLoading}
                      className="overflow-hidden rounded-2xl"
                      activeOpacity={0.8}
                    >
                      {isLoading ? (
                        <View className="px-6 py-3 bg-gray-300">
                          <View className="flex-row items-center justify-center">
                            <Feather name="loader" size={16} color="white" />
                            <Text className="ml-2 text-white font-outfit-semibold">
                              Creating...
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <LinearGradient
                          colors={["#14b8a6", "#0d9488"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="px-6 py-4"
                        >
                          <View className="flex-row items-center justify-center">
                            <Feather name="plus" size={16} color="white" />
                            <Text className="ml-2 text-white font-outfit-semibold">
                              Create Batch
                            </Text>
                          </View>
                        </LinearGradient>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </BlurView>
      </Animated.View>
    </Modal>
  );
};

export default CreateBatchModal;
