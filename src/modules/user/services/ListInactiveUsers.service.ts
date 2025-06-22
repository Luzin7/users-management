import { Injectable } from '@nestjs/common';
import { Service } from '@shared/core/contracts/Service';
import { Either, left, right } from '@shared/core/errors/Either';
import { ParameterError } from '../../../shared/errors/ParameterError';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/contracts/UserRepository';

export type FindManyParams = {
  pagination: {
    page: number;
    limit: number;
  };
};

type Request = FindManyParams;

type Errors = ParameterError;

export type UserWithStatus = User & {
  status: 'active' | 'inactive';
};

type Response = {
  users: User[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
};

@Injectable()
export class ListInactivesUsersService
  implements Service<Request, Errors, Response>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ pagination }: Request): Promise<Either<Errors, Response>> {
    if (pagination.page < 1) {
      return left(new ParameterError('Filtro de página inválido'));
    }
    if (pagination.limit < 1 || pagination.limit > 100) {
      return left(new ParameterError('Limite de resultados inválido'));
    }
    const { users, total } = await this.userRepository.findInactive(
      Number(pagination.page),
      Number(pagination.limit),
    );

    const totalPages = Math.ceil(total / pagination.limit);

    return right({
      users,
      total,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
      },
    });
  }
}
