import { SessionExpiredError } from '@modules/user/errors/SessionExpiredError';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshToken = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies?.refresh_token as string;
    if (!refreshToken) {
      throw new SessionExpiredError();
    }
    return refreshToken;
  },
);
