import { createMockUsers } from '../../../utils/createMockUsers';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserRepository } from '../repositories/contracts/UserRepository';
import { DeleteUserService } from './DeleteUser.service';

describe('DeleteUserService', () => {
  let service: DeleteUserService;
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

    service = new DeleteUserService(mockRepository);
    repository = mockRepository;
  });

  it('should delete user successfully', async () => {
    const mockUser = createMockUsers(1)[0];
    repository.findUnique.mockResolvedValue(mockUser);
    repository.delete.mockResolvedValue(undefined);

    const result = await service.execute({ targetUserId: 'user-1' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeNull();
    expect(repository.findUnique).toHaveBeenCalledWith('user-1');
    expect(repository.delete).toHaveBeenCalledWith('user-1');
  });

  it('should return error when user not found', async () => {
    repository.findUnique.mockResolvedValue(null);

    const result = await service.execute({ targetUserId: 'non-existent' });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
    }
    expect(repository.findUnique).toHaveBeenCalledWith('non-existent');
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
