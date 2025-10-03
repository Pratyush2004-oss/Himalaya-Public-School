import { Redirect, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import LoadingScreen from "./LoadingScreen";
import { useUserStore } from "@/store/auth.store";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const segment = useSegments();
  const { user, isCheckingAuth, isAuthenticated, checkAuth, isAdmin } =
    useUserStore();

  useEffect(() => {
    if (isCheckingAuth && !isAuthenticated) {
      checkAuth();
    }
  }, [isCheckingAuth, isAuthenticated, checkAuth]);

  const isAuthScreen = segment[0] === "(auth)";
  const isStudentScreen = segment[0] === "students";
  const isTeacherScreen = segment[0] === "teachers";
  const isAdminScreen = segment[0] === "(adminTabs)";

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }
  if (isAuthScreen && user && isAuthenticated) {
    return <Redirect href={"/(tabs)"} />;
  } else if (isStudentScreen && user?.role === "teacher") {
    return <Redirect href={"/(tabs)"} />;
  } else if (isTeacherScreen && user?.role === "student") {
    return <Redirect href={"/(tabs)"} />;
  } else if (isAdminScreen && !isAdmin) {
    return <Redirect href={"/(tabs)"} />;
  }

  return <View className="flex-1">{children}</View>;
};
