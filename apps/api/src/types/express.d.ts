import type { CreateClientInput } from "@repo/shared";

declare global {
  namespace Express {
    interface Request {
      user?: { sub: string };
      validatedBody?: CreateClientInput;
    }
  }
}

export {};
