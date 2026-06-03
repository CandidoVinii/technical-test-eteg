import type { CreateColorInput } from "@repo/shared";
import type { RequestHandler } from "express";
import { createColor, listColors } from "../services/color.service.js";

function toColorJson(color: {
  id: number;
  label: string;
  hex: string;
  createdAt: Date;
}) {
  return {
    id: color.id,
    label: color.label,
    hex: color.hex,
    createdAt: color.createdAt.toISOString(),
  };
}

export const list: RequestHandler = async (_req, res, next) => {
  try {
    const colors = await listColors();
    res.json({ data: colors.map(toColorJson) });
  } catch (error) {
    next(error);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    const input = req.validatedBody as CreateColorInput;
    const color = await createColor(input);
    res.status(201).json({ data: toColorJson(color) });
  } catch (error) {
    next(error);
  }
};
