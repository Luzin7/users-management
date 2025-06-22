import { Role } from '@providers/auth/roles';
import { Decoder } from '@providers/cryptography/contracts/Decoder';
import { Encrypter } from '@providers/cryptography/contracts/Encrypter';
import { DateAddition } from '@providers/date/contracts/DateAddition';
import { RefreshToken } from '../entities/RefreshToken';
import { User } from '../entities/User';
import { SessionExpiredError } from '../errors/SessionExpiredError';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { RefreshTokensRepository } from '../repositories/contracts/RefreshTokenRepository';
import { UserRepository } from '../repositories/contracts/UserRepository';
import { RefreshTokenService } from './RefreshToken.service';

jest.mock('@infra/env', () => ({
  env: {
    JWT_USER_ACCESS_EXPIRES_IN: '15m',
    JWT_USER_REFRESH_EXPIRES_IN: '7d',
    USER_REFRESH_EXPIRES_IN: 7,
  },
}));

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let userRepository: jest.Mocked<UserRepository>;
  let refreshTokensRepository: jest.Mocked<RefreshTokensRepository>;
  let decoder: jest.Mocked<Decoder>;
  let encrypter: jest.Mocked<Encrypter>;
  let dateAddition: jest.Mocked<DateAddition>;

  beforeEach(() => {
    const mockUserRepository: jest.Mocked<UserRepository> = {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueByEmail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findInactive: jest.fn(),
      count: jest.fn(),
    };

    const mockRefreshTokensRepository: jest.Mocked<RefreshTokensRepository> = {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
      deleteByToken: jest.fn(),
    };

    const mockDecoder: jest.Mocked<Decoder> = {
      decrypt: jest.fn(),
    };

    const mockEncrypter: jest.Mocked<Encrypter> = {
      encrypt: jest.fn(),
    };

    const mockDateAddition: jest.Mocked<DateAddition> = {
      addDaysInCurrentDate: jest.fn(),
      addDayInCurrentDate: jest.fn(),
    };

    service = new RefreshTokenService(
      mockUserRepository,
      mockRefreshTokensRepository,
      mockDecoder,
      mockEncrypter,
      mockDateAddition,
    );

    userRepository = mockUserRepository;
    refreshTokensRepository = mockRefreshTokensRepository;
    decoder = mockDecoder;
    encrypter = mockEncrypter;
    dateAddition = mockDateAddition;
  });

  it('should refresh tokens successfully with valid refresh token', async () => {
    const refreshTokenReceived = 'valid_refresh_token_jwt';
    const userId = 'user-123';

    const mockUser = new User(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
      },
      userId,
    );

    const mockSavedRefreshToken = new RefreshToken(
      {
        userId,
        token: refreshTokenReceived,
        expiresIn: new Date('2024-12-31'),
      },
      'refresh-token-123',
    );

    const newAccessToken = 'new_access_token_jwt';
    const newRefreshTokenJwt = 'new_refresh_token_jwt';
    const mockExpirationDate = new Date('2024-01-01');

    decoder.decrypt.mockResolvedValue({
      isValid: true,
      payload: { sub: userId, role: Role.User },
    });
    userRepository.findUnique.mockResolvedValue(mockUser);
    refreshTokensRepository.findUnique.mockResolvedValue(mockSavedRefreshToken);
    refreshTokensRepository.delete.mockResolvedValue();
    encrypter.encrypt
      .mockResolvedValueOnce(newAccessToken)
      .mockResolvedValueOnce(newRefreshTokenJwt);
    dateAddition.addDaysInCurrentDate.mockReturnValue(mockExpirationDate);
    refreshTokensRepository.create.mockResolvedValue();

    const result = await service.execute(refreshTokenReceived);

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { accessToken, refreshToken } = result.value;

      expect(accessToken).toBe(newAccessToken);
      expect(refreshToken).toBe(newRefreshTokenJwt);
    }

    expect(decoder.decrypt).toHaveBeenCalledWith(refreshTokenReceived);
    expect(userRepository.findUnique).toHaveBeenCalledWith(userId);
    expect(refreshTokensRepository.findUnique).toHaveBeenCalledWith(
      refreshTokenReceived,
    );
    expect(refreshTokensRepository.delete).toHaveBeenCalledWith(
      mockSavedRefreshToken.id,
    );

    expect(encrypter.encrypt).toHaveBeenNthCalledWith(
      2,
      { sub: userId },
      { expiresIn: '7d' },
    );

    expect(refreshTokensRepository.create).toHaveBeenCalledWith(
      expect.any(RefreshToken),
    );
  });

  it('should return error when refresh token is invalid', async () => {
    const invalidRefreshToken = 'invalid_refresh_token';

    decoder.decrypt.mockResolvedValue({
      isValid: false,
      payload: undefined,
    });

    const result = await service.execute(invalidRefreshToken);

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SessionExpiredError);
    }

    expect(decoder.decrypt).toHaveBeenCalledWith(invalidRefreshToken);
    expect(userRepository.findUnique).not.toHaveBeenCalled();
    expect(refreshTokensRepository.findUnique).not.toHaveBeenCalled();
    expect(encrypter.encrypt).not.toHaveBeenCalled();
  });

  it('should return error when refresh token has no payload', async () => {
    const refreshTokenReceived = 'token_without_payload';

    decoder.decrypt.mockResolvedValue({
      isValid: true,
      payload: undefined,
    });

    const result = await service.execute(refreshTokenReceived);

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SessionExpiredError);
    }
  });

  it('should return error when user does not exist', async () => {
    const refreshTokenReceived = 'valid_refresh_token_jwt';
    const userId = 'non-existent-user';

    decoder.decrypt.mockResolvedValue({
      isValid: true,
      payload: { sub: userId, role: Role.User },
    });
    userRepository.findUnique.mockResolvedValue(null);

    const result = await service.execute(refreshTokenReceived);

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
    }

    expect(userRepository.findUnique).toHaveBeenCalledWith(userId);
    expect(refreshTokensRepository.findUnique).not.toHaveBeenCalled();
    expect(encrypter.encrypt).not.toHaveBeenCalled();
  });

  it('should return error when refresh token is not found in database', async () => {
    const refreshTokenReceived = 'token_not_in_db';
    const userId = 'user-123';

    const mockUser = new User(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
      },
      userId,
    );

    decoder.decrypt.mockResolvedValue({
      isValid: true,
      payload: { sub: userId, role: Role.User },
    });
    userRepository.findUnique.mockResolvedValue(mockUser);
    refreshTokensRepository.findUnique.mockResolvedValue(null);

    const result = await service.execute(refreshTokenReceived);

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(SessionExpiredError);
    }

    expect(refreshTokensRepository.findUnique).toHaveBeenCalledWith(
      refreshTokenReceived,
    );
    expect(refreshTokensRepository.delete).not.toHaveBeenCalled();
    expect(encrypter.encrypt).not.toHaveBeenCalled();
  });

  it('should delete old refresh token before creating new one', async () => {
    const refreshTokenReceived = 'old_refresh_token';
    const userId = 'user-123';

    const mockUser = new User(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
      },
      userId,
    );

    const mockSavedRefreshToken = new RefreshToken(
      {
        userId,
        token: refreshTokenReceived,
        expiresIn: new Date('2024-12-31'),
      },
      'old-refresh-token-id',
    );

    decoder.decrypt.mockResolvedValue({
      isValid: true,
      payload: { sub: userId, role: Role.User },
    });
    userRepository.findUnique.mockResolvedValue(mockUser);
    refreshTokensRepository.findUnique.mockResolvedValue(mockSavedRefreshToken);
    refreshTokensRepository.delete.mockResolvedValue();
    encrypter.encrypt
      .mockResolvedValueOnce('new_access_token')
      .mockResolvedValueOnce('new_refresh_token');
    dateAddition.addDaysInCurrentDate.mockReturnValue(new Date());
    refreshTokensRepository.create.mockResolvedValue();

    await service.execute(refreshTokenReceived);

    expect(refreshTokensRepository.delete).toHaveBeenCalledWith(
      mockSavedRefreshToken.id,
    );
    expect(refreshTokensRepository.create).toHaveBeenCalledWith(
      expect.any(RefreshToken),
    );
  });

  it('should create new refresh token with correct properties', async () => {
    const refreshTokenReceived = 'valid_refresh_token';
    const userId = 'user-123';
    const newRefreshTokenJwt = 'new_refresh_token_jwt';
    const mockExpirationDate = new Date('2024-01-01');

    const mockUser = new User(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
      },
      userId,
    );

    const mockSavedRefreshToken = new RefreshToken(
      {
        userId,
        token: refreshTokenReceived,
        expiresIn: new Date('2024-12-31'),
      },
      'refresh-token-123',
    );

    decoder.decrypt.mockResolvedValue({
      isValid: true,
      payload: { sub: userId, role: Role.User },
    });
    userRepository.findUnique.mockResolvedValue(mockUser);
    refreshTokensRepository.findUnique.mockResolvedValue(mockSavedRefreshToken);
    refreshTokensRepository.delete.mockResolvedValue();
    encrypter.encrypt
      .mockResolvedValueOnce('access_token')
      .mockResolvedValueOnce(newRefreshTokenJwt);
    dateAddition.addDaysInCurrentDate.mockReturnValue(mockExpirationDate);
    refreshTokensRepository.create.mockResolvedValue();

    await service.execute(refreshTokenReceived);

    expect(refreshTokensRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        token: newRefreshTokenJwt,
        expiresIn: mockExpirationDate,
      }),
    );
  });
});
