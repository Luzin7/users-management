import { env } from '@infra/env';
import { Injectable } from '@nestjs/common';
import { Decoder } from '@providers/cryptography/contracts/Decoder';
import { Encrypter } from '@providers/cryptography/contracts/Encrypter';
import { DateAddition } from '@providers/date/contracts/DateAddition';
import { Service } from '@shared/core/contracts/Service';
import { Either, left, right } from '@shared/core/errors/Either';
import { RefreshToken } from '../entities/RefreshToken';
import { SessionExpiredError } from '../errors/SessionExpiredError';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { RefreshTokensRepository } from '../repositories/contracts/RefreshTokenRepository';
import { UserRepository } from '../repositories/contracts/UserRepository';

type Request = string;

type Errors = UserNotFoundError | SessionExpiredError;

type Response = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class RefreshTokenService implements Service<Request, Errors, Response> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly decrypter: Decoder,
    private readonly encrypter: Encrypter,
    private readonly dateAddition: DateAddition,
  ) {}

  async execute(
    refreshTokenReceived: Request,
  ): Promise<Either<Errors, Response>> {
    const { isValid, payload } =
      await this.decrypter.decrypt(refreshTokenReceived);

    if (!isValid || !payload) {
      return left(new SessionExpiredError());
    }

    const id = payload.sub;

    const user = await this.userRepository.findUnique(id);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const lastRefreshTokenSaved =
      await this.refreshTokensRepository.findUnique(refreshTokenReceived);

    if (!lastRefreshTokenSaved) {
      return left(new SessionExpiredError());
    }

    await this.refreshTokensRepository.delete(lastRefreshTokenSaved.id);

    const accessToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
        role: user.role,
      },
      {
        expiresIn: env.JWT_USER_ACCESS_EXPIRES_IN,
      },
    );

    const _refreshToken = await this.encrypter.encrypt(
      {
        sub: user.id.toString(),
      },
      {
        expiresIn: env.JWT_USER_REFRESH_EXPIRES_IN,
      },
    );

    const refreshToken = new RefreshToken({
      userId: user.id,
      token: _refreshToken,
      expiresIn: this.dateAddition.addDaysInCurrentDate(
        env.USER_REFRESH_EXPIRES_IN,
      ),
    });

    await this.refreshTokensRepository.create(refreshToken);

    return right({
      accessToken,
      refreshToken: refreshToken.token,
    });
  }
}
