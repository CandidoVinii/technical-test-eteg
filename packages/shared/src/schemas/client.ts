import { z } from "zod";
import { CLIENT_COLOR_IDS } from "../constants/client-colors.js";
import { stripCpf, validateCpf } from "../utils/cpf.js";

export const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(120, "Nome deve ter no máximo 120 caracteres"),
  email: z.string().trim().email("E-mail inválido"),
  cpf: z
    .string()
    .transform(stripCpf)
    .refine((v) => v.length === 11, "CPF deve ter 11 dígitos")
    .refine(validateCpf, "CPF inválido"),
  color: z
    .enum(CLIENT_COLOR_IDS, { message: "Selecione uma cor válida" })
    .optional(),
  note: z
    .string()
    .trim()
    .max(500, "Observação deve ter no máximo 500 caracteres")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const clientResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  cpf: z.string(),
  color: z.string().nullable(),
  note: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type ClientResponse = z.infer<typeof clientResponseSchema>;
