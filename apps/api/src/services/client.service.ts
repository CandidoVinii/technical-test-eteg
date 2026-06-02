import type { CreateClientInput } from "@repo/shared";
import { CpfConflictError } from "../errors/app-error.js";
import { prisma } from "../utils/prisma.js";
import { isPrismaUniqueViolation } from "../utils/prisma-errors.js";

export type ClientEntity = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  color: string | null;
  note: string | null;
  createdAt: Date;
};

export async function createClient(
  input: CreateClientInput,
): Promise<ClientEntity> {
  try {
    return await prisma.client.create({
      data: {
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        color: input.color ?? null,
        note: input.note ?? null,
      },
    });
  } catch (error) {
    if (isPrismaUniqueViolation(error, "cpf")) {
      throw new CpfConflictError();
    }
    throw error;
  }
}
