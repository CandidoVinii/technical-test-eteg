import type { CreateColorInput } from "@repo/shared";
import { ColorConflictError } from "../errors/app-error.js";
import { prisma } from "../utils/prisma.js";
import { isPrismaUniqueViolation } from "../utils/prisma-errors.js";

export type ColorEntity = {
  id: number;
  label: string;
  hex: string;
  createdAt: Date;
};

export async function listColors(): Promise<ColorEntity[]> {
  return prisma.color.findMany({ orderBy: { label: "asc" } });
}

export async function createColor(input: CreateColorInput): Promise<ColorEntity> {
  try {
    return await prisma.color.create({
      data: { label: input.label, hex: input.hex },
    });
  } catch (error) {
    if (isPrismaUniqueViolation(error, "hex")) {
      throw new ColorConflictError();
    }
    throw error;
  }
}
