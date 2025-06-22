import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Body, Controller, HttpCode, Patch } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentLoggedUser } from '@providers/auth/decorators/CurrentLoggedUser.decorator';
import { JwtPayloadSchema } from '@providers/auth/strategys/jwtStrategy';
import { statusCode } from '@shared/core/types/statusCode';
import { UpdatePasswordDTO } from '../dto/UpdatePasswordDTO';
import { UpdateUserPasswordGateway } from '../gateways/UpdateUserPassword.gateway';
import { UpdateUserPasswordService } from '../services/UpdateUserPassword.service';

@ApiTags('Usuário')
@Controller('users')
export class UpdateUserPasswordController {
  constructor(
    private readonly updateUserPasswordService: UpdateUserPasswordService,
  ) {}

  @Patch('password')
  @HttpCode(statusCode.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza a senha do usuário autenticado' })
  @ApiBody({
    type: UpdatePasswordDTO,
    examples: {
      exemplo: {
        value: {
          password: 'novaSenha123',
        },
      },
    },
  })
  @ApiNoContentResponse({
    description: 'Senha atualizada com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Senha inválida ou não atende aos critérios de segurança',
    schema: {
      example: {
        statusCode: 400,
        message: 'Senha deve ter pelo menos 8 caracteres',
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
    @Body(UpdateUserPasswordGateway) { password }: UpdatePasswordDTO,
  ) {
    const result = await this.updateUserPasswordService.execute({
      ...payload,
      password,
    });

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }
  }
}
