declare global {
  namespace Express {
    interface Request {
      user?: { sub: string };
      validatedBody?: unknown;
    }
  }
}

export {};
