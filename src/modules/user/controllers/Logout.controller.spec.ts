import { Test, TestingModule } from '@nestjs/testing';
import { left, right } from '@shared/core/errors/Either';
import { SessionExpiredError } from '../errors/SessionExpiredError';
import { LogoutService } from '../services/Logout.service';
import { LogoutController } from './Logout.controller';

describe('LogoutController', () => {
  let controller: LogoutController;
  let service: LogoutService;

  const mockLogoutService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogoutController],
      providers: [
        {
          provide: LogoutService,
          useValue: mockLogoutService,
        },
      ],
    }).compile();

    controller = module.get<LogoutController>(LogoutController);
    service = module.get<LogoutService>(LogoutService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should logout successfully (204)', async () => {
    mockLogoutService.execute.mockResolvedValue(right(null));

    const refreshToken = 'valid-refresh-token';

    const result = await controller.handle(refreshToken);

    expect(service.execute).toHaveBeenCalledWith({ refreshToken });
    expect(result).toBeUndefined();
  });

  it('should return error presenter on failure', async () => {
    const error = new SessionExpiredError();
    mockLogoutService.execute.mockResolvedValue(left(error));

    const refreshToken = 'invalid-refresh-token';

    await expect(controller.handle(refreshToken)).rejects.toThrow(
      'Token Inválido',
    );

    expect(service.execute).toHaveBeenCalledWith({ refreshToken });
  });
});
