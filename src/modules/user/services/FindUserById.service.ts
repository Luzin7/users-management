import { Injectable } from '@nestjs/common';
import { JwtPayloadSchema } from '@providers/auth/strategys/jwtStrategy';
import { Service } from '@shared/core/contracts/Service';
import { Either, left, right } from '@shared/core/errors/Either';
import { User } from '../entities/User';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserRepository } from '../repositories/contracts/UserRepository';

type Request = JwtPayloadSchema;

type Errors = UserNotFoundError;

type Response = {
  user: User;
};

@Injectable()
export class FindUserByIdService implements Service<Request, Errors, Response> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ sub }: Request): Promise<Either<Errors, Response>> {
    const user = await this.userRepository.findUnique(sub);

    if (!user) {
      return left(new UserNotFoundError());
    }

    return right({
      user,
    });
  }
}
