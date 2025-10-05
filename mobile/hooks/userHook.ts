import { useAdminStore } from "@/store/admin.store";
import { useAssignmentStore } from "@/store/assignment.store";
import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";
import { useFeeStore } from "@/store/fee.store";
import { useRouter } from "expo-router";

const useUserHook = () => {
  const router = useRouter();
  const { logout } = useUserStore();
  const { resetAdminData } = useAdminStore();
  const { resetBatchRecords } = useBatchStore();
  const { resetAssignmentRecord } = useAssignmentStore();
  const { resetFeeRecord } = useFeeStore();

  // Make the function async
  const logoutHook = async () => {
    // These are likely synchronous state resets, so they are fine.
    resetAdminData();
    resetBatchRecords();
    resetAssignmentRecord();
    resetFeeRecord();

    // Await the logout function to ensure it completes.
    // This assumes your logout function in the store returns a Promise.
    await logout();

    // This line will only run after logout() is finished.
    router.replace("/(auth)");
  };

  return { logoutHook };
};

export default useUserHook;
