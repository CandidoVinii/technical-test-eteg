import cors from "cors";
import express from "express";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import { setupSwagger } from "./openapi/swagger.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  setupSwagger(app);
  app.use("/api/v1", apiRouter);
  app.use(errorHandler);

  return app;
}
