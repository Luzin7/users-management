"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokensPrismaMapper = void 0;
class RefreshTokensPrismaMapper {
    static toEntity(raw) {
        return {
            id: raw.id,
            userId: raw.userId,
            token: raw.token,
            expiresIn: raw.expiresIn,
            createdAt: raw.createdAt,
        };
    }
    static toPrisma(refreshToken) {
        return {
            expiresIn: refreshToken.expiresIn,
            userId: refreshToken.userId,
            token: refreshToken.token,
            createdAt: refreshToken.createdAt,
        };
    }
}
exports.RefreshTokensPrismaMapper = RefreshTokensPrismaMapper;
