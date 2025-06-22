import { Injectable } from '@nestjs/common';
import { Service } from '@shared/core/contracts/Service';
import { Either, right } from '@shared/core/errors/Either';
import { SessionExpiredError } from '../errors/SessionExpiredError';
import { WrongCredentialsError } from '../errors/WrongCredentialsError';
import { RefreshTokensRepository } from '../repositories/contracts/RefreshTokenRepository';

type Request = { refreshToken: string };

type Errors = SessionExpiredError;

type Response = null;

@Injectable()
export class LogoutService implements Service<Request, Errors, Response> {
  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async execute({
    refreshToken,
  }: Request): Promise<Either<WrongCredentialsError, Response>> {
    await this.refreshTokensRepository.deleteByToken(refreshToken);

    return right(null);
  }
}
