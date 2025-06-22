import { Role } from '@providers/auth/roles';
import { Encrypter } from '@providers/cryptography/contracts/Encrypter';
import { HashComparer } from '@providers/cryptography/contracts/HashComparer';
import { DateAddition } from '@providers/date/contracts/DateAddition';
import { RefreshToken } from '../entities/RefreshToken';
import { User } from '../entities/User';
import { WrongCredentialsError } from '../errors/WrongCredentialsError';
import { RefreshTokensRepository } from '../repositories/contracts/RefreshTokenRepository';
import { UserRepository } from '../repositories/contracts/UserRepository';
import { LoginUserService } from './LoginUser.service';

jest.mock('@infra/env', () => ({
  env: {
    JWT_USER_ACCESS_EXPIRES_IN: '15m',
    JWT_USER_REFRESH_EXPIRES_IN: '7d',
    USER_REFRESH_EXPIRES_IN: 7,
  },
}));

describe('LoginUserService', () => {
  let service: LoginUserService;
  let userRepository: jest.Mocked<UserRepository>;
  let refreshTokensRepository: jest.Mocked<RefreshTokensRepository>;
  let hashComparer: jest.Mocked<HashComparer>;
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
      delete: jest.fn(),
      findUnique: jest.fn(),
      save: jest.fn(),
      deleteByToken: jest.fn(),
    };

    const mockHashComparer: jest.Mocked<HashComparer> = {
      compare: jest.fn(),
    };

    const mockEncrypter: jest.Mocked<Encrypter> = {
      encrypt: jest.fn(),
    };

    const mockDateAddition: jest.Mocked<DateAddition> = {
      addDayInCurrentDate: jest.fn(),
      addDaysInCurrentDate: jest.fn(),
    };

    service = new LoginUserService(
      mockUserRepository,
      mockRefreshTokensRepository,
      mockHashComparer,
      mockEncrypter,
      mockDateAddition,
    );

    userRepository = mockUserRepository;
    refreshTokensRepository = mockRefreshTokensRepository;
    hashComparer = mockHashComparer;
    encrypter = mockEncrypter;
    dateAddition = mockDateAddition;
  });

  it('should login user successfully with valid credentials', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = new User(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-123',
    );

    const mockAccessToken = 'access_token_jwt';
    const mockRefreshTokenJwt = 'refresh_token_jwt';
    const mockExpirationDate = new Date('2024-01-01');

    userRepository.findUniqueByEmail.mockResolvedValue(mockUser);
    hashComparer.compare.mockResolvedValue(true);
    encrypter.encrypt
      .mockResolvedValueOnce(mockAccessToken)
      .mockResolvedValueOnce(mockRefreshTokenJwt);
    dateAddition.addDaysInCurrentDate.mockReturnValue(mockExpirationDate);
    refreshTokensRepository.create.mockResolvedValue();
    userRepository.save.mockResolvedValue();

    const result = await service.execute(loginData);

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { accessToken, refreshToken, user } = result.value;

      expect(accessToken).toBe(mockAccessToken);
      expect(refreshToken).toBe(mockRefreshTokenJwt);
      expect(user).toEqual(mockUser);
      expect(user.lastLoginAt).toBeInstanceOf(Date);
    }

    expect(userRepository.findUniqueByEmail).toHaveBeenCalledWith(
      loginData.email,
    );
    expect(hashComparer.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password,
    );

    expect(encrypter.encrypt).toHaveBeenNthCalledWith(
      1,
      { sub: mockUser.id.toString(), role: mockUser.role },
      { expiresIn: '15m' },
    );

    expect(encrypter.encrypt).toHaveBeenNthCalledWith(
      2,
      { sub: mockUser.id.toString() },
      { expiresIn: '7d' },
    );

    expect(dateAddition.addDaysInCurrentDate).toHaveBeenCalledWith(7);
    expect(refreshTokensRepository.create).toHaveBeenCalledWith(
      expect.any(RefreshToken),
    );
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should return error when user does not exist', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    userRepository.findUniqueByEmail.mockResolvedValue(null);

    const result = await service.execute(loginData);

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(WrongCredentialsError);
    }

    expect(userRepository.findUniqueByEmail).toHaveBeenCalledWith(
      loginData.email,
    );
    expect(hashComparer.compare).not.toHaveBeenCalled();
    expect(encrypter.encrypt).not.toHaveBeenCalled();
    expect(refreshTokensRepository.create).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should return error when password is invalid', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'wrong_password',
    };

    const mockUser = new User(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
      },
      'user-123',
    );

    userRepository.findUniqueByEmail.mockResolvedValue(mockUser);
    hashComparer.compare.mockResolvedValue(false);

    const result = await service.execute(loginData);

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(WrongCredentialsError);
    }

    expect(userRepository.findUniqueByEmail).toHaveBeenCalledWith(
      loginData.email,
    );
    expect(hashComparer.compare).toHaveBeenCalledWith(
      loginData.password,
      mockUser.password,
    );
    expect(encrypter.encrypt).not.toHaveBeenCalled();
    expect(refreshTokensRepository.create).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should create refresh token with correct properties', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = new User(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
      },
      'user-123',
    );

    const mockRefreshTokenJwt = 'refresh_token_jwt';
    const mockExpirationDate = new Date('2024-01-01');

    userRepository.findUniqueByEmail.mockResolvedValue(mockUser);
    hashComparer.compare.mockResolvedValue(true);
    encrypter.encrypt
      .mockResolvedValueOnce('access_token')
      .mockResolvedValueOnce(mockRefreshTokenJwt);
    dateAddition.addDaysInCurrentDate.mockReturnValue(mockExpirationDate);
    refreshTokensRepository.create.mockResolvedValue();
    userRepository.save.mockResolvedValue();

    await service.execute(loginData);

    expect(refreshTokensRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockUser.id,
        token: mockRefreshTokenJwt,
        expiresIn: mockExpirationDate,
      }),
    );
  });

  it('should update user lastLoginAt timestamp', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = new User(
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: Role.User,
      },
      'user-123',
    );

    const originalLastLoginAt = mockUser.lastLoginAt;

    userRepository.findUniqueByEmail.mockResolvedValue(mockUser);
    hashComparer.compare.mockResolvedValue(true);
    encrypter.encrypt
      .mockResolvedValueOnce('access_token')
      .mockResolvedValueOnce('refresh_token');
    dateAddition.addDaysInCurrentDate.mockReturnValue(new Date());
    refreshTokensRepository.create.mockResolvedValue();
    userRepository.save.mockResolvedValue();

    await service.execute(loginData);

    expect(mockUser.lastLoginAt).not.toBe(originalLastLoginAt);
    expect(mockUser.lastLoginAt).toBeInstanceOf(Date);
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should handle admin user login', async () => {
    const loginData = {
      email: 'admin@example.com',
      password: 'admin_password',
    };

    const mockAdminUser = new User(
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashed_admin_password',
        role: Role.Admin,
      },
      'admin-123',
    );

    userRepository.findUniqueByEmail.mockResolvedValue(mockAdminUser);
    hashComparer.compare.mockResolvedValue(true);
    encrypter.encrypt
      .mockResolvedValueOnce('admin_access_token')
      .mockResolvedValueOnce('admin_refresh_token');
    dateAddition.addDaysInCurrentDate.mockReturnValue(new Date());
    refreshTokensRepository.create.mockResolvedValue();
    userRepository.save.mockResolvedValue();

    const result = await service.execute(loginData);

    expect(result.isRight()).toBe(true);

    expect(encrypter.encrypt).toHaveBeenNthCalledWith(
      1,
      { sub: mockAdminUser.id.toString(), role: Role.Admin },
      { expiresIn: '15m' },
    );
  });
});
