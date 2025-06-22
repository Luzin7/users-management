import { Test, TestingModule } from '@nestjs/testing';
import { left, right } from '@shared/core/errors/Either';
import { response } from 'express';
import { SessionExpiredError } from '../errors/SessionExpiredError';
import { RefreshTokenService } from '../services/RefreshToken.service';
import { RefreshTokenController } from './RefreshToken.controller';

jest.mock('@infra/env', () => ({
  env: {
    JWT_USER_ACCESS_EXPIRES_IN: 900,
    JWT_USER_REFRESH_EXPIRES_IN: 86400,
  },
}));

describe('RefreshTokenController', () => {
  let controller: RefreshTokenController;
  let service: RefreshTokenService;

  const mockRefreshTokenService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenController],
      providers: [
        {
          provide: RefreshTokenService,
          useValue: mockRefreshTokenService,
        },
      ],
    }).compile();

    controller = module.get<RefreshTokenController>(RefreshTokenController);
    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    const validRefreshToken = 'valid-refresh-token';

    it('should refresh tokens successfully', async () => {
      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockRefreshTokenService.execute.mockResolvedValue(right(mockTokens));

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      const result = await controller.handle(validRefreshToken, mockResponse);

      expect(service.execute).toHaveBeenCalledWith(validRefreshToken);
      expect(result).toEqual({
        access_token: mockTokens.accessToken,
      });
    });

    it('should throw ForbiddenException when refresh token is invalid', async () => {
      const error = new SessionExpiredError();
      mockRefreshTokenService.execute.mockResolvedValue(left(error));

      await expect(
        controller.handle(validRefreshToken, response),
      ).rejects.toThrow('Token Inválido');
      expect(service.execute).toHaveBeenCalledWith(validRefreshToken);
    });
  });
});
