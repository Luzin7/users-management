import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@providers/auth/roles';
import { left, right } from '@shared/core/errors/Either';
import { ParameterError } from '../../../shared/errors/ParameterError';
import { ListUsersQueryDto } from '../dto/ListUserQueryDTO';
import { UserListWithStatusPresenter } from '../presenters/User.presenter';
import {
  ListUsersService,
  UserWithStatus,
} from '../services/ListUsers.service';
import { ListUsersController } from './ListUsers.controller';

jest.mock('@infra/env', () => ({
  env: {
    JWT_USER_ACCESS_EXPIRES_IN: 900,
    JWT_USER_REFRESH_EXPIRES_IN: 86400,
  },
}));

describe('ListUsersController', () => {
  let controller: ListUsersController;
  let service: ListUsersService;

  const mockListUsersService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListUsersController],
      providers: [
        {
          provide: ListUsersService,
          useValue: mockListUsersService,
        },
      ],
    }).compile();

    controller = module.get<ListUsersController>(ListUsersController);
    service = module.get<ListUsersService>(ListUsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    const query: ListUsersQueryDto = {
      role: undefined,
      search: undefined,
      sortBy: undefined,
      order: undefined,
      page: 1,
      limit: 10,
    };

    it('should list users successfully', async () => {
      const mockUsers: UserWithStatus[] = [
        {
          id: 'user-1',
          name: 'User One',
          email: 'user1@email.com',
          role: Role.User,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          status: 'active',
        } as UserWithStatus,
        {
          id: 'user-2',
          name: 'User Two',
          email: 'user2@email.com',
          role: Role.User,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          status: 'active',
        } as UserWithStatus,
      ];

      const mockPagination = {
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockListUsersService.execute.mockResolvedValue(
        right({
          users: mockUsers,
          total: 2,
          pagination: mockPagination,
        }),
      );

      const result = await controller.handle(query);

      expect(service.execute).toHaveBeenCalledWith({
        filters: { role: undefined, search: undefined },
        sorting: { field: 'createdAt', order: 'desc' },
        pagination: { page: 1, limit: 10 },
      });

      expect(result).toEqual({
        users: mockUsers.map(UserListWithStatusPresenter.toHTTP),
        total: 2,
        pagination: mockPagination,
      });
    });

    it('should list users with custom sorting and filters', async () => {
      const customQuery: ListUsersQueryDto = {
        role: Role.Admin,
        search: 'john',
        sortBy: 'name',
        order: 'asc',
        page: 2,
        limit: 5,
      };

      const mockUsers: UserWithStatus[] = [
        {
          id: 'admin-1',
          name: 'John Admin',
          email: 'john@email.com',
          role: Role.Admin,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          status: 'active',
        } as UserWithStatus,
      ];

      const mockPagination = {
        page: 2,
        limit: 5,
        totalPages: 3,
      };

      mockListUsersService.execute.mockResolvedValue(
        right({
          users: mockUsers,
          total: 15,
          pagination: mockPagination,
        }),
      );

      const result = await controller.handle(customQuery);

      expect(service.execute).toHaveBeenCalledWith({
        filters: { role: Role.Admin, search: 'john' },
        sorting: { field: 'name', order: 'asc' },
        pagination: { page: 2, limit: 5 },
      });

      expect(result).toEqual({
        users: mockUsers.map(UserListWithStatusPresenter.toHTTP),
        total: 15,
        pagination: mockPagination,
      });
    });

    it('should return error presenter on service failure', async () => {
      const error = new ParameterError('Filtro de página inválido');

      mockListUsersService.execute.mockResolvedValue(left(error));

      await expect(controller.handle(query)).rejects.toThrowError(
        'Filtro de página inválido',
      );

      expect(service.execute).toHaveBeenCalledWith({
        filters: { role: undefined, search: undefined },
        sorting: { field: 'createdAt', order: 'desc' },
        pagination: { page: 1, limit: 10 },
      });
    });

    it('should use default values for sorting when not provided', async () => {
      const queryWithoutSorting: ListUsersQueryDto = {
        role: undefined,
        search: undefined,
        sortBy: undefined,
        order: undefined,
        page: 1,
        limit: 10,
      };

      mockListUsersService.execute.mockResolvedValue(
        right({
          users: [],
          total: 0,
          pagination: { page: 1, limit: 10, totalPages: 0 },
        }),
      );

      await controller.handle(queryWithoutSorting);

      expect(service.execute).toHaveBeenCalledWith({
        filters: { role: undefined, search: undefined },
        sorting: { field: 'createdAt', order: 'desc' }, // Valores padrão
        pagination: { page: 1, limit: 10 },
      });
    });
  });
});
