import { ErrorPresenter } from '@infra/presenters/Error.presenter';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Lista usuários inativos com paginação' })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    description: 'Número da página para paginação',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Quantidade de usuários por página',
    example: 10,
  })
  @ApiOkResponse({
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
