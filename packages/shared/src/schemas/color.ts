import { z } from "zod";

const hexColor = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .refine((v) => /^#[0-9A-F]{6}$/.test(v), "Hex inválido (use #RRGGBB)");

export const createColorSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Nome da cor deve ter pelo menos 2 caracteres")
    .max(40, "Nome da cor deve ter no máximo 40 caracteres"),
  hex: hexColor,
});

export type CreateColorInput = z.infer<typeof createColorSchema>;

export const colorResponseSchema = z.object({
  id: z.number().int().positive(),
  label: z.string(),
  hex: z.string(),
  createdAt: z.string().datetime(),
});

export type ColorResponse = z.infer<typeof colorResponseSchema>;
