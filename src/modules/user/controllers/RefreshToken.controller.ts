import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Controller, HttpCode, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Gera um novo access token a partir do refresh token',
  })
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'O cookie httpOnly "refresh_token" será setado na resposta.',
    headers: {
      'Set-Cookie': {
        description:
          'refresh_token; HttpOnly; Secure; SameSite; Max-Age=604800; Path=/',
        schema: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido ou ausente',
    schema: {
      example: {
        statusCode: 401,
        message: 'Refresh token inválido ou ausente',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Requisição malformada',
    schema: {
      example: {
        statusCode: 400,
        message: 'Requisição inválida',
      },
    },
  })
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
