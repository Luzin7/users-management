import { Injectable } from '@nestjs/common';
import { Role } from '@providers/auth/roles';
import { HashGenerator } from '@providers/cryptography/contracts/HashGenerator';
import { Service } from '@shared/core/contracts/Service';
import { Either, left, right } from '@shared/core/errors/Either';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { User } from '../entities/User';
import { EmailAlreadyExistsError } from '../errors/EmailAlreadyExistsError';
import { UserRepository } from '../repositories/contracts/UserRepository';

type Request = CreateUserDTO;

type Errors = EmailAlreadyExistsError;

type Response = {
  user: User;
};

@Injectable()
export class CreateUserService implements Service<Request, Errors, Response> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: Request): Promise<Either<Errors, Response>> {
    const nameAlreadyExists =
      await this.userRepository.findUniqueByEmail(email);

    if (nameAlreadyExists) {
      return left(new EmailAlreadyExistsError());
    }

    const totalUsers = await this.userRepository.count();
    const role = totalUsers === 0 ? Role.Admin : Role.User;

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });

    await this.userRepository.create(user);

    return right({
      user,
    });
  }
}
