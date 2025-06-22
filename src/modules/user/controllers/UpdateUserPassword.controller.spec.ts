import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@providers/auth/roles';
import { left, right } from '@shared/core/errors/Either';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UpdateUserPasswordService } from '../services/UpdateUserPassword.service';
import { UpdateUserPasswordController } from './UpdateUserPassword.controller';

describe('UpdateUserPasswordController', () => {
  let controller: UpdateUserPasswordController;
  let service: UpdateUserPasswordService;

  const mockUpdateUserPasswordService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserPasswordController],
      providers: [
        {
          provide: UpdateUserPasswordService,
          useValue: mockUpdateUserPasswordService,
        },
      ],
    }).compile();

    controller = module.get<UpdateUserPasswordController>(
      UpdateUserPasswordController,
    );
    service = module.get<UpdateUserPasswordService>(UpdateUserPasswordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update password successfully (204)', async () => {
    mockUpdateUserPasswordService.execute.mockResolvedValue(
      right({ user: {} }),
    );

    const payload = { sub: 'user-1', role: Role.User };
    const body = { password: 'new_password' };

    const result = await controller.handle(payload, body);

    expect(service.execute).toHaveBeenCalledWith({
      ...payload,
      password: 'new_password',
    });
    expect(result).toBeUndefined();
  });

  it('should throw NotFoundException on user not found error', async () => {
    const error = new UserNotFoundError();
    mockUpdateUserPasswordService.execute.mockResolvedValue(left(error));

    const payload = { sub: 'user-1', role: Role.User };
    const body = { password: 'new_password' };

    await expect(controller.handle(payload, body)).rejects.toThrow(
      'Usuário não encontrado',
    );

    expect(service.execute).toHaveBeenCalledWith({
      ...payload,
      password: 'new_password',
    });
  });
});
