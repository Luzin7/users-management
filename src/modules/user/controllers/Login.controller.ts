import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Realiza login do usuário e retorna o token de acesso',
  })
  @ApiBody({
    type: LoginUserDTO,
    examples: {
      exemplo: {
        summary: 'Exemplo de payload',
        value: {
          email: 'usuario@email.com',
          senha: 'senha123',
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      'Login realizado com sucesso. O token de atualização é enviado como cookie httpOnly.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'João da Silva',
          role: 'admin',
          email: 'joao@email.com',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-02T00:00:00.000Z',
          last_login_at: '2024-01-03T00:00:00.000Z',
        },
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
    description: 'Credenciais inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciais inválidas',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Requisição malformada',
    schema: {
      example: {
        statusCode: 400,
        message: 'Dados de entrada inválidos',
      },
    },
  })
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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return AuthPresenter.toHTTP(accessToken, user);
  }
}
