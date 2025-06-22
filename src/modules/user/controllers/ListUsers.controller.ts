import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@providers/auth/decorators/roles.decorator';
import { RolesGuard } from '@providers/auth/guards/roles.guard';
import { Role } from '@providers/auth/roles';
import { ListUsersQueryDto } from '../dto/ListUserQueryDTO';
import { UserListWithStatusPresenter } from '../presenters/User.presenter';
import { ListUsersService } from '../services/ListUsers.service';

@ApiTags('Administrador')
@Controller('users')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
export class ListUsersController {
  constructor(private readonly listUsersService: ListUsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista usuários com paginação' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
        total: { type: 'number' },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async handle(@Query() query: ListUsersQueryDto) {
    const result = await this.listUsersService.execute({
      filters: {
        role: query.role,
        search: query.search,
      },
      sorting: {
        field: query.sortBy || 'createdAt',
        order: query.order || 'desc',
      },
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
      users: users.map(UserListWithStatusPresenter.toHTTP),
      total,
      pagination,
    };
  }
}
