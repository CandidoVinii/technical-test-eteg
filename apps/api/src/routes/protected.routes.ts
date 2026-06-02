import { Router } from "express";
// Fase 2: import { authenticate } from "../middleware/authenticate.js";

/**
 * Rotas protegidas por JWT (Fase 2).
 * Exemplo de uso:
 *   protectedRoutes.use(authenticate);
 *   protectedRoutes.get("/me", meController.get);
 */
export const protectedRoutes = Router();
