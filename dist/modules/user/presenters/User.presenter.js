"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserListWithStatusPresenter = exports.UserListPresenter = exports.AuthPresenter = exports.UserPresenter = void 0;
class UserPresenter {
    static toHTTP(user) {
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
exports.UserPresenter = UserPresenter;
class AuthPresenter {
    static toHTTP(accessToken, user) {
        return {
            access_token: accessToken,
            user: UserPresenter.toHTTP(user),
        };
    }
}
exports.AuthPresenter = AuthPresenter;
class UserListPresenter {
    static toHTTP(user) {
        return {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            created_at: user.createdAt,
        };
    }
}
exports.UserListPresenter = UserListPresenter;
class UserListWithStatusPresenter {
    static toHTTP(user) {
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
exports.UserListWithStatusPresenter = UserListWithStatusPresenter;
