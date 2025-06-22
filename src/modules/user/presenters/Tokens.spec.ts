import { TokensPresenter } from './Tokens.presenter';

jest.mock('@infra/env', () => ({
  env: {
    JWT_USER_ACCESS_EXPIRES_IN: 900,
  },
}));

describe('TokensPresenter', () => {
  it('should format tokens to HTTP contract', () => {
    const input = {
      accessToken: 'access.jwt.token',
    };

    const result = TokensPresenter.toHTTP(input);

    expect(result).toEqual({
      access_token: input.accessToken,
    });
  });

  it('should handle empty tokens', () => {
    const input = {
      accessToken: '',
      refreshToken: '',
    };

    const result = TokensPresenter.toHTTP(input);

    expect(result.access_token).toBe('');
  });
});
