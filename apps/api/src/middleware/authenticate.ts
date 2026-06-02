import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/app-error.js";

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Token ausente ou inválido"));
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new UnauthorizedError("JWT_SECRET não configurado"));
  }

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload === "object" && payload && "sub" in payload) {
      req.user = { sub: String(payload.sub) };
      return next();
    }
    return next(new UnauthorizedError("Payload do token inválido"));
  } catch {
    return next(new UnauthorizedError("Token inválido ou expirado"));
  }
};
