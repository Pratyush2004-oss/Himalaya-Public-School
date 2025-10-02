import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Svg, Path } from "react-native-svg";
import { registerInputType } from "@/types";
import { Picker } from "@react-native-picker/picker";
import { RoleList, StandardsList } from "@/assets/constants";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/auth.store";

// Use react-native-svg for icons in React Native
const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 48 48">
    <Path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></Path>
    <Path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></Path>
    <Path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></Path>
    <Path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.088,5.571l6.19,5.238C42.022,35.122,44,30.021,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></Path>
  </Svg>
);

// Main component for React Native
export default function SignupScreen() {
  const [input, setinput] = useState<registerInputType>({
    email: "",
    name: "",
    password: "",
    role: "",
    standard: "",
  });
  const [showPassword, setshowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const { signup } = useUserStore();

  // Animation values using Reanimated
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(60);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(40);
  const buttonOpacity = useSharedValue(0);

  const animConfig = {
    duration: 700,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  };

  useEffect(() => {
    cardOpacity.value = withTiming(1, animConfig);
    cardTranslateY.value = withTiming(0, animConfig);

    formOpacity.value = withDelay(200, withTiming(1, animConfig));
    formTranslateY.value = withDelay(200, withTiming(0, animConfig));

    buttonOpacity.value = withDelay(400, withTiming(1, animConfig));
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  // handle change picker value for standard of the user
  const handleChangeStandard = (itemValue: string) => {
    setinput({
      ...input,
      standard: itemValue,
    });
  };

  // handle change picker value for role of the user
  const handleChangeRole = (itemValue: string) => {
    setinput({
      ...input,
      role: itemValue as "student" | "teacher" | "",
    });
  };

  const handleSignup = async () => {
    setisLoading(true);
    try {
      const response = await signup(input);
      if (response) router.replace("/(auth)");
    } catch (error) {
    } finally {
      setisLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      }}
      className="flex-1"
    >
      <View className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="items-center justify-center flex-1"
        >
          <Animated.View
            style={cardAnimatedStyle}
            className="w-11/12 max-w-md bg-white/30 rounded-3xl"
          >
            <BlurView
              intensity={80}
              tint="dark"
              className="p-8 overflow-hidden rounded-3xl"
            >
              <Text className="mb-2 text-4xl font-bold text-center text-white font-outfit ">
                Himlaya Public School
              </Text>
              <Text className="mb-8 text-lg text-center text-gray-300 font-outfit ">
                Student & Staff Portal
              </Text>

              <Animated.View style={formAnimatedStyle}>
                <View className="flex-row flex-wrap justify-between">
                  {/* Name */}
                  <View className="w-full mb-4">
                    <Text className="mb-2 text-gray-300 font-outfit ">Full Name</Text>
                    <TextInput
                      placeholderTextColor="#9CA3AF"
                      value={input.name}
                      onChangeText={(e) => setinput({ ...input, name: e })}
                      className="p-3 text-white border border-gray-500 rounded-lg bg-black/30"
                    />
                  </View>

                  {/* Email */}
                  <View className="w-full mb-4">
                    <Text className="mb-2 text-gray-300 font-outfit ">Email</Text>
                    <TextInput
                      placeholderTextColor="#9CA3AF"
                      value={input.email}
                      onChangeText={(e) => setinput({ ...input, email: e })}
                      className="p-3 text-white border border-gray-500 rounded-lg bg-black/30"
                      keyboardType="email-address"
                    />
                  </View>

                  {/* Role */}
                  <View
                    className={`${input.role === "student" ? "w-[48%]" : "w-full"} mb-4`}
                  >
                    <Text className="mb-2 text-gray-300 font-outfit ">Role</Text>
                    <View
                      className="border border-gray-500 rounded-lg bg-black/30"
                      style={{ height: 48 }}
                    >
                      <Picker
                        style={{
                          color: "white",
                          height: 48,
                          marginLeft: 0, // Adjust for proper alignment
                        }}
                        selectedValue={input.role}
                        dropdownIconColor={"white"}
                        dropdownIconRippleColor={"white"}
                        onValueChange={(e) => handleChangeRole(e)}
                      >
                        <Picker.Item label="Select Role" value="" />
                        {RoleList.map((item, idx) => (
                          <Picker.Item
                            key={idx}
                            label={item.toUpperCase()}
                            value={item}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  {/* Standard */}
                  {input.role === "student" && (
                    <View className="w-[48%] mb-4">
                      <Text className="mb-2 text-gray-300 font-outfit ">Standard</Text>
                      <View
                        className="border border-gray-500 rounded-lg bg-black/30"
                        style={{ height: 48 }}
                      >
                        <Picker
                          style={{
                            color: "white",
                            height: 48,
                            marginLeft: 0, // Adjust for proper alignment
                          }}
                          selectedValue={input.standard}
                          dropdownIconColor={"white"}
                          dropdownIconRippleColor={"white"}
                          onValueChange={(e) => handleChangeStandard(e)}
                        >
                          <Picker.Item label="Select Standard" value="" />
                          {StandardsList.map((item, idx) => (
                            <Picker.Item
                              key={idx}
                              label={item.name}
                              value={item.value}
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  )}

                  {/* Password */}
                  <View className="relative w-full mb-4">
                    <Text className="mb-2 text-gray-300 font-outfit ">Password</Text>
                    <TextInput
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPassword}
                      value={input.password}
                      onChangeText={(e) => setinput({ ...input, password: e })}
                      className="p-3 text-white border border-gray-500 rounded-lg bg-black/30"
                    />
                    <Pressable
                      className="absolute bottom-3 right-3"
                      onPress={() => setshowPassword(!showPassword)}
                    >
                      <Feather
                        name={showPassword ? "eye" : "eye-off"}
                        size={18}
                        color="white"
                      />
                    </Pressable>
                  </View>
                </View>
              </Animated.View>

              {/* Signin Button */}
              <Animated.View style={buttonAnimatedStyle}>
                <TouchableOpacity
                  className="flex-row items-center justify-center p-3 space-x-3 rounded-lg bg-white/90"
                  onPress={handleSignup}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Text className="text-base font-semibold text-gray-800 font-outfit ">
                      Regsiter
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-500" />
                <Text className="mx-4 text-gray-400 font-outfit ">or continue with</Text>
                <View className="flex-1 h-px bg-gray-500" />
              </View>

              {/* Login navigator */}
              {/* Signup navigator */}
              <Text className="mt-6 text-center text-gray-400 font-outfit ">
                Already have an account?{" "}
                <Text
                  onPress={() => router.replace("/(auth)")}
                  className="text-xl text-blue-500"
                >
                  Login
                </Text>
              </Text>
            </BlurView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
