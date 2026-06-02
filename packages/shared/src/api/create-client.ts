import type { CreateClientInput, ClientResponse } from "../schemas/client.js";
import type { ApiErrorBody, CreateClientResult } from "../types/api.js";

async function parseErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    const json = (await response.json()) as { error?: ApiErrorBody };
    if (json.error?.code) return json.error;
  } catch {
    /* ignore */
  }
  return {
    code: "UNKNOWN_ERROR",
    message: "Não foi possível processar a resposta do servidor",
  };
}

export async function createClientApi(
  baseUrl: string,
  input: CreateClientInput,
): Promise<CreateClientResult> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/v1/clients`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return {
      ok: false,
      status: 0,
      error: {
        code: "NETWORK_ERROR",
        message: "Verifique sua conexão e tente novamente.",
      },
    };
  }

  if (response.ok) {
    const json = (await response.json()) as { data: ClientResponse };
    return { ok: true, data: json.data };
  }

  return {
    ok: false,
    status: response.status,
    error: await parseErrorBody(response),
  };
}
