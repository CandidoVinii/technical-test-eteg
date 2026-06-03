export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class CpfConflictError extends AppError {
  constructor() {
    super(409, "CPF_ALREADY_REGISTERED", "Este CPF já possui cadastro");
  }
}

export class ColorConflictError extends AppError {
  constructor() {
    super(409, "COLOR_ALREADY_EXISTS", "Já existe uma cor com este hex");
  }
}

export class ColorNotFoundError extends AppError {
  constructor() {
    super(400, "COLOR_NOT_FOUND", "Cor não encontrada");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") {
    super(401, "UNAUTHORIZED", message);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    details: Array<{ path: (string | number)[]; message: string }>,
  ) {
    super(400, "VALIDATION_ERROR", message, details);
  }
}
