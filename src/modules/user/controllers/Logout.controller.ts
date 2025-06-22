import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '@providers/auth/decorators/IsPublic.decorator';
import { RefreshToken } from '@providers/auth/decorators/refreshToken.decorator';
import { statusCode } from '@shared/core/types/statusCode';
import { LogoutService } from '../services/Logout.service';

@ApiTags('Autenticação')
@Controller('auth')
export class LogoutController {
  constructor(private readonly logoutService: LogoutService) {}

  @Public()
  @Post('logout')
  @HttpCode(statusCode.NO_CONTENT)
  @ApiOperation({
    summary: 'Realiza logout do usuário, invalidando o refresh token',
  })
  @ApiCookieAuth('refresh_token')
  @ApiNoContentResponse({
    description:
      'Logout realizado com sucesso. O cookie de refresh token será removido do navegador.',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token ausente ou inválido',
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
  async handle(@RefreshToken() currentRefreshToken: string) {
    const result = await this.logoutService.execute({
      refreshToken: currentRefreshToken,
    });

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }
  }
}
