import { useAdminStore } from "@/store/admin.store";
import { useUserStore } from "@/store/auth.store";
import { useBatchStore } from "@/store/batch.store";

const useUserHook = () => {
  const { logout } = useUserStore();
  const { resetAdminData } = useAdminStore();
  const { resetBatchRecords } = useBatchStore();
  const logoutHook = () => {
    resetAdminData();
    resetBatchRecords();
    logout();
  };

  return { logoutHook };
};

export default useUserHook;
