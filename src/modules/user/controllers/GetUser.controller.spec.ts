import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@providers/auth/roles';
import { left, right } from '@shared/core/errors/Either';
import { User } from '../entities/User';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { FindUserByIdService } from '../services/FindUserById.service';
import { GetUserController } from './GetUser.controller';

jest.mock('@infra/env', () => ({
  env: {
    JWT_USER_ACCESS_EXPIRES_IN: 900,
    JWT_USER_REFRESH_EXPIRES_IN: 86400,
  },
}));

describe('GetUserController', () => {
  let controller: GetUserController;
  let service: FindUserByIdService;

  const mockFindUserByIdService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetUserController],
      providers: [
        {
          provide: FindUserByIdService,
          useValue: mockFindUserByIdService,
        },
      ],
    }).compile();

    controller = module.get<GetUserController>(GetUserController);
    service = module.get<FindUserByIdService>(FindUserByIdService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    const loggedUser = {
      sub: 'user-uuid',
      role: Role.User,
    };

    it('should return user profile successfully', async () => {
      const mockUser = new User(
        {
          name: 'João Silva',
          email: 'email@email.com',
          role: loggedUser.role,
          password: 'password123',
        },
        'user-uuid',
      );

      mockFindUserByIdService.execute.mockResolvedValue(
        right({ user: mockUser }),
      );

      const result = await controller.handle(loggedUser);

      expect(service.execute).toHaveBeenCalledWith(loggedUser);
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        created_at: mockUser.createdAt,
        updated_at: mockUser.updatedAt,
        last_login_at: mockUser.lastLoginAt,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const error = new UserNotFoundError();
      mockFindUserByIdService.execute.mockResolvedValue(left(error));

      await expect(controller.handle(loggedUser)).rejects.toThrow(
        'Usuário não encontrado',
      );
      expect(service.execute).toHaveBeenCalledWith(loggedUser);
    });
  });
});
