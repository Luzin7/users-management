import { Injectable } from '@nestjs/common';
import { JwtPayloadSchema } from '@providers/auth/strategys/jwtStrategy';
import { HashGenerator } from '@providers/cryptography/contracts/HashGenerator';
import { Service } from '@shared/core/contracts/Service';
import { Either, left, right } from '@shared/core/errors/Either';
import { User } from '../entities/User';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserRepository } from '../repositories/contracts/UserRepository';

type Request = JwtPayloadSchema & { password: string };

type Errors = UserNotFoundError;

type Response = {
  user: User;
};

@Injectable()
export class UpdateUserPasswordService
  implements Service<Request, Errors, Response>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({ sub, password }: Request): Promise<Either<Errors, Response>> {
    const user = await this.userRepository.findUnique(sub);
    if (!user) {
      return left(new UserNotFoundError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    user.password = hashedPassword;

    await this.userRepository.save(user);

    return right({
      user,
    });
  }
}
