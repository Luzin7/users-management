import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@providers/auth/roles';
import { left, right } from '@shared/core/errors/Either';
import { response } from 'express';
import { LoginUserDTO } from '../dto/LoginUserDTO';
import { WrongCredentialsError } from '../errors/WrongCredentialsError';
import { LoginUserService } from '../services/LoginUser.service';
import { LoginUserController } from './Login.controller';

jest.mock('@infra/env', () => ({
  env: {
    JWT_USER_ACCESS_EXPIRES_IN: 900,
    JWT_USER_REFRESH_EXPIRES_IN: 86400,
  },
}));

describe('LoginUserController', () => {
  let controller: LoginUserController;
  let service: LoginUserService;

  const mockLoginUserService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginUserController],
      providers: [
        {
          provide: LoginUserService,
          useValue: mockLoginUserService,
        },
      ],
    }).compile();

    controller = module.get<LoginUserController>(LoginUserController);
    service = module.get<LoginUserService>(LoginUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    const validLoginData: LoginUserDTO = {
      email: 'joao@email.com',
      password: 'senha123',
    };

    it('should login user successfully', async () => {
      const mockUser = {
        id: 'uuid-gerado',
        name: 'João Silva',
        email: 'joao@email.com',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      const mockTokens = {
        accessToken: 'access-token-jwt',
      };

      mockLoginUserService.execute.mockResolvedValue(
        right({
          accessToken: mockTokens.accessToken,
          user: mockUser,
        }),
      );

      const response = {
        cookie: jest.fn(),
      } as any;

      const result = await controller.handle(validLoginData, response);

      expect(service.execute).toHaveBeenCalledWith(validLoginData);
      expect(result).toEqual({
        access_token: mockTokens.accessToken,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          created_at: mockUser.createdAt,
          updated_at: mockUser.updatedAt,
          last_login_at: mockUser.lastLoginAt,
        },
      });
    });
    it('should throw WrongCredentialsError when credentials are invalid', async () => {
      const error = new WrongCredentialsError();
      mockLoginUserService.execute.mockResolvedValue(left(error));

      await expect(controller.handle(validLoginData, response)).rejects.toThrow(
        'Email ou senha inválidos',
      );
      expect(service.execute).toHaveBeenCalledWith(validLoginData);
    });
  });
});
