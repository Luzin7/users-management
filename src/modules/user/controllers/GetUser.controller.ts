import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async handle(@CurrentLoggedUser() sub: JwtPayloadSchema) {
    const result = await this.findUserByIdService.execute(sub);

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }

    const { user } = result.value;

    return UserPresenter.toHTTP(user);
  }
}
