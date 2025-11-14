import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { Toast } from "./Toast";

export const ToastContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
