import { User } from '@prisma/client';
import { UserWithStatus } from '../services/ListUsers.service';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      last_login_at: user.lastLoginAt,
    };
  }
}

export class AuthPresenter {
  static toHTTP(accessToken: string, user: User) {
    return {
      access_token: accessToken,
      user: UserPresenter.toHTTP(user),
    };
  }
}

export class UserListPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      created_at: user.createdAt,
    };
  }
}

export class UserListWithStatusPresenter {
  static toHTTP(user: UserWithStatus) {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      created_at: user.createdAt,
      isActive: user.status === 'active',
    };
  }
}
