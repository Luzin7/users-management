import { RefreshToken } from '@modules/user/entities/RefreshToken';
import { Repository } from '@shared/core/contracts/Repository';

export abstract class RefreshTokensRepository
  implements Repository<RefreshToken>
{
  abstract save(data: RefreshToken): Promise<void>;

  abstract create(refreshToken: RefreshToken): Promise<void>;

  abstract findUnique(token: string): Promise<RefreshToken | null>;

  abstract deleteByToken(token: string): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
