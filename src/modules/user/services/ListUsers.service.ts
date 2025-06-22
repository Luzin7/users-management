import { Injectable } from '@nestjs/common';
import { Service } from '@shared/core/contracts/Service';
import { Either, left, right } from '@shared/core/errors/Either';
import { ParameterError } from '../../../shared/errors/ParameterError';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/contracts/UserRepository';

export type FindManyParams = {
  filters: {
    role?: string;
    search?: string;
  };
  sorting: {
    field: 'name' | 'createdAt';
    order: 'asc' | 'desc';
  };
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
  users: UserWithStatus[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
};

@Injectable()
export class ListUsersService implements Service<Request, Errors, Response> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    filters,
    sorting,
    pagination,
  }: Request): Promise<Either<Errors, Response>> {
    if (pagination.page < 1) {
      return left(new ParameterError('Filtro de página inválido'));
    }
    if (pagination.limit < 1 || pagination.limit > 100) {
      return left(new ParameterError('Limite de resultados inválido'));
    }
    const { users, total } = await this.userRepository.findMany(
      Number(pagination.page),
      Number(pagination.limit),
      filters,
      sorting,
    );

    const usersWithStatus: UserWithStatus[] = users.map((user) => {
      return {
        ...user,
        status: this.calculateUserStatus(user),
      } as UserWithStatus;
    });

    const totalPages = Math.ceil(total / pagination.limit);

    return right({
      users: usersWithStatus,
      total,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
      },
    });
  }

  private calculateUserStatus(user: User): 'active' | 'inactive' {
    if (!user.lastLoginAt) return 'inactive';

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return user.lastLoginAt > thirtyDaysAgo ? 'active' : 'inactive';
  }
}
