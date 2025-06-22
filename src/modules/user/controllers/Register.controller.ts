import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@providers/auth/decorators/IsPublic.decorator';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { CreateUserGateway } from '../gateways/CreateUser.gateway';
import { UserPresenter } from '../presenters/User.presenter';
import { CreateUserService } from '../services/CreateUser.service';

@ApiTags('Autenticação')
@Controller('auth')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Endpoint para criação de um novo usuário no sistema',
  })
  @ApiBody({
    type: CreateUserDTO,
    description: 'Dados necessários para criar um usuário',
    examples: {
      exemplo1: {
        summary: 'Usuário padrão',
        value: {
          name: 'João Silva',
          email: 'joao@email.com',
          password: 'senha123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-gerado' },
        name: { type: 'string', example: 'João Silva' },
        role: { type: 'string', example: 'user' },
        email: { type: 'string', example: 'joao@email.com' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Dados inválidos',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Já existe um usuário com este e-mail cadastrado',
        },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  async handle(@Body(CreateUserGateway) body: CreateUserDTO) {
    const result = await this.createUserService.execute(body);

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }

    const { user } = result.value;

    return UserPresenter.toHTTP(user);
  }
}
