import { RefreshToken } from '@modules/user/entities/RefreshToken';
import { Prisma, RefreshToken as RefreshTokenPrisma } from '@prisma/client';

export class RefreshTokensPrismaMapper {
  static toEntity(raw: RefreshTokenPrisma): RefreshToken {
    return {
      id: raw.id,
      userId: raw.userId,
      token: raw.token,
      expiresIn: raw.expiresIn,
      createdAt: raw.createdAt,
    } as RefreshToken;
  }

  static toPrisma(
    refreshToken: RefreshToken,
  ): Prisma.RefreshTokenUncheckedCreateInput {
    return {
      expiresIn: refreshToken.expiresIn,
      userId: refreshToken.userId,
      token: refreshToken.token,
      createdAt: refreshToken.createdAt,
    };
  }
}
