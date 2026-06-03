export {
  createClientSchema,
  clientResponseSchema,
  type CreateClientInput,
  type ClientResponse,
} from "./schemas/client.js";
export {
  createColorSchema,
  colorResponseSchema,
  type CreateColorInput,
  type ColorResponse,
} from "./schemas/color.js";
export { validateCpf, stripCpf, formatCpfMask } from "./utils/cpf.js";
export { createClientApi } from "./api/create-client.js";
export type { ApiErrorBody, CreateClientResult } from "./types/api.js";
