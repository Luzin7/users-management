import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async handle(@RefreshToken() currentRefreshToken: string) {
    const result = await this.logoutService.execute({
      refreshToken: currentRefreshToken,
    });

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }
  }
}
