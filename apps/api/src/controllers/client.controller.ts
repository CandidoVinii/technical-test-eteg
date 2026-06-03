import type { CreateClientInput } from "@repo/shared";
import type { RequestHandler } from "express";
import { createClient } from "../services/client.service.js";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const input = req.validatedBody as CreateClientInput;
    const client = await createClient(input);
    res.status(201).json({
      data: {
        id: client.id,
        name: client.name,
        email: client.email,
        cpf: client.cpf,
        colorId: client.colorId,
        note: client.note,
        color: {
          id: client.color.id,
          label: client.color.label,
          hex: client.color.hex,
          createdAt: client.color.createdAt.toISOString(),
        },
        createdAt: client.createdAt.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
