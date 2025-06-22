import { User } from '@modules/user/entities/User';
import { Repository } from '@shared/core/contracts/Repository';

export type UserFilters = {
  role?: string;
  search?: string;
};

export type UserSorting = {
  field: 'name' | 'createdAt';
  order: 'asc' | 'desc';
};

export abstract class UserRepository implements Repository<User> {
  abstract findUnique(id: string): Promise<User | null>;
  abstract findUniqueByEmail(email: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
  abstract count(): Promise<number>;
  abstract delete(id: string): Promise<void>;
  abstract findMany(
    page: number,
    limit: number,
    filters: UserFilters,
    sorting: UserSorting,
  ): Promise<{ users: User[]; total: number }>;

  abstract findInactive(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }>;
}
