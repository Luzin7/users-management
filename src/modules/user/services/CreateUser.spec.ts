import { Role } from '@providers/auth/roles';
import { HashGenerator } from '@providers/cryptography/contracts/HashGenerator';
import { User } from '../entities/User';
import { EmailAlreadyExistsError } from '../errors/EmailAlreadyExistsError';
import { UserRepository } from '../repositories/contracts/UserRepository';
import { CreateUserService } from './CreateUser.service';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let userRepository: jest.Mocked<UserRepository>;
  let hashGenerator: jest.Mocked<HashGenerator>;

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

    const mockHashGenerator: jest.Mocked<HashGenerator> = {
      hash: jest.fn(),
    };

    service = new CreateUserService(mockUserRepository, mockHashGenerator);
    userRepository = mockUserRepository;
    hashGenerator = mockHashGenerator;
  });

  it('should create a new user successfully', async () => {
    const createUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const hashedPassword = 'hashed_password_123';

    userRepository.findUniqueByEmail.mockResolvedValue(null);

    hashGenerator.hash.mockResolvedValue(hashedPassword);

    userRepository.create.mockResolvedValue();

    const result = await service.execute(createUserData);

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { user } = result.value;

      expect(user.name).toBe(createUserData.name);
      expect(user.email).toBe(createUserData.email);
      expect(user.password).toBe(hashedPassword);
      expect(user.role).toBe(Role.User);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBe(null);
    }

    expect(userRepository.findUniqueByEmail).toHaveBeenCalledWith(
      createUserData.email,
    );
    expect(userRepository.findUniqueByEmail).toHaveBeenCalledTimes(1);

    expect(hashGenerator.hash).toHaveBeenCalledWith(createUserData.password);
    expect(hashGenerator.hash).toHaveBeenCalledTimes(1);

    expect(userRepository.create).toHaveBeenCalledWith(expect.any(User));
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return error when email already exists', async () => {
    const createUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const existingUser = new User({
      name: 'Existing User',
      email: 'john@example.com',
      password: 'existing_password',
      role: Role.User,
    });

    userRepository.findUniqueByEmail.mockResolvedValue(existingUser);

    const result = await service.execute(createUserData);

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(EmailAlreadyExistsError);
    }

    expect(userRepository.findUniqueByEmail).toHaveBeenCalledWith(
      createUserData.email,
    );
    expect(userRepository.findUniqueByEmail).toHaveBeenCalledTimes(1);

    expect(hashGenerator.hash).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should create user with correct default role', async () => {
    const createUserData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password456',
    };

    userRepository.findUniqueByEmail.mockResolvedValue(null);
    hashGenerator.hash.mockResolvedValue('hashed_password');
    userRepository.create.mockResolvedValue();

    const result = await service.execute(createUserData);

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.user.role).toBe(Role.User);
    }

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: Role.User,
      }),
    );
  });

  it('should hash password before creating user', async () => {
    const createUserData = {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'plainTextPassword',
    };

    const hashedPassword = 'super_secure_hashed_password';

    userRepository.findUniqueByEmail.mockResolvedValue(null);
    hashGenerator.hash.mockResolvedValue(hashedPassword);
    userRepository.create.mockResolvedValue();

    const result = await service.execute(createUserData);

    expect(result.isRight()).toBe(true);

    expect(hashGenerator.hash).toHaveBeenCalledWith(createUserData.password);

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: hashedPassword,
      }),
    );

    if (result.isRight()) {
      expect(result.value.user.password).toBe(hashedPassword);
      expect(result.value.user.password).not.toBe(createUserData.password);
    }
  });
});
