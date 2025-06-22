import { env } from '@infra/env';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import z from 'zod';

export const jwtPayloadSchema = z.object({
  sub: z.string(),
  role: z.string(),
});

export type JwtPayloadSchema = z.infer<typeof jwtPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayloadSchema) {
    return jwtPayloadSchema.parse(payload);
  }
}
