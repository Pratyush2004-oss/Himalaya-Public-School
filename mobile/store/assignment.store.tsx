import { AssignmentApis } from "@/assets/constants";
import {
  BatchAssignmentType,
  CreateAssignmentInputType,
  TodaysAssignmentType,
} from "@/types";
import axios from "axios";
import { DocumentPickerAsset } from "expo-document-picker";
import { Alert } from "react-native";
import { create } from "zustand";

interface AssignmentStoreInterface {
  todaysAssignment: TodaysAssignmentType[] | null;
  selectedBatch: string;
  isLoading: boolean;
  batchAssignment: BatchAssignmentType[] | null;
  setSelectedBatch: (batchId: string) => void;
  createAssignment: (
    input: CreateAssignmentInputType,
    token: string
  ) => Promise<boolean>;
  getBatchAssignment: (token: string) => Promise<void>;
  getTodaysAssignment: (token: string) => Promise<void>;
  resetAssignmentRecord: () => void;
}

export const useAssignmentStore = create<AssignmentStoreInterface>(
  (set, get) => ({
    todaysAssignment: null,
    isLoading: false,
    batchAssignment: null,
    selectedBatch: "",
    setSelectedBatch: (batchId) => {
      if (get().selectedBatch === batchId) return;
      set({ selectedBatch: batchId });
    },
    getTodaysAssignment: async (token) => {
      if (!token) return;
      set({ isLoading: true });
      try {
        const response = await axios.get(AssignmentApis.getTodayAssignment, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 400) throw new Error(response.data.message);
        set({ todaysAssignment: response.data.assignments });
      } catch (error) {
      } finally {
        set({ isLoading: false });
      }
    },
    getBatchAssignment: async (token) => {
      try {
        if (!token) return;
        if (!get().selectedBatch) return;
        set({ isLoading: true });
        const response = await axios.get(
          AssignmentApis.getBatchAssignment.replace(
            ":batchId",
            get().selectedBatch
          ),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 400) throw new Error(response.data.message);
        set({ batchAssignment: response.data.assignments });
      } catch (error) {
      } finally {
        set({ isLoading: false });
      }
    },

    createAssignment: async (input, token) => {
      try {
        if (!input.batchIds || input.batchIds.length === 0) {
          Alert.alert("Error", "Please add atlest one batch.");
          return false;
        }
        const formData = new FormData();
        formData.append("batchIds", input.batchIds.join(","));

        // --- THE CRITICAL FIX ---
        // When appending files to FormData in React Native, you must provide an object
        // with `uri`, `name`, and `type` properties. The DocumentPickerAsset gives you all of these.
        input.files.forEach(
          (
            file: File | DocumentPickerAsset,
            index: number,
            array: (File | DocumentPickerAsset)[]
          ) => {
            if ("uri" in file) {
              const fileToUpload = {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || "application/octet-stream",
              };
              formData.append("files", fileToUpload as any);
            }
          }
        );
        // --- END OF FIX ---

        const response = await axios.post(
          AssignmentApis.createAssignment,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 400) throw new Error(response.data.message);

        Alert.alert("Success", response.data.message, [
          {
            text: "OK",
            onPress: () => {
              return true;
            },
          },
        ]);

        return false;
      } catch (error: any) {
        if (error.isAxiosError)
          Alert.alert("Error", error.response.data.message);
        else Alert.alert("Error", error.message);
        return false;
      }
    },
    resetAssignmentRecord: () => {
      set({
        todaysAssignment: null,
        batchAssignment: null,
        selectedBatch: "",
        isLoading: false,
      });
    },
  })
);
