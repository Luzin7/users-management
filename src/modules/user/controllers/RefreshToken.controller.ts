import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@providers/auth/decorators/IsPublic.decorator';
import { RefreshToken } from '@providers/auth/decorators/refreshToken.decorator';
import { statusCode } from '@shared/core/types/statusCode';
import { Response } from 'express';
import { TokensPresenter } from '../presenters/Tokens.presenter';
import { RefreshTokenService } from '../services/RefreshToken.service';

@ApiTags('Autenticação')
@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Public()
  @Post('refresh')
  @HttpCode(statusCode.OK)
  async handle(
    @RefreshToken() currentRefreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.refreshTokenService.execute(currentRefreshToken);

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }

    const { accessToken, refreshToken } = result.value;

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return TokensPresenter.toHTTP({ accessToken });
  }
}
