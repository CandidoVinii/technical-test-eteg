import { Router } from "express";
import { publicRoutes } from "./public.routes.js";
import { protectedRoutes } from "./protected.routes.js";

export const apiRouter = Router();

apiRouter.use(publicRoutes);
apiRouter.use(protectedRoutes);
