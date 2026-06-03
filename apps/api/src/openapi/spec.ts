export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Cadastro de Clientes API",
    version: "1.0.0",
    description:
      "API REST do monorepo technical-test-eteg. Contratos de validação espelham os schemas Zod em `@repo/shared`.",
  },
  servers: [
    { url: "http://localhost:3333", description: "Desenvolvimento local" },
    { url: "http://localhost:3333", description: "Docker Compose (api:3333)" },
  ],
  tags: [
    { name: "Health", description: "Disponibilidade da API" },
    { name: "Colors", description: "Cores para cadastro de clientes" },
    { name: "Clients", description: "Cadastro de clientes" },
  ],
  paths: {
    "/api/v1/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        operationId: "healthCheck",
        responses: {
          "200": {
            description: "API disponível",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: {
                      type: "object",
                      required: ["status"],
                      properties: {
                        status: { type: "string", example: "ok" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/colors": {
      get: {
        tags: ["Colors"],
        summary: "Listar cores",
        operationId: "listColors",
        responses: {
          "200": {
            description: "Lista de cores ordenada por label",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ColorListResponse" },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Colors"],
        summary: "Criar cor",
        operationId: "createColor",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateColorBody" },
            },
          },
        },
        responses: {
          "201": {
            description: "Cor criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ColorResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "409": {
            description: "Hex já cadastrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
                example: {
                  error: {
                    code: "COLOR_ALREADY_EXISTS",
                    message: "Já existe uma cor com este hex",
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/v1/clients": {
      post: {
        tags: ["Clients"],
        summary: "Cadastrar cliente",
        operationId: "createClient",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateClientBody" },
            },
          },
        },
        responses: {
          "201": {
            description: "Cliente criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClientResponse" },
              },
            },
          },
          "400": {
            description: "Validação ou cor inexistente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
          "409": {
            description: "CPF já cadastrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
                example: {
                  error: {
                    code: "CPF_ALREADY_REGISTERED",
                    message: "Este CPF já possui cadastro",
                  },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateColorBody: {
        type: "object",
        required: ["label", "hex"],
        properties: {
          label: {
            type: "string",
            minLength: 2,
            maxLength: 40,
            example: "Turquesa",
          },
          hex: {
            type: "string",
            pattern: "^#[0-9A-F]{6}$",
            example: "#00BCD4",
          },
        },
      },
      Color: {
        type: "object",
        required: ["id", "label", "hex", "createdAt"],
        properties: {
          id: { type: "integer", minimum: 1, example: 1 },
          label: { type: "string" },
          hex: { type: "string", example: "#3B82F6" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ColorResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: { $ref: "#/components/schemas/Color" },
        },
      },
      ColorListResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Color" },
          },
        },
      },
      CreateClientBody: {
        type: "object",
        required: ["name", "email", "cpf", "colorId"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 120,
            example: "Maria Silva",
          },
          email: {
            type: "string",
            format: "email",
            example: "maria@example.com",
          },
          cpf: {
            type: "string",
            description: "11 dígitos; máscara aceita na entrada",
            example: "52998224725",
          },
          colorId: {
            type: "integer",
            minimum: 1,
            description: "ID retornado por GET /colors",
            example: 1,
          },
          note: {
            type: "string",
            maxLength: 500,
            description: "Opcional",
          },
        },
      },
      Client: {
        type: "object",
        required: ["id", "name", "email", "cpf", "colorId", "createdAt"],
        properties: {
          id: { type: "integer", minimum: 1 },
          name: { type: "string" },
          email: { type: "string" },
          cpf: { type: "string" },
          colorId: { type: "integer", minimum: 1 },
          note: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ClientResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: { $ref: "#/components/schemas/Client" },
        },
      },
      ErrorBody: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    path: {
                      type: "array",
                      items: { oneOf: [{ type: "string" }, { type: "number" }] },
                    },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: "Erro de validação (Zod)",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
            example: {
              error: {
                code: "VALIDATION_ERROR",
                message: "Dados inválidos",
                details: [{ path: ["cpf"], message: "CPF inválido" }],
              },
            },
          },
        },
      },
      InternalError: {
        description: "Erro interno",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
            example: {
              error: {
                code: "INTERNAL_ERROR",
                message: "Erro interno do servidor",
              },
            },
          },
        },
      },
    },
  },
} as const;
