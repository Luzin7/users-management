import { User } from '@modules/user/entities/User';
import { Prisma, User as UserPrisma } from '@prisma/client';

export class UserMapper {
  static toEntity(raw: UserPrisma): User {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      role: raw.role,
      lastLoginAt: raw.lastLoginAt,
      password: raw.password,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    } as User;
  }

  static toPrisma(entity: User): Prisma.UserUncheckedCreateInput {
    return {
      name: entity.name,
      email: entity.email,
      role: entity.role,
      lastLoginAt: entity.lastLoginAt,
      password: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt as Date,
    };
  }
}
