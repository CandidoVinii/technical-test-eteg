export const breakpoints = {
  sm: "480px",
  md: "768px",
} as const;

export type Breakpoint = keyof typeof breakpoints;
