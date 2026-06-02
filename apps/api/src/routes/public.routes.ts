import { Router } from "express";
import { createClientSchema } from "@repo/shared";
import { create } from "../controllers/client.controller.js";
import { healthCheck } from "../controllers/health.controller.js";
import { validateBody } from "../middleware/validate-body.js";

export const publicRoutes = Router();

publicRoutes.get("/health", healthCheck);
publicRoutes.post("/clients", validateBody(createClientSchema), create);
