import {
  ChangePasswordInputType,
  EventType,
  loginInputType,
  registerInputType,
  UserType,
} from "@/types";
import { Alert } from "react-native";
import { create } from "zustand";
import axios from "axios";
import { UserApis } from "@/assets/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserStoreInterface {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isAdmin: boolean;
  user: UserType | null;
  token: string | null;
  eventsList: EventType[];

  signup: (userInput: registerInputType) => Promise<boolean>;
  login: (userInput: loginInputType) => Promise<void>;
  checkAuth: () => Promise<void>;
  changePassword: (userInput: ChangePasswordInputType) => Promise<void>;
  logout: () => Promise<void>;
  getEventsList: () => Promise<void>;
  resetUserRecord: () => void;
}

export const useUserStore = create<UserStoreInterface>((set, get) => ({
  isAuthenticated: false,
  isCheckingAuth: true,
  isAdmin: false,
  isOrganizationAdmin: false,
  user: null,
  token: null,
  eventsList: [],

  //   signup controller
  signup: async (userInput) => {
    try {
      // check for all fields
      if (
        !userInput.email ||
        !userInput.password ||
        !userInput.name ||
        !userInput.role
      ) {
        Alert.alert("Error", "Please fill all the fields.");
        return false;
      }
      //   check for guardian details for students only
      if (userInput.role === "student" && !userInput.standard) {
        Alert.alert("Error", "Please fill standard details.");
        return false;
      }

      //   check for valid email
      if (!/^\S+@\S+\.\S+$/.test(userInput.email)) {
        Alert.alert("Error", "Please enter a valid email address.");
        return false;
      }

      const response = await axios.post(UserApis.registerUser, userInput);
      if (response.status === 400) throw new Error(response.data.error);

      Alert.alert("Success", response.data.message);
      return true;
    } catch (error: any) {
      if (error.isAxiosError) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", error.message);
      }
      return false;
    }
  },
  //   login controller
  login: async (userInput) => {
    set({ isAdmin: false });
    if (!userInput.email || !userInput.password) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(userInput.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(UserApis.loginUser, userInput);
      if (response.status === 400) throw new Error(response.data.message);

      // check for admin
      try {
        const responseAdmin = await axios.get(UserApis.checkAdmin, {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });
        if (responseAdmin.data.isAdmin) set({ isAdmin: true });

        if (responseAdmin.status === 400)
          throw new Error(responseAdmin.data.error);
      } catch (error) {}

      set({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
      });
      Alert.alert("Success", response.data.message);
      await AsyncStorage.setItem("token", response.data.token);
    } catch (error: any) {
      if (error.isAxiosError) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", error.message);
      }
    }
  },
  //   check auth controller
  checkAuth: async () => {
    try {
      set({ isAdmin: false, isCheckingAuth: true });
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return set({
          isCheckingAuth: false,
          isAuthenticated: false,
          token: null,
          user: null,
        });
      }

      const response = await axios.get(UserApis.checkAuth, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({
        token: token,
        isCheckingAuth: false,
        isAuthenticated: true,
        user: response.data.user,
      });

      // check for admin also
      try {
        const requireAdmin = await axios.get(UserApis.checkAdmin, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 400) throw new Error(response.data.message);
        if (requireAdmin.data.isAdmin) set({ isAdmin: true });
      } catch (error) {}
    } catch (error) {
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  //   change password
  changePassword: async (userInput) => {
    try {
    } catch (error) {}
  },
  //   logout controller
  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      set({
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        token: null,
        eventsList: [],
      });
      Alert.alert("Logged out successfully");
    } catch (error) {
      Alert.alert("Error Logging out");
    }
  },
  getEventsList: async () => {
    try {
      const response = await axios.get(UserApis.getEventsList);
      if (response.status === 400) throw new Error(response.data.message);
      set({ eventsList: response.data.events });
    } catch (error: any) {}
  },
  //   reset controller
  resetUserRecord: () => {
    set({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null,
      eventsList: [],
    });
  },
}));
