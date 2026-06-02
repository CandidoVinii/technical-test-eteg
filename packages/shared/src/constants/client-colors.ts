export const CLIENT_COLOR_IDS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
] as const;

export type ClientColorId = (typeof CLIENT_COLOR_IDS)[number];

export type ClientColorOption = {
  id: ClientColorId;
  label: string;
  hex: string;
};

/** Cores do arco-íris — lista pode ser alterada sem mudar o contrato da API (string). */
export const CLIENT_COLORS: readonly ClientColorOption[] = [
  { id: "red", label: "Vermelho", hex: "#EF4444" },
  { id: "orange", label: "Laranja", hex: "#F97316" },
  { id: "yellow", label: "Amarelo", hex: "#EAB308" },
  { id: "green", label: "Verde", hex: "#22C55E" },
  { id: "blue", label: "Azul", hex: "#3B82F6" },
  { id: "indigo", label: "Anil", hex: "#6366F1" },
  { id: "violet", label: "Violeta", hex: "#A855F7" },
] as const;

export function isClientColorId(value: string): value is ClientColorId {
  return (CLIENT_COLOR_IDS as readonly string[]).includes(value);
}
