import { Router } from "express";
import { createClientSchema, createColorSchema } from "@repo/shared";
import { create as createClientHandler } from "../controllers/client.controller.js";
import { create as createColorHandler, list as listColorsHandler } from "../controllers/color.controller.js";
import { healthCheck } from "../controllers/health.controller.js";
import { validateBody } from "../middleware/validate-body.js";

export const publicRoutes = Router();

publicRoutes.get("/health", healthCheck);
publicRoutes.get("/colors", listColorsHandler);
publicRoutes.post("/colors", validateBody(createColorSchema), createColorHandler);
publicRoutes.post("/clients", validateBody(createClientSchema), createClientHandler);
