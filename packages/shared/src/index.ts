export {
  createClientSchema,
  clientResponseSchema,
  type CreateClientInput,
  type ClientResponse,
} from "./schemas/client.js";
export {
  CLIENT_COLORS,
  CLIENT_COLOR_IDS,
  isClientColorId,
  type ClientColorId,
  type ClientColorOption,
} from "./constants/client-colors.js";
export { validateCpf, stripCpf, formatCpfMask } from "./utils/cpf.js";
export { createClientApi } from "./api/create-client.js";
export type { ApiErrorBody, CreateClientResult } from "./types/api.js";
