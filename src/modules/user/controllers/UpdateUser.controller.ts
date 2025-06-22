import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Body, Controller, HttpCode, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentLoggedUser } from '@providers/auth/decorators/CurrentLoggedUser.decorator';
import { JwtPayloadSchema } from '@providers/auth/strategys/jwtStrategy';
import { statusCode } from '@shared/core/types/statusCode';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
import { UpdateUserGateway } from '../gateways/UpdateUser.gateway';
import { UserPresenter } from '../presenters/User.presenter';
import { UpdateUserService } from '../services/UpdateUser.service';

@ApiTags('Usuário')
@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch('me')
  @HttpCode(statusCode.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza os dados do usuário autenticado' })
  @ApiBody({
    description: 'Dados para atualização do usuário',
    type: UpdateUserDTO,
    examples: {
      exemplo: {
        value: {
          name: 'Novo Nome',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
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
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Dados inválidos',
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
  async handle(
    @CurrentLoggedUser() payload: JwtPayloadSchema,
    @Body(UpdateUserGateway) { name }: UpdateUserDTO,
  ) {
    const result = await this.updateUserService.execute({
      ...payload,
      name,
    });

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }

    const { user } = result.value;

    return UserPresenter.toHTTP(user);
  }
}
