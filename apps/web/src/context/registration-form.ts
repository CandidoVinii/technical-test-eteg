import {
  createClientSchema,
  isClientColorId,
  stripCpf,
  type ApiErrorBody,
  type CreateClientInput,
} from "@repo/shared";
import type { FormFieldKey } from "./registration-context";

export type FormFields = Record<FormFieldKey, string>;

export type FieldErrors = Partial<Record<FormFieldKey, string>>;

export const ALL_FIELDS_TOUCHED: Record<FormFieldKey, true> = {
  name: true,
  email: true,
  cpf: true,
  color: true,
  note: true,
};

const FIELD_KEYS = new Set<string>(Object.keys(ALL_FIELDS_TOUCHED));

export function emptyFields(): FormFields {
  return { name: "", email: "", cpf: "", color: "", note: "" };
}

/** Campo com algo digitado — vazio + blur não dispara erro. */
export function hasFieldContent(field: FormFieldKey, value: string): boolean {
  if (field === "cpf") return stripCpf(value).length > 0;
  return value.trim().length > 0;
}

export function zodIssuesToFieldErrors(
  issues: Array<{ path: (string | number)[]; message: string }>,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && FIELD_KEYS.has(key) && !errors[key as FormFieldKey]) {
      errors[key as FormFieldKey] = issue.message;
    }
  }
  return errors;
}

export function buildPayload(fields: FormFields): CreateClientInput {
  const color =
    fields.color && isClientColorId(fields.color) ? fields.color : undefined;
  return {
    name: fields.name,
    email: fields.email,
    cpf: stripCpf(fields.cpf),
    color,
    note: fields.note.trim() || undefined,
  };
}

export function parseClientForm(fields: FormFields) {
  return createClientSchema.safeParse(buildPayload(fields));
}

export function fieldErrorsFromApi(error: ApiErrorBody): FieldErrors {
  if (error.details?.length) {
    return zodIssuesToFieldErrors(error.details);
  }
  if (error.code === "CPF_ALREADY_REGISTERED") {
    return { cpf: "Este CPF já possui cadastro." };
  }
  return {};
}

export function scrollToFirstFieldError() {
  requestAnimationFrame(() => {
    document
      .querySelector("[data-field-error='true']")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}
