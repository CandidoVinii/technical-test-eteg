export type ApiErrorBody = {
  code: string;
  message?: string;
  details?: Array<{ path: (string | number)[]; message: string }>;
};

export type ApiSuccessResponse<T> = { data: T };
export type ApiErrorResponse = { error: ApiErrorBody };

export type CreateClientResult =
  | { ok: true; data: import("../schemas/client.js").ClientResponse }
  | { ok: false; status: number; error: ApiErrorBody };
