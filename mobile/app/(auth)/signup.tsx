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
  ScrollView,
  Switch,
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
import { BusList, RoleList, StandardsList } from "@/assets/constants";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/auth.store";

// Main component for React Native
export default function SignupScreen() {
  const [input, setinput] = useState<registerInputType>({
    email: "",
    name: "",
    password: "",
    role: "",
    standard: "",
    aadhar: "",
    parentsName: "",
    parentsMobile: "",
    bus: false,
    pickUp: "",
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

  const handleChangeBus = (e: boolean) => {
    setinput({
      ...input,
      bus: !input.bus,
      pickUp: e ? "" : input.pickUp,
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
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="mb-2 text-4xl text-center text-white font-outfit-bold ">
                  Himlaya Public School
                </Text>
                <Text className="mb-8 text-lg text-center text-gray-300 font-outfit ">
                  Student & Staff Portal
                </Text>

                <Animated.View style={formAnimatedStyle}>
                  <View className="flex-row flex-wrap justify-between">
                    {/* Name */}
                    <View className="w-full mb-4">
                      <Text className="mb-2 text-gray-300 font-outfit ">
                        Full Name
                      </Text>
                      <TextInput
                        placeholderTextColor="#9CA3AF"
                        placeholder="Enter your full name"
                        value={input.name}
                        onChangeText={(e) => setinput({ ...input, name: e })}
                        className="p-3 text-white border border-gray-500 rounded-lg bg-black/30 font-outfit"
                      />
                    </View>

                    {/* Email */}
                    <View className="w-full mb-4">
                      <Text className="mb-2 text-gray-300 font-outfit ">
                        Email
                      </Text>
                      <TextInput
                        placeholder="Enter your email"
                        autoCapitalize="none"
                        placeholderTextColor="#9CA3AF"
                        value={input.email}
                        onChangeText={(e) => setinput({ ...input, email: e })}
                        className="p-3 text-white border border-gray-500 rounded-lg bg-black/30 font-outfit"
                        keyboardType="email-address"
                      />
                    </View>

                    {/* AAdhar Number */}
                    <View className="w-full mb-4">
                      <Text className="mb-2 text-gray-300 font-outfit ">
                        Aadhar Number
                      </Text>
                      <TextInput
                        placeholderTextColor="#9CA3AF"
                        placeholder="Enter your Aadhar Number"
                        value={input.aadhar}
                        onChangeText={(e) => setinput({ ...input, aadhar: e })}
                        className="p-3 text-white border border-gray-500 rounded-lg bg-black/30 font-outfit"
                        keyboardType="numeric"
                        maxLength={12}
                      />
                    </View>

                    {/* Role */}
                    <View
                      className={`${input.role === "student" ? "w-[48%]" : "w-full"} mb-4`}
                    >
                      <Text className="mb-2 text-gray-300 font-outfit ">
                        Role
                      </Text>
                      <View
                        className="border border-gray-500 rounded-lg bg-black/30"
                        style={{ height: 48 }}
                      >
                        <Picker
                          style={{
                            color: "white",
                            fontFamily: "Outfit",
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
                              style={{ fontFamily: "Outfit" }}
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
                        <Text className="mb-2 text-gray-300 font-outfit ">
                          Standard
                        </Text>
                        <View
                          className="border border-gray-500 rounded-lg bg-black/30"
                          style={{ height: 48 }}
                        >
                          <Picker
                            style={{
                              fontFamily: "Outfit",
                              color: "white",
                              height: 48,
                              marginLeft: 0, // Adjust for proper alignment
                            }}
                            selectedValue={input.standard}
                            dropdownIconColor={"white"}
                            dropdownIconRippleColor={"white"}
                            onValueChange={(e) => handleChangeStandard(e)}
                          >
                            <Picker.Item
                              style={{ fontFamily: "Outfit" }}
                              label="Select Standard"
                              value=""
                            />
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

                    {/* Parents Name */}
                    {input.role === "student" && (
                      <View className="w-full mb-4">
                        <Text className="mb-2 text-gray-300 font-outfit ">
                          Parents Name
                        </Text>
                        <TextInput
                          placeholderTextColor="#9CA3AF"
                          placeholder="Enter your parents name"
                          value={input.parentsName}
                          onChangeText={(e) =>
                            setinput({ ...input, parentsName: e })
                          }
                          className="p-3 text-white border border-gray-500 rounded-lg bg-black/30 font-outfit"
                        />
                      </View>
                    )}

                    {/* Parents Phone Number */}
                    {input.role === "student" && (
                      <View className="w-full mb-4">
                        <Text className="mb-2 text-gray-300 font-outfit ">
                          Parent's Phone Number
                        </Text>
                        <TextInput
                          placeholderTextColor="#9CA3AF"
                          placeholder="Enter your phone number"
                          value={input.parentsMobile}
                          keyboardType="numeric"
                          onChangeText={(e) =>
                            setinput({ ...input, parentsMobile: e })
                          }
                          className="p-3 text-white border border-gray-500 rounded-lg bg-black/30 font-outfit"
                        />
                      </View>
                    )}

                    {/* choose bus and pickup */}
                    {input.role === "student" && (
                      <View className="flex-row items-center justify-between w-full">
                        <Text className="mb-2 text-xl text-gray-300 font-outfit">
                          Use Bus?
                        </Text>
                        <View className="">
                          <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={input.bus ? "#f5dd4d" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(e) => handleChangeBus(e)}
                            value={input.bus}
                          />
                        </View>
                      </View>
                    )}
                    
                    {/* choose Pickup location */}
                    {input.bus && (
                      <View className="w-full mb-4">
                        <Text className="mb-2 text-gray-300 font-outfit">
                          Pick Up Point
                        </Text>
                        <View
                          className="border border-gray-500 rounded-lg bg-black/30"
                          style={{ height: 48 }}
                        >
                          <Picker
                            style={{
                              fontFamily: "Outfit",
                              color: "white",
                            }}
                            selectedValue={input.standard}
                            dropdownIconColor={"white"}
                            dropdownIconRippleColor={"white"}
                            onValueChange={(e) =>
                              setinput({ ...input, pickUp: e })
                            }
                          >
                            <Picker.Item
                              style={{ fontFamily: "Outfit" }}
                              label="Select Pickup Point"
                              value=""
                            />
                            {BusList.map((item, idx) => (
                              <Picker.Item
                                key={idx}
                                label={item}
                                value={item}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    )}

                    {/* Password */}
                    <View className="relative w-full mb-4">
                      <Text className="mb-2 text-gray-300 font-outfit ">
                        Password
                      </Text>
                      <TextInput
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showPassword}
                        value={input.password}
                        onChangeText={(e) =>
                          setinput({ ...input, password: e })
                        }
                        className="p-3 text-white border border-gray-500 rounded-lg bg-black/30 font-outfit"
                        placeholder="Enter your password"
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
                  <Text className="mx-4 text-gray-400 font-outfit ">
                    or continue with
                  </Text>
                  <View className="flex-1 h-px bg-gray-500" />
                </View>

                {/* Login navigator */}
                <Text className="mt-6 text-center text-gray-400 font-outfit ">
                  Already have an account?{" "}
                  <Text
                    onPress={() => router.replace("/(auth)")}
                    className="text-xl text-blue-500"
                  >
                    Login
                  </Text>
                </Text>
              </ScrollView>
            </BlurView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
