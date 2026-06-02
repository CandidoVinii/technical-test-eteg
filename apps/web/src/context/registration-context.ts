import { createContext } from "react";
import type { ClientColorId } from "@repo/shared";

export type FormFieldKey = "name" | "email" | "cpf" | "color" | "note";

export type ToastVariant = "success" | "error" | "warning";

export type ToastState = {
  id: number;
  variant: ToastVariant;
  message: string;
};

export type RegistrationContextValue = {
  submitting: boolean;
  toast: ToastState | null;
  submitForm: () => void;
  getValue: (field: FormFieldKey) => string;
  setValue: (field: FormFieldKey, value: string) => void;
  blur: (field: FormFieldKey) => void;
  getError: (field: FormFieldKey) => string | undefined;
  selectColor: (colorId: ClientColorId) => void;
  clearColor: () => void;
  selectedColorId: ClientColorId | null;
  noteLength: number;
};

export const RegistrationContext =
  createContext<RegistrationContextValue | null>(null);
