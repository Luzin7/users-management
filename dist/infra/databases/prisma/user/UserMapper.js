"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toEntity(raw) {
        return {
            id: raw.id,
            name: raw.name,
            email: raw.email,
            role: raw.role,
            lastLoginAt: raw.lastLoginAt,
            password: raw.password,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        };
    }
    static toPrisma(entity) {
        return {
            name: entity.name,
            email: entity.email,
            role: entity.role,
            lastLoginAt: entity.lastLoginAt,
            password: entity.password,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.UserMapper = UserMapper;
