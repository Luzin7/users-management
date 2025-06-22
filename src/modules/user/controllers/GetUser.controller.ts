import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentLoggedUser } from '@providers/auth/decorators/CurrentLoggedUser.decorator';
import { JwtPayloadSchema } from '@providers/auth/strategys/jwtStrategy';
import { statusCode } from '@shared/core/types/statusCode';
import { UserPresenter } from '../presenters/User.presenter';
import { FindUserByIdService } from '../services/FindUserById.service';

@ApiTags('Usuário')
@Controller('users')
export class GetUserController {
  constructor(private readonly findUserByIdService: FindUserByIdService) {}

  @Get('me')
  @HttpCode(statusCode.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado' })
  @ApiOkResponse({
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João da Silva',
        role: 'admin',
        email: 'joao@email.com',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-02T00:00:00.000Z',
        last_login_at: '2024-01-03T00:00:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação inválido ou ausente',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token inválido',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Usuário não encontrado',
      },
    },
  })
  async handle(@CurrentLoggedUser() sub: JwtPayloadSchema) {
    const result = await this.findUserByIdService.execute(sub);

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }

    const { user } = result.value;

    return UserPresenter.toHTTP(user);
  }
}
