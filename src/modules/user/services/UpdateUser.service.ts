import { Injectable } from '@nestjs/common';
import { JwtPayloadSchema } from '@providers/auth/strategys/jwtStrategy';
import { Service } from '@shared/core/contracts/Service';
import { Either, left, right } from '@shared/core/errors/Either';
import { UnauthorizedError } from '@shared/errors/UnauthorizedError';
import { User } from '../entities/User';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserRepository } from '../repositories/contracts/UserRepository';

type Request = JwtPayloadSchema & { name: string };

type Errors = UserNotFoundError | UnauthorizedError;

type Response = {
  user: User;
};

@Injectable()
export class UpdateUserService implements Service<Request, Errors, Response> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ sub, name }: Request): Promise<Either<Errors, Response>> {
    const user = await this.userRepository.findUnique(sub);

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (user.name === name) {
      return right({
        user,
      });
    }

    user.name = name;

    await this.userRepository.save(user);

    return right({
      user,
    });
  }
}
