import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@providers/auth/roles';
import { left, right } from '@shared/core/errors/Either';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { User } from '../entities/User';
import { EmailAlreadyExistsError } from '../errors/EmailAlreadyExistsError';
import { CreateUserService } from '../services/CreateUser.service';
import { CreateUserController } from './Register.controller';

jest.mock('@infra/env', () => ({
  env: {
    JWT_USER_ACCESS_EXPIRES_IN: 900,
  },
}));

describe('CreateUserController', () => {
  let controller: CreateUserController;
  let service: CreateUserService;

  const mockCreateUserService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        {
          provide: CreateUserService,
          useValue: mockCreateUserService,
        },
      ],
    }).compile();

    controller = module.get<CreateUserController>(CreateUserController);
    service = module.get<CreateUserService>(CreateUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    const validUserData: CreateUserDTO = {
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'senha123',
    };

    it('should create user successfully', async () => {
      const mockUser = new User(
        {
          name: validUserData.name,
          email: validUserData.email,
          password: validUserData.password,
          role: Role.User,
        },
        'uuid-gerado',
      );

      mockCreateUserService.execute.mockResolvedValue(
        right({ user: mockUser }),
      );

      const result = await controller.handle(validUserData);

      expect(service.execute).toHaveBeenCalledWith(validUserData);
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

    it('should return error when user already exists', async () => {
      const error = new EmailAlreadyExistsError();
      mockCreateUserService.execute.mockResolvedValue(left(error));

      await expect(controller.handle(validUserData)).rejects.toMatchObject({
        message: 'Já existe um usuário com este e-mail cadastrado',
        status: 409,
      });

      expect(service.execute).toHaveBeenCalledWith(validUserData);
    });
  });
});
