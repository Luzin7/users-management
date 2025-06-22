import { Role } from '@providers/auth/roles';
import { JwtPayloadSchema } from '@providers/auth/strategys/jwtStrategy';
import { User } from '../entities/User';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserRepository } from '../repositories/contracts/UserRepository';
import { FindUserByIdService } from './FindUserById.service';

describe('FindUserByIdService', () => {
  let service: FindUserByIdService;
  let userRepository: jest.Mocked<UserRepository>;

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

    service = new FindUserByIdService(mockUserRepository);
    userRepository = mockUserRepository;
  });

  it('should find user by id successfully', async () => {
    const userId = 'user-123';
    const jwtPayload: JwtPayloadSchema = {
      sub: userId,
      role: Role.User,
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
      userId,
    );

    userRepository.findUnique.mockResolvedValue(mockUser);

    const result = await service.execute(jwtPayload);

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { user } = result.value;

      expect(user).toEqual(mockUser);
      expect(user.id).toBe(userId);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    }

    expect(userRepository.findUnique).toHaveBeenCalledWith(userId);
    expect(userRepository.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should return error when user is not found', async () => {
    const userId = 'non-existent-user-123';
    const jwtPayload: JwtPayloadSchema = {
      sub: userId,
      role: Role.User,
    };

    userRepository.findUnique.mockResolvedValue(null);

    const result = await service.execute(jwtPayload);

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
    }

    expect(userRepository.findUnique).toHaveBeenCalledWith(userId);
    expect(userRepository.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should extract user id from jwt payload correctly', async () => {
    const userId = 'extracted-user-456';
    const jwtPayload: JwtPayloadSchema = {
      sub: userId,
      role: Role.User,
    };

    const mockUser = new User(
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashed_password',
        role: Role.Admin,
      },
      userId,
    );

    userRepository.findUnique.mockResolvedValue(mockUser);

    await service.execute(jwtPayload);

    expect(userRepository.findUnique).toHaveBeenCalledWith(userId);
  });

  it('should handle different user roles', async () => {
    const adminUserId = 'admin-user-789';
    const jwtPayload: JwtPayloadSchema = {
      sub: adminUserId,
      role: Role.Admin,
    };

    const mockAdminUser = new User(
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashed_password',
        role: Role.Admin,
      },
      adminUserId,
    );

    userRepository.findUnique.mockResolvedValue(mockAdminUser);

    const result = await service.execute(jwtPayload);

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.user.role).toBe(Role.Admin);
    }
  });
});
