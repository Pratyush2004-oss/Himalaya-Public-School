import { View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, paddingTop: insets.top }}>{children}</View>;
};

export default SafeScreen;
