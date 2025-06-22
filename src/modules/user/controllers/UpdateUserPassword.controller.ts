import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Body, Controller, HttpCode, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
