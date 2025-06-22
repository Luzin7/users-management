import { ServiceError } from '@shared/core/errors/ServiceError';
import { statusCode } from '@shared/core/types/statusCode';

export class ParameterError extends Error implements ServiceError {
  statusCode: number = statusCode.BAD_REQUEST;

  constructor(msg?: string) {
    super(msg ?? 'Há parâmetros inválidos na requisição');
  }
}
