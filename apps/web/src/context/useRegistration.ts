import { useContext } from "react";
import { RegistrationContext } from "./registration-context";

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) {
    throw new Error("useRegistration deve ser usado dentro de RegistrationProvider");
  }
  return ctx;
}
