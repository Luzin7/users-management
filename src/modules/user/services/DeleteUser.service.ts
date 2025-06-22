import { Injectable } from '@nestjs/common';
import { Service } from '@shared/core/contracts/Service';
import { Either, left, right } from '@shared/core/errors/Either';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { UserRepository } from '../repositories/contracts/UserRepository';

type Request = { targetUserId: string };

type Errors = UserNotFoundError;

type Response = null;

@Injectable()
export class DeleteUserService implements Service<Request, Errors, Response> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ targetUserId }: Request): Promise<Either<Errors, Response>> {
    const targetUser = await this.userRepository.findUnique(targetUserId);

    if (!targetUser) {
      return left(new UserNotFoundError());
    }

    await this.userRepository.delete(targetUserId);

    return right(null);
  }
}
