import { batchApis } from "@/assets/constants";
import {
  Add_To_BatchInputType,
  AllBatchesForStudentsType,
  BatchForStudentType,
  BatchForTeacherType,
  JoinBatchInputType,
  removeStudentFromBatchInputType,
  StudentType,
} from "@/types";
import axios from "axios";
import { Alert } from "react-native";
import { create } from "zustand";

interface BatchStoreInterface {
  selectedBatch: BatchForTeacherType | null;
  batchListForTeacher: BatchForTeacherType[];
  batchListForStudents: BatchForStudentType[];
  batchStudentList: StudentType[];
  allStudentsForBatch: StudentType[];
  isLoading: boolean;
  allBatches: AllBatchesForStudentsType[];
  setSelectedBatch: (batch: BatchForTeacherType) => void;
  deleteBatch: (batchId: string, token: string) => Promise<void>;
  getAllBatches: (token: string) => Promise<void>;
  getBatchListForStudent: (token: string) => Promise<void>;
  getBatchListForTeacher: (token: string) => Promise<void>;
  getBatchStudents: (batchId: string, token: string) => Promise<void>;
  getAllStudentsForBatch: (batchId: string, token: string) => Promise<void>;
  changeBatchJoiningCode: (batchId: string, token: string) => Promise<void>;
  addStudentsToBatch: (
    input: Add_To_BatchInputType,
    token: string
  ) => Promise<boolean>;
  removeStudentFromBatch: (
    input: removeStudentFromBatchInputType,
    token: string
  ) => Promise<boolean>;
  leaveBatch: (batchId: string, token: string) => Promise<boolean>;
  joinBatch: (input: JoinBatchInputType, token: string) => Promise<boolean>;
  resetBatchRecords: () => void;
}

export const useBatchStore = create<BatchStoreInterface>((set, get) => ({
  selectedBatch: null,
  batchListForTeacher: [],
  allStudentsForBatch: [],
  batchListForStudents: [],
  batchStudentList: [],
  isLoading: false,
  allBatches: [],
  setSelectedBatch: (batch) => set({ selectedBatch: batch }),
  //   get student batches
  getBatchListForStudent: async (token) => {
    try {
      if (!token) return;
      set({ isLoading: true });
      const batches = await axios.get(batchApis.get_batches_for_Student, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (batches.status === 400) throw new Error(batches.data.message);
      set({ batchListForStudents: batches.data.batchDetails });
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
  //   get all the batches for student to join
  getAllBatches: async (token) => {
    try {
      if (!token) return;
      set({ isLoading: true });
      const batches = await axios.get(batchApis.get_All_Batches_to_Join, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (batches.status === 400) throw new Error(batches.data.message);
      set({ allBatches: batches.data.batchDetails });
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
  //   get teacher batches
  getBatchListForTeacher: async (token) => {
    try {
      if (!token) return;
      set({ isLoading: true });
      const batches = await axios.get(batchApis.get_Batches_for_Teacher, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (batches.status === 400) throw new Error(batches.data.message);
      set({ batchListForTeacher: batches.data.batches });
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
  //   get batch students
  getBatchStudents: async (batchId, token) => {
    if (!token) return;
    try {
      set({ isLoading: true, batchStudentList: [] });
      const batchDetails = await axios.get(
        batchApis.get_Single_Batch_for_Teacher.replace(":batchId", batchId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (batchDetails.status === 400)
        throw new Error(batchDetails.data.message);
      set({ batchStudentList: batchDetails.data.students });
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
  //   delete batch
  deleteBatch: async (batchId, token) => {
    if (!token) return;
    try {
      const response = await axios.delete(
        batchApis.deleteBatch.replace(":batchId", batchId),
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
            get().getBatchListForTeacher(token);
          },
        },
      ]);
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },
  //   add student to batch
  addStudentsToBatch: async (input, token) => {
    try {
      if (!token) return false;
      if (
        !input.batchId ||
        !input.studentIds ||
        input.studentIds.length === 0
      ) {
        Alert.alert("Error", "Please add atlest one student.");
        return false;
      }
      const response = await axios.post(
        batchApis.add_students_to_batch,
        input,
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
            get().getBatchStudents(input.batchId, token);
            return true;
          },
        },
      ]);
      return false;
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      return false;
    }
  },
  //   get all students for the batch
  getAllStudentsForBatch: async (batchId, token) => {
    try {
      if (!batchId || !token) return;
      set({ isLoading: true, allStudentsForBatch: [] });
      const response = await axios.get(
        batchApis.getAllStudentList.replace(":batchId", batchId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
    } catch (error) {
    } finally {
      set({ isLoading: false });
    }
  },
  //   change batch joining code
  changeBatchJoiningCode: async (batchId, token) => {
    try {
      if (!batchId || !token) return;
      const response = await axios.get(
        batchApis.changeBatchJoiningCode.replace(":batchId", batchId),
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
            get().getBatchListForTeacher(token);
          },
        },
      ]);
    } catch (error: any) {
      console.log(error);
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    }
  },
  //   remove student from batch
  removeStudentFromBatch: async (input, token) => {
    if (!token) return false;
    if (!input.batchId || !input.studentId) {
      Alert.alert("Error", "Please add atlest one student.");
      return false;
    }
    try {
      const response = await axios.put(
        batchApis.delete_Student_from_Batch,
        input,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      Alert.alert("Success", response.data.message);
      get().getBatchStudents(input.batchId, token);
      return true;
    } catch (error: any) {
      console.log(error.response.data);
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
      return false;
    }
  },
  // join batch
  joinBatch: async (input, token) => {
    if (!token) return false;
    if (!input.batchId || !input.batchJoiningCode) {
      Alert.alert("Error", "Please fill all the fields.");
      return false;
    }
    try {
      const response = await axios.post(batchApis.add_to_batch, input, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      Alert.alert("Success", response.data.message);
      get().getBatchListForStudent(token);
      return true;
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      return false;
    }
  },
  // leave batch
  leaveBatch: async (batchId, token) => {
    if (!token || !batchId) return false;
    try {
      const response = await axios.put(
        batchApis.leaveBatch,
        { batchId },
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
            get().getBatchListForStudent(token);
          },
        },
      ]);
      return true;
    } catch (error: any) {
      console.log(error.response.data);
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
      return false;
    }
  },
  // reset All batch Records
  resetBatchRecords: () =>
    set({
      selectedBatch: null,
      batchListForTeacher: [],
      allStudentsForBatch: [],
      batchListForStudents: [],
      batchStudentList: [],
      isLoading: false,
      allBatches: [],
    }),
}));
