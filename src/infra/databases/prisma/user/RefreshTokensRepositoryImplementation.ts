import { RefreshToken } from '@modules/user/entities/RefreshToken';
import { RefreshTokensRepository } from '@modules/user/repositories/contracts/RefreshTokenRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RefreshTokensPrismaMapper } from './RefreshTokensPrismaMapper';

@Injectable()
export class RefreshTokensRepositoryImplementation
  implements RefreshTokensRepository
{
  constructor(private readonly prisma: PrismaService) {}
  async findMany(): Promise<RefreshToken[]> {
    const refreshTokens = await this.prisma.refreshToken.findMany();
    return refreshTokens.map(RefreshTokensPrismaMapper.toEntity);
  }

  async save(data: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: data.id },
      data: RefreshTokensPrismaMapper.toPrisma(data),
    });
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.create({
      data: RefreshTokensPrismaMapper.toPrisma(refreshToken),
    });
  }

  async findUnique(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        token,
      },
    });

    if (refreshToken) {
      return RefreshTokensPrismaMapper.toEntity(refreshToken);
    }
    return null;
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: {
        id,
      },
    });
  }
}
