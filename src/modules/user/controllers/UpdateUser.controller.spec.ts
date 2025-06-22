import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@providers/auth/roles';
import { left, right } from '@shared/core/errors/Either';
import { User } from '../entities/User';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserPresenter } from '../presenters/User.presenter';
import { UpdateUserService } from '../services/UpdateUser.service';
import { UpdateUserController } from './UpdateUser.controller';

describe('UpdateUserController', () => {
  let controller: UpdateUserController;
  let service: UpdateUserService;

  const mockUpdateUserService = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserController],
      providers: [
        {
          provide: UpdateUserService,
          useValue: mockUpdateUserService,
        },
      ],
    }).compile();

    controller = module.get<UpdateUserController>(UpdateUserController);
    service = module.get<UpdateUserService>(UpdateUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user successfully', async () => {
    const user = new User(
      {
        name: 'Novo Nome',
        email: 'user@email.com',
        password: 'hashed',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'user-1',
    );

    mockUpdateUserService.execute.mockResolvedValue(right({ user }));

    const payload = { sub: 'user-1', role: Role.User };
    const body = { name: 'Novo Nome' };

    const result = await controller.handle(payload, body);

    expect(service.execute).toHaveBeenCalledWith({
      ...payload,
      name: 'Novo Nome',
    });
    expect(result).toEqual(UserPresenter.toHTTP(user));
  });

  it('should return error presenter on failure', async () => {
    const error = new UserNotFoundError();
    mockUpdateUserService.execute.mockResolvedValue(left(error));

    const payload = { sub: 'user-1', role: Role.User };
    const body = { name: 'Novo Nome' };

    await expect(controller.handle(payload, body)).rejects.toThrow(
      'Usuário não encontrado',
    );

    expect(service.execute).toHaveBeenCalledWith({
      ...payload,
      name: 'Novo Nome',
    });
  });
});
