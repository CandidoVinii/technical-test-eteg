import type { CreateClientInput } from "@repo/shared";
import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { toValidationError } from "../utils/zod-error.js";

export function validateBody<T extends CreateClientInput>(
  schema: ZodSchema<T>,
): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(toValidationError(result.error));
    }
    req.validatedBody = result.data;
    next();
  };
}
