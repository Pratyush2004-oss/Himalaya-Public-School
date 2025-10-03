import { adminApis } from "@/assets/constants";
import {
  AllBatchesType,
  AllTeachersType,
  AllUsersType,
  CountType,
  CreateBatchInputType,
  SelectedUserType,
} from "@/types";
import axios from "axios";
import { Alert } from "react-native";
import { create } from "zustand";

interface AdminStoreInterface {
  isLoading: boolean;
  users: AllUsersType[];
  count: CountType;
  selectedStudent: SelectedUserType | null;
  allTeachers: AllTeachersType[];
  allBatches: AllBatchesType[];
  getAllUsers: (token: string) => Promise<void>;
  verifyUser: (userId: string, token: string) => Promise<boolean | void>;
  getUserById: (userId: string, token: string) => Promise<boolean>;
  getStudentInfoByUID: (UIDNumber: string, token: string) => Promise<void>;
  deleteUser: (userId: string, token: string) => Promise<boolean | void>;
  getAllBatches: (token: string) => Promise<void>;
  getAllTeachers: (token: string) => Promise<void>;
  createBatch: (input: CreateBatchInputType, token: string) => Promise<boolean>;
  deleteBatch: (batchId: string, token: string) => Promise<void>;
  verifyFeeStatus: (feeId: string, token: string) => Promise<void>;
  resetAdminData: () => void;
}

export const useAdminStore = create<AdminStoreInterface>((set, get) => ({
  isLoading: false,
  // user state
  count: {
    studentCount: 0,
    teacherCount: 0,
    totalUserCount: 0,
    verifiedCount: 0,
  },
  users: [],
  selectedStudent: null,
  //   batch state
  allTeachers: [],
  allBatches: [],

  //   user actions
  getAllUsers: async (token) => {
    if (!token) return;
    try {
      set({ isLoading: true });
      const response = await axios.get(adminApis.getAllUsers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({ users: response.data.students, count: response.data.count });
    } catch (error: any) {
    } finally {
      set({ isLoading: false });
    }
  },
  verifyUser: async (userId, token) => {
    if (!token) return;
    try {
      set({ isLoading: true });
      const response = await axios.post(
        adminApis.verifyUser,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      Alert.alert("Success", "User Verified Successfully", [
        {
          text: "OK",
          onPress: () => {
            get().getAllUsers(token);
          },
        },
      ]);
      return true;
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  getUserById: async (userId, token) => {
    try {
      if (get().selectedStudent?.user._id !== userId)
        set({ selectedStudent: null });
      set({ isLoading: true });
      if (!token) return false;
      const response = await axios.post(
        adminApis.getStudentInformation,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      set({ selectedStudent: response.data });
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  getStudentInfoByUID: async (UIDNumber, token) => {
    try {
      set({ isLoading: true, selectedStudent: null });
      if (!token) return;
      console.log(UIDNumber);
      const response = await axios.post(
        adminApis.getStudentInfoByUID,
        { UIDNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      set({ selectedStudent: response.data });
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteUser: async (userId, token) => {
    if (!token) return;
    try {
      set({ isLoading: true });
      const response = await axios.delete(
        adminApis.deleteUser.replace(":userId", userId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => {
            get().getAllUsers(token);
          },
        },
      ]);
      return true;
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  //   batch actions
  getAllBatches: async (token) => {
    try {
      if (!token) return;
      set({ isLoading: true });
      const response = await axios.get(adminApis.getAllBatchesForAdmin, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({ allBatches: response.data.batches });
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
  getAllTeachers: async (token) => {
    try {
      if (!token) return;
      set({ isLoading: true });
      const response = await axios.get(adminApis.getAllTeachers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({ allTeachers: response.data.teachers });
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
  createBatch: async (input, token) => {
    try {
      if (!token) return false;
      if (!(input.name && input.standard && input.teacher)) {
        Alert.alert("Error", "Please fill all the fields.");
        return false;
      }
      set({ isLoading: true });
      const response = await axios.post(adminApis.createBatch, input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => {
            get().getAllBatches(token);
          },
        },
      ]);
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteBatch: async (batchId, token) => {
    if (!token) return;
    try {
      const response = await axios.delete(
        adminApis.deleteBatch.replace(":batchId", batchId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => {
            get().getAllBatches(token);
          },
        },
      ]);
    } catch (error) {
    } finally {
    }
  },
  //   fee actions
  verifyFeeStatus: async (feeId, token) => {
    try {
      set({ isLoading: true });
      const response = await axios.put(
        adminApis.verifyFeePayment,
        { feeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => {
            get().getStudentInfoByUID(
              get().selectedStudent?.user.UID as string,
              token
            );
          },
        },
      ]);
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // reset
  resetAdminData: () => {
    set({
      isLoading: false,
      users: [],
      count: {
        studentCount: 0,
        teacherCount: 0,
        totalUserCount: 0,
        verifiedCount: 0,
      },
      selectedStudent: null,
      allTeachers: [],
      allBatches: [],
    });
  },
}));
