import { breakpoints } from "./breakpoints";

export const theme = {
  breakpoints,
  colors: {
    bgPage: "#f5f5f4",
    bgCard: "#ffffff",
    bgInput: "#ffffff",
    bgInputDisabled: "#e7e5e4",
    textPrimary: "#1c1917",
    textSecondary: "#57534e",
    textPlaceholder: "#a8a29e",
    textInverse: "#ffffff",
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    primaryActive: "#1e40af",
    successBg: "#ecfdf5",
    successBorder: "#10b981",
    successText: "#065f46",
    errorBg: "#fef2f2",
    errorBorder: "#ef4444",
    errorText: "#991b1b",
    warningBg: "#fffbeb",
    warningBorder: "#f59e0b",
    warningText: "#92400e",
    border: "#d6d3d1",
    borderFocus: "#2563eb",
    divider: "#e7e5e4",
  },
  fonts: {
    family:
      'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    sizeXs: "0.75rem",
    sizeSm: "0.875rem",
    sizeBase: "1rem",
    sizeLg: "1.125rem",
    sizeXl: "1.5rem",
    weightNormal: 400,
    weightMedium: 500,
    weightSemibold: 600,
  },
  space: {
    s1: "4px",
    s2: "8px",
    s3: "12px",
    s4: "16px",
    s5: "20px",
    s6: "24px",
    s8: "32px",
  },
  radius: {
    sm: "6px",
    md: "8px",
  },
  layout: {
    maxFormWidth: "480px",
  },
  shadow: {
    card: "0 1px 3px rgba(0, 0, 0, 0.08)",
  },
} as const;

export type AppTheme = typeof theme;
