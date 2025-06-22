import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@providers/auth/decorators/roles.decorator';
import { RolesGuard } from '@providers/auth/guards/roles.guard';
import { Role } from '@providers/auth/roles';
import { ListUsersQueryDto } from '../dto/ListUserQueryDTO';
import { UserListPresenter } from '../presenters/User.presenter';
import { ListInactivesUsersService } from '../services/ListInactiveUsers.service';

@ApiTags('Administrador')
@Controller('users')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
export class ListInactivesUsersController {
  constructor(
    private readonly listInactivesUsersService: ListInactivesUsersService,
  ) {}

  @Get('inactives')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List inactives users with pagination' })
  async handle(@Query() query: ListUsersQueryDto) {
    const result = await this.listInactivesUsersService.execute({
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });

    if (result.isLeft()) {
      return ErrorPresenter.toHTTP(result.value);
    }

    const { users, total, pagination } = result.value;

    return {
      users: users.map(UserListPresenter.toHTTP),
      total,
      pagination,
    };
  }
}
