import { Role } from '@providers/auth/roles';
import { User } from '../entities/User';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserRepository } from '../repositories/contracts/UserRepository';
import { UpdateUserService } from './UpdateUser.service';

describe('UpdateUserService', () => {
  let service: UpdateUserService;
  let repository: jest.Mocked<UserRepository>;

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

    service = new UpdateUserService(mockRepository);
    repository = mockRepository;
  });

  it('should update user name successfully', async () => {
    const user = new User(
      {
        name: 'Old Name',
        email: 'user@email.com',
        password: 'hashed',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-1',
    );

    repository.findUnique.mockResolvedValue(user);
    repository.save.mockResolvedValue(undefined);

    const result = await service.execute({
      sub: 'user-1',
      role: Role.User,
      name: 'New Name',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.name).toBe('New Name');
    }
    expect(repository.findUnique).toHaveBeenCalledWith('user-1');
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'user-1', name: 'New Name' }),
    );
  });

  it('should return user if name is unchanged', async () => {
    const user = new User(
      {
        name: 'Same Name',
        email: 'user@email.com',
        password: 'hashed',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-1',
    );

    repository.findUnique.mockResolvedValue(user);

    const result = await service.execute({
      sub: 'user-1',
      role: Role.User,
      name: 'Same Name',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.user.name).toBe('Same Name');
    }
    expect(repository.findUnique).toHaveBeenCalledWith('user-1');
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should return error if user not found', async () => {
    repository.findUnique.mockResolvedValue(null);

    const result = await service.execute({
      sub: 'user-1',
      role: Role.User,
      name: 'Any Name',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
    }
    expect(repository.findUnique).toHaveBeenCalledWith('user-1');
    expect(repository.save).not.toHaveBeenCalled();
  });
});
