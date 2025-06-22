import { Role } from '@providers/auth/roles';
import { HashGenerator } from '@providers/cryptography/contracts/HashGenerator';
import { User } from '../entities/User';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserRepository } from '../repositories/contracts/UserRepository';
import { UpdateUserPasswordService } from './UpdateUserPassword.service';

describe('UpdateUserPasswordService', () => {
  let service: UpdateUserPasswordService;
  let repository: jest.Mocked<UserRepository>;
  let hashGenerator: jest.Mocked<HashGenerator>;

  beforeEach(() => {
    const mockRepository: jest.Mocked<UserRepository> = {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueByEmail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findInactive: jest.fn(),
      count: jest.fn(),
    };

    const mockHashGenerator: jest.Mocked<HashGenerator> = {
      hash: jest.fn(),
    };

    service = new UpdateUserPasswordService(mockRepository, mockHashGenerator);
    repository = mockRepository;
    hashGenerator = mockHashGenerator;
  });

  it('should update user password successfully', async () => {
    const user = new User(
      {
        name: 'User',
        email: 'user@email.com',
        password: 'old_hashed',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-1',
    );

    repository.findUnique.mockResolvedValue(user);
    hashGenerator.hash.mockResolvedValue('new_hashed_password');
    repository.save.mockResolvedValue(undefined);

    const result = await service.execute({
      sub: 'user-1',
      role: Role.User,
      password: 'new_password',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.password).toBe('new_hashed_password');
    }
    expect(repository.findUnique).toHaveBeenCalledWith('user-1');
    expect(hashGenerator.hash).toHaveBeenCalledWith('new_password');
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-1',
        password: 'new_hashed_password',
      }),
    );
  });

  it('should return error if user not found', async () => {
    repository.findUnique.mockResolvedValue(null);

    const result = await service.execute({
      sub: 'user-1',
      role: Role.User,
      password: 'any_password',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
    }
    expect(repository.findUnique).toHaveBeenCalledWith('user-1');
    expect(hashGenerator.hash).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
