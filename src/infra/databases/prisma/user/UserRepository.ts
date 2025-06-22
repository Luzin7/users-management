import { User } from '@modules/user/entities/User';
import { UserRepository } from '@modules/user/repositories/contracts/UserRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserMapper } from './UserMapper';

@Injectable()
export class UserRepositoryImplementation implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async findMany(
    page: number,
    limit: number,
    filters: { role?: string; search?: string },
    sorting: { field: string; order: 'asc' | 'desc' },
  ): Promise<{ users: User[]; total: number }> {
    const where: {
      role?: string;
      OR?: Array<
        | { name?: { contains: string; mode: 'insensitive' } }
        | { email?: { contains: string; mode: 'insensitive' } }
      >;
    } = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: {
      [key: string]: 'asc' | 'desc';
    } = {};

    if (sorting) {
      orderBy[sorting.field] = sorting.order;
    } else {
      orderBy.createdAt = 'desc';
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map((user) => UserMapper.toEntity(user)),
      total,
    };
  }

  async findInactive(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const where = {
      OR: [{ lastLoginAt: null }, { lastLoginAt: { lte: thirtyDaysAgo } }],
    };

    const skip = (page - 1) * limit;
    const take = limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map((user) => UserMapper.toEntity(user)),
      total,
    };
  }

  async findUnique(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: UserMapper.toPrisma(user),
    });
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: UserMapper.toPrisma(user),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findUniqueByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }
}
