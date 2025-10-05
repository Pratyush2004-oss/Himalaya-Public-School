import { feeApis, RAZORPAY_KEY_ID } from "@/assets/constants";
import { FeeType, UserType } from "@/types";
import axios from "axios";
import { Alert } from "react-native";
import { create } from "zustand";
import RazorpayCheckout from "react-native-razorpay";

interface FeeStoreInterface {
  FeesList: FeeType[];
  isLoading: boolean;
  getAllFeeDetailsOfUser: (token: string) => Promise<void>;
  payFee: (feeId: string, token: string, user: UserType) => Promise<void>;
  resetFeeRecord: () => void;
}

export const useFeeStore = create<FeeStoreInterface>((set, get) => ({
  FeesList: [],
  isLoading: false,
  getAllFeeDetailsOfUser: async (token: string) => {
    if (!token) return;
    try {
      set({ isLoading: true });
      const response = await axios.get(feeApis.getAllFees, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({ FeesList: response.data.FeesList });
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  payFee: async (feeId, token, user) => {
    if (!token || !feeId) return;
    try {
      set({ isLoading: true });
      const response = await axios.post(
        feeApis.orderFee,
        { feeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      const data = response.data.order;

      const options = {
        description: "Fee Payment",
        currency: "INR",
        key: RAZORPAY_KEY_ID,
        amount: data.amount,
        name: "Fee Payment",
        theme: { color: "#F372A8" },
        order_id: data.id,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
      };
      if (!RazorpayCheckout || !RazorpayCheckout.open) {
        Alert.alert("Error", "Razorpay Checkout not found");
        return;
      }
      RazorpayCheckout.open(options).then(async (response: any) => {
        // handle Success
        const options2 = {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          feeId: feeId,
        };
        const verifyResponse = await axios.post(
          feeApis.verifyFeePayment,
          options2,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (verifyResponse.status === 400)
          throw new Error(verifyResponse.data.message);

        Alert.alert("Success", verifyResponse.data.message, [
          {
            text: "OK",
            onPress: () => {
              get().getAllFeeDetailsOfUser(token);
            },
          },
        ]);
      });
    } catch (error: any) {
      if (error.isAxiosError) Alert.alert("Error", error.response.data.message);
      else Alert.alert("Error", error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  resetFeeRecord: () => set({ FeesList: [], isLoading: false }),
}));
