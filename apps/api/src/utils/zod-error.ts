import { ZodError } from "zod";
import { ValidationError } from "../errors/app-error.js";

export function toValidationError(error: ZodError): ValidationError {
  const details = error.errors.map((issue) => ({
    path: issue.path,
    message: issue.message,
  }));
  return new ValidationError("Dados inválidos", details);
}
