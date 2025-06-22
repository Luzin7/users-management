import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentLoggedUser } from '@providers/auth/decorators/CurrentLoggedUser.decorator';
import { Roles } from '@providers/auth/decorators/roles.decorator';
import { RolesGuard } from '@providers/auth/guards/roles.guard';
import { Role } from '@providers/auth/roles';
import { JwtPayloadSchema } from '@providers/auth/strategys/jwtStrategy';
import { statusCode } from '@shared/core/types/statusCode';
import { DeleteUserService } from '../services/DeleteUser.service';

@ApiTags('Administrador')
@Controller('users')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete(':id')
  @HttpCode(statusCode.NO_CONTENT)
  @ApiOperation({
    summary: 'Deleta um usuário pelo ID (apenas administradores)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser deletado',
    type: String,
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({ description: 'Usuário deletado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Não autenticado ou token inválido' })
  @ApiForbiddenResponse({
    description: 'Usuário não possui permissão de administrador',
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiBadRequestResponse({
    description: 'ID inválido ou requisição malformada',
  })
  async handle(
    @CurrentLoggedUser() payload: JwtPayloadSchema,
    @Param('id') targetUserId: string,
  ) {
    const result = await this.deleteUserService.execute({
      ...payload,
      targetUserId,
    });

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }
  }
}
