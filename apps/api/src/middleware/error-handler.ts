import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, CpfConflictError } from "../errors/app-error.js";
import { isPrismaUniqueViolation } from "../utils/prisma-errors.js";
import { toValidationError } from "../utils/zod-error.js";

type ErrorResolver = (err: unknown) => AppError | null;

const resolvers: ErrorResolver[] = [
  (err) => (err instanceof AppError ? err : null),
  (err) => (err instanceof ZodError ? toValidationError(err) : null),
  (err) =>
    isPrismaUniqueViolation(err, "cpf") ? new CpfConflictError() : null,
];

function resolveError(err: unknown): AppError {
  for (const resolve of resolvers) {
    const resolved = resolve(err);
    if (resolved) return resolved;
  }
  console.error(err);
  return new AppError(500, "INTERNAL_ERROR", "Erro interno do servidor");
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const appError = resolveError(err);
  const body: { error: { code: string; message: string; details?: unknown } } =
    {
      error: {
        code: appError.code,
        message: appError.message,
      },
    };
  if (appError.details !== undefined) {
    body.error.details = appError.details;
  }
  res.status(appError.statusCode).json(body);
};
