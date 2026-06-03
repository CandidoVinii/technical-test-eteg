/** Funcionalidades futuras — ative com VITE_ENABLE_ADD_COLOR=true no .env */
const enableAddColor =
  (import.meta.env.VITE_ENABLE_ADD_COLOR ?? "false").toLowerCase() === "true";

export const features = {
  addColor: enableAddColor,
} as const;
