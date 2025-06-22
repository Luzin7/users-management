import { ParameterError } from '../../../shared/errors/ParameterError';
import { createMockUsers } from '../../../utils/createMockUsers';
import { UserRepository } from '../repositories/contracts/UserRepository';
import { ListInactivesUsersService } from './ListInactiveUsers.service';

describe('ListInactivesUsersService', () => {
  let service: ListInactivesUsersService;
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

    service = new ListInactivesUsersService(mockRepository);
    repository = mockRepository;
  });

  it('should list inactive users with pagination', async () => {
    const mockUsers = createMockUsers(5);
    repository.findInactive.mockResolvedValue({
      users: mockUsers,
      total: 5,
    });

    const result = await service.execute({
      pagination: { page: 1, limit: 5 },
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.users).toEqual(mockUsers);
      expect(result.value.total).toBe(5);
      expect(result.value.pagination.page).toBe(1);
      expect(result.value.pagination.limit).toBe(5);
      expect(result.value.pagination.totalPages).toBe(1);
    }
    expect(repository.findInactive).toHaveBeenCalledWith(1, 5);
  });

  it('should return error for invalid page', async () => {
    const result = await service.execute({
      pagination: { page: 0, limit: 10 },
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ParameterError);
      expect(result.value.message).toBe('Filtro de página inválido');
    }
    expect(repository.findInactive).not.toHaveBeenCalled();
  });

  it('should return error for invalid limit (too low)', async () => {
    const result = await service.execute({
      pagination: { page: 1, limit: 0 },
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ParameterError);
      expect(result.value.message).toBe('Limite de resultados inválido');
    }
    expect(repository.findInactive).not.toHaveBeenCalled();
  });

  it('should return error for invalid limit (too high)', async () => {
    const result = await service.execute({
      pagination: { page: 1, limit: 101 },
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ParameterError);
      expect(result.value.message).toBe('Limite de resultados inválido');
    }
    expect(repository.findInactive).not.toHaveBeenCalled();
  });
});
