import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@providers/auth/decorators/IsPublic.decorator';
import { statusCode } from '@shared/core/types/statusCode';
import { Response } from 'express';
import { LoginUserDTO } from '../dto/LoginUserDTO';
import { LoginUserGateway } from '../gateways/LoginUser.gateway';
import { AuthPresenter } from '../presenters/User.presenter';
import { LoginUserService } from '../services/LoginUser.service';

@ApiTags('Autenticação')
@Controller('auth')
export class LoginUserController {
  constructor(private readonly loginUserService: LoginUserService) {}

  @Public()
  @Post('login')
  @HttpCode(statusCode.OK)
  async handle(
    @Body(LoginUserGateway) body: LoginUserDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.loginUserService.execute(body);

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }

    const { accessToken, refreshToken, user } = result.value;

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return AuthPresenter.toHTTP(accessToken, user);
  }
}
