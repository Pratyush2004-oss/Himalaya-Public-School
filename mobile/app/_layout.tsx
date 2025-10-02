import { ProtectedRoute } from "@/components/shared/Redirect";
import SafeScreen from "@/components/shared/SafeScreen";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { useFonts } from "@/hooks/useFonts";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <ProtectedRoute>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
          </Stack>
        </ProtectedRoute>
      </SafeScreen>
      <StatusBar barStyle="default" />
    </SafeAreaProvider>
  );
}
