import { JwtSignOptions } from '@nestjs/jwt';
import { JwtPayloadSchema } from '@providers/auth/strategys/jwtStrategy';

export abstract class Decoder {
  abstract decrypt(
    token: string,
    options?: JwtSignOptions,
  ): Promise<{ payload?: JwtPayloadSchema; isValid: boolean }>;
}
