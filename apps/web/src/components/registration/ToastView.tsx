import { useRegistration } from "../../context/useRegistration";
import { ToastBox, ToastStack } from "../../styles/primitives";

export function ToastView() {
  const { toast } = useRegistration();

  if (!toast) return null;

  return (
    <ToastStack>
      <ToastBox
        key={toast.id}
        $variant={toast.variant}
        role={toast.variant === "success" ? "status" : "alert"}
        aria-live="polite"
      >
        {toast.message}
      </ToastBox>
    </ToastStack>
  );
}
