import axios, { isAxiosError } from "axios";
import type { CreateClientInput, ClientResponse } from "@repo/shared";
import type { ApiErrorBody } from "@repo/shared";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export const httpClient = axios.create({
  baseURL: `${baseURL.replace(/\/$/, "")}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

export type CreateClientApiResult =
  | { ok: true; data: ClientResponse }
  | { ok: false; status: number; error: ApiErrorBody };

export async function postClient(
  input: CreateClientInput,
): Promise<CreateClientApiResult> {
  try {
    const response = await httpClient.post<{ data: ClientResponse }>(
      "/clients",
      input,
    );
    return { ok: true, data: response.data.data };
  } catch (error) {
    return mapAxiosError(error);
  }
}

function mapAxiosError(error: unknown): CreateClientApiResult {
  if (!isAxiosError(error)) {
    return {
      ok: false,
      status: 0,
      error: {
        code: "NETWORK_ERROR",
        message: "Verifique sua conexão e tente novamente.",
      },
    };
  }

  const status = error.response?.status ?? 0;
  const body = error.response?.data as { error?: ApiErrorBody } | undefined;

  if (body?.error?.code) {
    return { ok: false, status, error: body.error };
  }

  if (error.code === "ECONNABORTED") {
    return {
      ok: false,
      status: 0,
      error: {
        code: "TIMEOUT",
        message: "A requisição demorou demais. Tente novamente.",
      },
    };
  }

  if (!error.response) {
    return {
      ok: false,
      status: 0,
      error: {
        code: "NETWORK_ERROR",
        message: "Verifique sua conexão e tente novamente.",
      },
    };
  }

  return {
    ok: false,
    status,
    error: {
      code: "INTERNAL_ERROR",
      message: "Não foi possível concluir. Tente novamente.",
    },
  };
}
