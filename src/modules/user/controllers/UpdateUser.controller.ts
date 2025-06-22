import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Body, Controller, HttpCode, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
