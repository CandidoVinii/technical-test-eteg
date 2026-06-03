import type { ToastVariant } from "./registration-context";

export type ToastMessage = {
  variant: ToastVariant;
  message: string;
};

const DEFAULT_ERROR: ToastMessage = {
  variant: "error",
  message: "Não foi possível concluir. Tente novamente.",
};

const BY_CODE: Record<string, ToastMessage> = {
  CPF_ALREADY_REGISTERED: {
    variant: "warning",
    message: "Este CPF já possui cadastro.",
  },
  COLOR_ALREADY_EXISTS: {
    variant: "warning",
    message: "Já existe uma cor com este hex.",
  },
  NETWORK_ERROR: {
    variant: "error",
    message: "Verifique sua conexão e tente novamente.",
  },
  TIMEOUT: {
    variant: "error",
    message: "A requisição demorou demais. Tente novamente.",
  },
  VALIDATION_ERROR: {
    variant: "error",
    message: "Revise os campos destacados.",
  },
};

const BY_STATUS: Record<number, ToastMessage> = {
  400: BY_CODE.VALIDATION_ERROR,
  409: BY_CODE.CPF_ALREADY_REGISTERED,
};

export function resolveApiToast(status: number, code: string): ToastMessage {
  if (status === 0) return BY_CODE.NETWORK_ERROR;
  return BY_CODE[code] ?? BY_STATUS[status] ?? DEFAULT_ERROR;
}

export const CLIENT_VALIDATION_TOAST: ToastMessage = {
  variant: "error",
  message: "Revise os campos destacados.",
};

export function successToast(clientName: string): ToastMessage {
  return {
    variant: "success",
    message: `Cadastro concluído: ${clientName}.`,
  };
}
