import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
