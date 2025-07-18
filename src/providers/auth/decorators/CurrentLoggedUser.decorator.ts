import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadSchema } from '../strategys/jwtStrategy';

export const CurrentLoggedUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as JwtPayloadSchema;
  },
);
