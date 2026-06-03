import { isAxiosError } from "axios";
import type { ApiErrorBody, ColorResponse, CreateColorInput } from "@repo/shared";
import { httpClient } from "./client-api";

export type ColorApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: ApiErrorBody };

export async function getColors(): Promise<ColorApiResult<ColorResponse[]>> {
  try {
    const response = await httpClient.get<{ data: ColorResponse[] }>("/colors");
    return { ok: true, data: response.data.data };
  } catch (error) {
    return mapError(error);
  }
}

export async function postColor(
  input: CreateColorInput,
): Promise<ColorApiResult<ColorResponse>> {
  try {
    const response = await httpClient.post<{ data: ColorResponse }>(
      "/colors",
      input,
    );
    return { ok: true, data: response.data.data };
  } catch (error) {
    return mapError(error);
  }
}

function mapError(error: unknown): ColorApiResult<never> {
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
  return {
    ok: false,
    status,
    error: {
      code: "INTERNAL_ERROR",
      message: "Não foi possível concluir. Tente novamente.",
    },
  };
}
