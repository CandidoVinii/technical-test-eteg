import type { CreateClientInput } from "@repo/shared";
import { CpfConflictError, ColorNotFoundError } from "../errors/app-error.js";
import { prisma } from "../utils/prisma.js";
import { isPrismaUniqueViolation } from "../utils/prisma-errors.js";

export type ClientEntity = {
  id: number;
  name: string;
  email: string;
  cpf: string;
  colorId: number;
  note: string | null;
  createdAt: Date;
};

export async function createClient(
  input: CreateClientInput,
): Promise<ClientEntity> {
  const color = await prisma.color.findUnique({
    where: { id: input.colorId },
  });
  if (!color) {
    throw new ColorNotFoundError();
  }

  try {
    return await prisma.client.create({
      data: {
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        note: input.note ?? null,
        colorId: input.colorId,
      },
    });
  } catch (error) {
    if (isPrismaUniqueViolation(error, "cpf")) {
      throw new CpfConflictError();
    }
    throw error;
  }
}
