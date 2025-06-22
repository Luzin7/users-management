import { RefreshTokensRepository } from '../repositories/contracts/RefreshTokenRepository';
import { LogoutService } from './Logout.service';

describe('LogoutService', () => {
  let service: LogoutService;
  let repository: jest.Mocked<RefreshTokensRepository>;

  beforeEach(() => {
    const mockRepository: jest.Mocked<RefreshTokensRepository> = {
      create: jest.fn(),
      findUnique: jest.fn(),
      deleteByToken: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
    };

    service = new LogoutService(mockRepository);
    repository = mockRepository;
  });

  it('should logout successfully', async () => {
    repository.deleteByToken.mockResolvedValue(undefined);

    const result = await service.execute({ refreshToken: 'valid-token' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeNull();
    expect(repository.deleteByToken).toHaveBeenCalledWith('valid-token');
  });

  it('should logout even with invalid token', async () => {
    repository.deleteByToken.mockResolvedValue(undefined);

    const result = await service.execute({ refreshToken: 'invalid-token' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeNull();
    expect(repository.deleteByToken).toHaveBeenCalledWith('invalid-token');
  });
});
