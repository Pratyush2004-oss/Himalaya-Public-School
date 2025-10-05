import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";
import { useRouter } from "expo-router";

const useUserHook = () => {
  const router = useRouter();
  const { logout } = useUserStore();
  const { resetAdminData } = useAdminStore();
  const { resetBatchRecords } = useBatchStore();
  const logoutHook = () => {
    resetAdminData();
    resetBatchRecords();
    logout().then((res) => {
      if (res) router.replace("/(auth)");
    });
  };

  return { logoutHook };
};

export default useUserHook;
