import { createMockUsers } from '../../../utils/createMockUsers';
import { UserRepository } from '../repositories/contracts/UserRepository';
import { ListUsersService } from './ListUsers.service';

describe('ListUsersService', () => {
  let service: ListUsersService;
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

    service = new ListUsersService(mockRepository as UserRepository);
    repository = mockRepository as jest.Mocked<UserRepository>;
  });

  it('should list users with pagination', async () => {
    const mockUsers = createMockUsers(20);
    repository.findMany.mockResolvedValue({
      users: mockUsers,
      total: mockUsers.length,
    });

    const result = await service.execute({
      filters: {},
      sorting: { field: 'createdAt', order: 'desc' },
      pagination: { page: 1, limit: 10 },
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.users).toHaveLength(20);
      expect(result.value.users.every((user) => user.status)).toBe(true);
      expect(result.value.pagination.page).toBe(1);
      expect(result.value.pagination.limit).toBe(10);
      expect(result.value.pagination.totalPages).toBe(2);
      expect(result.value.total).toBe(mockUsers.length);
    }

    expect(repository.findMany).toHaveBeenCalledTimes(1);
  });

  it('should list users with admin role', async () => {
    const mockUsers = createMockUsers(12);
    const expectedAdmins = mockUsers.filter((user) => user.role === 'admin');

    repository.findMany.mockResolvedValue({
      users: expectedAdmins,
      total: expectedAdmins.length,
    });

    const result = await service.execute({
      filters: { role: 'admin' },
      sorting: { field: 'createdAt', order: 'desc' },
      pagination: { page: 1, limit: 10 },
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.users).toHaveLength(expectedAdmins.length);
      expect(result.value.users.every((user) => user.status)).toBe(true);
      expect(result.value.total).toBe(expectedAdmins.length);
    }

    expect(repository.findMany).toHaveBeenCalledWith(
      1,
      10,
      { role: 'admin' },
      { field: 'createdAt', order: 'desc' },
    );
    expect(repository.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return error for invalid page', async () => {
    const result = await service.execute({
      filters: {},
      sorting: { field: 'createdAt', order: 'desc' },
      pagination: { page: 0, limit: 10 },
    });

    expect(result.isRight()).toBe(false);
    if (result.isLeft()) {
      expect(result.value.message).toBe('Filtro de página inválido');
    }
    expect(repository.findMany).toHaveBeenCalledTimes(0);
  });

  it('should return error for invalid limit', async () => {
    const result = await service.execute({
      filters: {},
      sorting: { field: 'createdAt', order: 'desc' },
      pagination: { page: 1, limit: 101 },
    });

    expect(result.isRight()).toBe(false);
    if (result.isLeft()) {
      expect(result.value.message).toBe('Limite de resultados inválido');
    }
    expect(repository.findMany).toHaveBeenCalledTimes(0);
  });
});
